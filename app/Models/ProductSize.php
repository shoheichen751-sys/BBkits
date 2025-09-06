<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductSize extends Model
{
    protected $fillable = [
        'product_id',
        'size_code',
        'size_name',
        'price',
        'stock_quantity',
        'is_available',
        'sort_order'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'stock_quantity' => 'integer',
        'is_available' => 'boolean',
        'sort_order' => 'integer'
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}