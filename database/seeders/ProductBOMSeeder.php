<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Material;
use App\Models\ProductBOM;
use App\Models\ProductBOMVariant;
use Illuminate\Database\Seeder;

class ProductBOMSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Creates sample BOM entries for existing products.
     */
    public function run(): void
    {
        // Get existing products and materials
        $products = Product::all();
        $materials = Material::all();

        if ($products->isEmpty() || $materials->isEmpty()) {
            $this->command->warn('No products or materials found. Skipping BOM seeding.');
            return;
        }

        // Create sample BOM for first product: Bolsa Térmica Infantil
        $product1 = $products->firstWhere('name', 'Bolsa Térmica Infantil');
        if ($product1) {
            $this->createBOMForBolsaTermica($product1, $materials);
        }

        // Create sample BOM for second product: Bolsa de Fraldas Premium
        $product2 = $products->firstWhere('name', 'Bolsa de Fraldas Premium');
        if ($product2) {
            $this->createBOMForBolsaFraldas($product2, $materials);
        }

        $this->command->info('BOM seeding completed successfully.');
    }

    private function createBOMForBolsaTermica(Product $product, $materials): void
    {
        // Material 1: Laminado Sintético
        $laminado = $materials->firstWhere('name', 'Laminado Sintético Cristal 20cm');
        if ($laminado) {
            $bom1 = ProductBOM::create([
                'product_id' => $product->id,
                'material_id' => $laminado->id,
                'quantity' => 0.5,
                'unit' => 'm',
                'notes' => 'Material principal para exterior',
            ]);

            // Size variants - bigger sizes need more material
            ProductBOMVariant::create([
                'product_bom_id' => $bom1->id,
                'size' => 'P',
                'quantity_override' => 0.4,
            ]);
            ProductBOMVariant::create([
                'product_bom_id' => $bom1->id,
                'size' => 'M',
                'quantity_override' => 0.5,
            ]);
            ProductBOMVariant::create([
                'product_bom_id' => $bom1->id,
                'size' => 'G',
                'quantity_override' => 0.65,
            ]);
        }

        // Material 2: Zíper
        $ziper = $materials->firstWhere('name', 'Zíper Preto 15cm');
        if ($ziper) {
            ProductBOM::create([
                'product_id' => $product->id,
                'material_id' => $ziper->id,
                'quantity' => 1,
                'unit' => 'unit',
                'notes' => 'Zíper para fechamento',
            ]);
        }

        // Material 3: Gorgorão (alça)
        $gorgorao = $materials->firstWhere('name', 'Gorgorão Rosa 25mm');
        if ($gorgorao) {
            $bom3 = ProductBOM::create([
                'product_id' => $product->id,
                'material_id' => $gorgorao->id,
                'quantity' => 0.8,
                'unit' => 'm',
                'notes' => 'Para alças',
            ]);

            // Size variants for straps
            ProductBOMVariant::create([
                'product_bom_id' => $bom3->id,
                'size' => 'P',
                'quantity_override' => 0.6,
            ]);
            ProductBOMVariant::create([
                'product_bom_id' => $bom3->id,
                'size' => 'G',
                'quantity_override' => 1.0,
            ]);
        }

        $this->command->info("Created BOM for: {$product->name}");
    }

    private function createBOMForBolsaFraldas(Product $product, $materials): void
    {
        // Material 1: Laminado
        $laminado = $materials->firstWhere('name', 'Laminado Sintético Cristal 20cm');
        if ($laminado) {
            $bom1 = ProductBOM::create([
                'product_id' => $product->id,
                'material_id' => $laminado->id,
                'quantity' => 0.8,
                'unit' => 'm',
                'notes' => 'Material exterior',
            ]);

            // Size variants
            ProductBOMVariant::create([
                'product_bom_id' => $bom1->id,
                'size' => 'M',
                'quantity_override' => 0.8,
            ]);
            ProductBOMVariant::create([
                'product_bom_id' => $bom1->id,
                'size' => 'G',
                'quantity_override' => 1.0,
            ]);
            ProductBOMVariant::create([
                'product_bom_id' => $bom1->id,
                'size' => 'GG',
                'quantity_override' => 1.2,
            ]);
        }

        // Material 2: Zíper
        $ziper = $materials->firstWhere('name', 'Zíper Preto 15cm');
        if ($ziper) {
            ProductBOM::create([
                'product_id' => $product->id,
                'material_id' => $ziper->id,
                'quantity' => 2,
                'unit' => 'unit',
                'notes' => 'Zíperes para bolsos',
            ]);
        }

        // Material 3: Fita Cetim
        $fita = $materials->firstWhere('name', 'Fita Cetim 12mm Branca');
        if ($fita) {
            ProductBOM::create([
                'product_id' => $product->id,
                'material_id' => $fita->id,
                'quantity' => 0.5,
                'unit' => 'm',
                'notes' => 'Detalhes decorativos',
            ]);
        }

        // Material 4: Botões
        $botao = $materials->firstWhere('name', 'Botão Redondo 8mm');
        if ($botao) {
            ProductBOM::create([
                'product_id' => $product->id,
                'material_id' => $botao->id,
                'quantity' => 4,
                'unit' => 'unit',
                'notes' => 'Botões de fechamento',
            ]);
        }

        $this->command->info("Created BOM for: {$product->name}");
    }
}
