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
        Schema::create('embroidery_colors', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Nome da cor (Azul Marinho, Vermelho, etc.)
            $table->string('hex_code'); // Código hexadecimal da cor (#FF0000)
            $table->string('thread_code')->nullable(); // Código do fio (para referência)
            $table->text('description')->nullable(); // Descrição da cor
            $table->decimal('additional_cost', 8, 2)->default(0); // Custo adicional
            $table->boolean('is_active')->default(true); // Ativa/Inativa
            $table->integer('sort_order')->default(0); // Ordem de exibição
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('embroidery_colors');
    }
};
