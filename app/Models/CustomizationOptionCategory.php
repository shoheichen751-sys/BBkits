<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CustomizationOptionCategory extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'display_type',
        'is_required',
        'is_active',
        'sort_order',
    ];
    
    protected $casts = [
        'is_required' => 'boolean',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];
    
    public function values(): HasMany
    {
        return $this->hasMany(CustomizationOptionValue::class, 'category_id');
    }
    
    public function activeValues(): HasMany
    {
        return $this->values()->where('is_active', true)->orderBy('sort_order')->orderBy('name');
    }
    
    public function productCustomizations(): HasMany
    {
        return $this->hasMany(ProductCustomizationOption::class, 'category_id');
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