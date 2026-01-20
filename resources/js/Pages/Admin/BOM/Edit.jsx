import { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import toast from 'react-hot-toast';

export default function Edit({ auth, product, materials, availableSizes, availableColors }) {
    const [bomItems, setBomItems] = useState([]);
    const [saving, setSaving] = useState(false);
    const [showDuplicateModal, setShowDuplicateModal] = useState(false);

    // Initialize BOM items from product data
    useEffect(() => {
        if (product?.bom && product.bom.length > 0) {
            setBomItems(product.bom.map(item => ({
                id: item.id,
                material_id: item.material_id,
                material: item.material,
                quantity: parseFloat(item.quantity),
                unit: item.unit,
                notes: item.notes || '',
                is_active: item.is_active !== false,
                variants: item.variants || [],
                showVariants: false,
            })));
        }
    }, [product]);

    // Add new material to BOM
    const addMaterial = () => {
        setBomItems([...bomItems, {
            id: null,
            material_id: '',
            material: null,
            quantity: 1,
            unit: 'unidade',
            notes: '',
            is_active: true,
            variants: [],
            showVariants: false,
        }]);
    };

    // Remove material from BOM
    const removeMaterial = (index) => {
        const newItems = [...bomItems];
        newItems.splice(index, 1);
        setBomItems(newItems);
    };

    // Update material field
    const updateMaterial = (index, field, value) => {
        const newItems = [...bomItems];
        newItems[index][field] = value;

        // If material_id changed, update the material object and unit
        if (field === 'material_id') {
            const material = materials.find(m => m.id === parseInt(value));
            newItems[index].material = material;
            if (material) {
                newItems[index].unit = material.unit || 'unidade';
            }
        }

        setBomItems(newItems);
    };

    // Toggle variants visibility
    const toggleVariants = (index) => {
        const newItems = [...bomItems];
        newItems[index].showVariants = !newItems[index].showVariants;
        setBomItems(newItems);
    };

    // Add variant to a BOM item
    const addVariant = (bomIndex, size = '', color = '') => {
        const newItems = [...bomItems];
        newItems[bomIndex].variants.push({
            id: null,
            size: size,
            color: color,
            quantity_override: '',
            material_id_override: null,
        });
        setBomItems(newItems);
    };

    // Update variant field
    const updateVariant = (bomIndex, variantIndex, field, value) => {
        const newItems = [...bomItems];
        newItems[bomIndex].variants[variantIndex][field] = value;
        setBomItems(newItems);
    };

    // Remove variant
    const removeVariant = (bomIndex, variantIndex) => {
        const newItems = [...bomItems];
        newItems[bomIndex].variants.splice(variantIndex, 1);
        setBomItems(newItems);
    };

    // Save BOM
    const saveBOM = async () => {
        // Validate materials
        const invalidItems = bomItems.filter(item => !item.material_id || item.quantity <= 0);
        if (invalidItems.length > 0) {
            toast.error('Preencha todos os materiais com quantidade válida.');
            return;
        }

        // Check for duplicate materials
        const materialIds = bomItems.map(item => item.material_id);
        const duplicates = materialIds.filter((id, index) => materialIds.indexOf(id) !== index);
        if (duplicates.length > 0) {
            toast.error('Não é permitido adicionar o mesmo material duas vezes.');
            return;
        }

        // Validate variants - check for empty variants (no size or color)
        let hasInvalidVariants = false;
        bomItems.forEach(item => {
            if (item.variants) {
                item.variants.forEach(v => {
                    if (!v.size && !v.color) {
                        hasInvalidVariants = true;
                    }
                });
            }
        });
        if (hasInvalidVariants) {
            toast.error('Remova ou complete as variações que não têm tamanho nem cor selecionados.');
            return;
        }

        // Check for duplicate variants within same BOM item
        let hasDuplicateVariants = false;
        bomItems.forEach(item => {
            if (item.variants && item.variants.length > 1) {
                const variantKeys = item.variants
                    .filter(v => v.size || v.color)
                    .map(v => `${v.size || ''}-${v.color || ''}`);
                const uniqueKeys = new Set(variantKeys);
                if (uniqueKeys.size !== variantKeys.length) {
                    hasDuplicateVariants = true;
                }
            }
        });
        if (hasDuplicateVariants) {
            toast.error('Existem variações duplicadas (mesmo tamanho e cor) em um material.');
            return;
        }

        setSaving(true);

        const payload = {
            items: bomItems.map(item => ({
                material_id: parseInt(item.material_id),
                quantity: parseFloat(item.quantity),
                unit: item.unit,
                notes: item.notes,
                is_active: item.is_active,
                variants: item.variants.filter(v => v.size || v.color).map(v => ({
                    size: v.size || null,
                    color: v.color || null,
                    quantity_override: v.quantity_override ? parseFloat(v.quantity_override) : null,
                    material_id_override: v.material_id_override ? parseInt(v.material_id_override) : null,
                })),
            })),
        };

        router.post(`/admin/bom/${product.id}`, payload, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Ficha técnica salva com sucesso!');
                setSaving(false);
            },
            onError: (errors) => {
                toast.error('Erro ao salvar ficha técnica.');
                console.error(errors);
                setSaving(false);
            },
        });
    };

    // Calculate total materials preview
    const calculatePreview = (size = null) => {
        const preview = {};
        bomItems.forEach(item => {
            if (!item.material_id || !item.material) return;

            let qty = item.quantity;

            // Check for size variant
            if (size && item.variants) {
                const variant = item.variants.find(v => v.size === size);
                if (variant && variant.quantity_override) {
                    qty = parseFloat(variant.quantity_override);
                }
            }

            const materialName = item.material.name;
            if (preview[materialName]) {
                preview[materialName].quantity += qty;
            } else {
                preview[materialName] = { quantity: qty, unit: item.unit };
            }
        });
        return preview;
    };

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
                            <h2 className="text-xl font-semibold text-gray-900">{product.name}</h2>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">
                            Defina os materiais necessários para produzir este produto
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowDuplicateModal(true)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                        >
                            Copiar de outro produto
                        </button>
                        <button
                            onClick={saveBOM}
                            disabled={saving}
                            className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            {saving ? 'Salvando...' : 'Salvar Ficha'}
                        </button>
                    </div>
                </div>
            }
        >
            <Head title={`Ficha Técnica - ${product.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Editor */}
                        <div className="lg:col-span-2">
                            <div className="bg-white shadow rounded-lg">
                                <div className="p-6 border-b border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-medium text-gray-900">
                                            Materiais ({bomItems.length})
                                        </h3>
                                        <button
                                            onClick={addMaterial}
                                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm transition-colors"
                                        >
                                            + Adicionar Material
                                        </button>
                                    </div>
                                </div>

                                <div className="divide-y divide-gray-200">
                                    {bomItems.map((item, index) => (
                                        <div key={index} className="p-6">
                                            <div className="grid grid-cols-12 gap-4 items-start">
                                                {/* Material Select */}
                                                <div className="col-span-12 sm:col-span-5">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Material
                                                    </label>
                                                    <select
                                                        value={item.material_id}
                                                        onChange={(e) => updateMaterial(index, 'material_id', e.target.value)}
                                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                                    >
                                                        <option value="">Selecione...</option>
                                                        {materials.map(material => (
                                                            <option key={material.id} value={material.id}>
                                                                {material.name} ({material.unit})
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* Quantity */}
                                                <div className="col-span-6 sm:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Quantidade
                                                    </label>
                                                    <input
                                                        type="number"
                                                        step="0.001"
                                                        min="0.001"
                                                        value={item.quantity}
                                                        onChange={(e) => updateMaterial(index, 'quantity', e.target.value)}
                                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                                    />
                                                </div>

                                                {/* Unit */}
                                                <div className="col-span-6 sm:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Unidade
                                                    </label>
                                                    <select
                                                        value={item.unit}
                                                        onChange={(e) => updateMaterial(index, 'unit', e.target.value)}
                                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                                    >
                                                        <option value="unidade">unidade</option>
                                                        <option value="m">metros</option>
                                                        <option value="cm">centímetros</option>
                                                        <option value="g">gramas</option>
                                                        <option value="kg">quilos</option>
                                                        <option value="ml">mililitros</option>
                                                        <option value="l">litros</option>
                                                    </select>
                                                </div>

                                                {/* Actions */}
                                                <div className="col-span-12 sm:col-span-3 flex items-end gap-2">
                                                    {(availableSizes?.length > 0 || availableColors?.length > 0) && (
                                                        <button
                                                            onClick={() => toggleVariants(index)}
                                                            className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                                                                item.showVariants
                                                                    ? 'bg-purple-100 text-purple-700'
                                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                            }`}
                                                            title="Variações por tamanho/cor"
                                                        >
                                                            Variações {item.variants?.length > 0 && `(${item.variants.length})`}
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => removeMaterial(index)}
                                                        className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm transition-colors"
                                                        title="Remover material"
                                                    >
                                                        Remover
                                                    </button>
                                                </div>

                                                {/* Notes */}
                                                <div className="col-span-12">
                                                    <input
                                                        type="text"
                                                        placeholder="Observações (opcional)"
                                                        value={item.notes}
                                                        onChange={(e) => updateMaterial(index, 'notes', e.target.value)}
                                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-sm"
                                                    />
                                                </div>
                                            </div>

                                            {/* Variants Section */}
                                            {item.showVariants && (
                                                <div className="mt-4 pl-4 border-l-2 border-purple-200">
                                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
                                                        <h4 className="text-sm font-medium text-gray-700">
                                                            Variações por Tamanho/Cor
                                                        </h4>
                                                        <div className="flex flex-wrap gap-1">
                                                            {/* Quick-add buttons for sizes */}
                                                            {availableSizes?.map(size => {
                                                                const hasVariant = item.variants?.some(v => v.size === size);
                                                                return (
                                                                    <button
                                                                        key={size}
                                                                        onClick={() => !hasVariant && addVariant(index, size, '')}
                                                                        disabled={hasVariant}
                                                                        className={`px-2 py-1 text-xs rounded transition-colors ${
                                                                            hasVariant
                                                                                ? 'bg-green-100 text-green-700 cursor-default'
                                                                                : 'bg-gray-100 text-gray-600 hover:bg-purple-100 hover:text-purple-700'
                                                                        }`}
                                                                        title={hasVariant ? `Tamanho ${size} já configurado` : `Adicionar tamanho ${size}`}
                                                                    >
                                                                        {size} {hasVariant && '✓'}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>

                                                    {/* Configured sizes indicator */}
                                                    {item.variants?.length > 0 && (
                                                        <div className="mb-3 flex flex-wrap gap-1">
                                                            <span className="text-xs text-gray-500">Configurados:</span>
                                                            {item.variants.map((v, vIdx) => (
                                                                <span
                                                                    key={vIdx}
                                                                    className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-purple-100 text-purple-700"
                                                                >
                                                                    {v.size && `${v.size}`}
                                                                    {v.size && v.color && ' / '}
                                                                    {v.color && `${v.color}`}
                                                                    {v.quantity_override && ` = ${v.quantity_override}`}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {item.variants?.map((variant, vIndex) => (
                                                        <div key={vIndex} className="bg-gray-50 rounded-lg p-3 mb-2">
                                                            <div className="grid grid-cols-12 gap-2 items-center">
                                                                {/* Size */}
                                                                <div className="col-span-6 sm:col-span-2">
                                                                    <label className="block text-xs text-gray-500 mb-1">Tamanho</label>
                                                                    <select
                                                                        value={variant.size || ''}
                                                                        onChange={(e) => updateVariant(index, vIndex, 'size', e.target.value)}
                                                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-sm"
                                                                    >
                                                                        <option value="">-</option>
                                                                        {availableSizes?.map(size => (
                                                                            <option key={size} value={size}>{size}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>

                                                                {/* Color */}
                                                                <div className="col-span-6 sm:col-span-2">
                                                                    <label className="block text-xs text-gray-500 mb-1">Cor</label>
                                                                    <select
                                                                        value={variant.color || ''}
                                                                        onChange={(e) => updateVariant(index, vIndex, 'color', e.target.value)}
                                                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-sm"
                                                                    >
                                                                        <option value="">-</option>
                                                                        {availableColors?.map(color => (
                                                                            <option key={color} value={color}>{color}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>

                                                                {/* Quantity Override */}
                                                                <div className="col-span-6 sm:col-span-2">
                                                                    <label className="block text-xs text-gray-500 mb-1">Quantidade</label>
                                                                    <input
                                                                        type="number"
                                                                        step="0.001"
                                                                        placeholder={item.quantity.toString()}
                                                                        value={variant.quantity_override || ''}
                                                                        onChange={(e) => updateVariant(index, vIndex, 'quantity_override', e.target.value)}
                                                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-sm"
                                                                    />
                                                                </div>

                                                                {/* Material Override */}
                                                                <div className="col-span-6 sm:col-span-4">
                                                                    <label className="block text-xs text-gray-500 mb-1">Material alternativo</label>
                                                                    <select
                                                                        value={variant.material_id_override || ''}
                                                                        onChange={(e) => updateVariant(index, vIndex, 'material_id_override', e.target.value)}
                                                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-sm"
                                                                    >
                                                                        <option value="">Usar material padrão</option>
                                                                        {materials.filter(m => m.id !== parseInt(item.material_id)).map(material => (
                                                                            <option key={material.id} value={material.id}>
                                                                                {material.name}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                </div>

                                                                {/* Remove */}
                                                                <div className="col-span-12 sm:col-span-2 flex justify-end">
                                                                    <button
                                                                        onClick={() => removeVariant(index, vIndex)}
                                                                        className="text-red-600 hover:text-red-800 text-sm px-2 py-1"
                                                                    >
                                                                        Remover
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            {/* Variant validation warning */}
                                                            {!variant.size && !variant.color && (
                                                                <p className="text-xs text-yellow-600 mt-2">
                                                                    Selecione pelo menos um tamanho ou cor para esta variação.
                                                                </p>
                                                            )}
                                                        </div>
                                                    ))}

                                                    {/* Add variant button */}
                                                    <button
                                                        onClick={() => addVariant(index)}
                                                        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-purple-300 hover:text-purple-600 transition-colors"
                                                    >
                                                        + Adicionar variação manual
                                                    </button>

                                                    {item.variants?.length === 0 && (
                                                        <p className="text-sm text-gray-500 italic mt-3">
                                                            Use os botões de tamanho acima ou adicione variações manualmente para definir quantidades diferentes por tamanho ou cor.
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    {bomItems.length === 0 && (
                                        <div className="p-12 text-center">
                                            <div className="text-gray-400 text-4xl mb-4">📋</div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                Nenhum material adicionado
                                            </h3>
                                            <p className="text-gray-500 mb-4">
                                                Adicione os materiais necessários para produzir este produto.
                                            </p>
                                            <button
                                                onClick={addMaterial}
                                                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                                            >
                                                + Adicionar primeiro material
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Product Info */}
                            <div className="bg-white shadow rounded-lg p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Produto</h3>
                                {product.image_url && (
                                    <img
                                        src={product.image_url}
                                        alt={product.name}
                                        className="w-full h-40 object-cover rounded-lg mb-4"
                                    />
                                )}
                                <dl className="space-y-2">
                                    <div>
                                        <dt className="text-sm text-gray-500">Nome</dt>
                                        <dd className="text-sm font-medium text-gray-900">{product.name}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm text-gray-500">Tamanhos</dt>
                                        <dd className="text-sm font-medium text-gray-900">
                                            {availableSizes?.join(', ') || 'Nenhum'}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm text-gray-500">Cores</dt>
                                        <dd className="text-sm font-medium text-gray-900">
                                            {availableColors?.join(', ') || 'Nenhuma'}
                                        </dd>
                                    </div>
                                </dl>
                            </div>

                            {/* Preview */}
                            <div className="bg-white shadow rounded-lg p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    Pré-visualização
                                </h3>
                                <p className="text-sm text-gray-500 mb-4">
                                    Materiais necessários para 1 unidade:
                                </p>

                                {availableSizes?.length > 0 && (
                                    <div className="space-y-4">
                                        {availableSizes.map(size => {
                                            const preview = calculatePreview(size);
                                            return (
                                                <div key={size} className="border-l-2 border-purple-200 pl-3">
                                                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                                                        Tamanho {size}
                                                    </h4>
                                                    {Object.keys(preview).length > 0 ? (
                                                        <ul className="space-y-1">
                                                            {Object.entries(preview).map(([name, data]) => (
                                                                <li key={name} className="text-sm text-gray-600">
                                                                    • {name}: {data.quantity} {data.unit}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <p className="text-sm text-gray-400 italic">
                                                            Nenhum material
                                                        </p>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {(!availableSizes || availableSizes.length === 0) && (
                                    <div>
                                        {Object.keys(calculatePreview()).length > 0 ? (
                                            <ul className="space-y-1">
                                                {Object.entries(calculatePreview()).map(([name, data]) => (
                                                    <li key={name} className="text-sm text-gray-600">
                                                        • {name}: {data.quantity} {data.unit}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-sm text-gray-400 italic">
                                                Adicione materiais para ver a pré-visualização.
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Duplicate Modal */}
            {showDuplicateModal && (
                <DuplicateModal
                    productId={product.id}
                    onClose={() => setShowDuplicateModal(false)}
                />
            )}
        </AuthenticatedLayout>
    );
}

// Duplicate Modal Component
function DuplicateModal({ productId, onClose }) {
    const [sourceProductId, setSourceProductId] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [duplicating, setDuplicating] = useState(false);

    useEffect(() => {
        // Fetch products with BOM using dedicated JSON endpoint
        fetch('/admin/bom/products-with-bom', {
            headers: { 'Accept': 'application/json' },
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setProducts(data.products?.filter(p => p.id !== productId) || []);
                }
                setLoading(false);
            })
            .catch(() => {
                toast.error('Erro ao carregar produtos.');
                setLoading(false);
            });
    }, [productId]);

    const handleDuplicate = () => {
        if (!sourceProductId) {
            toast.error('Selecione um produto de origem.');
            return;
        }

        setDuplicating(true);

        fetch(`/admin/bom/${productId}/duplicate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
            },
            body: JSON.stringify({ source_product_id: sourceProductId }),
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    toast.success('Ficha técnica copiada com sucesso!');
                    window.location.reload();
                } else {
                    toast.error(data.message || 'Erro ao copiar ficha técnica.');
                }
                setDuplicating(false);
            })
            .catch(() => {
                toast.error('Erro ao copiar ficha técnica.');
                setDuplicating(false);
            });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Copiar Ficha Técnica
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                        Selecione um produto para copiar sua ficha técnica. Isso substituirá qualquer ficha existente.
                    </p>

                    {loading ? (
                        <div className="text-center py-4">Carregando...</div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-4 text-gray-500">
                            Nenhum produto com ficha técnica disponível.
                        </div>
                    ) : (
                        <select
                            value={sourceProductId}
                            onChange={(e) => setSourceProductId(e.target.value)}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                        >
                            <option value="">Selecione o produto de origem...</option>
                            {products.map(product => (
                                <option key={product.id} value={product.id}>
                                    {product.name} ({product.bom_count} materiais)
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleDuplicate}
                        disabled={duplicating || !sourceProductId}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg transition-colors"
                    >
                        {duplicating ? 'Copiando...' : 'Copiar Ficha'}
                    </button>
                </div>
            </div>
        </div>
    );
}
