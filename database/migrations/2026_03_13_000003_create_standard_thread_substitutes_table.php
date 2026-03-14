<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('standard_thread_substitutes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('specialty_thread_id')->constrained('threads')->onDelete('cascade');
            $table->foreignId('standard_thread_id')->constrained('threads')->onDelete('cascade');
            $table->integer('priority')->default(1);
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['specialty_thread_id', 'standard_thread_id'], 'unique_substitute_pair');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('standard_thread_substitutes');
    }
};
