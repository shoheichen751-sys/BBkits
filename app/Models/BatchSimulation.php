<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BatchSimulation extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'user_id',
        'products_config',
        'results',
        'status',
    ];

    protected $casts = [
        'products_config' => 'array',
        'results' => 'array',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Scopes
    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    public function scopeCalculated($query)
    {
        return $query->where('status', 'calculated');
    }

    public function scopeArchived($query)
    {
        return $query->where('status', 'archived');
    }

    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    // Accessors
    public function getStatusDisplayAttribute(): string
    {
        return match($this->status) {
            'draft' => 'Rascunho',
            'calculated' => 'Calculado',
            'archived' => 'Arquivado',
            default => $this->status,
        };
    }

    public function getTotalProductsAttribute(): int
    {
        return collect($this->products_config)->sum('quantity');
    }

    public function getTotalCostAttribute(): float
    {
        return $this->results['total_cost'] ?? 0;
    }

    public function getHasShortagesAttribute(): bool
    {
        return !empty($this->results['shortages']);
    }

    public function getShortagesCountAttribute(): int
    {
        return count($this->results['shortages'] ?? []);
    }

    // Business Methods
    public function calculate(): self
    {
        $service = app(\App\Services\BatchSimulationService::class);
        $results = $service->simulate($this->products_config);

        $this->update([
            'results' => $results,
            'status' => 'calculated',
        ]);

        return $this;
    }

    public function archive(): self
    {
        $this->update(['status' => 'archived']);
        return $this;
    }

    public function duplicate(): self
    {
        return static::create([
            'name' => $this->name . ' (cópia)',
            'description' => $this->description,
            'user_id' => auth()->id() ?? $this->user_id,
            'products_config' => $this->products_config,
            'status' => 'draft',
        ]);
    }

    public function getMaterialRequirements(): array
    {
        return $this->results['materials'] ?? [];
    }

    public function getShortages(): array
    {
        return $this->results['shortages'] ?? [];
    }

    public function getThreadRequirements(): array
    {
        return $this->results['threads'] ?? [];
    }
}
