<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SaleProduct extends Model
{
    use HasFactory;

    protected $fillable = [
        'sale_id',
        'product_id',
        'quantity',
        'size',
        'product_color',
        'unit_price',
        'has_embroidery',
        'embroidery_text',
        'embroidery_font_id',
        'embroidery_color_id',
        'embroidery_position',
        'embroidery_cost',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'unit_price' => 'decimal:2',
        'has_embroidery' => 'boolean',
        'embroidery_cost' => 'decimal:2',
    ];

    public function sale()
    {
        return $this->belongsTo(Sale::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function embroideryFont()
    {
        return $this->belongsTo(EmbroideryFont::class);
    }

    public function embroideryColor()
    {
        return $this->belongsTo(EmbroideryColor::class);
    }

    public function getTotalPriceAttribute()
    {
        return ($this->unit_price + $this->embroidery_cost) * $this->quantity;
    }

    public function getSubtotalAttribute()
    {
        return $this->unit_price * $this->quantity;
    }

    public function getTotalEmbroideryAttribute()
    {
        return $this->embroidery_cost * $this->quantity;
    }

    public function hasEmbroideryOptions()
    {
        return $this->has_embroidery && 
               ($this->embroidery_font_id || $this->embroidery_color_id || $this->embroidery_position);
    }
}