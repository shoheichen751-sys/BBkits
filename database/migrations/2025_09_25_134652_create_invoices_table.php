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
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->string('tiny_erp_id')->nullable()->index();
            $table->string('invoice_number');
            $table->string('series')->default('1');
            $table->date('issue_date');
            $table->decimal('total_amount', 10, 2);
            $table->enum('status', ['pending', 'authorized', 'sent', 'rejected', 'cancelled'])->default('pending');
            $table->string('xml_path')->nullable();
            $table->string('pdf_path')->nullable();
            $table->string('access_key')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->json('tiny_erp_data')->nullable();
            $table->timestamps();

            $table->unique(['invoice_number', 'series']);
            $table->index(['status', 'issue_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
