<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductionController extends Controller
{
    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            if (!auth()->user()->canManageProduction()) {
                abort(403, 'Unauthorized');
            }
            return $next($request);
        });
    }

    public function ordersIndex(Request $request)
    {
        $statusFilter = $request->get('status', 'all');
        
        $query = Sale::with(['user', 'financeAdmin', 'productionAdmin', 'payments']);
        
        // Filter based on status
        switch ($statusFilter) {
            case 'payment_approved':
                $query->where('order_status', 'payment_approved');
                break;
            case 'in_production':
                $query->where('order_status', 'in_production');
                break;
            case 'photo_sent':
                $query->where('order_status', 'photo_sent');
                break;
            case 'ready_for_shipping':
                $query->where('order_status', 'ready_for_shipping');
                break;
            case 'all':
            default:
                $query->whereIn('order_status', [
                    'payment_approved', 
                    'in_production', 
                    'photo_sent',
                    'ready_for_shipping'
                ]);
                break;
        }
        
        $orders = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('Production/OrdersIndex', [
            'orders' => $orders,
            'statusFilter' => $statusFilter
        ]);
    }

    public function startProduction(Sale $sale)
    {
        if ($sale->order_status !== 'payment_approved') {
            return back()->withErrors(['error' => 'Pedido não está pronto para produção']);
        }

        // Validate required information before starting production
        $validationErrors = $this->validateProductionRequirements($sale);
        if (!empty($validationErrors)) {
            return back()->withErrors(['validation' => $validationErrors]);
        }
        
        try {
            $sale->update([
                'order_status' => 'in_production',
                'production_admin_id' => auth()->id(),
                'production_started_at' => now()
            ]);
            
            Log::info('Production started', [
                'order_id' => $sale->id,
                'production_admin_id' => auth()->id()
            ]);
            
            // Notify client
            $notificationService = app(\App\Services\NotificationService::class);
            $notificationService->notifyProductionStarted($sale);
            
            return back()->with('message', 'Produção iniciada com sucesso!');
            
        } catch (\Exception $e) {
            Log::error('Failed to start production', [
                'order_id' => $sale->id,
                'error' => $e->getMessage()
            ]);
            
            return back()->withErrors(['error' => 'Erro ao iniciar produção']);
        }
    }

    public function uploadPhoto(Request $request, Sale $sale)
    {
        if ($sale->order_status !== 'in_production') {
            return back()->withErrors(['error' => 'Pedido não está em produção']);
        }
        
        $validated = $request->validate([
            'product_photo' => 'required|file|mimes:jpeg,png,jpg|max:5120', // 5MB max
            'notes' => 'nullable|string|max:1000'
        ]);
        
        try {
            DB::beginTransaction();
            
            if ($request->hasFile('product_photo')) {
                $file = $request->file('product_photo');
                $fileContent = file_get_contents($file->getRealPath());
                $mimeType = $file->getMimeType();
                
                // Store as base64 data URL for easy display
                $photoData = 'data:' . $mimeType . ';base64,' . base64_encode($fileContent);
                
                // Also store file for backup
                $photoPath = $file->store('product_photos', 'public');
                
                $sale->update([
                    'product_photo_data' => $photoData,
                    'product_photo' => $photoPath,
                    'order_status' => 'photo_sent',
                    'photo_sent_at' => now(),
                    'notes' => $validated['notes'] ?? $sale->notes
                ]);
            }
            
            DB::commit();
            
            Log::info('Product photo uploaded', [
                'order_id' => $sale->id,
                'production_admin_id' => auth()->id()
            ]);
            
            // Notify client
            $notificationService = app(\App\Services\NotificationService::class);
            $notificationService->notifyPhotoSent($sale);
            
            return back()->with('message', 'Foto enviada para aprovação da cliente!');
            
        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('Failed to upload product photo', [
                'order_id' => $sale->id,
                'error' => $e->getMessage()
            ]);
            
            return back()->withErrors(['error' => 'Erro ao enviar foto']);
        }
    }

    public function generateShippingLabel(Sale $sale)
    {
        if ($sale->order_status !== 'ready_for_shipping') {
            return back()->withErrors(['error' => 'Pedido não está pronto para envio']);
        }

        // Validate delivery address before shipping
        $shippingErrors = $this->validateShippingRequirements($sale);
        if (!empty($shippingErrors)) {
            return back()->withErrors(['validation' => $shippingErrors]);
        }

        try {
            // Generate tracking code
            $trackingCode = 'BB' . str_pad($sale->id, 6, '0', STR_PAD_LEFT) . 'BR';
            
            // Generate invoice number
            $invoiceNumber = 'NF-' . date('Y') . '-' . str_pad($sale->id, 6, '0', STR_PAD_LEFT);
            
            $sale->update([
                'tracking_code' => $trackingCode,
                'invoice_number' => $invoiceNumber,
                'order_status' => 'shipped',
                'shipped_at' => now()
            ]);
            
            Log::info('Shipping label generated', [
                'order_id' => $sale->id,
                'tracking_code' => $trackingCode,
                'invoice_number' => $invoiceNumber
            ]);
            
            // Notify client
            $notificationService = app(\App\Services\NotificationService::class);
            $notificationService->notifyOrderShipped($sale);
            
            return back()->with('message', 'Etiqueta de envio gerada! Código: ' . $trackingCode);
            
        } catch (\Exception $e) {
            Log::error('Failed to generate shipping label', [
                'order_id' => $sale->id,
                'error' => $e->getMessage()
            ]);
            
            return back()->withErrors(['error' => 'Erro ao gerar etiqueta de envio']);
        }
    }

    public function dashboard()
    {
        $paymentApproved = Sale::where('order_status', 'payment_approved')->count();
        $inProduction = Sale::where('order_status', 'in_production')->count();
        $photoSent = Sale::where('order_status', 'photo_sent')->count();
        $readyForShipping = Sale::where('order_status', 'ready_for_shipping')->count();
        
        $myProductions = Sale::where('production_admin_id', auth()->id())
                            ->whereDate('production_started_at', '>=', now()->subDays(30))
                            ->count();
        
        $recentOrders = Sale::with(['user'])
                           ->whereIn('order_status', ['payment_approved', 'in_production', 'photo_sent', 'ready_for_shipping'])
                           ->latest()
                           ->limit(10)
                           ->get();
        
        return Inertia::render('Production/Dashboard', [
            'stats' => [
                'payment_approved' => $paymentApproved,
                'in_production' => $inProduction,
                'photo_sent' => $photoSent,
                'ready_for_shipping' => $readyForShipping,
                'my_productions' => $myProductions
            ],
            'recent_orders' => $recentOrders
        ]);
    }

    /**
     * Validate all requirements before starting production
     */
    private function validateProductionRequirements(Sale $sale)
    {
        $errors = [];

        // Client information validation
        if (empty($sale->client_name)) {
            $errors[] = 'Nome do cliente é obrigatório';
        }

        if (empty($sale->client_phone)) {
            $errors[] = 'Telefone do cliente é obrigatório';
        }

        // Child and embroidery validation
        if (empty($sale->child_name)) {
            $errors[] = 'Nome da criança é obrigatório para o bordado';
        }

        if (empty($sale->embroidery_position)) {
            $errors[] = 'Posição do bordado deve ser especificada';
        }

        if (empty($sale->embroidery_color)) {
            $errors[] = 'Cor do bordado deve ser especificada';
        }

        // Delivery address validation - Optional for production start
        // Address will be required before shipping, not production start
        // This allows production to begin while customer completes address info

        // Payment validation - Skip this as it's already validated at finance approval stage
        // Payment proof is checked during finance approval, not production start

        // Finance approval validation - This ensures payment was already validated
        if (empty($sale->finance_admin_id)) {
            $errors[] = 'Pagamento deve ser aprovado pelo financeiro antes da produção';
        }

        return $errors;
    }

    /**
     * Validate all requirements before generating shipping label
     */
    private function validateShippingRequirements(Sale $sale)
    {
        $errors = [];

        // Delivery address validation - Required for shipping
        if (empty($sale->delivery_address)) {
            $errors[] = 'Endereço de entrega é obrigatório para gerar etiqueta de envio';
        }

        if (empty($sale->delivery_city)) {
            $errors[] = 'Cidade de entrega é obrigatória para gerar etiqueta de envio';
        }

        if (empty($sale->delivery_state)) {
            $errors[] = 'Estado de entrega é obrigatório para gerar etiqueta de envio';
        }

        if (empty($sale->delivery_zipcode)) {
            $errors[] = 'CEP de entrega é obrigatório para gerar etiqueta de envio';
        }

        return $errors;
    }
}