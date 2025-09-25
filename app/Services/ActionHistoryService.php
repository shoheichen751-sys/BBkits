<?php

namespace App\Services;

use App\Models\ActionHistory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class ActionHistoryService
{
    public function logAction(
        string $actionType,
        string $description,
        ?Model $resource = null,
        ?array $changes = null,
        ?array $metadata = null
    ): ?ActionHistory {
        try {
            return ActionHistory::log(
                $actionType,
                $description,
                $resource ? class_basename($resource) : null,
                $resource?->id,
                $changes,
                $metadata
            );
        } catch (\Exception $e) {
            Log::error('Failed to log action history', [
                'action_type' => $actionType,
                'description' => $description,
                'resource' => $resource ? get_class($resource) . ':' . $resource->id : null,
                'error' => $e->getMessage()
            ]);
            return null;
        }
    }

    public function logSaleAction(
        string $actionType,
        string $description,
        Model $sale,
        ?array $changes = null,
        ?array $metadata = null
    ): ?ActionHistory {
        return $this->logAction(
            $actionType,
            $description,
            $sale,
            $changes,
            array_merge($metadata ?? [], [
                'sale_token' => $sale->unique_token ?? null,
                'client_name' => $sale->client_name ?? null,
                'order_status' => $sale->order_status ?? null,
            ])
        );
    }

    public function logSaleCreated(Model $sale): ?ActionHistory
    {
        return $this->logSaleAction(
            'create',
            "Nova venda criada: {$sale->client_name}",
            $sale,
            null,
            [
                'total_amount' => $sale->total_amount,
                'initial_status' => $sale->order_status
            ]
        );
    }

    public function logPaymentApproved(Model $sale, ?array $paymentData = null): ?ActionHistory
    {
        return $this->logSaleAction(
            'approve_payment',
            "Pagamento aprovado para venda #{$sale->unique_token}",
            $sale,
            [
                'old_status' => 'pending_payment',
                'new_status' => $sale->order_status
            ],
            [
                'payment_amount' => $paymentData['amount'] ?? null,
                'payment_method' => $paymentData['method'] ?? null,
                'approved_by' => auth()->user()?->name
            ]
        );
    }

    public function logPaymentRejected(Model $sale, string $reason): ?ActionHistory
    {
        return $this->logSaleAction(
            'reject_payment',
            "Pagamento rejeitado para venda #{$sale->unique_token}",
            $sale,
            [
                'rejection_reason' => $reason
            ],
            [
                'rejected_by' => auth()->user()?->name,
                'reason' => $reason
            ]
        );
    }

    public function logProductionStarted(Model $sale): ?ActionHistory
    {
        return $this->logSaleAction(
            'start_production',
            "Produção iniciada para venda #{$sale->unique_token}",
            $sale,
            [
                'old_status' => 'payment_approved',
                'new_status' => 'in_production'
            ],
            [
                'production_admin' => auth()->user()?->name,
                'started_at' => now()->toDateTimeString()
            ]
        );
    }

    public function logPhotoSent(Model $sale): ?ActionHistory
    {
        return $this->logSaleAction(
            'send_photo',
            "Foto do produto enviada para aprovação - venda #{$sale->unique_token}",
            $sale,
            [
                'old_status' => 'in_production',
                'new_status' => 'photo_sent'
            ],
            [
                'sent_by' => auth()->user()?->name,
                'has_photo' => !empty($sale->product_photo_data)
            ]
        );
    }

    public function logPhotoApproved(Model $sale): ?ActionHistory
    {
        return $this->logSaleAction(
            'approve_photo',
            "Foto aprovada pelo cliente - venda #{$sale->unique_token}",
            $sale,
            [
                'old_status' => 'photo_sent',
                'new_status' => $sale->order_status
            ]
        );
    }

    public function logOrderShipped(Model $sale, ?string $trackingCode = null): ?ActionHistory
    {
        return $this->logSaleAction(
            'ship_order',
            "Pedido enviado - venda #{$sale->unique_token}",
            $sale,
            [
                'old_status' => 'ready_for_shipping',
                'new_status' => 'shipped'
            ],
            [
                'tracking_code' => $trackingCode ?? $sale->tracking_code,
                'shipped_by' => auth()->user()?->name,
                'shipped_at' => now()->toDateTimeString()
            ]
        );
    }

    public function logUserAction(
        string $actionType,
        string $description,
        ?Model $targetUser = null,
        ?array $changes = null
    ): ?ActionHistory {
        return $this->logAction(
            $actionType,
            $description,
            $targetUser,
            $changes,
            [
                'performed_by' => auth()->user()?->name,
                'target_user' => $targetUser?->name ?? null
            ]
        );
    }

    public function getResourceHistory(Model $resource, int $limit = 50): \Illuminate\Database\Eloquent\Collection
    {
        return ActionHistory::forResource(class_basename($resource), $resource->id)
            ->with('user')
            ->orderBy('performed_at', 'desc')
            ->limit($limit)
            ->get();
    }

    public function getUserActions(int $userId, int $limit = 100): \Illuminate\Database\Eloquent\Collection
    {
        return ActionHistory::byUser($userId)
            ->with('user')
            ->orderBy('performed_at', 'desc')
            ->limit($limit)
            ->get();
    }

    public function getRecentActions(int $limit = 50): \Illuminate\Database\Eloquent\Collection
    {
        return ActionHistory::with('user')
            ->orderBy('performed_at', 'desc')
            ->limit($limit)
            ->get();
    }

    public function getActionStats(?\Carbon\Carbon $startDate = null, ?\Carbon\Carbon $endDate = null): array
    {
        $query = ActionHistory::query();

        if ($startDate && $endDate) {
            $query->inDateRange($startDate, $endDate);
        } elseif (!$startDate && !$endDate) {
            // Default to last 30 days
            $query->inDateRange(now()->subDays(30), now());
        }

        $totalActions = $query->count();
        $actionTypes = $query->groupBy('action_type')
                            ->selectRaw('action_type, count(*) as count')
                            ->pluck('count', 'action_type')
                            ->toArray();

        $topUsers = $query->whereNotNull('user_id')
                         ->with('user')
                         ->groupBy('user_id')
                         ->selectRaw('user_id, count(*) as count')
                         ->orderBy('count', 'desc')
                         ->limit(10)
                         ->get()
                         ->map(function ($item) {
                             return [
                                 'user' => $item->user?->name ?? 'Unknown',
                                 'count' => $item->count
                             ];
                         })
                         ->toArray();

        return [
            'total_actions' => $totalActions,
            'action_types' => $actionTypes,
            'top_users' => $topUsers,
            'period' => [
                'start' => $startDate?->format('Y-m-d') ?? now()->subDays(30)->format('Y-m-d'),
                'end' => $endDate?->format('Y-m-d') ?? now()->format('Y-m-d')
            ]
        ];
    }
}