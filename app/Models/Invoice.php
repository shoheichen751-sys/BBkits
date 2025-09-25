<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'sale_id',
        'tiny_erp_id',
        'invoice_number',
        'series',
        'issue_date',
        'total_amount',
        'status',
        'xml_path',
        'pdf_path',
        'access_key',
        'rejection_reason',
        'tiny_erp_data',
    ];

    protected $casts = [
        'issue_date' => 'date',
        'total_amount' => 'decimal:2',
        'tiny_erp_data' => 'array',
    ];

    /**
     * Get the sale that owns this invoice
     */
    public function sale(): BelongsTo
    {
        return $this->belongsTo(Sale::class);
    }

    /**
     * Get the formatted invoice number with series
     */
    public function getFullInvoiceNumberAttribute(): string
    {
        return "{$this->series}-{$this->invoice_number}";
    }

    /**
     * Check if invoice is authorized
     */
    public function isAuthorized(): bool
    {
        return $this->status === 'authorized';
    }

    /**
     * Check if invoice is pending
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Check if invoice is rejected
     */
    public function isRejected(): bool
    {
        return $this->status === 'rejected';
    }

    /**
     * Check if invoice has XML file
     */
    public function hasXml(): bool
    {
        return !empty($this->xml_path) && file_exists(storage_path('app/' . $this->xml_path));
    }

    /**
     * Check if invoice has PDF file
     */
    public function hasPdf(): bool
    {
        return !empty($this->pdf_path) && file_exists(storage_path('app/' . $this->pdf_path));
    }

    /**
     * Get the XML file URL
     */
    public function getXmlUrlAttribute(): ?string
    {
        if ($this->hasXml()) {
            return route('admin.invoices.download-xml', $this);
        }
        return null;
    }

    /**
     * Get the PDF file URL
     */
    public function getPdfUrlAttribute(): ?string
    {
        if ($this->hasPdf()) {
            return route('admin.invoices.download-pdf', $this);
        }
        return null;
    }
}
