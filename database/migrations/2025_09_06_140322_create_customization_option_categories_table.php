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
        Schema::create('customization_option_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., "Strap Color", "Outline Color"
            $table->string('slug')->unique(); // e.g., "strap-color", "outline-color"
            $table->text('description')->nullable();
            $table->string('display_type')->default('select'); // select, color, radio, checkbox
            $table->boolean('is_required')->default(false);
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            
            $table->index(['is_active', 'sort_order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customization_option_categories');
    }
};
