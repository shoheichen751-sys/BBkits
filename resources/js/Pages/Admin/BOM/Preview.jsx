import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import toast from 'react-hot-toast';

export default function Preview({ auth, products, materials }) {
    const [orderItems, setOrderItems] = useState([
        { product_id: '', size: '', color: '', quantity: 1 }
    ]);
    const [calculatedMaterials, setCalculatedMaterials] = useState(null);
    const [calculating, setCalculating] = useState(false);

    // Add order item
    const addOrderItem = () => {
        setOrderItems([...orderItems, { product_id: '', size: '', color: '', quantity: 1 }]);
    };

    // Remove order item
    const removeOrderItem = (index) => {
        const newItems = [...orderItems];
        newItems.splice(index, 1);
        setOrderItems(newItems);
        setCalculatedMaterials(null);
    };

    // Update order item
    const updateOrderItem = (index, field, value) => {
        const newItems = [...orderItems];
        newItems[index][field] = value;

        // Reset size and color when product changes
        if (field === 'product_id') {
            newItems[index].size = '';
            newItems[index].color = '';
        }

        setOrderItems(newItems);
        setCalculatedMaterials(null);
    };

    // Get product by ID
    const getProduct = (productId) => {
        return products?.find(p => p.id === parseInt(productId));
    };

    // Calculate materials
    const calculateMaterials = async () => {
        const validItems = orderItems.filter(item => item.product_id && item.quantity > 0);

        if (validItems.length === 0) {
            toast.error('Adicione pelo menos um produto com quantidade válida.');
            return;
        }

        setCalculating(true);

        try {
            const response = await fetch('/admin/bom/preview-materials', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                },
                body: JSON.stringify({ items: validItems }),
            });

            const data = await response.json();

            if (data.success) {
                setCalculatedMaterials(data.materials);
                toast.success('Materiais calculados com sucesso!');
            } else {
                toast.error('Erro ao calcular materiais.');
            }
        } catch (error) {
            toast.error('Erro ao calcular materiais.');
            console.error(error);
        }

        setCalculating(false);
    };

    // Check if any material has shortage
    const hasShortage = calculatedMaterials?.some(m => !m.has_enough);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-2">
                            <Link
                                href="/admin/bom"
                                className="text-gray-500 hover:text-gray-700"
                            >
                                Fichas Técnicas
                            </Link>
                            <span className="text-gray-400">/</span>
                            <h2 className="text-xl font-semibold text-gray-900">Calculadora de Materiais</h2>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">
                            Calcule os materiais necessários para um pedido
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Calculadora de Materiais" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Order Items */}
                        <div className="bg-white shadow rounded-lg">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        Itens do Pedido
                                    </h3>
                                    <button
                                        onClick={addOrderItem}
                                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm transition-colors"
                                    >
                                        + Adicionar Item
                                    </button>
                                </div>
                            </div>

                            <div className="divide-y divide-gray-200">
                                {orderItems.map((item, index) => {
                                    const product = getProduct(item.product_id);
                                    return (
                                        <div key={index} className="p-6">
                                            <div className="grid grid-cols-12 gap-3">
                                                {/* Product */}
                                                <div className="col-span-12">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Produto
                                                    </label>
                                                    <select
                                                        value={item.product_id}
                                                        onChange={(e) => updateOrderItem(index, 'product_id', e.target.value)}
                                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                                    >
                                                        <option value="">Selecione um produto...</option>
                                                        {products?.map(product => (
                                                            <option key={product.id} value={product.id}>
                                                                {product.name}
                                                                {!product.has_bom && ' (sem ficha técnica)'}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* Size */}
                                                <div className="col-span-4">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Tamanho
                                                    </label>
                                                    <select
                                                        value={item.size}
                                                        onChange={(e) => updateOrderItem(index, 'size', e.target.value)}
                                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                                        disabled={!product}
                                                    >
                                                        <option value="">-</option>
                                                        {product?.available_sizes?.map(size => (
                                                            <option key={size} value={size}>{size}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* Color */}
                                                <div className="col-span-4">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Cor
                                                    </label>
                                                    <select
                                                        value={item.color}
                                                        onChange={(e) => updateOrderItem(index, 'color', e.target.value)}
                                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                                        disabled={!product}
                                                    >
                                                        <option value="">-</option>
                                                        {product?.available_colors?.map(color => (
                                                            <option key={color} value={color}>{color}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* Quantity */}
                                                <div className="col-span-4">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Quantidade
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={item.quantity}
                                                        onChange={(e) => updateOrderItem(index, 'quantity', parseInt(e.target.value) || 1)}
                                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                                    />
                                                </div>

                                                {/* Warning if no BOM */}
                                                {product && !product.has_bom && (
                                                    <div className="col-span-12">
                                                        <p className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
                                                            Este produto não possui ficha técnica cadastrada.
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Remove button */}
                                                {orderItems.length > 1 && (
                                                    <div className="col-span-12">
                                                        <button
                                                            onClick={() => removeOrderItem(index)}
                                                            className="text-sm text-red-600 hover:text-red-800"
                                                        >
                                                            Remover item
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="p-6 border-t border-gray-200">
                                <button
                                    onClick={calculateMaterials}
                                    disabled={calculating}
                                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-4 py-3 rounded-lg transition-colors font-medium"
                                >
                                    {calculating ? 'Calculando...' : 'Calcular Materiais Necessários'}
                                </button>
                            </div>
                        </div>

                        {/* Results */}
                        <div className="bg-white shadow rounded-lg">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        Materiais Necessários
                                    </h3>
                                    {calculatedMaterials && (
                                        <button
                                            onClick={() => setCalculatedMaterials(null)}
                                            className="text-sm text-gray-500 hover:text-gray-700"
                                        >
                                            Limpar
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="p-6">
                                {!calculatedMaterials && (
                                    <div className="text-center py-12 text-gray-500">
                                        <div className="text-4xl mb-4">📋</div>
                                        <p>Adicione produtos e clique em "Calcular" para ver os materiais necessários.</p>
                                    </div>
                                )}

                                {calculatedMaterials && calculatedMaterials.length === 0 && (
                                    <div className="text-center py-12 text-gray-500">
                                        <div className="text-4xl mb-4">⚠️</div>
                                        <p>Nenhum material encontrado. Verifique se os produtos possuem ficha técnica.</p>
                                    </div>
                                )}

                                {calculatedMaterials && calculatedMaterials.length > 0 && (
                                    <div>
                                        {/* Summary alert */}
                                        {hasShortage ? (
                                            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                                <p className="text-sm text-red-800 font-medium">
                                                    ⚠️ Atenção: Alguns materiais estão com estoque insuficiente!
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                                                <p className="text-sm text-green-800 font-medium">
                                                    ✓ Todos os materiais estão disponíveis em estoque.
                                                </p>
                                            </div>
                                        )}

                                        {/* Materials table */}
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead>
                                                    <tr>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                            Material
                                                        </th>
                                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                                            Necessário
                                                        </th>
                                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                                            Em Estoque
                                                        </th>
                                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                                            Status
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200">
                                                    {calculatedMaterials.map((material, index) => (
                                                        <tr key={index} className={!material.has_enough ? 'bg-red-50' : ''}>
                                                            <td className="px-4 py-3 text-sm text-gray-900">
                                                                {material.material_name}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm text-gray-900 text-right">
                                                                {material.quantity_needed.toFixed(3)} {material.unit}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm text-gray-900 text-right">
                                                                {parseFloat(material.current_stock).toFixed(3)} {material.unit}
                                                            </td>
                                                            <td className="px-4 py-3 text-center">
                                                                {material.has_enough ? (
                                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                        ✓ OK
                                                                    </span>
                                                                ) : (
                                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                                        Faltam {material.shortage.toFixed(3)}
                                                                    </span>
                                                                )}
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
            </div>
        </AuthenticatedLayout>
    );
}
