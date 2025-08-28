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
        Schema::create('embroidery_positions', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Nome da posição (Peito Esquerdo, Costas, etc.)
            $table->string('display_name'); // Nome para exibição
            $table->text('description')->nullable(); // Descrição da posição
            $table->decimal('additional_cost', 8, 2)->default(0); // Custo adicional
            $table->boolean('is_active')->default(true); // Ativa/Inativa
            $table->integer('sort_order')->default(0); // Ordem de exibição
            $table->string('preview_image')->nullable(); // Imagem de preview
            $table->json('compatible_products')->nullable(); // Produtos compatíveis
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('embroidery_positions');
    }
};