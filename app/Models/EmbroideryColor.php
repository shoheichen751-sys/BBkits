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
        'description',
        'additional_cost',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'additional_cost' => 'decimal:2',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function saleProducts()
    {
        return $this->hasMany(SaleProduct::class);
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