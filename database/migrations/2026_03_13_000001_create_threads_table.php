<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('threads', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('brand')->nullable();
            $table->string('color_code');
            $table->string('hex_code')->nullable();
            $table->foreignId('embroidery_color_id')->nullable()->constrained()->nullOnDelete();
            $table->enum('type', ['standard', 'specialty'])->default('standard');
            $table->string('material_type')->default('polyester');
            $table->integer('spool_count')->default(0);
            $table->decimal('meters_per_spool', 10, 2)->default(1000);
            $table->decimal('meters_remaining', 12, 2)->default(0);
            $table->integer('minimum_spools')->default(2);
            $table->decimal('purchase_price', 10, 2)->default(0);
            $table->text('notes')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['type', 'is_active']);
            $table->index('color_code');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('threads');
    }
};
