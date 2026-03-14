<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('embroidery_colors', function (Blueprint $table) {
            $table->foreignId('primary_thread_id')->nullable()->after('thread_code')
                ->constrained('threads')->nullOnDelete();
            $table->decimal('estimated_meters_per_use', 8, 2)->default(50)->after('primary_thread_id');
        });
    }

    public function down(): void
    {
        Schema::table('embroidery_colors', function (Blueprint $table) {
            $table->dropForeign(['primary_thread_id']);
            $table->dropColumn(['primary_thread_id', 'estimated_meters_per_use']);
        });
    }
};
