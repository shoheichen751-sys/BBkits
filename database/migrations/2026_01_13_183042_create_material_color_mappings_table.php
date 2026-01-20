<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * This table maps product colors to specific materials.
     * Example: When product color is "Rosa" and BOM requires "Gorgorão",
     * the system should use "Gorgorão Rosa 25mm" instead.
     */
    public function up(): void
    {
        Schema::create('material_color_mappings', function (Blueprint $table) {
            $table->id();

            // The product color name (e.g., "Rosa", "Azul", "Verde")
            $table->string('product_color', 50);

            // The base/generic material in BOM (e.g., "Gorgorão" category)
            $table->foreignId('base_material_id')->constrained('materials')->onDelete('cascade');

            // The specific colored material to use (e.g., "Gorgorão Rosa 25mm")
            $table->foreignId('target_material_id')->constrained('materials')->onDelete('cascade');

            // Optional notes
            $table->text('notes')->nullable();

            // Whether this mapping is active
            $table->boolean('is_active')->default(true);

            $table->timestamps();

            // Prevent duplicate mappings for same color + base material
            $table->unique(['product_color', 'base_material_id'], 'unique_color_material_mapping');

            // Index for faster lookups
            $table->index('product_color');
            $table->index('base_material_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('material_color_mappings');
    }
};
