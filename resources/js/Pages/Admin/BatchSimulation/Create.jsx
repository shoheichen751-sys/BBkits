import { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Create({ products, categories }) {
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [calculationResult, setCalculationResult] = useState(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const [filterCategory, setFilterCategory] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        products_config: [],
    });

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value || 0);
    };

    const filteredProducts = products.filter((product) => {
        const matchesCategory = !filterCategory || product.category_id === parseInt(filterCategory);
        const matchesSearch = !searchTerm || product.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const addProduct = (product) => {
        if (!selectedProducts.find((p) => p.product_id === product.id)) {
            const newProduct = {
                product_id: product.id,
                name: product.name,
                quantity: 1,
                color: '',
                size: '',
            };
            setSelectedProducts([...selectedProducts, newProduct]);
            setData('products_config', [...selectedProducts, newProduct].map(p => ({
                product_id: p.product_id,
                quantity: p.quantity,
                color: p.color,
                size: p.size,
            })));
        }
    };

    const removeProduct = (productId) => {
        const updated = selectedProducts.filter((p) => p.product_id !== productId);
        setSelectedProducts(updated);
        setData('products_config', updated.map(p => ({
            product_id: p.product_id,
            quantity: p.quantity,
            color: p.color,
            size: p.size,
        })));
        setCalculationResult(null);
    };

    const updateProductQuantity = (productId, quantity) => {
        const updated = selectedProducts.map((p) =>
            p.product_id === productId ? { ...p, quantity: parseInt(quantity) || 1 } : p
        );
        setSelectedProducts(updated);
        setData('products_config', updated.map(p => ({
            product_id: p.product_id,
            quantity: p.quantity,
            color: p.color,
            size: p.size,
        })));
        setCalculationResult(null);
    };

    const calculateSimulation = async () => {
        if (selectedProducts.length === 0) return;

        setIsCalculating(true);
        try {
            const response = await fetch('/admin/batch-simulation/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                },
                body: JSON.stringify({
                    products_config: selectedProducts.map(p => ({
                        product_id: p.product_id,
                        quantity: p.quantity,
                        color: p.color,
                        size: p.size,
                    })),
                }),
            });
            const result = await response.json();
            setCalculationResult(result);
        } catch (error) {
            console.error('Error calculating:', error);
        }
        setIsCalculating(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedProducts.length === 0) return;

        setData('products_config', selectedProducts.map(p => ({
            product_id: p.product_id,
            quantity: p.quantity,
            color: p.color,
            size: p.size,
        })));

        post('/admin/batch-simulation');
    };

    const totalUnits = selectedProducts.reduce((sum, p) => sum + p.quantity, 0);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Nova Simulação de Produção</h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Adicione produtos e quantidades para simular a produção
                        </p>
                    </div>
                    <Link href="/admin/batch-simulation" className="text-gray-600 hover:text-gray-900">
                        Voltar
                    </Link>
                </div>
            }
        >
            <Head title="Nova Simulação" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Product Selector */}
                        <div className="lg:col-span-1 space-y-4">
                            <div className="bg-white shadow rounded-lg p-4">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Selecionar Produtos</h3>

                                {/* Filters */}
                                <div className="space-y-3 mb-4">
                                    <input
                                        type="text"
                                        placeholder="Buscar produto..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full rounded-lg border-gray-300 text-sm focus:border-pink-500 focus:ring-pink-500"
                                    />
                                    <select
                                        value={filterCategory}
                                        onChange={(e) => setFilterCategory(e.target.value)}
                                        className="w-full rounded-lg border-gray-300 text-sm focus:border-pink-500 focus:ring-pink-500"
                                    >
                                        <option value="">Todas as categorias</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Product List */}
                                <div className="max-h-96 overflow-y-auto space-y-2">
                                    {filteredProducts.map((product) => {
                                        const isSelected = selectedProducts.find(p => p.product_id === product.id);
                                        return (
                                            <div
                                                key={product.id}
                                                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                                                    isSelected
                                                        ? 'bg-pink-50 border-pink-300'
                                                        : 'bg-gray-50 border-gray-200 hover:border-pink-300'
                                                }`}
                                                onClick={() => !isSelected && addProduct(product)}
                                            >
                                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                <div className="text-xs text-gray-500">
                                                    {product.product_category?.name || 'Sem categoria'}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Selected Products & Form */}
                        <div className="lg:col-span-2 space-y-6">
                            <form onSubmit={handleSubmit}>
                                {/* Simulation Info */}
                                <div className="bg-white shadow rounded-lg p-6 mb-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Informações da Simulação</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Nome *</label>
                                            <input
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className="mt-1 block w-full rounded-lg border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                                                placeholder="Ex: Lote Março 2026"
                                            />
                                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Descrição</label>
                                            <input
                                                type="text"
                                                value={data.description}
                                                onChange={(e) => setData('description', e.target.value)}
                                                className="mt-1 block w-full rounded-lg border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                                                placeholder="Observações..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Selected Products */}
                                <div className="bg-white shadow rounded-lg p-6 mb-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-medium text-gray-900">
                                            Produtos Selecionados ({selectedProducts.length})
                                        </h3>
                                        <span className="text-sm text-gray-500">
                                            Total: {totalUnits} unidades
                                        </span>
                                    </div>

                                    {selectedProducts.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            <p>Nenhum produto selecionado</p>
                                            <p className="text-sm">Selecione produtos na lista ao lado</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {selectedProducts.map((product) => (
                                                <div
                                                    key={product.product_id}
                                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                                >
                                                    <div className="flex-1">
                                                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex items-center gap-2">
                                                            <label className="text-xs text-gray-500">Qtd:</label>
                                                            <input
                                                                type="number"
                                                                min="1"
                                                                value={product.quantity}
                                                                onChange={(e) => updateProductQuantity(product.product_id, e.target.value)}
                                                                className="w-20 rounded border-gray-300 text-sm focus:border-pink-500 focus:ring-pink-500"
                                                            />
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeProduct(product.product_id)}
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={calculateSimulation}
                                        disabled={selectedProducts.length === 0 || isCalculating}
                                        className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                                    >
                                        {isCalculating ? 'Calculando...' : 'Calcular Materiais'}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={selectedProducts.length === 0 || !data.name || processing}
                                        className="flex-1 px-4 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 transition-colors"
                                    >
                                        {processing ? 'Salvando...' : 'Salvar Simulação'}
                                    </button>
                                </div>
                            </form>

                            {/* Calculation Results */}
                            {calculationResult && (
                                <div className="space-y-6">
                                    {/* Summary */}
                                    <div className="bg-white shadow rounded-lg p-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">Resultado do Cálculo</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="bg-gray-50 rounded-lg p-3">
                                                <div className="text-xs text-gray-500 uppercase">Produtos</div>
                                                <div className="text-xl font-bold text-gray-900">
                                                    {calculationResult.summary.total_products}
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-3">
                                                <div className="text-xs text-gray-500 uppercase">Unidades</div>
                                                <div className="text-xl font-bold text-gray-900">
                                                    {calculationResult.summary.total_units}
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-3">
                                                <div className="text-xs text-gray-500 uppercase">Materiais</div>
                                                <div className="text-xl font-bold text-gray-900">
                                                    {calculationResult.summary.total_materials}
                                                </div>
                                            </div>
                                            <div className="bg-blue-50 rounded-lg p-3">
                                                <div className="text-xs text-blue-600 uppercase">Custo Total</div>
                                                <div className="text-xl font-bold text-blue-900">
                                                    {formatCurrency(calculationResult.summary.total_cost)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Feasibility Status */}
                                        <div className={`mt-4 p-4 rounded-lg ${
                                            calculationResult.summary.can_produce
                                                ? 'bg-green-50 border border-green-200'
                                                : 'bg-red-50 border border-red-200'
                                        }`}>
                                            <div className="flex items-center gap-2">
                                                {calculationResult.summary.can_produce ? (
                                                    <>
                                                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        <span className="font-medium text-green-800">
                                                            Produção Viável - Todos os materiais disponíveis
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                        <span className="font-medium text-red-800">
                                                            {calculationResult.summary.shortages_count} materiais faltantes
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Shortages */}
                                    {calculationResult.shortages.length > 0 && (
                                        <div className="bg-white shadow rounded-lg overflow-hidden">
                                            <div className="px-6 py-4 border-b bg-red-50">
                                                <h4 className="text-lg font-medium text-red-800">Materiais Faltantes</h4>
                                            </div>
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Material</th>
                                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Necessário</th>
                                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Disponível</th>
                                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Faltante</th>
                                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Custo Est.</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200">
                                                    {calculationResult.shortages.map((shortage) => (
                                                        <tr key={shortage.material_id} className="bg-red-50">
                                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{shortage.name}</td>
                                                            <td className="px-6 py-4 text-right text-sm text-gray-500">
                                                                {shortage.needed} {shortage.unit}
                                                            </td>
                                                            <td className="px-6 py-4 text-right text-sm text-gray-500">
                                                                {shortage.available} {shortage.unit}
                                                            </td>
                                                            <td className="px-6 py-4 text-right text-sm font-medium text-red-600">
                                                                {shortage.shortage} {shortage.unit}
                                                            </td>
                                                            <td className="px-6 py-4 text-right text-sm text-gray-900">
                                                                {formatCurrency(shortage.shortage_cost)}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    {/* All Materials */}
                                    <div className="bg-white shadow rounded-lg overflow-hidden">
                                        <div className="px-6 py-4 border-b bg-gray-50">
                                            <h4 className="text-lg font-medium text-gray-900">Todos os Materiais Necessários</h4>
                                        </div>
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Material</th>
                                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Necessário</th>
                                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Em Estoque</th>
                                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Custo</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {calculationResult.materials.map((material) => (
                                                    <tr key={material.material_id} className={material.shortage > 0 ? 'bg-red-50' : ''}>
                                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{material.name}</td>
                                                        <td className="px-6 py-4 text-right text-sm text-gray-500">
                                                            {material.quantity_needed.toFixed(2)} {material.unit}
                                                        </td>
                                                        <td className="px-6 py-4 text-right text-sm text-gray-500">
                                                            {material.current_stock.toFixed(2)} {material.unit}
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            {material.shortage > 0 ? (
                                                                <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                                                                    Faltam {material.shortage.toFixed(2)}
                                                                </span>
                                                            ) : (
                                                                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                                                    OK
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 text-right text-sm text-gray-900">
                                                            {formatCurrency(material.total_cost)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
