<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->foreignId('pricing_formula_id')->nullable()->after('price')
                ->constrained('pricing_formulas')->nullOnDelete();
            $table->decimal('calculated_price', 10, 2)->nullable()->after('pricing_formula_id');
            $table->decimal('overhead_cost', 10, 2)->default(0)->after('calculated_price');
            $table->timestamp('price_calculated_at')->nullable()->after('overhead_cost');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign(['pricing_formula_id']);
            $table->dropColumn(['pricing_formula_id', 'calculated_price', 'overhead_cost', 'price_calculated_at']);
        });
    }
};
