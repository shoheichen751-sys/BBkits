<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class FinanceController extends Controller
{
    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            if (!auth()->user()->canApprovePayments()) {
                abort(403, 'Unauthorized');
            }
            return $next($request);
        });
    }

    public function ordersIndex(Request $request)
    {
        $statusFilter = $request->get('status', 'all');
        
        $query = Sale::with(['user', 'financeAdmin', 'productionAdmin']);
        
        // Filter based on status
        switch ($statusFilter) {
            case 'pending_payment':
                $query->where('order_status', 'pending_payment');
                break;
            case 'pending_final_payment':
                $query->where('order_status', 'pending_final_payment')
                      ->whereNotNull('final_payment_proof_data');
                break;
            case 'all':
            default:
                $query->whereIn('order_status', [
                    'pending_payment', 
                    'pending_final_payment'
                ]);
                break;
        }
        
        $orders = $query->latest()->get();
        
        return Inertia::render('Finance/OrdersIndex', [
            'orders' => $orders,
            'statusFilter' => $statusFilter
        ]);
    }

    public function approveOrder(Sale $sale)
    {
        try {
            DB::beginTransaction();

            if ($sale->order_status === 'pending_payment') {
                // Validate minimum payment requirement (50% rule)
                $totalOrderAmount = $sale->total_amount + ($sale->shipping_amount ?? 0);
                $minimumRequired = $totalOrderAmount * 0.5; // 50% minimum
                $currentPaidAmount = $sale->getTotalPaidAmount();

                if ($currentPaidAmount < $minimumRequired) {
                    DB::rollBack();
                    return back()->withErrors([
                        'error' => sprintf(
                            'Pagamento insuficiente para aprovação. Mínimo de 50%% necessário: %s (Pago: %s)',
                            'R$ ' . number_format($minimumRequired, 2, ',', '.'),
                            'R$ ' . number_format($currentPaidAmount, 2, ',', '.')
                        )
                    ]);
                }

                // Initial payment approval
                $sale->update([
                    'status' => 'aprovado', // Legacy status for commission calculation
                    'order_status' => 'payment_approved',
                    'finance_admin_id' => auth()->id(),
                    'initial_payment_approved_at' => now(),
                    'approved_by' => auth()->id(), // Legacy field
                    'approved_at' => now() // Legacy field
                ]);

                // Approve all pending payments for this sale
                $sale->payments()->where('status', 'pending')->update([
                    'status' => 'approved',
                    'approved_by' => auth()->id(),
                    'approved_at' => now(),
                ]);

                // Create commission record if needed
                $commissionService = app(\App\Services\CommissionService::class);
                $commissionService->createCommissionForSale($sale->fresh());
                
            } elseif ($sale->order_status === 'pending_final_payment') {
                // Validate final payment completes the order
                $totalOrderAmount = $sale->total_amount + ($sale->shipping_amount ?? 0);
                $currentPaidAmount = $sale->getTotalPaidAmount();

                if ($currentPaidAmount < $totalOrderAmount) {
                    DB::rollBack();
                    $remaining = $totalOrderAmount - $currentPaidAmount;
                    return back()->withErrors([
                        'error' => sprintf(
                            'Pagamento final insuficiente. Ainda falta: %s para completar o pedido',
                            'R$ ' . number_format($remaining, 2, ',', '.')
                        )
                    ]);
                }

                // Final payment approval - order is now fully paid
                $sale->update([
                    'order_status' => 'ready_for_shipping',
                    'final_payment_approved_at' => now()
                ]);

                // Approve pending final payments
                $sale->payments()->where('status', 'pending')->update([
                    'status' => 'approved',
                    'approved_by' => auth()->id(),
                    'approved_at' => now(),
                ]);
            }
            
            DB::commit();
            
            Log::info('Order payment approved', [
                'order_id' => $sale->id,
                'approved_by' => auth()->id(),
                'status' => $sale->order_status
            ]);
            
            // Notify relevant parties
            $notificationService = app(\App\Services\NotificationService::class);
            $notificationService->notifyPaymentApproved($sale);
            
            return back()->with('message', 'Pagamento aprovado com sucesso!');
            
        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('Failed to approve order payment', [
                'order_id' => $sale->id,
                'error' => $e->getMessage(),
                'user_id' => auth()->id()
            ]);
            
            return back()->withErrors(['error' => 'Erro ao aprovar pagamento. Tente novamente.']);
        }
    }

    public function rejectOrder(Request $request, Sale $sale)
    {
        $validated = $request->validate([
            'rejection_reason' => 'required|string|max:500'
        ]);
        
        try {
            DB::beginTransaction();
            
            if ($sale->order_status === 'pending_payment') {
                $sale->update([
                    'status' => 'recusado',
                    'order_status' => 'pending_payment', // Keep in pending for re-approval
                    'rejected_by' => auth()->id(),
                    'rejected_at' => now(),
                    'rejection_reason' => $validated['rejection_reason']
                ]);
            } elseif ($sale->order_status === 'pending_final_payment') {
                $sale->update([
                    'order_status' => 'photo_approved', // Back to photo approved status
                    'rejection_reason' => $validated['rejection_reason']
                ]);
            }
            
            DB::commit();
            
            Log::info('Order payment rejected', [
                'order_id' => $sale->id,
                'rejected_by' => auth()->id(),
                'reason' => $validated['rejection_reason']
            ]);
            
            // Notify relevant parties
            $notificationService = app(\App\Services\NotificationService::class);
            $notificationService->notifyPaymentRejected($sale, $validated['rejection_reason']);
            
            return back()->with('message', 'Pagamento rejeitado.');
            
        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('Failed to reject order payment', [
                'order_id' => $sale->id,
                'error' => $e->getMessage(),
                'user_id' => auth()->id()
            ]);
            
            return back()->withErrors(['error' => 'Erro ao rejeitar pagamento. Tente novamente.']);
        }
    }

    public function dashboard()
    {
        $pendingPayments = Sale::where('order_status', 'pending_payment')->count();
        $pendingFinalPayments = Sale::where('order_status', 'pending_final_payment')
                                   ->whereNotNull('final_payment_proof_data')
                                   ->count();
        
        $totalPendingValue = Sale::whereIn('order_status', ['pending_payment', 'pending_final_payment'])
                                ->sum('total_amount');
        
        $recentApprovals = Sale::with('user')
                              ->where('finance_admin_id', auth()->id())
                              ->where('initial_payment_approved_at', '>=', now()->subDays(7))
                              ->latest('initial_payment_approved_at')
                              ->limit(10)
                              ->get();
        
        return Inertia::render('Finance/Dashboard', [
            'stats' => [
                'pending_payments' => $pendingPayments,
                'pending_final_payments' => $pendingFinalPayments,
                'total_pending_value' => $totalPendingValue,
                'recent_approvals_count' => $recentApprovals->count()
            ],
            'recent_approvals' => $recentApprovals
        ]);
    }
}