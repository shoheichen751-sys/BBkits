<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('embroidery_designs', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('category'); // Animals, Characters, Patterns, etc.
            $table->string('image_url')->nullable(); // Preview image
            $table->string('design_file_url')->nullable(); // Actual design file
            $table->decimal('additional_cost', 8, 2)->default(0);
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->json('compatible_positions')->nullable(); // Which positions work with this design
            $table->json('compatible_colors')->nullable(); // Which colors work with this design
            $table->timestamps();
            
            $table->index(['category', 'is_active']);
            $table->index('sort_order');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('embroidery_designs');
    }
};