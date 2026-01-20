import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import toast from 'react-hot-toast';

export default function Index({ auth, mappings, mappingsByColor, productColors, materials, stats }) {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showCopyModal, setShowCopyModal] = useState(false);
    const [selectedColor, setSelectedColor] = useState('');
    const [expandedColors, setExpandedColors] = useState({});

    // Toggle color section expansion
    const toggleColorExpanded = (color) => {
        setExpandedColors(prev => ({
            ...prev,
            [color]: !prev[color]
        }));
    };

    // Delete mapping
    const deleteMapping = (mappingId) => {
        if (!confirm('Remover este mapeamento?')) return;

        router.delete(`/admin/color-mapping/${mappingId}`, {
            preserveScroll: true,
            onSuccess: () => toast.success('Mapeamento removido!'),
            onError: () => toast.error('Erro ao remover mapeamento.'),
        });
    };

    // Toggle mapping active status
    const toggleActive = (mappingId) => {
        router.post(`/admin/color-mapping/${mappingId}/toggle`, {}, {
            preserveScroll: true,
            onSuccess: () => toast.success('Status atualizado!'),
            onError: () => toast.error('Erro ao atualizar status.'),
        });
    };

    // Get color badge style
    const getColorStyle = (colorName) => {
        const colorMap = {
            'Rosa': 'bg-pink-100 text-pink-800 border-pink-200',
            'Azul': 'bg-blue-100 text-blue-800 border-blue-200',
            'Verde': 'bg-green-100 text-green-800 border-green-200',
            'Amarelo': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'Vermelho': 'bg-red-100 text-red-800 border-red-200',
            'Branco': 'bg-gray-100 text-gray-800 border-gray-200',
            'Bege': 'bg-amber-100 text-amber-800 border-amber-200',
            'Lilás': 'bg-purple-100 text-purple-800 border-purple-200',
        };
        return colorMap[colorName] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Mapeamento de Cores</h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Configure quais materiais usar para cada cor de produto
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowCopyModal(true)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                        >
                            Copiar Mapeamentos
                        </button>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            + Novo Mapeamento
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Mapeamento de Cores" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                                            <span className="text-white text-lg">🎨</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Total Mapeamentos</dt>
                                            <dd className="text-lg font-semibold text-gray-900">{stats.total_mappings}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                                            <span className="text-white text-lg">✓</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Cores Configuradas</dt>
                                            <dd className="text-lg font-semibold text-green-600">{stats.colors_configured}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                                            <span className="text-white text-lg">📦</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Total Cores Produtos</dt>
                                            <dd className="text-lg font-semibold text-gray-900">{stats.total_product_colors}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                                            <span className="text-white text-lg">!</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Cores Sem Config.</dt>
                                            <dd className="text-lg font-semibold text-yellow-600">{stats.unconfigured_colors}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Warning if unconfigured colors */}
                    {stats.unconfigured_colors > 0 && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-yellow-800">
                                        {stats.unconfigured_colors} cor(es) ainda não configurada(s)
                                    </h3>
                                    <p className="mt-1 text-sm text-yellow-700">
                                        Cores sem mapeamento usarão o material base definido na ficha técnica.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Color Mappings List */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">
                                Mapeamentos por Cor
                            </h3>
                        </div>

                        <div className="divide-y divide-gray-200">
                            {productColors.map(color => {
                                const colorMappings = mappingsByColor[color] || [];
                                const isExpanded = expandedColors[color] || colorMappings.length > 0;

                                return (
                                    <div key={color} className="p-4">
                                        <div
                                            className="flex items-center justify-between cursor-pointer"
                                            onClick={() => toggleColorExpanded(color)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getColorStyle(color)}`}>
                                                    {color}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    {colorMappings.length} mapeamento(s)
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedColor(color);
                                                        setShowAddModal(true);
                                                    }}
                                                    className="text-sm text-purple-600 hover:text-purple-800"
                                                >
                                                    + Adicionar
                                                </button>
                                                <svg
                                                    className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>

                                        {isExpanded && (
                                            <div className="mt-4 pl-4 border-l-2 border-gray-200">
                                                {colorMappings.length === 0 ? (
                                                    <p className="text-sm text-gray-500 italic py-2">
                                                        Nenhum mapeamento configurado. Clique em "+ Adicionar" para criar.
                                                    </p>
                                                ) : (
                                                    <div className="space-y-2">
                                                        {colorMappings.map(mapping => (
                                                            <div
                                                                key={mapping.id}
                                                                className={`flex items-center justify-between p-3 rounded-lg ${
                                                                    mapping.is_active ? 'bg-gray-50' : 'bg-gray-100 opacity-60'
                                                                }`}
                                                            >
                                                                <div className="flex items-center gap-4">
                                                                    <div className="text-sm">
                                                                        <span className="text-gray-500">Material base:</span>
                                                                        <span className="ml-2 font-medium text-gray-900">
                                                                            {mapping.base_material?.name}
                                                                        </span>
                                                                    </div>
                                                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                                    </svg>
                                                                    <div className="text-sm">
                                                                        <span className="text-gray-500">Usar:</span>
                                                                        <span className="ml-2 font-medium text-purple-600">
                                                                            {mapping.target_material?.name}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <button
                                                                        onClick={() => toggleActive(mapping.id)}
                                                                        className={`px-2 py-1 rounded text-xs ${
                                                                            mapping.is_active
                                                                                ? 'bg-green-100 text-green-700'
                                                                                : 'bg-gray-200 text-gray-600'
                                                                        }`}
                                                                    >
                                                                        {mapping.is_active ? 'Ativo' : 'Inativo'}
                                                                    </button>
                                                                    <button
                                                                        onClick={() => deleteMapping(mapping.id)}
                                                                        className="text-red-600 hover:text-red-800 p-1"
                                                                    >
                                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {productColors.length === 0 && (
                                <div className="p-12 text-center">
                                    <div className="text-gray-400 text-4xl mb-4">🎨</div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        Nenhuma cor de produto encontrada
                                    </h3>
                                    <p className="text-gray-500">
                                        Adicione cores aos seus produtos para configurar mapeamentos.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Mapping Modal */}
            {showAddModal && (
                <AddMappingModal
                    productColors={productColors}
                    materials={materials}
                    selectedColor={selectedColor}
                    onClose={() => {
                        setShowAddModal(false);
                        setSelectedColor('');
                    }}
                />
            )}

            {/* Copy Mappings Modal */}
            {showCopyModal && (
                <CopyMappingsModal
                    productColors={productColors}
                    mappingsByColor={mappingsByColor}
                    onClose={() => setShowCopyModal(false)}
                />
            )}
        </AuthenticatedLayout>
    );
}

// Add Mapping Modal Component
function AddMappingModal({ productColors, materials, selectedColor, onClose }) {
    const [formData, setFormData] = useState({
        product_color: selectedColor || '',
        base_material_id: '',
        target_material_id: '',
        notes: '',
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.product_color || !formData.base_material_id || !formData.target_material_id) {
            toast.error('Preencha todos os campos obrigatórios.');
            return;
        }

        setSaving(true);

        router.post('/admin/color-mapping', formData, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Mapeamento criado com sucesso!');
                onClose();
            },
            onError: (errors) => {
                toast.error(Object.values(errors)[0] || 'Erro ao criar mapeamento.');
                setSaving(false);
            },
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Novo Mapeamento de Cor
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Cor do Produto *
                                </label>
                                <select
                                    value={formData.product_color}
                                    onChange={(e) => setFormData({ ...formData, product_color: e.target.value })}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                    required
                                >
                                    <option value="">Selecione uma cor...</option>
                                    {productColors.map(color => (
                                        <option key={color} value={color}>{color}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Material Base (na Ficha Técnica) *
                                </label>
                                <select
                                    value={formData.base_material_id}
                                    onChange={(e) => setFormData({ ...formData, base_material_id: e.target.value })}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                    required
                                >
                                    <option value="">Selecione o material base...</option>
                                    {materials.map(material => (
                                        <option key={material.id} value={material.id}>
                                            {material.name}
                                        </option>
                                    ))}
                                </select>
                                <p className="mt-1 text-xs text-gray-500">
                                    O material genérico definido na ficha técnica
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Material de Destino (a usar) *
                                </label>
                                <select
                                    value={formData.target_material_id}
                                    onChange={(e) => setFormData({ ...formData, target_material_id: e.target.value })}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                    required
                                >
                                    <option value="">Selecione o material específico...</option>
                                    {materials.map(material => (
                                        <option key={material.id} value={material.id}>
                                            {material.name}
                                        </option>
                                    ))}
                                </select>
                                <p className="mt-1 text-xs text-gray-500">
                                    O material específico colorido a ser usado
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Observações (opcional)
                                </label>
                                <input
                                    type="text"
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                    placeholder="Ex: Usar apenas para tamanhos P e M"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg transition-colors"
                        >
                            {saving ? 'Salvando...' : 'Criar Mapeamento'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Copy Mappings Modal Component
function CopyMappingsModal({ productColors, mappingsByColor, onClose }) {
    const [sourceColor, setSourceColor] = useState('');
    const [targetColor, setTargetColor] = useState('');
    const [copying, setCopying] = useState(false);

    const colorsWithMappings = productColors.filter(c => (mappingsByColor[c]?.length || 0) > 0);

    const handleCopy = () => {
        if (!sourceColor || !targetColor) {
            toast.error('Selecione as cores de origem e destino.');
            return;
        }

        setCopying(true);

        router.post('/admin/color-mapping/copy', {
            source_color: sourceColor,
            target_color: targetColor,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Mapeamentos copiados com sucesso!');
                onClose();
            },
            onError: (errors) => {
                toast.error(Object.values(errors)[0] || 'Erro ao copiar mapeamentos.');
                setCopying(false);
            },
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Copiar Mapeamentos
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                        Copie todos os mapeamentos de uma cor para outra. Útil quando cores similares usam os mesmos materiais.
                    </p>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Cor de Origem
                            </label>
                            <select
                                value={sourceColor}
                                onChange={(e) => setSourceColor(e.target.value)}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                            >
                                <option value="">Selecione...</option>
                                {colorsWithMappings.map(color => (
                                    <option key={color} value={color}>
                                        {color} ({mappingsByColor[color]?.length || 0} mapeamentos)
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Cor de Destino
                            </label>
                            <select
                                value={targetColor}
                                onChange={(e) => setTargetColor(e.target.value)}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                            >
                                <option value="">Selecione...</option>
                                {productColors.filter(c => c !== sourceColor).map(color => (
                                    <option key={color} value={color}>{color}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {colorsWithMappings.length === 0 && (
                        <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                            <p className="text-sm text-yellow-800">
                                Nenhuma cor possui mapeamentos para copiar. Crie mapeamentos primeiro.
                            </p>
                        </div>
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
                        onClick={handleCopy}
                        disabled={copying || !sourceColor || !targetColor}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg transition-colors"
                    >
                        {copying ? 'Copiando...' : 'Copiar Mapeamentos'}
                    </button>
                </div>
            </div>
        </div>
    );
}
