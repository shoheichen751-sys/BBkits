<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmbroideryComplexityLevel extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'stitch_count_min',
        'stitch_count_max',
        'base_cost',
        'thread_cost_multiplier',
        'estimated_minutes',
        'is_active',
    ];

    protected $casts = [
        'stitch_count_min' => 'integer',
        'stitch_count_max' => 'integer',
        'base_cost' => 'decimal:2',
        'thread_cost_multiplier' => 'decimal:3',
        'estimated_minutes' => 'integer',
        'is_active' => 'boolean',
    ];

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('stitch_count_min', 'asc');
    }

    // Business Methods
    public function calculateCost(float $threadCostPerMeter = 0, float $metersUsed = 0): float
    {
        $threadCost = $threadCostPerMeter * $metersUsed * $this->thread_cost_multiplier;
        return $this->base_cost + $threadCost;
    }

    // Static Methods
    public static function getLevel(int $stitchCount): ?self
    {
        return static::active()
            ->where('stitch_count_min', '<=', $stitchCount)
            ->where(function ($query) use ($stitchCount) {
                $query->where('stitch_count_max', '>=', $stitchCount)
                      ->orWhereNull('stitch_count_max');
            })
            ->first();
    }

    public static function getAllLevels(): \Illuminate\Database\Eloquent\Collection
    {
        return static::active()->ordered()->get();
    }

    public function getDisplayNameAttribute(): string
    {
        $range = $this->stitch_count_max
            ? "{$this->stitch_count_min} - {$this->stitch_count_max}"
            : "{$this->stitch_count_min}+";

        return "{$this->name} ({$range} pontos)";
    }
}
