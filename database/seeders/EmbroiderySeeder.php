<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\EmbroideryFont;
use App\Models\EmbroideryColor;
use App\Models\EmbroideryPosition;
use App\Models\EmbroideryDesign;

class EmbroiderySeeder extends Seeder
{
    public function run(): void
    {
        // Create default fonts (to fix backward compatibility)
        $fonts = [
            ['name' => 'cursive', 'display_name' => 'Cursiva', 'additional_cost' => 0],
            ['name' => 'block', 'display_name' => 'Bloco', 'additional_cost' => 5],
            ['name' => 'script', 'display_name' => 'Script', 'additional_cost' => 8],
            ['name' => 'modern', 'display_name' => 'Moderna', 'additional_cost' => 10],
        ];

        foreach ($fonts as $font) {
            EmbroideryFont::create($font);
        }

        // Create default colors
        $colors = [
            ['name' => 'Rosa', 'hex_code' => '#FF69B4', 'thread_code' => 'PK001', 'additional_cost' => 0],
            ['name' => 'Azul', 'hex_code' => '#4169E1', 'thread_code' => 'BL001', 'additional_cost' => 0],
            ['name' => 'Verde', 'hex_code' => '#32CD32', 'thread_code' => 'GR001', 'additional_cost' => 0],
            ['name' => 'Vermelho', 'hex_code' => '#DC143C', 'thread_code' => 'RD001', 'additional_cost' => 0],
            ['name' => 'Amarelo', 'hex_code' => '#FFD700', 'thread_code' => 'YL001', 'additional_cost' => 0],
            ['name' => 'Roxo', 'hex_code' => '#8A2BE2', 'thread_code' => 'PR001', 'additional_cost' => 0],
            ['name' => 'Preto', 'hex_code' => '#000000', 'thread_code' => 'BK001', 'additional_cost' => 0],
            ['name' => 'Branco', 'hex_code' => '#FFFFFF', 'thread_code' => 'WH001', 'additional_cost' => 0],
        ];

        foreach ($colors as $color) {
            EmbroideryColor::create($color);
        }

        // Create default positions
        $positions = [
            ['name' => 'center', 'display_name' => 'Centro', 'additional_cost' => 0],
            ['name' => 'left', 'display_name' => 'Esquerda', 'additional_cost' => 0],
            ['name' => 'right', 'display_name' => 'Direita', 'additional_cost' => 0],
            ['name' => 'top', 'display_name' => 'Superior', 'additional_cost' => 5],
            ['name' => 'bottom', 'display_name' => 'Inferior', 'additional_cost' => 5],
        ];

        foreach ($positions as $position) {
            EmbroideryPosition::create($position);
        }

        // Create sample embroidery designs
        $designs = [
            [
                'name' => 'Elefante Safari',
                'slug' => 'elefante-safari',
                'description' => 'Lindo elefante com tema safari',
                'category' => 'Animais',
                'image_url' => 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=200&h=150&fit=crop',
                'additional_cost' => 15.00,
                'compatible_positions' => ['center', 'left', 'right'],
                'compatible_colors' => ['Cinza', 'Azul', 'Verde'],
            ],
            [
                'name' => 'Princesa Encantada',
                'slug' => 'princesa-encantada',
                'description' => 'Princesa com coroa e vestido elegante',
                'category' => 'Personagens',
                'image_url' => 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=200&h=150&fit=crop',
                'additional_cost' => 20.00,
                'compatible_positions' => ['center', 'top'],
                'compatible_colors' => ['Rosa', 'Roxo', 'Amarelo'],
            ],
            [
                'name' => 'Leão Rei',
                'slug' => 'leao-rei',
                'description' => 'Majestoso leão com juba dourada',
                'category' => 'Animais',
                'image_url' => 'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=200&h=150&fit=crop',
                'additional_cost' => 18.00,
                'compatible_positions' => ['center', 'left', 'right'],
                'compatible_colors' => ['Amarelo', 'Marrom', 'Laranja'],
            ],
            [
                'name' => 'Borboleta Colorida',
                'slug' => 'borboleta-colorida',
                'description' => 'Borboleta com asas multicoloridas',
                'category' => 'Natureza',
                'image_url' => 'https://images.unsplash.com/photo-1444927714506-8492d94b5ba0?w=200&h=150&fit=crop',
                'additional_cost' => 12.00,
                'compatible_positions' => ['center', 'top', 'bottom'],
                'compatible_colors' => ['Rosa', 'Azul', 'Verde', 'Amarelo'],
            ],
            [
                'name' => 'Brasão Real',
                'slug' => 'brasao-real',
                'description' => 'Brasão clássico com coroa e escudo',
                'category' => 'Brasões',
                'image_url' => 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=150&fit=crop',
                'additional_cost' => 25.00,
                'compatible_positions' => ['center'],
                'compatible_colors' => ['Dourado', 'Vermelho', 'Azul'],
            ],
            [
                'name' => 'Iniciais Monograma',
                'slug' => 'iniciais-monograma',
                'description' => 'Monograma elegante personalizado',
                'category' => 'Iniciais',
                'image_url' => 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=200&h=150&fit=crop',
                'additional_cost' => 10.00,
                'compatible_positions' => ['center', 'left', 'right'],
                'compatible_colors' => ['Preto', 'Azul', 'Vermelho', 'Dourado'],
            ],
        ];

        foreach ($designs as $design) {
            EmbroideryDesign::create($design);
        }
    }
}