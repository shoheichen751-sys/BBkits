<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\SalePayment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SalePaymentController extends Controller
{
    public function index(Sale $sale)
    {
        $payments = $sale->payments()->with('approvedBy')->orderBy('payment_date', 'desc')->get();
        
        return Inertia::render('Sales/Payments/Index', [
            'sale' => $sale,
            'payments' => $payments,
            'paymentSummary' => [
                'total_amount' => $sale->total_amount + $sale->shipping_amount,
                'paid_amount' => $sale->getTotalPaidAmount(),
                'pending_amount' => $sale->getTotalPendingAmount(),
                'remaining_amount' => $sale->getRemainingAmount(),
                'progress' => $sale->getPaymentProgress(),
                'status' => $sale->getPaymentStatus(),
            ]
        ]);
    }

    public function store(Request $request, Sale $sale)
    {
        $request->validate([
            'amount' => 'required|numeric|min:0.01',
            'payment_date' => 'required|date',
            'payment_method' => 'required|string|max:255',
            'receipt' => 'required|file|mimes:jpeg,png,jpg,pdf|max:5120', // 5MB max
            'notes' => 'nullable|string|max:1000',
        ]);

        // Check if payment amount doesn't exceed remaining amount
        $remainingAmount = $sale->getRemainingAmount();
        if ($request->amount > $remainingAmount) {
            return back()->withErrors([
                'amount' => "O valor do pagamento (R$ {$request->amount}) não pode ser maior que o valor restante (R$ {$remainingAmount})"
            ]);
        }

        // Store receipt file
        $receiptPath = null;
        if ($request->hasFile('receipt')) {
            $receiptPath = $request->file('receipt')->store('payment-receipts', 'public');
        }

        // Auto-approve small payments or trusted sellers
        $autoApprove = $request->amount <= 5000 || $request->user()->isAdmin();
        $status = $autoApprove ? 'approved' : 'pending';

        // Create payment record
        SalePayment::create([
            'sale_id' => $sale->id,
            'amount' => $request->amount,
            'payment_date' => $request->payment_date,
            'payment_method' => $request->payment_method,
            'receipt_path' => $receiptPath,
            'notes' => $request->notes,
            'status' => $status,
            'approved_by' => $autoApprove ? $request->user()->id : null,
            'approved_at' => $autoApprove ? now() : null,
        ]);

        $message = $autoApprove 
            ? 'Pagamento registrado e aprovado automaticamente!' 
            : 'Pagamento registrado com sucesso e enviado para aprovação.';
        
        return back()->with('success', $message);
    }

    public function approve(SalePayment $payment)
    {
        if (!auth()->user()->isAdmin()) {
            return back()->withErrors(['error' => 'Apenas administradores podem aprovar pagamentos.']);
        }

        $payment->update([
            'status' => 'approved',
            'approved_by' => auth()->id(),
            'approved_at' => now(),
        ]);

        // Check if sale is now fully paid and update sale status
        $sale = $payment->sale;
        if ($sale->isFullyPaid()) {
            $sale->update([
                'status' => 'aprovado',
                'approved_by' => auth()->id(),
                'approved_at' => now(),
            ]);
        }

        return back()->with('success', 'Pagamento aprovado com sucesso.');
    }

    public function reject(Request $request, SalePayment $payment)
    {
        if (!auth()->user()->isAdmin()) {
            return back()->withErrors(['error' => 'Apenas administradores podem rejeitar pagamentos.']);
        }

        $request->validate([
            'rejection_reason' => 'required|string|max:500',
        ]);

        $payment->update([
            'status' => 'rejected',
            'rejection_reason' => $request->rejection_reason,
        ]);

        return back()->with('success', 'Pagamento rejeitado.');
    }

    public function destroy(SalePayment $payment)
    {
        // Only allow deletion by the sale owner or admin
        if (!auth()->user()->isAdmin() && $payment->sale->user_id !== auth()->id()) {
            return back()->withErrors(['error' => 'Você não tem permissão para excluir este pagamento.']);
        }

        // Only allow deletion if payment is still pending
        if ($payment->status !== 'pending') {
            return back()->withErrors(['error' => 'Apenas pagamentos pendentes podem ser excluídos.']);
        }

        // Delete receipt file if exists
        if ($payment->receipt_path) {
            Storage::disk('public')->delete($payment->receipt_path);
        }

        $payment->delete();

        return back()->with('success', 'Pagamento excluído com sucesso.');
    }
}