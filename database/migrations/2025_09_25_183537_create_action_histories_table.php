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
        Schema::create('action_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('action_type'); // create, update, delete, approve, reject, etc.
            $table->string('resource_type'); // Sale, User, Product, etc.
            $table->unsignedBigInteger('resource_id')->nullable();
            $table->string('description');
            $table->json('changes')->nullable(); // Store what was changed
            $table->json('metadata')->nullable(); // Additional context data
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->timestamp('performed_at');
            $table->timestamps();

            // Indexes for better performance
            $table->index(['resource_type', 'resource_id']);
            $table->index(['user_id', 'performed_at']);
            $table->index(['action_type', 'performed_at']);
            $table->index('performed_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('action_histories');
    }
};
