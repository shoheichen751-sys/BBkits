<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\WATIService;
use App\Models\Sale;
use App\Events\SaleOrderConfirmed;
use App\Events\SalePaymentApproved;
use App\Events\SaleProductionStarted;
use App\Events\SalePhotoSent;
use App\Events\SaleOrderShipped;
use App\Events\SalePaymentRejected;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class WATIIntegrationController extends Controller
{
    private WATIService $watiService;

    public function __construct(WATIService $watiService)
    {
        $this->middleware(['auth', 'approved']);
        $this->watiService = $watiService;
    }

    /**
     * Show WATI integration dashboard
     */
    public function index()
    {
        $stats = [
            'enabled' => $this->watiService->isEnabled(),
            'connection_status' => $this->watiService->testConnection(),
            'messages_sent_today' => DB::table('notification_logs')
                ->where('type', 'whatsapp')
                ->where('status', 'sent')
                ->whereDate('created_at', today())
                ->count(),
            'messages_sent_this_month' => DB::table('notification_logs')
                ->where('type', 'whatsapp')
                ->where('status', 'sent')
                ->whereYear('created_at', now()->year)
                ->whereMonth('created_at', now()->month)
                ->count(),
            'failed_messages' => DB::table('notification_logs')
                ->where('type', 'whatsapp')
                ->where('status', 'failed')
                ->whereDate('created_at', '>=', now()->subDays(7))
                ->count(),
        ];

        $recentNotifications = $this->getRecentNotifications();
        $messageTemplates = $this->watiService->getMessageTemplates();

        return Inertia::render('Admin/WATI/Dashboard', [
            'stats' => $stats,
            'recentNotifications' => $recentNotifications,
            'messageTemplates' => $messageTemplates,
            'config' => [
                'templates' => config('services.wati.templates'),
                'enabled' => config('services.wati.enabled'),
                'fallback_to_text' => config('services.wati.fallback_to_text'),
            ]
        ]);
    }

    /**
     * Test WATI connection
     */
    public function testConnection()
    {
        try {
            $isConnected = $this->watiService->testConnection();

            if ($isConnected) {
                $templates = $this->watiService->getMessageTemplates();

                return response()->json([
                    'success' => true,
                    'message' => 'WATI connection successful',
                    'templates_count' => count($templates),
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'WATI connection failed',
                ]);
            }

        } catch (\Exception $e) {
            Log::error('WATI connection test failed', ['error' => $e->getMessage()]);

            return response()->json([
                'success' => false,
                'message' => 'WATI connection error: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Send test WhatsApp message
     */
    public function sendTestMessage(Request $request)
    {
        $request->validate([
            'phone_number' => 'required|string|max:20',
            'template_name' => 'required|string',
            'parameters' => 'nullable|array',
        ]);

        try {
            $result = $this->watiService->sendTemplateMessage(
                $request->phone_number,
                $request->template_name,
                $request->parameters ?? []
            );

            return response()->json([
                'success' => true,
                'message' => 'Test message sent successfully',
                'result' => $result,
            ]);

        } catch (\Exception $e) {
            Log::error('WATI test message failed', [
                'phone' => $request->phone_number,
                'template' => $request->template_name,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to send test message: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Send manual WhatsApp notification for a sale
     */
    public function sendManualNotification(Request $request, Sale $sale)
    {
        $request->validate([
            'event_type' => 'required|in:order_confirmation,payment_approved,production_started,photo_approval,order_shipped,payment_rejected',
            'photo_url' => 'nullable|url',
            'tracking_code' => 'nullable|string|max:50',
            'rejection_reason' => 'nullable|string|max:255',
        ]);

        try {
            $eventType = $request->event_type;

            // Fire the appropriate event based on the request
            match ($eventType) {
                'order_confirmation' => event(new SaleOrderConfirmed($sale)),
                'payment_approved' => event(new SalePaymentApproved($sale)),
                'production_started' => event(new SaleProductionStarted($sale)),
                'photo_approval' => event(new SalePhotoSent($sale, $request->photo_url ?? 'https://example.com/photo.jpg')),
                'order_shipped' => event(new SaleOrderShipped($sale, $request->tracking_code)),
                'payment_rejected' => event(new SalePaymentRejected($sale, $request->rejection_reason)),
            };

            return response()->json([
                'success' => true,
                'message' => 'WhatsApp notification queued successfully',
            ]);

        } catch (\Exception $e) {
            Log::error('Manual WhatsApp notification failed', [
                'sale_id' => $sale->id,
                'event_type' => $request->event_type,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to send notification: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get notification logs
     */
    public function getNotificationLogs(Request $request)
    {
        $query = DB::table('notification_logs')
            ->leftJoin('sales', 'notification_logs.sale_id', '=', 'sales.id')
            ->select([
                'notification_logs.*',
                'sales.unique_token',
                'sales.client_name'
            ])
            ->where('notification_logs.type', 'whatsapp')
            ->orderBy('notification_logs.created_at', 'desc');

        // Apply filters
        if ($request->has('status')) {
            $query->where('notification_logs.status', $request->status);
        }

        if ($request->has('event_type')) {
            $query->where('notification_logs.event_type', $request->event_type);
        }

        if ($request->has('date_from')) {
            $query->whereDate('notification_logs.created_at', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->whereDate('notification_logs.created_at', '<=', $request->date_to);
        }

        $logs = $query->paginate(50);

        return response()->json($logs);
    }

    /**
     * Retry failed notification
     */
    public function retryNotification(Request $request, int $logId)
    {
        try {
            $log = DB::table('notification_logs')->find($logId);

            if (!$log) {
                return response()->json([
                    'success' => false,
                    'message' => 'Notification log not found',
                ], 404);
            }

            if ($log->status !== 'failed') {
                return response()->json([
                    'success' => false,
                    'message' => 'Only failed notifications can be retried',
                ], 400);
            }

            $sale = Sale::find($log->sale_id);
            if (!$sale) {
                return response()->json([
                    'success' => false,
                    'message' => 'Sale not found',
                ], 404);
            }

            // Fire the appropriate event based on the log
            match ($log->event_type) {
                'order_confirmation' => event(new SaleOrderConfirmed($sale)),
                'payment_approved' => event(new SalePaymentApproved($sale)),
                'production_started' => event(new SaleProductionStarted($sale)),
                'photo_approval' => event(new SalePhotoSent($sale, 'https://example.com/photo.jpg')),
                'order_shipped' => event(new SaleOrderShipped($sale, '')),
                'payment_rejected' => event(new SalePaymentRejected($sale, '')),
                default => throw new \Exception('Unknown event type: ' . $log->event_type)
            };

            // Update the log status to retry
            DB::table('notification_logs')
                ->where('id', $logId)
                ->update([
                    'status' => 'retry',
                    'updated_at' => now()
                ]);

            return response()->json([
                'success' => true,
                'message' => 'Notification retry queued successfully',
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to retry notification', [
                'log_id' => $logId,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to retry notification: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Bulk send notifications
     */
    public function bulkSendNotifications(Request $request)
    {
        $request->validate([
            'sale_ids' => 'required|array',
            'sale_ids.*' => 'exists:sales,id',
            'event_type' => 'required|in:order_confirmation,payment_approved,production_started,order_shipped',
        ]);

        $successCount = 0;
        $errors = [];

        foreach ($request->sale_ids as $saleId) {
            try {
                $sale = Sale::find($saleId);

                match ($request->event_type) {
                    'order_confirmation' => event(new SaleOrderConfirmed($sale)),
                    'payment_approved' => event(new SalePaymentApproved($sale)),
                    'production_started' => event(new SaleProductionStarted($sale)),
                    'order_shipped' => event(new SaleOrderShipped($sale, '')),
                };

                $successCount++;

            } catch (\Exception $e) {
                $errors[] = "Sale {$saleId}: " . $e->getMessage();
            }
        }

        return response()->json([
            'success' => $successCount,
            'errors' => $errors,
            'message' => "Queued {$successCount} notifications" . (count($errors) > 0 ? " with " . count($errors) . " errors" : ""),
        ]);
    }

    /**
     * Handle WATI webhooks
     */
    public function webhook(Request $request)
    {
        try {
            $webhookData = $request->all();
            Log::info('WATI webhook received', $webhookData);

            $result = $this->watiService->processWebhook($webhookData);

            return response()->json(['status' => 'processed']);

        } catch (\Exception $e) {
            Log::error('WATI webhook processing failed', [
                'error' => $e->getMessage(),
                'data' => $request->all(),
            ]);

            return response()->json(['error' => 'Webhook processing failed'], 500);
        }
    }

    /**
     * Get message templates
     */
    public function getMessageTemplates()
    {
        try {
            $templates = $this->watiService->getMessageTemplates();

            return response()->json([
                'success' => true,
                'templates' => $templates,
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to get WATI templates', ['error' => $e->getMessage()]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to get templates: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get contacts
     */
    public function getContact(Request $request)
    {
        $request->validate([
            'phone_number' => 'required|string|max:20',
        ]);

        try {
            $contact = $this->watiService->getContact($request->phone_number);

            return response()->json([
                'success' => true,
                'contact' => $contact,
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to get WATI contact', [
                'phone' => $request->phone_number,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to get contact: ' . $e->getMessage(),
            ], 500);
        }
    }

    // ==================== PRIVATE METHODS ====================

    private function getRecentNotifications(): array
    {
        return DB::table('notification_logs')
            ->leftJoin('sales', 'notification_logs.sale_id', '=', 'sales.id')
            ->select([
                'notification_logs.id',
                'notification_logs.event_type',
                'notification_logs.recipient',
                'notification_logs.status',
                'notification_logs.created_at',
                'notification_logs.error_message',
                'sales.unique_token',
                'sales.client_name'
            ])
            ->where('notification_logs.type', 'whatsapp')
            ->orderBy('notification_logs.created_at', 'desc')
            ->limit(20)
            ->get()
            ->map(function ($log) {
                return [
                    'id' => $log->id,
                    'event_type' => $log->event_type,
                    'recipient' => $log->recipient,
                    'status' => $log->status,
                    'created_at' => $log->created_at,
                    'error_message' => $log->error_message,
                    'sale' => [
                        'token' => $log->unique_token,
                        'client_name' => $log->client_name,
                    ],
                ];
            })
            ->toArray();
    }
}