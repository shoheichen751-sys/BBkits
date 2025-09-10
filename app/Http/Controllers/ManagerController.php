<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class ManagerController extends Controller
{
    public function orders(Request $request)
    {
        // Check permission
        if (!auth()->user()->canViewOrders()) {
            abort(403, 'Access denied');
        }

        $query = Sale::with(['user', 'productCategory', 'embroideryDesign', 'approvedPayments', 'payments'])
            ->orderBy('created_at', 'desc');

        // Filter by status if provided
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('order_status', $request->status);
        }

        // Filter by search term
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('client_name', 'LIKE', "%{$search}%")
                  ->orWhere('child_name', 'LIKE', "%{$search}%")
                  ->orWhere('unique_token', 'LIKE', "%{$search}%");
            });
        }

        $orders = $query->paginate(20)->withQueryString();
        
        // Add payment status information to each order
        $orders->getCollection()->transform(function ($order) {
            // For manager view, if order is finance-approved, consider it paid even if payments aren't fully tracked
            if ($order->order_status !== 'pending_payment' && !empty($order->finance_admin_id)) {
                // If finance approved it, there should be payment
                $order->payment_progress = $order->getPaymentProgress();
                $order->payment_status = $order->getPaymentStatus();
                $order->is_fully_paid = $order->isFullyPaid();
                $order->total_paid_amount = $order->getTotalPaidAmount();
                $order->remaining_amount = $order->getRemainingAmount();
                
                // Override payment status for finance-approved orders with missing payment data
                if ($order->payment_status === 'unpaid' && $order->order_status !== 'pending_payment') {
                    // If order moved beyond payment_approved but shows unpaid, it's likely a data sync issue
                    // Use received_amount or assume paid based on order progression
                    if ($order->received_amount > 0) {
                        $order->payment_status = $order->received_amount >= ($order->total_amount + $order->shipping_amount) ? 'fully_paid' : 'partially_paid';
                        $order->is_fully_paid = $order->received_amount >= ($order->total_amount + $order->shipping_amount);
                        $order->total_paid_amount = $order->received_amount;
                        $order->remaining_amount = max(0, ($order->total_amount + $order->shipping_amount) - $order->received_amount);
                        $order->payment_progress = $order->received_amount > 0 ? ($order->received_amount / ($order->total_amount + $order->shipping_amount)) * 100 : 0;
                    } else {
                        // If no received_amount but finance approved, assume initial payment was made
                        $order->payment_status = 'partially_paid';
                        $order->total_paid_amount = $order->total_amount; // Assume product paid, shipping might be pending
                        $order->remaining_amount = $order->shipping_amount ?? 0;
                        $order->payment_progress = $order->shipping_amount > 0 ? ($order->total_amount / ($order->total_amount + $order->shipping_amount)) * 100 : 100;
                        $order->is_fully_paid = $order->shipping_amount <= 0;
                    }
                }
                
                $order->can_print = $order->is_fully_paid && !empty($order->finance_admin_id);
            } else {
                // Standard payment calculation for pending orders
                $order->payment_progress = $order->getPaymentProgress();
                $order->payment_status = $order->getPaymentStatus();
                $order->is_fully_paid = $order->isFullyPaid();
                $order->total_paid_amount = $order->getTotalPaidAmount();
                $order->remaining_amount = $order->getRemainingAmount();
                $order->can_print = $order->isFullyPaid() && !empty($order->finance_admin_id);
            }
            
            return $order;
        });

        // Order status options for filter
        $statusOptions = [
            'all' => 'Todos',
            'pending_payment' => 'Aguardando Pagamento',
            'payment_approved' => 'Pagamento Aprovado',
            'in_production' => 'Em Produção',
            'photo_sent' => 'Foto Enviada',
            'photo_approved' => 'Foto Aprovada',
            'pending_final_payment' => 'Pagamento Final Pendente',
            'ready_for_shipping' => 'Pronto para Envio',
            'shipped' => 'Enviado'
        ];

        return Inertia::render('Manager/Orders/Index', [
            'orders' => $orders,
            'filters' => $request->only(['status', 'search']),
            'statusOptions' => $statusOptions
        ]);
    }

    public function printOrder(Sale $sale)
    {
        // Check permission
        if (!auth()->user()->canPrintOrders()) {
            abort(403, 'Access denied');
        }

        $sale->load(['user', 'productCategory', 'embroideryDesign', 'payments']);

        return Inertia::render('Manager/Orders/Print', [
            'order' => $sale
        ]);
    }

    public function sendToProduction(Request $request, Sale $sale)
    {
        // Check permission
        if (!auth()->user()->canSendToProduction()) {
            abort(403, 'Access denied');
        }

        // Validate that order can be sent to production
        if (!$sale->canMoveToProduction()) {
            return back()->withErrors(['error' => 'Este pedido não pode ser enviado para produção ainda.']);
        }

        $sale->update([
            'order_status' => 'in_production',
            'production_started_at' => now(),
            'production_admin_id' => auth()->id()
        ]);

        return back()->with('success', 'Pedido enviado para produção com sucesso!');
    }

    public function dashboard()
    {
        return Inertia::render('Manager/Dashboard', [
            'auth' => ['user' => auth()->user()]
        ]);
    }
}