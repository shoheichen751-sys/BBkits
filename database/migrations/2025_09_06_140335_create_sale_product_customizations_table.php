<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('sale_product_customizations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sale_product_id')->constrained('sale_products')->onDelete('cascade');
            $table->foreignId('category_id')->constrained('customization_option_categories')->onDelete('cascade');
            $table->foreignId('value_id')->constrained('customization_option_values')->onDelete('cascade');
            $table->decimal('additional_cost', 8, 2)->default(0); // Cost at time of sale
            $table->timestamps();
            
            $table->unique(['sale_product_id', 'category_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sale_product_customizations');
    }
};
