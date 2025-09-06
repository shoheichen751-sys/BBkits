<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductCustomizationOption extends Model
{
    protected $fillable = [
        'product_id',
        'category_id',
        'is_required',
    ];
    
    protected $casts = [
        'is_required' => 'boolean',
    ];
    
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
    
    public function category(): BelongsTo
    {
        return $this->belongsTo(CustomizationOptionCategory::class, 'category_id');
    }
}