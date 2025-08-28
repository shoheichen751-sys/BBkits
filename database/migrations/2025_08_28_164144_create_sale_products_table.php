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
        Schema::create('sale_products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sale_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->integer('quantity')->default(1);
            $table->string('size')->nullable();
            $table->string('product_color')->nullable(); // Cor do produto escolhida
            $table->decimal('unit_price', 10, 2); // Preço unitário no momento da venda
            
            // Campos de bordado
            $table->boolean('has_embroidery')->default(false);
            $table->text('embroidery_text')->nullable();
            $table->foreignId('embroidery_font_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('embroidery_color_id')->nullable()->constrained()->onDelete('set null');
            $table->string('embroidery_position')->nullable(); // Posição do bordado
            $table->decimal('embroidery_cost', 8, 2)->default(0); // Custo adicional do bordado
            
            $table->timestamps();
            
            // Índices para melhor performance
            $table->index(['sale_id', 'product_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sale_products');
    }
};
