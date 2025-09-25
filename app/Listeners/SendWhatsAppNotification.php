<?php

namespace App\Listeners;

use App\Services\WATIService;
use App\Events\SaleOrderConfirmed;
use App\Events\SalePaymentApproved;
use App\Events\SaleProductionStarted;
use App\Events\SalePhotoSent;
use App\Events\SaleOrderShipped;
use App\Events\SalePaymentRejected;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class SendWhatsAppNotification implements ShouldQueue
{
    use InteractsWithQueue;

    private WATIService $watiService;

    /**
     * Create the event listener.
     */
    public function __construct(WATIService $watiService)
    {
        $this->watiService = $watiService;
    }

    /**
     * Handle the event.
     */
    public function handle(object $event): void
    {
        // Check if WATI is enabled
        if (!$this->watiService->isEnabled()) {
            Log::info('WATI is not enabled, skipping WhatsApp notification', [
                'event' => get_class($event)
            ]);
            return;
        }

        try {
            match (true) {
                $event instanceof SaleOrderConfirmed => $this->handleOrderConfirmed($event),
                $event instanceof SalePaymentApproved => $this->handlePaymentApproved($event),
                $event instanceof SaleProductionStarted => $this->handleProductionStarted($event),
                $event instanceof SalePhotoSent => $this->handlePhotoSent($event),
                $event instanceof SaleOrderShipped => $this->handleOrderShipped($event),
                $event instanceof SalePaymentRejected => $this->handlePaymentRejected($event),
                default => Log::warning('Unknown event type for WhatsApp notification', [
                    'event' => get_class($event)
                ])
            };
        } catch (\Exception $e) {
            Log::error('WhatsApp notification failed', [
                'event' => get_class($event),
                'sale_id' => $event->sale->id ?? 'unknown',
                'error' => $e->getMessage(),
            ]);

            // Re-throw to trigger retry mechanism
            throw $e;
        }
    }

    /**
     * Handle order confirmed event
     */
    private function handleOrderConfirmed(SaleOrderConfirmed $event): void
    {
        $saleData = $this->prepareSaleData($event->sale);

        $success = $this->watiService->sendOrderConfirmation($saleData);

        if ($success) {
            Log::info('Order confirmation WhatsApp sent successfully', [
                'sale_id' => $event->sale->id,
                'phone' => $event->sale->client_phone
            ]);
        }
    }

    /**
     * Handle payment approved event
     */
    private function handlePaymentApproved(SalePaymentApproved $event): void
    {
        $saleData = $this->prepareSaleData($event->sale);

        $success = $this->watiService->sendPaymentApproved($saleData);

        if ($success) {
            Log::info('Payment approved WhatsApp sent successfully', [
                'sale_id' => $event->sale->id,
                'phone' => $event->sale->client_phone
            ]);
        }
    }

    /**
     * Handle production started event
     */
    private function handleProductionStarted(SaleProductionStarted $event): void
    {
        $saleData = $this->prepareSaleData($event->sale);

        $success = $this->watiService->sendProductionStarted($saleData);

        if ($success) {
            Log::info('Production started WhatsApp sent successfully', [
                'sale_id' => $event->sale->id,
                'phone' => $event->sale->client_phone
            ]);
        }
    }

    /**
     * Handle photo sent event
     */
    private function handlePhotoSent(SalePhotoSent $event): void
    {
        $saleData = $this->prepareSaleData($event->sale);

        $success = $this->watiService->sendPhotoApproval($saleData, $event->photoUrl);

        if ($success) {
            Log::info('Photo approval WhatsApp sent successfully', [
                'sale_id' => $event->sale->id,
                'phone' => $event->sale->client_phone,
                'photo_url' => $event->photoUrl
            ]);
        }
    }

    /**
     * Handle order shipped event
     */
    private function handleOrderShipped(SaleOrderShipped $event): void
    {
        $saleData = $this->prepareSaleData($event->sale);

        $success = $this->watiService->sendOrderShipped($saleData, $event->trackingCode ?? '');

        if ($success) {
            Log::info('Order shipped WhatsApp sent successfully', [
                'sale_id' => $event->sale->id,
                'phone' => $event->sale->client_phone,
                'tracking_code' => $event->trackingCode
            ]);
        }
    }

    /**
     * Handle payment rejected event
     */
    private function handlePaymentRejected(SalePaymentRejected $event): void
    {
        $saleData = $this->prepareSaleData($event->sale);

        $success = $this->watiService->sendPaymentRejected($saleData, $event->rejectionReason ?? '');

        if ($success) {
            Log::info('Payment rejected WhatsApp sent successfully', [
                'sale_id' => $event->sale->id,
                'phone' => $event->sale->client_phone,
                'reason' => $event->rejectionReason
            ]);
        }
    }

    /**
     * Prepare sale data for WhatsApp service
     */
    private function prepareSaleData($sale): array
    {
        return [
            'id' => $sale->id,
            'unique_token' => $sale->unique_token,
            'client_name' => $sale->client_name,
            'client_phone' => $sale->client_phone,
            'child_name' => $sale->child_name,
            'total_amount' => $sale->total_amount,
            'shipping_amount' => $sale->shipping_amount ?? 0,
            'product_name' => $sale->product_name ?? 'Produto Personalizado',
            'order_status' => $sale->order_status,
            'created_at' => $sale->created_at,
        ];
    }

    /**
     * Handle failed job
     */
    public function failed(object $event, \Throwable $exception): void
    {
        Log::error('WhatsApp notification job failed permanently', [
            'event' => get_class($event),
            'sale_id' => $event->sale->id ?? 'unknown',
            'exception' => $exception->getMessage(),
            'trace' => $exception->getTraceAsString(),
        ]);
    }

    /**
     * Determine the number of times the listener should be retried
     */
    public function retryUntil(): \DateTime
    {
        return now()->addHours(2);
    }

    /**
     * Calculate the number of seconds to wait before retrying the job
     */
    public function backoff(): array
    {
        return [30, 60, 120]; // Retry after 30 seconds, then 1 minute, then 2 minutes
    }
}
