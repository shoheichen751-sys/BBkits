<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\TinyERPService;
use App\Models\Sale;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class TinyERPIntegrationController extends Controller
{
    private TinyERPService $tinyERPService;

    public function __construct(TinyERPService $tinyERPService)
    {
        $this->middleware(['auth', 'approved']);
        $this->tinyERPService = $tinyERPService;
    }

    /**
     * Show integration dashboard
     */
    public function index()
    {
        $stats = [
            'synced_orders' => Sale::whereNotNull('tiny_erp_invoice_id')->count(),
            'generated_invoices' => Invoice::whereNotNull('tiny_erp_id')->count(),
            'pending_sync' => Sale::whereNull('tiny_erp_invoice_id')
                ->whereIn('order_status', ['payment_approved', 'in_production', 'ready_for_shipping'])
                ->count(),
            'connection_status' => $this->tinyERPService->testConnection(),
        ];

        $recentActivity = $this->getRecentActivity();

        return Inertia::render('Admin/TinyERP/Dashboard', [
            'stats' => $stats,
            'recentActivity' => $recentActivity,
        ]);
    }

    /**
     * Generate invoice for sale
     */
    public function generateInvoice(Request $request, Sale $sale)
    {
        try {
            DB::beginTransaction();

            // Check if sale already has an invoice
            if ($sale->invoice) {
                return response()->json([
                    'error' => 'Sale already has an invoice generated'
                ], 400);
            }

            // Check if sale is in correct status
            if (!in_array($sale->order_status, ['payment_approved', 'in_production', 'ready_for_shipping'])) {
                return response()->json([
                    'error' => 'Sale must be payment approved to generate invoice'
                ], 400);
            }

            // Sync sale to Tiny ERP first if not already synced
            if (!$sale->tiny_erp_invoice_id) {
                $this->syncSaleToTinyERP($sale);
            }

            // Generate invoice in Tiny ERP
            $result = $this->tinyERPService->generateInvoice($sale->tiny_erp_invoice_id);

            if (isset($result['retorno']['status']) && $result['retorno']['status'] === 'OK') {
                // Create local invoice record
                $invoice = new Invoice([
                    'sale_id' => $sale->id,
                    'tiny_erp_id' => $result['retorno']['id'],
                    'invoice_number' => $result['retorno']['numero'],
                    'series' => $result['retorno']['serie'] ?? '1',
                    'issue_date' => now(),
                    'total_amount' => $sale->total_amount,
                    'status' => 'pending',
                    'xml_path' => null,
                    'pdf_path' => null,
                ]);

                $invoice->save();

                // Update sale status
                $sale->update([
                    'invoice_id' => $invoice->id,
                    'invoice_generated_at' => now(),
                    'order_status' => 'ready_for_shipping'
                ]);

                // Log activity
                $this->logActivity('invoice_generated', [
                    'sale_id' => $sale->id,
                    'invoice_id' => $invoice->id,
                    'tiny_erp_invoice_id' => $result['retorno']['id'],
                ]);

                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => 'Invoice generated successfully',
                    'invoice' => $invoice,
                ]);
            } else {
                throw new \Exception('Failed to generate invoice in Tiny ERP: ' . json_encode($result));
            }

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Invoice generation failed', [
                'sale_id' => $sale->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'error' => 'Failed to generate invoice: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generate shipping label for sale
     */
    public function generateShippingLabel(Request $request, Sale $sale)
    {
        try {
            // Validate that sale has delivery address
            if (empty($sale->delivery_address) || empty($sale->delivery_city)) {
                return response()->json([
                    'error' => 'Sale must have delivery address'
                ], 400);
            }

            // Check sale status
            if (!in_array($sale->order_status, ['ready_for_shipping'])) {
                return response()->json([
                    'error' => 'Sale must be ready for shipping to generate label'
                ], 400);
            }

            // Prepare shipping data
            $shippingData = [
                'order_id' => $sale->tiny_erp_invoice_id,
                'shipping_method' => $request->input('shipping_method', config('services.tiny_erp.default_shipping_service')),
                'recipient_name' => $sale->client_name,
                'address' => [
                    'street' => $sale->delivery_address,
                    'number' => $sale->delivery_number ?? 'S/N',
                    'complement' => $sale->delivery_complement ?? '',
                    'neighborhood' => $sale->delivery_neighborhood,
                    'city' => $sale->delivery_city,
                    'state' => $sale->delivery_state,
                    'zipcode' => $sale->delivery_cep,
                ],
                'notes' => 'Pedido BBKits #' . $sale->unique_token,
            ];

            // Send shipping to Tiny ERP
            $result = $this->tinyERPService->sendShipping($shippingData);

            if (isset($result['retorno']['status']) && $result['retorno']['status'] === 'OK') {
                $shippingId = $result['retorno']['id'];

                // Get shipping label
                $labelResult = $this->tinyERPService->getShippingLabel($shippingId);

                if (isset($labelResult['retorno']['etiqueta_url'])) {
                    // Update sale with shipping info
                    $sale->update([
                        'tiny_erp_shipping_id' => $shippingId,
                        'shipping_label_url' => $labelResult['retorno']['etiqueta_url'],
                        'shipping_label_generated_at' => now(),
                        'order_status' => 'shipped'
                    ]);

                    // Log activity
                    $this->logActivity('shipping_label_generated', [
                        'sale_id' => $sale->id,
                        'shipping_id' => $shippingId,
                        'tracking_code' => $labelResult['retorno']['codigo_rastreamento'] ?? null,
                    ]);

                    return response()->json([
                        'success' => true,
                        'message' => 'Shipping label generated successfully',
                        'label_url' => $labelResult['retorno']['etiqueta_url'],
                        'tracking_code' => $labelResult['retorno']['codigo_rastreamento'] ?? null,
                    ]);
                }
            }

            throw new \Exception('Failed to generate shipping label: ' . json_encode($result));

        } catch (\Exception $e) {
            Log::error('Shipping label generation failed', [
                'sale_id' => $sale->id,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'error' => 'Failed to generate shipping label: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update sale tracking information
     */
    public function updateTracking(Request $request, Sale $sale)
    {
        $request->validate([
            'tracking_code' => 'required|string|max:50',
            'shipping_method' => 'nullable|string|max:50',
        ]);

        try {
            $result = $this->tinyERPService->updateOrderTracking(
                $sale->tiny_erp_invoice_id,
                $request->tracking_code,
                $request->shipping_method
            );

            if (isset($result['retorno']['status']) && $result['retorno']['status'] === 'OK') {
                $sale->update([
                    'order_status' => 'shipped'
                ]);

                // Log activity
                $this->logActivity('tracking_updated', [
                    'sale_id' => $sale->id,
                    'tracking_code' => $request->tracking_code,
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Tracking information updated successfully',
                ]);
            }

            throw new \Exception('Failed to update tracking: ' . json_encode($result));

        } catch (\Exception $e) {
            Log::error('Tracking update failed', [
                'sale_id' => $sale->id,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'error' => 'Failed to update tracking: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Sync sale to Tiny ERP
     */
    public function syncSale(Request $request, Sale $sale)
    {
        try {
            $result = $this->syncSaleToTinyERP($sale);

            return response()->json([
                'success' => true,
                'message' => 'Sale synced successfully',
                'tiny_erp_id' => $result,
            ]);

        } catch (\Exception $e) {
            Log::error('Sale sync failed', [
                'sale_id' => $sale->id,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'error' => 'Failed to sync sale: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Bulk sync sales
     */
    public function bulkSync(Request $request)
    {
        $request->validate([
            'sale_ids' => 'required|array',
            'sale_ids.*' => 'exists:sales,id',
        ]);

        $successCount = 0;
        $errors = [];

        foreach ($request->sale_ids as $saleId) {
            try {
                $sale = Sale::find($saleId);
                $this->syncSaleToTinyERP($sale);
                $successCount++;
            } catch (\Exception $e) {
                $errors[] = "Sale {$saleId}: " . $e->getMessage();
            }
        }

        return response()->json([
            'success' => $successCount,
            'errors' => $errors,
            'message' => "Synced {$successCount} sales" . (count($errors) > 0 ? " with " . count($errors) . " errors" : ""),
        ]);
    }

    /**
     * Handle Tiny ERP webhooks
     */
    public function webhook(Request $request)
    {
        try {
            $webhookData = $request->all();
            Log::info('Tiny ERP webhook received', $webhookData);

            $result = $this->tinyERPService->processWebhook($webhookData);

            return response()->json(['status' => 'processed']);

        } catch (\Exception $e) {
            Log::error('Webhook processing failed', [
                'error' => $e->getMessage(),
                'data' => $request->all(),
            ]);

            return response()->json(['error' => 'Webhook processing failed'], 500);
        }
    }

    /**
     * Test connection to Tiny ERP
     */
    public function testConnection()
    {
        try {
            $isConnected = $this->tinyERPService->testConnection();
            $status = $this->tinyERPService->getStatus();

            return response()->json([
                'connected' => $isConnected,
                'status' => $status,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'connected' => false,
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // ==================== PRIVATE METHODS ====================

    private function syncSaleToTinyERP(Sale $sale): string
    {
        // Prepare sale data for Tiny ERP
        $orderData = [
            'order_date' => $sale->created_at->format('d/m/Y'),
            'expected_date' => $sale->created_at->addDays(7)->format('d/m/Y'),
            'purchase_order_number' => $sale->unique_token,
            'status' => $this->mapSaleStatusToTiny($sale->order_status),
            'customer' => [
                'name' => $sale->client_name,
                'type' => 'F', // Física (assuming individual customers)
                'document' => $sale->client_cpf,
                'email' => $sale->client_email,
                'phone' => $sale->client_phone,
                'address' => [
                    'street' => $sale->delivery_address,
                    'number' => $sale->delivery_number ?? 'S/N',
                    'complement' => $sale->delivery_complement ?? '',
                    'neighborhood' => $sale->delivery_neighborhood,
                    'city' => $sale->delivery_city,
                    'state' => $sale->delivery_state,
                    'zipcode' => $sale->delivery_cep,
                ],
            ],
            'items' => [
                [
                    'sku' => $sale->product_name ?? 'PRODUTO-01',
                    'name' => $sale->product_name ?? 'Produto Personalizado',
                    'unit' => 'UN',
                    'quantity' => 1,
                    'unit_price' => $sale->total_amount - ($sale->shipping_amount ?? 0),
                ]
            ],
            'notes' => "Pedido BBKits: {$sale->unique_token}\nNome da criança: {$sale->child_name}",
            'internal_notes' => "BBKits Sale ID: {$sale->id}",
        ];

        // Create order in Tiny ERP
        $result = $this->tinyERPService->createOrder($orderData);

        if (isset($result['retorno']['status']) && $result['retorno']['status'] === 'OK') {
            $tinyErpId = $result['retorno']['id'];

            // Update local sale with Tiny ERP ID
            $sale->update([
                'tiny_erp_invoice_id' => $tinyErpId,
                'tiny_erp_sync_at' => now(),
                'tiny_erp_status' => 'synced'
            ]);

            // Log activity
            $this->logActivity('sale_synced', [
                'sale_id' => $sale->id,
                'tiny_erp_id' => $tinyErpId,
            ]);

            return $tinyErpId;
        }

        throw new \Exception('Failed to sync sale to Tiny ERP: ' . json_encode($result));
    }

    private function mapSaleStatusToTiny(string $status): string
    {
        return match ($status) {
            'pending_payment' => 'Pendente',
            'payment_approved' => 'Aprovado',
            'in_production' => 'Em produção',
            'photo_sent' => 'Aguardando aprovação',
            'photo_approved' => 'Aprovado para produção',
            'pending_final_payment' => 'Pendente pagamento final',
            'ready_for_shipping' => 'Pronto para envio',
            'shipped' => 'Enviado',
            default => 'Pendente',
        };
    }

    private function getRecentActivity(): array
    {
        return DB::table('activity_logs')
            ->where('activity_type', 'LIKE', 'tiny_erp_%')
            ->orderBy('created_at', 'desc')
            ->limit(20)
            ->get()
            ->map(function ($activity) {
                return [
                    'id' => $activity->id,
                    'type' => $activity->activity_type,
                    'description' => $activity->description,
                    'data' => json_decode($activity->data, true),
                    'created_at' => $activity->created_at,
                ];
            })
            ->toArray();
    }

    private function logActivity(string $type, array $data = []): void
    {
        DB::table('activity_logs')->insert([
            'activity_type' => "tiny_erp_{$type}",
            'description' => $this->getActivityDescription($type, $data),
            'data' => json_encode($data),
            'user_id' => auth()->id(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    private function getActivityDescription(string $type, array $data): string
    {
        return match ($type) {
            'sale_synced' => "Sale #{$data['sale_id']} synced to Tiny ERP (ID: {$data['tiny_erp_id']})",
            'invoice_generated' => "Invoice generated for sale #{$data['sale_id']} (Invoice ID: {$data['invoice_id']})",
            'shipping_label_generated' => "Shipping label generated for sale #{$data['sale_id']}",
            'tracking_updated' => "Tracking code updated for sale #{$data['sale_id']}: {$data['tracking_code']}",
            default => "Unknown activity: {$type}",
        };
    }
}