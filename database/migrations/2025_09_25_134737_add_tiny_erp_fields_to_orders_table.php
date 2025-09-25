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
        // Update invoice foreign key relationship in sales table
        Schema::table('sales', function (Blueprint $table) {
            // Check if invoice_id column doesn't exist before adding it
            if (!Schema::hasColumn('sales', 'invoice_id')) {
                $table->foreignId('invoice_id')->nullable()->constrained()->after('tiny_erp_sync_at');
            }
        });

        // Update invoices table to reference sales instead of orders
        Schema::table('invoices', function (Blueprint $table) {
            $table->dropForeign(['order_id']);
            $table->renameColumn('order_id', 'sale_id');
            $table->foreign('sale_id')->references('id')->on('sales')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->dropForeign(['sale_id']);
            $table->renameColumn('sale_id', 'order_id');
            $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');
        });

        Schema::table('sales', function (Blueprint $table) {
            if (Schema::hasColumn('sales', 'invoice_id')) {
                $table->dropForeign(['invoice_id']);
                $table->dropColumn('invoice_id');
            }
        });
    }
};
