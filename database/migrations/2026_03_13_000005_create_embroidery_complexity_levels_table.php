<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('embroidery_complexity_levels', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->integer('stitch_count_min');
            $table->integer('stitch_count_max')->nullable();
            $table->decimal('base_cost', 10, 2);
            $table->decimal('thread_cost_multiplier', 5, 3)->default(1.000);
            $table->integer('estimated_minutes');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('embroidery_complexity_levels');
    }
};
