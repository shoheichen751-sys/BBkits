<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Set default values for existing sales to maintain compatibility
        // Use the first available category as default for old records
        $firstCategory = DB::table('product_categories')->first();
        
        if ($firstCategory) {
            DB::table('sales')
                ->whereNull('product_category_id')
                ->update([
                    'product_category_id' => $firstCategory->id,
                    'product_size' => 'P', // Default size
                    'product_price' => DB::raw('total_amount - COALESCE(shipping_amount, 0)') // Infer product price
                ]);
        }
    }

    public function down(): void
    {
        // Set the added fields back to null
        DB::table('sales')->update([
            'product_category_id' => null,
            'product_size' => null,
            'product_price' => null
        ]);
    }
};