<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Thread extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'brand',
        'color_code',
        'hex_code',
        'embroidery_color_id',
        'type',
        'material_type',
        'spool_count',
        'meters_per_spool',
        'meters_remaining',
        'minimum_spools',
        'purchase_price',
        'notes',
        'is_active',
    ];

    protected $casts = [
        'spool_count' => 'integer',
        'meters_per_spool' => 'decimal:2',
        'meters_remaining' => 'decimal:2',
        'minimum_spools' => 'integer',
        'purchase_price' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    // Relationships
    public function embroideryColor()
    {
        return $this->belongsTo(EmbroideryColor::class);
    }

    public function transactions()
    {
        return $this->hasMany(ThreadTransaction::class);
    }

    public function standardSubstitutes()
    {
        return $this->hasMany(StandardThreadSubstitute::class, 'specialty_thread_id');
    }

    public function specialtyFor()
    {
        return $this->hasMany(StandardThreadSubstitute::class, 'standard_thread_id');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeStandard($query)
    {
        return $query->where('type', 'standard');
    }

    public function scopeSpecialty($query)
    {
        return $query->where('type', 'specialty');
    }

    public function scopeLowStock($query)
    {
        return $query->whereColumn('spool_count', '<=', 'minimum_spools');
    }

    // Accessors
    public function getAvailableMetersAttribute(): float
    {
        return (float) $this->meters_remaining;
    }

    public function getIsLowStockAttribute(): bool
    {
        return $this->spool_count <= $this->minimum_spools;
    }

    public function getStockStatusAttribute(): string
    {
        if ($this->spool_count <= 0) {
            return 'out_of_stock';
        } elseif ($this->spool_count <= $this->minimum_spools) {
            return 'low_stock';
        }
        return 'in_stock';
    }

    public function getFormattedPriceAttribute(): string
    {
        return 'R$ ' . number_format($this->purchase_price, 2, ',', '.');
    }

    public function getStockDisplayAttribute(): string
    {
        return $this->spool_count . ' spools (' . number_format($this->meters_remaining, 0, ',', '.') . 'm)';
    }

    public function getIsStandardAttribute(): bool
    {
        return $this->type === 'standard';
    }

    public function getIsSpecialtyAttribute(): bool
    {
        return $this->type === 'specialty';
    }

    // Business Methods
    public function consumeMeters(float $meters, ?string $reference = null, ?string $notes = null): self
    {
        $this->meters_remaining = max(0, $this->meters_remaining - $meters);

        // Calculate if we need to deduct spools
        $totalCapacity = $this->spool_count * $this->meters_per_spool;
        if ($this->meters_remaining < $totalCapacity - $this->meters_per_spool) {
            $this->spool_count = max(0, (int) ceil($this->meters_remaining / $this->meters_per_spool));
        }

        $this->save();

        $this->transactions()->create([
            'type' => 'consumption',
            'meters_quantity' => -$meters,
            'reference' => $reference,
            'notes' => $notes,
            'user_id' => auth()->id() ?? 1,
        ]);

        return $this;
    }

    public function addSpools(int $spools, ?float $unitPrice = null, ?string $reference = null, ?string $notes = null): self
    {
        $this->spool_count += $spools;
        $this->meters_remaining += $spools * $this->meters_per_spool;

        if ($unitPrice) {
            $this->purchase_price = $unitPrice;
        }

        $this->save();

        $this->transactions()->create([
            'type' => 'purchase',
            'spool_quantity' => $spools,
            'meters_quantity' => $spools * $this->meters_per_spool,
            'reference' => $reference,
            'notes' => $notes,
            'user_id' => auth()->id() ?? 1,
        ]);

        return $this;
    }

    public function adjustStock(int $spools, float $meters = 0, ?string $notes = null): self
    {
        $this->spool_count += $spools;
        $this->meters_remaining += $meters ?: ($spools * $this->meters_per_spool);
        $this->save();

        $this->transactions()->create([
            'type' => 'adjustment',
            'spool_quantity' => $spools,
            'meters_quantity' => $meters ?: ($spools * $this->meters_per_spool),
            'notes' => $notes,
            'user_id' => auth()->id() ?? 1,
        ]);

        return $this;
    }

    public function getSubstitutes(): \Illuminate\Database\Eloquent\Collection
    {
        if ($this->type !== 'specialty') {
            return collect([]);
        }

        return self::whereIn('id', $this->standardSubstitutes()->pluck('standard_thread_id'))
            ->where('is_active', true)
            ->orderBy('spool_count', 'desc')
            ->get();
    }

    public function getBestSubstitute(): ?self
    {
        return $this->getSubstitutes()->first();
    }
}
