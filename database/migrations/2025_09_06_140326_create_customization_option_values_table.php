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
        Schema::create('customization_option_values', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('customization_option_categories')->onDelete('cascade');
            $table->string('name'); // e.g., "Red", "Blue", "Black"
            $table->string('value'); // e.g., "#FF0000", "red", "black"
            $table->string('hex_code')->nullable(); // For color values
            $table->text('description')->nullable();
            $table->decimal('additional_cost', 8, 2)->default(0); // Extra cost for this option
            $table->string('image_url')->nullable(); // Optional image preview
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            
            $table->index(['category_id', 'is_active', 'sort_order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customization_option_values');
    }
};
