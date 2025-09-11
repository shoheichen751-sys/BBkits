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
        Schema::table('sales', function (Blueprint $table) {
            // Product specification fields for manual entry by sales staff
            $table->text('mesa_livre_details')->nullable()->comment('Mesa livre (detalhes no bolso frontal)');
            $table->string('chaveiros')->nullable()->comment('Chaveiros details');
            $table->string('kit_main_color')->nullable()->comment('Cor principal do kit');
            $table->string('alcas')->nullable()->comment('Alças details');
            $table->string('faixa')->nullable()->comment('Faixa details');
            $table->string('friso')->nullable()->comment('Friso (contorno da bolsa)');
            $table->string('vies')->nullable()->comment('Viés (contorno dos bolsos laterais)');
            $table->string('ziper')->nullable()->comment('Zíper details');
            
            // Production timeline fields
            $table->date('production_estimate')->nullable()->comment('Previsão de confecção');
            $table->date('delivery_estimate')->nullable()->comment('Previsão de entrega');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            $table->dropColumn([
                'mesa_livre_details',
                'chaveiros',
                'kit_main_color',
                'alcas',
                'faixa',
                'friso',
                'vies',
                'ziper',
                'production_estimate',
                'delivery_estimate'
            ]);
        });
    }
};
