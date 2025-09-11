<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Sale extends Model
{
    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($sale) {
            if (empty($sale->unique_token)) {
                do {
                    $token = 'BB' . strtoupper(Str::random(8));
                } while (self::where('unique_token', $token)->exists());
                
                $sale->unique_token = $token;
            }
        });
    }
    protected $fillable = [
        'user_id',
        'unique_token',
        'client_name',
        'client_email',
        'client_phone',
        'client_cpf',
        'product_category_id',
        'product_size',
        'product_price',
        'child_name',
        'embroidery_position',
        'embroidery_color',
        'embroidery_font',
        'embroidery_type',
        'embroidery_design_id',
        'embroidery_text',
        'total_amount',
        'shipping_amount',
        'payment_method',
        'received_amount',
        'payment_date',
        'payment_receipt',
        'receipt_data',
        'initial_payment_proof',
        'initial_payment_proof_data',
        'final_payment_proof',
        'final_payment_proof_data',
        'notes',
        'status',
        'order_status',
        'admin_notes',
        'approved_by',
        'approved_at',
        'rejected_by',
        'rejected_at',
        'rejection_reason',
        'corrected_by',
        'corrected_at',
        'correction_reason',
        'original_status',
        'review_started_at',
        'reviewed_by',
        'review_reason',
        'review_resolved_at',
        'delivery_address',
        'delivery_number',
        'delivery_complement',
        'delivery_neighborhood',
        'delivery_city',
        'delivery_state',
        'delivery_zipcode',
        'preferred_delivery_date',
        'production_admin_id',
        'production_started_at',
        'product_photo',
        'product_photo_data',
        'photo_sent_at',
        'photo_approved_at',
        'photo_rejected_at',
        'photo_rejection_reason',
        'finance_admin_id',
        'initial_payment_approved_at',
        'final_payment_approved_at',
        'invoice_number',
        'tracking_code',
        'shipped_at',
        'shipping_label',
        // Tiny ERP fields
        'tiny_erp_invoice_id',
        'tiny_erp_shipping_id',
        'invoice_generated_at',
        'shipping_label_generated_at',
        'shipping_label_url',
        'tiny_erp_status',
        'tiny_erp_error',
        'tiny_erp_sync_at',
        // WhatsApp fields
        'whatsapp_confirmation_sent',
        'whatsapp_confirmation_sent_at',
        'whatsapp_payment_approved_sent',
        'whatsapp_payment_approved_sent_at',
        'whatsapp_production_started_sent',
        'whatsapp_production_started_sent_at',
        'whatsapp_photo_sent',
        'whatsapp_photo_sent_at',
        'whatsapp_shipping_sent',
        'whatsapp_shipping_sent_at',
        'whatsapp_payment_rejected_sent',
        'whatsapp_payment_rejected_sent_at',
        'whatsapp_final_payment_reminder_sent',
        'whatsapp_final_payment_reminder_sent_at',
        // Processing fields
        'is_processing',
        'processing_started_at',
        'processing_token',
        // Product specifications for inventory control
        'mesa_livre_details',
        'chaveiros',
        'kit_main_color',
        'alcas',
        'faixa',
        'friso',
        'vies',
        'ziper',
        'production_estimate',
        'delivery_estimate'
    ];

    protected $casts = [
        'payment_date' => 'date',
        'preferred_delivery_date' => 'date',
        'approved_at' => 'datetime',
        'rejected_at' => 'datetime',
        'corrected_at' => 'datetime',
        'review_started_at' => 'datetime',
        'review_resolved_at' => 'datetime',
        'production_started_at' => 'datetime',
        'photo_sent_at' => 'datetime',
        'photo_approved_at' => 'datetime',
        'photo_rejected_at' => 'datetime',
        'initial_payment_approved_at' => 'datetime',
        'final_payment_approved_at' => 'datetime',
        'shipped_at' => 'datetime',
        // Tiny ERP casts
        'invoice_generated_at' => 'datetime',
        'shipping_label_generated_at' => 'datetime',
        'tiny_erp_sync_at' => 'datetime',
        // WhatsApp casts
        'whatsapp_confirmation_sent' => 'boolean',
        'whatsapp_confirmation_sent_at' => 'datetime',
        'whatsapp_payment_approved_sent' => 'boolean',
        'whatsapp_payment_approved_sent_at' => 'datetime',
        'whatsapp_production_started_sent' => 'boolean',
        'whatsapp_production_started_sent_at' => 'datetime',
        'whatsapp_photo_sent' => 'boolean',
        'whatsapp_photo_sent_at' => 'datetime',
        'whatsapp_shipping_sent' => 'boolean',
        'whatsapp_shipping_sent_at' => 'datetime',
        'whatsapp_payment_rejected_sent' => 'boolean',
        'whatsapp_payment_rejected_sent_at' => 'datetime',
        'whatsapp_final_payment_reminder_sent' => 'boolean',
        'whatsapp_final_payment_reminder_sent_at' => 'datetime',
        // Processing casts
        'is_processing' => 'boolean',
        'processing_started_at' => 'datetime',
        // Existing casts
        'total_amount' => 'decimal:2',
        'shipping_amount' => 'decimal:2',
        'received_amount' => 'decimal:2',
        // Specification dates
        'production_estimate' => 'date',
        'delivery_estimate' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    
    public function productCategory(): BelongsTo
    {
        return $this->belongsTo(ProductCategory::class, 'product_category_id');
    }

    public function embroideryDesign(): BelongsTo
    {
        return $this->belongsTo(EmbroideryDesign::class, 'embroidery_design_id');
    }
    
    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
    
    public function rejectedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'rejected_by');
    }

    public function productionAdmin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'production_admin_id');
    }

    public function financeAdmin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'finance_admin_id');
    }

    public function comments(): HasMany
    {
        return $this->hasMany(OrderComment::class);
    }

    public function recentComments(): HasMany
    {
        return $this->hasMany(OrderComment::class)->latest()->limit(5);
    }

    public function reviewedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function saleProducts()
    {
        return $this->hasMany(SaleProduct::class);
    }

    public function products()
    {
        return $this->belongsToMany(Product::class, 'sale_products')
                    ->withPivot([
                        'quantity', 
                        'size', 
                        'product_color', 
                        'unit_price',
                        'has_embroidery',
                        'embroidery_text',
                        'embroidery_font_id',
                        'embroidery_color_id',
                        'embroidery_position',
                        'embroidery_cost'
                    ])
                    ->withTimestamps();
    }

    public function getCommissionBaseAmount(): float
    {
        // If sale has payment records, use the approved payments total
        if ($this->hasPartialPayments()) {
            return $this->getTotalPaidAmount() - $this->shipping_amount;
        }
        
        // Fallback to original received_amount for backward compatibility
        return $this->received_amount - $this->shipping_amount;
    }

    public function isPending(): bool
    {
        return $this->status === 'pendente';
    }

    public function isApproved(): bool
    {
        return $this->status === 'aprovado';
    }

    public function isRejected(): bool
    {
        return $this->status === 'recusado';
    }

    public function getReceiptUrl(): ?string
    {
        // If we have base64 data, return it as data URL
        if ($this->receipt_data) {
            return $this->receipt_data;
        }
        
        // Fallback to file path if it exists
        if ($this->payment_receipt) {
            return asset('storage/' . $this->payment_receipt);
        }
        
        return null;
    }

    public function hasReceipt(): bool
    {
        return !empty($this->receipt_data) || !empty($this->payment_receipt);
    }

    // Payment relationships and methods
    public function payments(): HasMany
    {
        return $this->hasMany(SalePayment::class);
    }

    public function approvedPayments(): HasMany
    {
        return $this->hasMany(SalePayment::class)->where('status', 'approved');
    }

    public function pendingPayments(): HasMany
    {
        return $this->hasMany(SalePayment::class)->where('status', 'pending');
    }

    public function getTotalPaidAmount(): float
    {
        // Check if there are actual approved payments (partial payment system)
        $approvedPayments = $this->approvedPayments();
        if ($approvedPayments->count() > 0) {
            return $approvedPayments->sum('amount');
        }
        
        // Fall back to received_amount for simple payment system
        return (float) ($this->received_amount ?? 0);
    }

    public function getTotalPendingAmount(): float
    {
        return $this->pendingPayments()->sum('amount');
    }

    public function getRemainingAmount(): float
    {
        return ($this->total_amount + $this->shipping_amount) - $this->getTotalPaidAmount();
    }

    public function isFullyPaid(): bool
    {
        return $this->getTotalPaidAmount() >= ($this->total_amount + $this->shipping_amount);
    }

    public function hasPartialPayments(): bool
    {
        return $this->payments()->count() > 0;
    }

    public function getPaymentProgress(): float
    {
        $totalWithShipping = $this->total_amount + $this->shipping_amount;
        if ($totalWithShipping <= 0) {
            return 0;
        }
        return ($this->getTotalPaidAmount() / $totalWithShipping) * 100;
    }

    public function getPaymentStatus(): string
    {
        if ($this->isFullyPaid()) {
            return 'fully_paid';
        } elseif ($this->getTotalPaidAmount() > 0) {
            return 'partially_paid';
        } else {
            return 'unpaid';
        }
    }

    // Override the original commission base calculation for partial payments
    public function getCommissionBaseAmountForPayments(): float
    {
        if (!$this->isFullyPaid()) {
            return 0; // No commission until fully paid
        }
        return $this->getTotalPaidAmount() - $this->shipping_amount;
    }

    // Order lifecycle methods
    public function getOrderStatusLabel(): string
    {
        $labels = [
            'pending_payment' => '⏳ Aguardando Pagamento',
            'payment_approved' => '✅ Pagamento Aprovado',
            'in_production' => '🏭 Em Produção',
            'photo_sent' => '📸 Foto Enviada para Aprovação',
            'photo_approved' => '✨ Aguardando Aprovação da Cliente',
            'pending_final_payment' => '🟠 Pagamento Final Pendente',
            'ready_for_shipping' => '🔗 Pronto para Envio',
            'shipped' => '🎉 Enviado',
            'under_review' => '🔍 Em Revisão'
        ];
        
        return $labels[$this->order_status] ?? $this->order_status;
    }

    public function getOrderStatusColor(): string
    {
        $colors = [
            'pending_payment' => 'yellow',
            'payment_approved' => 'green',
            'in_production' => 'blue',
            'photo_sent' => 'purple',
            'photo_approved' => 'indigo',
            'pending_final_payment' => 'orange',
            'ready_for_shipping' => 'teal',
            'shipped' => 'green',
            'under_review' => 'red'
        ];
        
        return $colors[$this->order_status] ?? 'gray';
    }

    public function canMoveToProduction(): bool
    {
        return $this->order_status === 'payment_approved';
    }

    public function canShip(): bool
    {
        return $this->order_status === 'ready_for_shipping' && 
               $this->isFullyPaid() && 
               $this->hasPhotoApproval();
    }

    public function hasPhotoApproval(): bool
    {
        return !empty($this->photo_approved_at);
    }

    public function canSendPhoto(): bool
    {
        return $this->order_status === 'in_production' && 
               !empty($this->product_photo_data);
    }

    public function canApprovePayment(): bool
    {
        return $this->status === 'pendente' && 
               $this->hasInitialPaymentProof();
    }

    public function canStartProduction(): bool
    {
        return $this->order_status === 'payment_approved' && 
               !empty($this->finance_admin_id) &&
               $this->hasCompleteDeliveryAddress();
    }

    public function hasCompleteDeliveryAddress(): bool
    {
        return !empty($this->delivery_address) && 
               !empty($this->delivery_city) && 
               !empty($this->delivery_state) && 
               !empty($this->delivery_zipcode);
    }

    public function canGenerateShipping(): bool
    {
        return $this->order_status === 'ready_for_shipping' && 
               $this->isFullyPaid() && 
               $this->hasPhotoApproval() &&
               $this->hasCompleteDeliveryAddress();
    }

    public function getWorkflowViolations(): array
    {
        $violations = [];

        // Check if trying to ship without photo approval
        if ($this->order_status === 'ready_for_shipping' && !$this->hasPhotoApproval()) {
            $violations[] = 'Não é possível enviar sem aprovação da foto pelo cliente';
        }

        // Check if trying to ship without full payment
        if ($this->order_status === 'ready_for_shipping' && !$this->isFullyPaid()) {
            $violations[] = 'Não é possível enviar sem pagamento completo';
        }

        // Check if trying to start production without finance approval
        if ($this->order_status === 'in_production' && empty($this->finance_admin_id)) {
            $violations[] = 'Produção iniciada sem aprovação financeira';
        }

        // Check if trying to start production without complete address
        if ($this->order_status === 'in_production' && !$this->hasCompleteDeliveryAddress()) {
            $violations[] = 'Produção iniciada sem endereço completo';
        }

        return $violations;
    }

    public function getPersonalizedPageUrl(): string
    {
        return route('sales.client-page', ['token' => $this->unique_token]);
    }

    public function hasInitialPaymentProof(): bool
    {
        return !empty($this->initial_payment_proof_data) || !empty($this->initial_payment_proof);
    }

    public function hasFinalPaymentProof(): bool
    {
        return !empty($this->final_payment_proof_data) || !empty($this->final_payment_proof);
    }

    public function getInitialPaymentProofUrl(): ?string
    {
        if ($this->initial_payment_proof_data) {
            return $this->initial_payment_proof_data;
        }
        
        if ($this->initial_payment_proof) {
            return asset('storage/' . $this->initial_payment_proof);
        }
        
        return null;
    }

    public function getFinalPaymentProofUrl(): ?string
    {
        if ($this->final_payment_proof_data) {
            return $this->final_payment_proof_data;
        }
        
        if ($this->final_payment_proof) {
            return asset('storage/' . $this->final_payment_proof);
        }
        
        return null;
    }

    public function getProductPhotoUrl(): ?string
    {
        if ($this->product_photo_data) {
            return $this->product_photo_data;
        }
        
        if ($this->product_photo) {
            return asset('storage/' . $this->product_photo);
        }
        
        return null;
    }

    public function needsFinalPayment(): bool
    {
        return $this->getRemainingAmount() > 0 && in_array($this->order_status, ['photo_approved', 'pending_final_payment']);
    }

    public function isStalled(): bool
    {
        // Order is stalled if no update in 48 hours
        return $this->updated_at->diffInHours(now()) > 48;
    }

    public function isUnderReview(): bool
    {
        return $this->status === 'em_revisao' && !empty($this->review_started_at) && empty($this->review_resolved_at);
    }

    public function putUnderReview(string $reason, int $reviewedBy): void
    {
        $this->update([
            'status' => 'em_revisao',
            'review_started_at' => now(),
            'reviewed_by' => $reviewedBy,
            'review_reason' => $reason
        ]);
    }

    public function resolveReview(): void
    {
        $this->update([
            'status' => 'pendente', // Back to pending for re-review
            'review_resolved_at' => now()
        ]);
    }
}
