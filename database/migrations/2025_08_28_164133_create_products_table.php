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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Nome do produto
            $table->text('description')->nullable(); // Descrição
            $table->decimal('price', 10, 2); // Preço base
            $table->string('category')->nullable(); // Categoria (camisa, boné, etc.)
            $table->string('image_url')->nullable(); // URL da imagem
            $table->boolean('allows_embroidery')->default(true); // Permite bordado
            $table->json('available_sizes')->nullable(); // Tamanhos disponíveis
            $table->json('available_colors')->nullable(); // Cores do produto disponíveis
            $table->boolean('is_active')->default(true); // Ativo/Inativo
            $table->integer('stock_quantity')->default(0); // Quantidade em estoque
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
