<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_sizes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->string('size_code'); // P, M, G, GG
            $table->string('size_name'); // Pequeno, Médio, Grande, Extra Grande
            $table->decimal('price', 10, 2);
            $table->integer('stock_quantity')->default(0);
            $table->boolean('is_available')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            
            $table->unique(['product_id', 'size_code']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_sizes');
    }
};