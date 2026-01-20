<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Stock reservations are created when an order is approved.
     * They "soft-lock" materials until production starts (hard deduction).
     */
    public function up(): void
    {
        Schema::create('stock_reservations', function (Blueprint $table) {
            $table->id();

            // Link to the sale/order
            $table->foreignId('sale_id')->constrained('sales')->onDelete('cascade');

            // Link to the sale product (specific item in the order)
            $table->foreignId('sale_product_id')->nullable()->constrained('sale_products')->onDelete('cascade');

            // The material being reserved
            $table->foreignId('material_id')->constrained('materials')->onDelete('cascade');

            // Quantity reserved
            $table->decimal('quantity_reserved', 10, 3);

            // Unit of measurement
            $table->string('unit', 50)->default('unidade');

            // Status: reserved, deducted, released
            $table->enum('status', ['reserved', 'deducted', 'released'])->default('reserved');

            // When the reservation was made
            $table->timestamp('reserved_at')->useCurrent();

            // When materials were actually deducted (production start)
            $table->timestamp('deducted_at')->nullable();

            // When reservation was released (order cancelled)
            $table->timestamp('released_at')->nullable();

            // User who created/processed the reservation
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('deducted_by')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('released_by')->nullable()->constrained('users')->onDelete('set null');

            // Notes
            $table->text('notes')->nullable();

            $table->timestamps();

            // Indexes for faster lookups
            $table->index('sale_id');
            $table->index('material_id');
            $table->index('status');
            $table->index(['material_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_reservations');
    }
};
