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
        Schema::create('product_bom_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_bom_id')->constrained('product_boms')->onDelete('cascade');

            // Size variant (P, M, G, GG, RN, etc.)
            $table->string('size', 20)->nullable();

            // Color variant (Rosa, Azul, Verde, etc.)
            $table->string('color', 50)->nullable();

            // Override quantity for this variant (null = use base quantity)
            $table->decimal('quantity_override', 10, 3)->nullable();

            // Override material for this variant (e.g., Tecido Azul instead of Tecido Rosa)
            $table->foreignId('material_id_override')->nullable()->constrained('materials')->onDelete('set null');

            $table->timestamps();

            // Prevent duplicate size/color combinations for same BOM entry
            $table->unique(['product_bom_id', 'size', 'color']);

            // Index for faster lookups
            $table->index('product_bom_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_bom_variants');
    }
};
