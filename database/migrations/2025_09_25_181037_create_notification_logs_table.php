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
        Schema::create('notification_logs', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // whatsapp, email, sms, etc.
            $table->string('event_type'); // order_confirmation, payment_approved, etc.
            $table->string('recipient'); // phone number, email address, etc.
            $table->foreignId('sale_id')->nullable()->constrained()->onDelete('cascade');
            $table->enum('status', ['sent', 'failed', 'retry'])->default('sent');
            $table->json('response_data')->nullable();
            $table->text('error_message')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->timestamps();

            $table->index(['type', 'event_type']);
            $table->index(['sale_id', 'status']);
            $table->index('sent_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notification_logs');
    }
};
