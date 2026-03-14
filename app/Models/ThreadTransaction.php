<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ThreadTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'thread_id',
        'type',
        'spool_quantity',
        'meters_quantity',
        'reference',
        'notes',
        'user_id',
    ];

    protected $casts = [
        'spool_quantity' => 'integer',
        'meters_quantity' => 'decimal:2',
    ];

    // Relationships
    public function thread()
    {
        return $this->belongsTo(Thread::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Scopes
    public function scopeConsumption($query)
    {
        return $query->where('type', 'consumption');
    }

    public function scopePurchase($query)
    {
        return $query->where('type', 'purchase');
    }

    public function scopeInDateRange($query, $from, $to)
    {
        return $query->whereBetween('created_at', [$from, $to]);
    }

    // Accessors
    public function getTypeDisplayAttribute(): string
    {
        return match($this->type) {
            'purchase' => 'Compra',
            'consumption' => 'Consumo',
            'adjustment' => 'Ajuste',
            'return' => 'Devolução',
            default => $this->type,
        };
    }

    public function getIsPositiveAttribute(): bool
    {
        return in_array($this->type, ['purchase', 'return']) || $this->meters_quantity > 0;
    }
}
