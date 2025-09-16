<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\Product;
use App\Models\SaleProduct;
use App\Models\SalePayment;
use App\Models\EmbroideryFont;
use App\Models\EmbroideryColor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use App\Services\PDFReportService;
use App\Services\NotificationService;
use App\Services\CommissionService;
use App\Jobs\ProcessSaleApproval;

class SaleController extends Controller
{
    protected $notificationService;
    protected $commissionService;

    public function __construct(NotificationService $notificationService, CommissionService $commissionService)
    {
        $this->notificationService = $notificationService;
        $this->commissionService = $commissionService;
    }

    public function index()
    {
        $sales = Sale::with('user')
            ->where('user_id', auth()->id())
            ->latest()
            ->paginate(10);

        return Inertia::render('Sales/Index', [
            'sales' => $sales,
            'auth' => [
                'user' => auth()->user()
            ]
        ]);
    }

    public function create()
    {
        // Redirect to expanded form since we need delivery fields
        return redirect()->route('sales.create-expanded');
    }

    public function createExpanded()
    {
        return Inertia::render('Sales/CreateExpanded');
    }
    
    public function createWithPreview()
    {
        return Inertia::render('Sales/CreateWithPreview');
    }

    public function createWithProducts()
    {
        // Load all active products with embroidery options
        $products = Product::active()->orderBy('category')->orderBy('name')->get();
        $fonts = EmbroideryFont::active()->ordered()->get();
        $colors = EmbroideryColor::active()->ordered()->get();
        
        return Inertia::render('Sales/CreateWithProducts', [
            'products' => $products,
            'fonts' => $fonts,
            'colors' => $colors,
        ]);
    }

    public function kanban()
    {
        $sales = Sale::with(['user', 'comments'])
            ->withCount('comments')
            ->orderBy('updated_at', 'desc')
            ->get();

        $users = \App\Models\User::select('id', 'name', 'role')->get();

        return Inertia::render('KanbanBoard', [
            'sales' => $sales,
            'users' => $users
        ]);
    }

