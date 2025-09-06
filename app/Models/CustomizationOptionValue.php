<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CustomizationOptionValue extends Model
{
    protected $fillable = [
        'category_id',
        'name',
        'value',
        'hex_code',
        'description',
        'additional_cost',
        'image_url',
        'is_active',
        'sort_order',
    ];
    
    protected $casts = [
        'additional_cost' => 'decimal:2',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];
    
    public function category(): BelongsTo
    {
        return $this->belongsTo(CustomizationOptionCategory::class, 'category_id');
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