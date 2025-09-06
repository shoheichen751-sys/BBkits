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
            $order->payment_progress = $order->getPaymentProgress();
            $order->payment_status = $order->getPaymentStatus();
            $order->is_fully_paid = $order->isFullyPaid();
            $order->total_paid_amount = $order->getTotalPaidAmount();
            $order->remaining_amount = $order->getRemainingAmount();
            $order->can_print = $order->isFullyPaid() && !empty($order->approved_by);
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