    public function updateStatus(Request $request, Sale $sale)
    {
        $validated = $request->validate([
            'order_status' => 'required|in:pending_payment,payment_approved,in_production,photo_sent,photo_approved,pending_final_payment,ready_for_shipping,shipped,under_review'
        ]);

        $sale->update([
            'order_status' => $validated['order_status']
        ]);

        return back()->with('success', 'Status atualizado com sucesso!');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            // Client info - REQUIRED
            'client_name' => 'required|string|max:255',
            'client_email' => 'nullable|email|max:255',
            'client_phone' => 'required|string|max:20',
            'client_cpf' => 'nullable|string|max:14',
            
            // Product info - OPTIONAL (only for CreateExpanded form)
            'product_category' => 'nullable|exists:product_categories,id',
            'product_size' => 'nullable|in:P,M,G,GG',
            'product_price' => 'nullable|numeric|min:0',
            
            // Child & embroidery - REQUIRED
            'child_name' => 'required|string|max:255',
            'embroidery_type' => 'nullable|in:text,design,both',
            'embroidery_position' => 'required|string|max:255', // Now accepts ID or name
            'embroidery_color' => 'required|string|max:255',    // Now accepts ID or name
            'embroidery_font' => 'nullable|string|max:255',     // Now accepts ID or name
            'embroidery_design_id' => 'nullable|exists:embroidery_designs,id',
            'embroidery_text' => 'nullable|string|max:255',
            
            // Payment - REQUIRED
            'total_amount' => 'required|numeric|min:0',
            'shipping_amount' => 'required|numeric|min:0',
            'payment_method' => 'required|in:pix,boleto,cartao,dinheiro',
            'received_amount' => 'required|numeric|min:0',
            'payment_date' => 'required|date',
            'payment_receipt' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:2048',
            
            // Delivery address - OPTIONAL (customer fills later)
            'delivery_address' => 'nullable|string|max:255',
            'delivery_number' => 'nullable|string|max:20',
            'delivery_complement' => 'nullable|string|max:100',
            'delivery_neighborhood' => 'nullable|string|max:100',
            'delivery_city' => 'nullable|string|max:100',
            'delivery_state' => 'nullable|string|size:2',
            'delivery_zipcode' => 'nullable|string|regex:/^\d{5}-?\d{3}$/',
            
            // Product specifications - REQUIRED for inventory control
            'mesa_livre_details' => 'required|string|max:1000',
            'chaveiros' => 'required|string|max:255',
            'kit_main_color' => 'required|string|max:255',
            'alcas' => 'required|string|max:255',
            'faixa' => 'required|string|max:255',
            'friso' => 'required|string|max:255',
            'vies' => 'required|string|max:255',
            'ziper' => 'required|string|max:255',
            'production_estimate' => 'required|date|after:today',
            'delivery_estimate' => 'required|date|after:production_estimate',
            
            // Optional
            'notes' => 'nullable|string',
            'preferred_delivery_date' => 'nullable|date'
        ]);

        if ($request->hasFile('payment_receipt')) {
            $file = $request->file('payment_receipt');
            $fileContent = file_get_contents($file->getRealPath());
            $mimeType = $file->getMimeType();
            
            // Store as base64 data URL
            $validated['receipt_data'] = 'data:' . $mimeType . ';base64,' . base64_encode($fileContent);
            
            // If this is the initial payment proof, also store it in the new field
            $validated['initial_payment_proof_data'] = $validated['receipt_data'];
            
            // Still store the file path for backward compatibility
            $validated['payment_receipt'] = $request->file('payment_receipt')->store('receipts', 'public');
            $validated['initial_payment_proof'] = $validated['payment_receipt'];
        }

        // Map product_category to product_category_id for database storage
        if (isset($validated['product_category'])) {
            $validated['product_category_id'] = $validated['product_category'];
            unset($validated['product_category']);
        }
        
        // Handle embroidery type for backward compatibility
        if (!isset($validated['embroidery_type']) || empty($validated['embroidery_type'])) {
            $validated['embroidery_type'] = 'text'; // Default to text for existing behavior
        }

        $validated['user_id'] = auth()->id();
        $validated['status'] = 'pendente';
        
        // Set initial order status based on payment
        if ($validated['received_amount'] >= $validated['total_amount']) {
            $validated['order_status'] = 'pending_payment'; // Will be approved by finance
        } else {
            $validated['order_status'] = 'pending_payment'; // Partial payment
        }

        $sale = Sale::create($validated);
        
        $this->notificationService->notifyNewSale($sale);

        // Send WhatsApp order confirmation automatically
        if ($sale->client_phone) {
            try {
                $whatsAppService = app(\App\Services\WhatsAppService::class);
                $whatsAppResult = $whatsAppService->sendOrderConfirmation($sale);
                
                if (!$whatsAppResult['success']) {
                    Log::warning('WhatsApp order confirmation failed', [
                        'sale_id' => $sale->id,
                        'error' => $whatsAppResult['message']
                    ]);
                }
            } catch (\Exception $e) {
                Log::error('WhatsApp service error during order creation', [
                    'sale_id' => $sale->id,
                    'error' => $e->getMessage()
                ]);
            }
        }

        // Return with personalized page URL if client email exists
        if ($sale->client_email) {
            return redirect()->route('sales.index')->with([
                'message' => 'Venda registrada com sucesso!',
                'client_url' => $sale->getPersonalizedPageUrl()
            ]);
        }

        return redirect()->route('sales.index')->with('message', 'Venda registrada com sucesso!');
    }

    public function storeWithProducts(Request $request)
    {
        $validated = $request->validate([
            // Client info - REQUIRED
            'client_name' => 'required|string|max:255',
            'client_email' => 'nullable|email|max:255',
            'client_phone' => 'required|string|max:20',
            'client_cpf' => 'nullable|string|max:14',
            
            // Child name - REQUIRED
            'child_name' => 'required|string|max:255',
            
            // Products - REQUIRED (array of products)
            'products' => 'required|array|min:1',
            'products.*.product_id' => 'required|exists:products,id',
            'products.*.quantity' => 'required|integer|min:1',
            'products.*.size' => 'nullable|string|max:50',
            'products.*.product_color' => 'nullable|string|max:50',
            'products.*.unit_price' => 'required|numeric|min:0',
            
            // Embroidery per product (optional)
            'products.*.has_embroidery' => 'boolean',
            'products.*.embroidery_type' => 'nullable|in:text,design,both',
            'products.*.embroidery_text' => 'nullable|string|max:255',
            'products.*.embroidery_font_id' => 'nullable|exists:embroidery_fonts,id',
            'products.*.embroidery_color_id' => 'nullable|exists:embroidery_colors,id',
            'products.*.embroidery_design_id' => 'nullable|exists:embroidery_designs,id',
            'products.*.embroidery_position' => 'nullable|string|max:100',
            'products.*.embroidery_cost' => 'nullable|numeric|min:0',
            
            // Payment - REQUIRED
            'total_amount' => 'required|numeric|min:0',
            'shipping_amount' => 'required|numeric|min:0',
            'payment_method' => 'required|in:pix,boleto,cartao,dinheiro',
            'received_amount' => 'required|numeric|min:0',
            'payment_date' => 'required|date',
            'payment_receipt' => 'required|file|mimes:jpeg,png,jpg,pdf|max:2048',
            
            // Delivery address - OPTIONAL (customer fills later)
            'delivery_address' => 'nullable|string|max:255',
            'delivery_number' => 'nullable|string|max:20',
            'delivery_complement' => 'nullable|string|max:100',
            'delivery_neighborhood' => 'nullable|string|max:100',
            'delivery_city' => 'nullable|string|max:100',
            'delivery_state' => 'nullable|string|size:2',
            'delivery_zipcode' => 'nullable|string|regex:/^\d{5}-?\d{3}$/',
            
            // Product specifications - REQUIRED for inventory control
            'mesa_livre_details' => 'required|string|max:1000',
            'chaveiros' => 'required|string|max:255',
            'kit_main_color' => 'required|string|max:255',
            'alcas' => 'required|string|max:255',
            'faixa' => 'required|string|max:255',
            'friso' => 'required|string|max:255',
            'vies' => 'required|string|max:255',
            'ziper' => 'required|string|max:255',
            'production_estimate' => 'required|date|after:today',
            'delivery_estimate' => 'required|date|after:production_estimate',
            
            // Delivery estimates
            'estimated_delivery_date' => 'nullable|date',
            'delivery_days' => 'nullable|integer|min:1',
            
            // Optional
            'notes' => 'nullable|string',
            'preferred_delivery_date' => 'nullable|date'
        ]);

        DB::beginTransaction();
        
        try {
            // Handle payment receipt
            if ($request->hasFile('payment_receipt')) {
                $file = $request->file('payment_receipt');
                $fileContent = file_get_contents($file->getRealPath());
                $mimeType = $file->getMimeType();
                
                // Store as base64 data URL
                $validated['receipt_data'] = 'data:' . $mimeType . ';base64,' . base64_encode($fileContent);
                $validated['initial_payment_proof_data'] = $validated['receipt_data'];
                
                // Still store the file path for backward compatibility
                $validated['payment_receipt'] = $request->file('payment_receipt')->store('receipts', 'public');
                $validated['initial_payment_proof'] = $validated['payment_receipt'];
            }

            // Extract products data and remove from main validated array
            $productsData = $validated['products'];
            unset($validated['products']);

            // Set sale basic info
            $validated['user_id'] = auth()->id();
            $validated['status'] = 'pendente';
            
            // Set initial order status based on payment
            if ($validated['received_amount'] >= $validated['total_amount']) {
                $validated['order_status'] = 'pending_payment'; // Will be approved by finance
            } else {
                $validated['order_status'] = 'pending_payment'; // Partial payment
            }

            // Create the sale
            $sale = Sale::create($validated);
            
            // Create sale products
            foreach ($productsData as $productData) {
                $saleProduct = SaleProduct::create([
                    'sale_id' => $sale->id,
                    'product_id' => $productData['product_id'],
                    'quantity' => $productData['quantity'],
                    'size' => $productData['size'] ?? null,
                    'product_color' => $productData['product_color'] ?? null,
                    'unit_price' => $productData['unit_price'],
                    'has_embroidery' => $productData['has_embroidery'] ?? false,
                    'embroidery_text' => $productData['embroidery_text'] ?? null,
                    'embroidery_font_id' => $productData['embroidery_font_id'] ?? null,
                    'embroidery_color_id' => $productData['embroidery_color_id'] ?? null,
                    'embroidery_position' => $productData['embroidery_position'] ?? null,
                    'embroidery_cost' => $productData['embroidery_cost'] ?? 0,
                ]);
            }
            
            // Create initial payment record if there's a received amount
            if ($validated['received_amount'] > 0) {
                SalePayment::create([
                    'sale_id' => $sale->id,
                    'amount' => $validated['received_amount'],
                    'payment_date' => $validated['payment_date'],
                    'payment_method' => $validated['payment_method'],
                    'status' => 'pending', // Will be approved by admin/finance
                    'proof_data' => $validated['receipt_data'] ?? null,
                    'notes' => 'Pagamento inicial registrado na criação da venda',
                ]);
            }
            
            DB::commit();
            
            $this->notificationService->notifyNewSale($sale);

            // Send WhatsApp order confirmation automatically
            if ($sale->client_phone) {
                try {
                    $whatsAppService = app(\App\Services\WhatsAppService::class);
                    $whatsAppResult = $whatsAppService->sendOrderConfirmation($sale);
                    
                    if (!$whatsAppResult['success']) {
                        Log::warning('WhatsApp order confirmation failed', [
                            'sale_id' => $sale->id,
                            'error' => $whatsAppResult['message']
                        ]);
                    }
                } catch (\Exception $e) {
                    Log::error('WhatsApp service error during order creation', [
                        'sale_id' => $sale->id,
                        'error' => $e->getMessage()
                    ]);
                }
            }

            // Return with personalized page URL if client email exists
            if ($sale->client_email) {
                return redirect()->route('sales.index')->with([
                    'message' => 'Venda com produtos registrada com sucesso!',
                    'client_url' => $sale->getPersonalizedPageUrl()
                ]);
            }

            return redirect()->route('sales.index')->with('message', 'Venda com produtos registrada com sucesso!');
            
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error creating sale with products', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return redirect()->back()->withErrors(['error' => 'Erro ao criar venda: ' . $e->getMessage()]);
        }
    }

    public function show(Sale $sale)
    {
        $this->authorize('view', $sale);
        
        return Inertia::render('Sales/Show', [
            'sale' => $sale->load([
                'user', 
                'approvedBy', 
                'rejectedBy',
                'productCategory',
                'saleProducts.product',
                'saleProducts.embroideryFont',
                'saleProducts.embroideryColor'
            ])
        ]);
    }

    public function edit(Sale $sale)
    {
        $this->authorize('update', $sale);

        return Inertia::render('Sales/Edit', [
            'sale' => $sale
        ]);
    }

    public function update(Request $request, Sale $sale)
    {
        $this->authorize('update', $sale);

        $validated = $request->validate([
            'client_name' => 'required|string|max:255',
            'total_amount' => 'required|numeric|min:0',
            'shipping_amount' => 'required|numeric|min:0',
            'payment_method' => 'required|in:pix,boleto,cartao,dinheiro',
            'received_amount' => 'required|numeric|min:0',
            'payment_date' => 'required|date',
            'payment_receipt' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:2048',
            'notes' => 'nullable|string'
        ]);

        if ($request->hasFile('payment_receipt')) {
            $file = $request->file('payment_receipt');
            $fileContent = file_get_contents($file->getRealPath());
            $mimeType = $file->getMimeType();
            
            // Store as base64 data URL
            $validated['receipt_data'] = 'data:' . $mimeType . ';base64,' . base64_encode($fileContent);
            
            // Delete old file if exists
            if ($sale->payment_receipt) {
                Storage::disk('public')->delete($sale->payment_receipt);
            }
            
            // Still store the file path for backward compatibility
            $validated['payment_receipt'] = $request->file('payment_receipt')->store('receipts', 'public');
        }

        $sale->update($validated);

        return redirect()->route('sales.index')->with('message', 'Venda atualizada com sucesso!');
    }

    public function destroy(Sale $sale)
    {
        $this->authorize('delete', $sale);

        if ($sale->payment_receipt) {
            Storage::disk('public')->delete($sale->payment_receipt);
        }

        $sale->delete();

        return redirect()->route('sales.index')->with('message', 'Venda excluída com sucesso!');
    }
    
    // Admin methods
    public function adminIndex()
    {
        if (auth()->user()->role !== 'admin' && auth()->user()->role !== 'financeiro') {
            abort(403, 'Unauthorized');
        }
        
        $sales = Sale::with(['user', 'approvedBy', 'rejectedBy'])
            ->latest()
            ->paginate(15);

        return Inertia::render('Admin/Sales/Index', [
            'sales' => $sales
        ]);
    }
    
    public function approve(Sale $sale)
    {
        if (auth()->user()->role !== 'admin' && auth()->user()->role !== 'financeiro') {
            abort(403, 'Unauthorized');
        }
        
        try {
            DB::beginTransaction();
            
            // Verify sale is still pending
            if ($sale->status !== 'pendente') {
                throw new \Exception('Sale is no longer pending approval');
            }
            
            $sale->update([
                'status' => 'aprovado',
                'order_status' => 'payment_approved', // Move to new workflow
                'approved_by' => auth()->id(),
                'approved_at' => now(),
                'finance_admin_id' => auth()->id(),
                'initial_payment_approved_at' => now()
            ]);
            
            // Create commission record
            $commission = $this->commissionService->createCommissionForSale($sale->fresh());
            
            DB::commit();
            
            Log::info('Sale approved successfully', [
                'sale_id' => $sale->id,
                'approved_by' => auth()->id(),
                'commission_created' => $commission ? $commission->id : null
            ]);
            
            $this->notificationService->notifySaleApproved($sale);
            
            return back()->with('message', 'Venda aprovada com sucesso!');
            
        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('Failed to approve sale', [
                'sale_id' => $sale->id,
                'error' => $e->getMessage(),
                'user_id' => auth()->id()
            ]);
            
            return back()->withErrors(['error' => 'Erro ao aprovar venda. Tente novamente.']);
        }
    }
    
    public function reject(Request $request, Sale $sale)
    {
        if (auth()->user()->role !== 'admin' && auth()->user()->role !== 'financeiro') {
            abort(403, 'Unauthorized');
        }
        
        try {
            $validated = $request->validate([
                'rejection_reason' => 'required|string|max:500'
            ]);
            
            DB::beginTransaction();
            
            // Verify sale is still pending
            if ($sale->status !== 'pendente') {
                throw new \Exception('Sale is no longer pending approval');
            }
            
            $sale->update([
                'status' => 'recusado',
                'rejected_by' => auth()->id(),
                'rejected_at' => now(),
                'rejection_reason' => $validated['rejection_reason']
            ]);
            
            DB::commit();
            
            Log::info('Sale rejected', [
                'sale_id' => $sale->id,
                'rejected_by' => auth()->id(),
                'reason' => $validated['rejection_reason']
            ]);
            
            $this->notificationService->notifySaleRejected($sale, $validated['rejection_reason']);
            
            return back()->with('message', 'Venda recusada.');
            
        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('Failed to reject sale', [
                'sale_id' => $sale->id,
                'error' => $e->getMessage(),
                'user_id' => auth()->id()
            ]);
            
            return back()->withErrors(['error' => 'Erro ao recusar venda. Tente novamente.']);
        }
    }
    
    // Queued payment processing methods with fallback
    public function approveWithQueue(Sale $sale)
    {
        if (auth()->user()->role !== 'admin' && auth()->user()->role !== 'financeiro') {
            abort(403, 'Unauthorized');
        }
        
        try {
            // Try to dispatch to queue first
            ProcessSaleApproval::dispatch($sale->id, auth()->id(), 'approve');
            
            Log::info('Sale approval queued', [
                'sale_id' => $sale->id,
                'approved_by' => auth()->id()
            ]);
            
            return back()->with('message', 'Venda está sendo processada para aprovação...');
            
        } catch (\Exception $e) {
            Log::warning('Queue failed, falling back to synchronous processing', [
                'sale_id' => $sale->id,
                'error' => $e->getMessage()
            ]);
            
            // Fallback to synchronous processing
            return $this->approve($sale);
        }
    }
    
    public function rejectWithQueue(Request $request, Sale $sale)
    {
        if (auth()->user()->role !== 'admin' && auth()->user()->role !== 'financeiro') {
            abort(403, 'Unauthorized');
        }
        
        try {
            $validated = $request->validate([
                'rejection_reason' => 'required|string|max:500'
            ]);
            
            // Try to dispatch to queue first
            ProcessSaleApproval::dispatch(
                $sale->id, 
                auth()->id(), 
                'reject', 
                $validated['rejection_reason']
            );
            
            Log::info('Sale rejection queued', [
                'sale_id' => $sale->id,
                'rejected_by' => auth()->id()
            ]);
            
            return back()->with('message', 'Venda está sendo processada para recusa...');
            
        } catch (\Exception $e) {
            Log::warning('Queue failed, falling back to synchronous processing', [
                'sale_id' => $sale->id,
                'error' => $e->getMessage()
            ]);
            
            // Fallback to synchronous processing
            return $this->reject($request, $sale);
        }
    }
    
    // PDF Report methods
    public function generateSalesReport(Request $request)
    {
        $month = $request->get('month');
        $year = $request->get('year');
        
        $pdfService = new PDFReportService();
        return $pdfService->generateSalesReport(auth()->user(), $month, $year);
    }
    
    public function generateCommissionReport(Request $request)
    {
        $month = $request->get('month');
        $year = $request->get('year');
        
        $pdfService = new PDFReportService();
        return $pdfService->generateCommissionReport(auth()->user(), $month, $year);
    }

    public function correct(Request $request, Sale $sale)
    {
        $validated = $request->validate([
            'total_amount' => 'required|numeric|min:0',
            'shipping_amount' => 'required|numeric|min:0',
            'received_amount' => 'required|numeric|min:0',
            'payment_date' => 'required|date',
            'correction_reason' => 'required|string|max:1000',
        ]);

        DB::transaction(function () use ($sale, $validated) {
            $originalStatus = $sale->status;
            $originalMonth = $sale->payment_date ? $sale->payment_date->month : null;
            $originalYear = $sale->payment_date ? $sale->payment_date->year : null;

            $sale->update([
                'total_amount' => $validated['total_amount'],
                'shipping_amount' => $validated['shipping_amount'],
                'received_amount' => $validated['received_amount'],
                'payment_date' => $validated['payment_date'],
                'corrected_by' => auth()->id(),
                'corrected_at' => now(),
                'correction_reason' => $validated['correction_reason'],
                'original_status' => $originalStatus,
            ]);

            if ($originalMonth && $originalYear) {
                $this->commissionService->recalculateMonthlyCommissions(
                    $sale->user,
                    $originalMonth,
                    $originalYear
                );
            }

            $newMonth = $sale->payment_date->month;
            $newYear = $sale->payment_date->year;
            if ($newMonth !== $originalMonth || $newYear !== $originalYear) {
                $this->commissionService->recalculateMonthlyCommissions(
                    $sale->user,
                    $newMonth,
                    $newYear
                );
            }
        });

        return back()->with('success', 'Venda corrigida com sucesso.');
    }

    public function cancel(Request $request, Sale $sale)
    {
        // Explicitly authorize using the 'cancel' policy method
        $this->authorize('cancel', $sale);

        // Simple test - always log when method is called
        \Log::emergency('CANCEL METHOD CALLED - Sale ID: ' . $sale->id . ' - User: ' . auth()->user()->email);

        $validated = $request->validate([
            'admin_password' => 'required|string',
            'explanation' => 'required|string|min:10|max:1000',
        ]);

        // Debug: Log the password attempt
        Log::info('Cancel attempt', [
            'sale_id' => $sale->id,
            'password_length' => strlen($validated['admin_password']),
            'explanation_length' => strlen($validated['explanation']),
            'user_id' => auth()->id()
        ]);

        // Verify admin password against any admin user (not just current user)
        $adminUsers = \App\Models\User::where('role', 'admin')->get();

        Log::info('Admin users found', [
            'count' => $adminUsers->count(),
            'admins' => $adminUsers->pluck('email')->toArray()
        ]);

        $isValidAdminPassword = $adminUsers->contains(function ($admin) use ($validated) {
            $isValid = Hash::check($validated['admin_password'], $admin->password);
            Log::info('Password check', [
                'admin_email' => $admin->email,
                'password_valid' => $isValid
            ]);
            return $isValid;
        });

        if (!$isValidAdminPassword) {
            Log::warning('Invalid admin password attempt', [
                'sale_id' => $sale->id,
                'user_id' => auth()->id()
            ]);
            return back()->withErrors(['admin_password' => 'Senha do administrador incorreta.']);
        }

        Log::info('Admin password verified, proceeding with deletion', [
            'sale_id' => $sale->id,
            'user_id' => auth()->id()
        ]);

        try {
            DB::transaction(function () use ($sale, $validated) {
                $originalMonth = $sale->payment_date ? $sale->payment_date->month : null;
                $originalYear = $sale->payment_date ? $sale->payment_date->year : null;
                $saleUser = $sale->user; // Store user reference before deletion

                Log::info('About to delete sale', [
                    'sale_id' => $sale->id,
                    'client_name' => $sale->client_name
                ]);

                // Delete the sale record completely
                $sale->delete();

                Log::info('Sale deleted successfully', [
                    'sale_id' => $sale->id
                ]);

                // Recalculate commissions for the affected month after deletion
                if ($originalMonth && $originalYear && $saleUser) {
                    $this->commissionService->recalculateMonthlyCommissions(
                        $saleUser,
                        $originalMonth,
                        $originalYear
                    );
                }
            });

            Log::info('Sale cancellation completed successfully', [
                'sale_id' => $sale->id
            ]);

            return back()->with('message', 'Venda cancelada com sucesso.');

        } catch (\Exception $e) {
            Log::error('Error cancelling sale', [
                'sale_id' => $sale->id,
                'error' => $e->getMessage(),
                'user_id' => auth()->id()
            ]);

            return back()->withErrors(['error' => 'Erro ao cancelar venda. Tente novamente.']);
        }
    }

    // Public client page
    public function clientPage($token)
    {
        $sale = Sale::where('unique_token', $token)->firstOrFail();
        
        return Inertia::render('Sales/ClientPage', [
            'sale' => $sale->load([
                'user', 
                'productionAdmin', 
                'financeAdmin',
                'saleProducts.product',  // Load product details
                'embroideryDesign'       // Load embroidery design details
            ]),
            'orderStatus' => $sale->getOrderStatusLabel(),
            'orderStatusColor' => $sale->getOrderStatusColor(),
            'paidAmount' => $sale->getTotalPaidAmount(),
            'remainingAmount' => $sale->getRemainingAmount(),
            'needsFinalPayment' => $sale->needsFinalPayment(),
            'productPhotoUrl' => $sale->getProductPhotoUrl()
        ]);
    }

    public function clientUpdateAddress(Request $request, $token)
    {
        $sale = Sale::where('unique_token', $token)->firstOrFail();
        
        $validated = $request->validate([
            'delivery_address' => 'required|string|max:255',
            'delivery_number' => 'required|string|max:20',
            'delivery_complement' => 'nullable|string|max:100',
            'delivery_neighborhood' => 'required|string|max:100',
            'delivery_city' => 'required|string|max:100',
            'delivery_state' => 'required|string|max:2',
            'delivery_zipcode' => 'required|string|max:10'
        ]);
        
        $sale->update($validated);
        
        return back()->with('message', 'Endereço atualizado com sucesso!');
    }

    public function clientUploadPayment(Request $request, $token)
    {
        $sale = Sale::where('unique_token', $token)->firstOrFail();
        
        $validated = $request->validate([
            'final_payment_proof' => 'required|file|mimes:jpeg,png,jpg,pdf|max:2048'
        ]);
        
        if ($request->hasFile('final_payment_proof')) {
            $file = $request->file('final_payment_proof');
            $fileContent = file_get_contents($file->getRealPath());
            $mimeType = $file->getMimeType();
            
            $sale->final_payment_proof_data = 'data:' . $mimeType . ';base64,' . base64_encode($fileContent);
            $sale->final_payment_proof = $file->store('receipts', 'public');
            $sale->save();
            
            // Notify admin about new payment proof
            $this->notificationService->notifyPaymentUploaded($sale);
        }
        
        return back()->with('message', 'Comprovante enviado com sucesso!');
    }

    public function clientApprovePhoto(Request $request, $token)
    {
        $sale = Sale::where('unique_token', $token)->firstOrFail();
        
        if ($sale->order_status !== 'photo_sent') {
            return back()->withErrors(['error' => 'Foto não está disponível para aprovação']);
        }
        
        $validated = $request->validate([
            'approved' => 'required|boolean',
            'reason' => 'required_if:approved,false|string|max:500'
        ]);
        
        if ($validated['approved']) {
            $sale->update([
                'photo_approved_at' => now(),
                'order_status' => $sale->needsFinalPayment() ? 'pending_final_payment' : 'ready_for_shipping'
            ]);
            
            $this->notificationService->notifyPhotoApproved($sale);
        } else {
            $sale->update([
                'photo_rejected_at' => now(),
                'photo_rejection_reason' => $validated['reason'],
                'order_status' => 'in_production' // Back to production for adjustments
            ]);
            
            $this->notificationService->notifyPhotoRejected($sale, $validated['reason']);
        }
        
        return back()->with('message', $validated['approved'] ? 'Foto aprovada!' : 'Solicitação de ajuste enviada');
    }
}
