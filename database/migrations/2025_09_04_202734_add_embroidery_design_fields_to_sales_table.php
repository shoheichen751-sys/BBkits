<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            $table->string('embroidery_type')->default('text')->after('embroidery_font'); // 'text', 'design', 'both'
            $table->foreignId('embroidery_design_id')->nullable()->after('embroidery_type')->constrained('embroidery_designs');
            $table->text('embroidery_text')->nullable()->after('embroidery_design_id'); // Custom text for text embroidery
        });
    }

    public function down(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            $table->dropForeign(['embroidery_design_id']);
            $table->dropColumn(['embroidery_type', 'embroidery_design_id', 'embroidery_text']);
        });
    }
};