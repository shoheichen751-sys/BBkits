<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmbroideryColor extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'hex_code',
        'thread_code',
        'primary_thread_id',
        'estimated_meters_per_use',
        'description',
        'additional_cost',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'additional_cost' => 'decimal:2',
        'estimated_meters_per_use' => 'decimal:2',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function saleProducts()
    {
        return $this->hasMany(SaleProduct::class);
    }

    public function primaryThread()
    {
        return $this->belongsTo(Thread::class, 'primary_thread_id');
    }

    /**
     * Consume thread for this embroidery color usage.
     */
    public function consumeThread(?string $reference = null): void
    {
        if ($this->primaryThread && $this->estimated_meters_per_use > 0) {
            $this->primaryThread->consumeMeters(
                $this->estimated_meters_per_use,
                $reference,
                "Consumo para cor de bordado: {$this->name}"
            );
        }
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('name');
    }
}