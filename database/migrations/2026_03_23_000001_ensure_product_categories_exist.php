<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $categories = [
            ['name' => 'Bolsas', 'description' => 'Bolsas diversas', 'sort_order' => 1],
            ['name' => 'Mochilas', 'description' => 'Mochilas infantis e adultas', 'sort_order' => 2],
            ['name' => 'Frasqueiras', 'description' => 'Frasqueiras e nécessaires', 'sort_order' => 3],
            ['name' => 'Malas', 'description' => 'Malas de viagem', 'sort_order' => 4],
            ['name' => 'Acessórios', 'description' => 'Acessórios diversos', 'sort_order' => 5],
            ['name' => 'Kits', 'description' => 'Kits para bebê e maternidade', 'sort_order' => 6],
        ];

        foreach ($categories as $category) {
            $exists = DB::table('product_categories')
                ->where('name', $category['name'])
                ->exists();

            if (!$exists) {
                DB::table('product_categories')->insert([
                    'name' => $category['name'],
                    'slug' => Str::slug($category['name']),
                    'description' => $category['description'],
                    'is_active' => true,
                    'sort_order' => $category['sort_order'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            } else {
                // Ensure existing categories are active
                DB::table('product_categories')
                    ->where('name', $category['name'])
                    ->update(['is_active' => true]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Don't delete categories on rollback as they may have products
    }
};
