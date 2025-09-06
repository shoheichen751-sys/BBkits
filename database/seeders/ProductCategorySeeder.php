<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ProductCategory;
use Illuminate\Support\Str;

class ProductCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Bolsas', 'description' => 'Bolsas diversas', 'sort_order' => 1],
            ['name' => 'Mochilas', 'description' => 'Mochilas infantis e adultas', 'sort_order' => 2],
            ['name' => 'Frasqueiras', 'description' => 'Frasqueiras e nécessaires', 'sort_order' => 3],
            ['name' => 'Malas', 'description' => 'Malas de viagem', 'sort_order' => 4],
            ['name' => 'Acessórios', 'description' => 'Acessórios diversos', 'sort_order' => 5],
        ];

        foreach ($categories as $category) {
            ProductCategory::updateOrCreate(
                ['name' => $category['name']],
                [
                    'slug' => Str::slug($category['name']),
                    'description' => $category['description'],
                    'is_active' => true,
                    'sort_order' => $category['sort_order']
                ]
            );
        }
    }
}