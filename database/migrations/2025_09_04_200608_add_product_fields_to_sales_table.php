<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            $table->foreignId('product_category_id')->nullable()->after('client_cpf')->constrained('product_categories');
            $table->string('product_size', 10)->nullable()->after('product_category_id');
            $table->decimal('product_price', 10, 2)->nullable()->after('product_size');
        });
    }

    public function down(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            $table->dropForeign(['product_category_id']);
            $table->dropColumn(['product_category_id', 'product_size', 'product_price']);
        });
    }
};