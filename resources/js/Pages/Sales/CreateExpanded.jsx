import { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import toast from 'react-hot-toast';
import axios from 'axios';
import { formatBRL, formatBRLNumber, formatBrazilianCurrencyInput, parseBrazilianCurrency, formatAdditionalCost } from '@/utils/currency';

export default function CreateExpanded() {
    const { data, setData, post, processing, errors } = useForm({
        // Client info
        client_name: '',
        client_email: '',
        client_phone: '',
        client_cpf: '',
        
        // Products info (now supports multiple products)
        products: [], // Array of {product_id, product_name, product_category, size, quantity, unit_price, has_embroidery, embroidery_text, embroidery_font, embroidery_color, embroidery_position}
        
        // Child & embroidery
        child_name: '',
        embroidery_position: 'center',
        embroidery_color: 'pink',
        embroidery_font: 'cursive',
        
        // Payment
        total_amount: '',
        shipping_amount: '',
        payment_method: 'pix',
        received_amount: '',
        payment_date: '',
        payment_receipt: null,
        
        // Delivery address
        delivery_address: '',
        delivery_number: '',
        delivery_complement: '',
        delivery_neighborhood: '',
        delivery_city: '',
        delivery_state: '',
        delivery_zipcode: '',
        estimated_delivery_date: '',
        delivery_days: '',
        
        // Product specifications - required by backend
        mesa_livre_details: '',
        chaveiros: '',
        kit_main_color: '',
        alcas: '',
        faixa: '',
        friso: '',
        vies: '',
        ziper: '',
        production_estimate: '',
        delivery_estimate: '',
        
        notes: ''
    });

    const [showPreview, setShowPreview] = useState(false);
    const [receiptPreview, setReceiptPreview] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
    
    // Dynamic embroidery options from API
    const [embroideryFonts, setEmbroideryFonts] = useState([]);
    const [embroideryColors, setEmbroideryColors] = useState([]);
    const [embroideryPositions, setEmbroideryPositions] = useState([]);
    const [embroideryDesigns, setEmbroideryDesigns] = useState([]);
    const [availableProducts, setAvailableProducts] = useState([]);
    const [loadingOptions, setLoadingOptions] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(null);
    
    // Current product being added to cart
    const [currentProduct, setCurrentProduct] = useState({
        product_id: '',
        product_name: '',
        product_category: '',
        size: 'P',
        quantity: 1,
        unit_price: 0,
        has_embroidery: true,
        embroidery_text: '',
        embroidery_font: '',
        embroidery_color: '',
        embroidery_position: '',
        embroidery_design: ''
    });
    
    // Brazilian size mapping and pricing
    const sizePricing = {
        'P': { name: 'Pequeno (P)', basePrice: 0 },
        'M': { name: 'Médio (M)', basePrice: 10 },
        'G': { name: 'Grande (G)', basePrice: 20 },
        'GG': { name: 'Extra Grande (GG)', basePrice: 30 }
    };

    // Fetch embroidery options and categories from API on component mount
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                setLoadingOptions(true);
                
                const [fontsRes, colorsRes, positionsRes, designsRes, productsRes] = await Promise.all([
                    axios.get('/api/embroidery/fonts'),
                    axios.get('/api/embroidery/colors'),
                    axios.get('/api/embroidery/positions'),
                    axios.get('/api/embroidery/designs'),
                    axios.get('/api/products')
                ]);
                
                setEmbroideryFonts(fontsRes.data);
                setEmbroideryColors(colorsRes.data);
                setEmbroideryPositions(positionsRes.data);
                setEmbroideryDesigns(designsRes.data);
                setAvailableProducts(productsRes.data);
                
                // Set default values for current product being added
                setCurrentProduct(prev => ({
                    ...prev,
                    embroidery_font: fontsRes.data.length > 0 ? fontsRes.data[0].id : '',
                    embroidery_color: colorsRes.data.length > 0 ? colorsRes.data[0].id : '',
                    embroidery_position: positionsRes.data.length > 0 ? positionsRes.data[0].id : '',
                    embroidery_design: designsRes.data.length > 0 ? designsRes.data[0].id : ''
                }));
                
                setLoadingOptions(false);
            } catch (error) {
                console.error('Error fetching options:', error);
                toast.error('Erro ao carregar opções');
                setLoadingOptions(false);
            }
        };
        
        fetchOptions();
    }, []);

    // Rest of the component logic...
    const calculateCurrentProductPrice = () => {
        if (!currentProduct.product_id) return { unitTotal: 0, totalPrice: 0, breakdown: {} };
        
        const basePrice = parseFloat(currentProduct.unit_price || 0);
        const sizePrice = parseFloat(sizePricing[currentProduct.size]?.basePrice || 0);
        const quantity = parseInt(currentProduct.quantity || 1);
        
        let embroideryCost = 0;
        const selectedFont = embroideryFonts.find(f => f.id == currentProduct.embroidery_font);
        const selectedColor = embroideryColors.find(c => c.id == currentProduct.embroidery_color);
        const selectedPosition = embroideryPositions.find(p => p.id == currentProduct.embroidery_position);
        
        const fontCost = parseFloat(selectedFont?.additional_cost || 0);
        const colorCost = parseFloat(selectedColor?.additional_cost || 0);
        const positionCost = parseFloat(selectedPosition?.additional_cost || 0);
        
        embroideryCost = fontCost + colorCost + positionCost;
        
        const unitTotal = basePrice + sizePrice + embroideryCost;
        const totalPrice = unitTotal * quantity;
        
        return {
            unitTotal,
            totalPrice,
            breakdown: {
                basePrice,
                sizePrice,
                embroideryCost: {
                    total: embroideryCost,
                    font: fontCost,
                    color: colorCost,
                    position: positionCost
                },
                quantity
            }
        };
    };

    const handleCurrentProductChange = (productId) => {
        const selectedProd = availableProducts.find(p => p.id == productId);
        if (selectedProd) {
            setCurrentProduct(prev => ({
                ...prev,
                product_id: productId,
                product_name: selectedProd.name,
                product_category: selectedProd.product_category ? selectedProd.product_category.name : 'N/A',
                unit_price: parseFloat(selectedProd.price || 0),
                embroidery_text: data.child_name || ''
            }));
        }
    };

    const addProductToCart = () => {
        if (!currentProduct.product_id) {
            toast.error('Por favor, selecione um produto');
            return;
        }
        
        if (!currentProduct.embroidery_design) {
            toast.error('Por favor, selecione um design para bordado');
            return;
        }
        
        if (!data.child_name || !data.child_name.trim()) {
            toast.error('Por favor, digite o nome da criança primeiro');
            return;
        }
        
        const basePrice = parseFloat(currentProduct.unit_price || 0);
        const sizePrice = parseFloat(sizePricing[currentProduct.size]?.basePrice || 0);
        const quantity = parseInt(currentProduct.quantity || 1);
        
        let embroideryCost = 0;
        const selectedFont = embroideryFonts.find(f => f.id == currentProduct.embroidery_font);
        const selectedColor = embroideryColors.find(c => c.id == currentProduct.embroidery_color);
        const selectedPosition = embroideryPositions.find(p => p.id == currentProduct.embroidery_position);
        
        if (selectedFont) embroideryCost += parseFloat(selectedFont.additional_cost || 0);
        if (selectedColor) embroideryCost += parseFloat(selectedColor.additional_cost || 0);
        if (selectedPosition) embroideryCost += parseFloat(selectedPosition.additional_cost || 0);
        
        const unitTotal = basePrice + sizePrice + embroideryCost;
        const productTotal = unitTotal * quantity;
        
        const newProduct = {
            ...currentProduct,
            id: Date.now(),
            unit_price: basePrice,
            size_price: sizePrice,
            embroidery_cost: embroideryCost,
            quantity: quantity,
            unit_total: unitTotal,
            total_price: productTotal
        };
        
        setData('products', [...data.products, newProduct]);
        
        // Reset form
        setCurrentProduct({
            product_id: '',
            product_name: '',
            product_category: '',
            size: 'P',
            quantity: 1,
            unit_price: 0,
            has_embroidery: true,
            embroidery_text: data.child_name || '',
            embroidery_font: embroideryFonts.length > 0 ? embroideryFonts[0].id : '',
            embroidery_color: embroideryColors.length > 0 ? embroideryColors[0].id : '',
            embroidery_position: embroideryPositions.length > 0 ? embroideryPositions[0].id : '',
            embroidery_design: embroideryDesigns.length > 0 ? embroideryDesigns[0].id : ''
        });
        
        toast.success('Produto adicionado ao carrinho!');
    };
    
    const removeProductFromCart = (productIndex) => {
        const updatedProducts = data.products.filter((_, index) => index !== productIndex);
        setData('products', updatedProducts);
        toast.success('Produto removido do carrinho!');
    };
    
    // Calculate total from all products in cart plus shipping
    useEffect(() => {
        const calculateTotal = () => {
            const productsTotal = data.products.reduce((sum, product) => sum + parseFloat(product.total_price || 0), 0);
            const shippingAmount = parseFloat(data.shipping_amount || 0);
            const totalAmount = productsTotal + shippingAmount;
            setData('total_amount', totalAmount.toFixed(2));
        };
        
        calculateTotal();
    }, [data.products, data.shipping_amount]);

    const handleReceiptChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('payment_receipt', file);
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setReceiptPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Use centralized Brazilian currency utilities
    const formatBrazilianCurrency = formatBrazilianCurrencyInput;
    const parseBrazilianCurrencyValue = parseBrazilianCurrency;

    const validateForm = () => {
        const errors = [];
        
        if (!data.products || data.products.length === 0) {
            errors.push({
                field: 'products',
                message: '🛍️ Por favor, adicione pelo menos um produto ao carrinho',
                section: 'Produtos'
            });
        }
        
        if (!data.client_name || !data.client_name.trim()) {
            errors.push({
                field: 'client_name',
                message: '👤 Nome da cliente é obrigatório',
                section: 'Dados da Cliente'
            });
        }
        
        if (!data.child_name || !data.child_name.trim()) {
            errors.push({
                field: 'child_name',
                message: '👶 Nome da criança é obrigatório para personalização',
                section: 'Dados da Criança'
            });
        }
        
        if (errors.length > 0) {
            setValidationErrors({});
            toast.error(errors[0].message);
            return false;
        }
        
        setValidationErrors({});
        return true;
    };

    const submit = (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        post(route('sales.store-products'), {
            onSuccess: () => {
                toast.success('Venda registrada com sucesso! Cliente receberá o link personalizado. 🎉');
            },
            onError: (errors) => {
                // Only show the first server-side validation error to avoid duplication
                const firstError = Object.values(errors)[0];
                if (firstError) {
                    toast.error(firstError);
                }
            },
        });
    };

    const paymentMethods = {
        pix: 'PIX',
        boleto: 'Boleto',
        cartao: 'Cartão',
        dinheiro: 'Dinheiro'
    };

    return (
        <>
            <Head title="Registrar Venda Completa" />

            <AuthenticatedLayout
                header={
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold">
                            ✨ Novo Pedido BBKits
                        </h2>
                        <p className="text-purple-100 mt-1">
                            Preencha todos os dados do pedido para gerar o link personalizado da cliente
                        </p>
                    </div>
                }
            >
                <div className="py-12 bg-gray-50 min-h-screen">
                    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                        <form onSubmit={submit} className="space-y-6">
                            {/* Cliente Section */}
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                    <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">👤</span>
                                    Dados da Cliente
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo *</label>
                                        <input
                                            type="text"
                                            name="client_name"
                                            value={data.client_name}
                                            onChange={e => setData('client_name', e.target.value)}
                                            className="w-full rounded-lg focus:ring-purple-500 border-gray-300 focus:border-purple-500"
                                            placeholder="Maria Silva"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">E-mail *</label>
                                        <input
                                            type="email"
                                            name="client_email"
                                            value={data.client_email}
                                            onChange={e => setData('client_email', e.target.value)}
                                            className="w-full rounded-lg focus:ring-purple-500 border-gray-300 focus:border-purple-500"
                                            placeholder="maria@email.com"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Telefone *</label>
                                        <input
                                            type="tel"
                                            value={data.client_phone}
                                            onChange={e => setData('client_phone', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                            placeholder="(11) 98765-4321"
                                            required
                                        />
                                    </div>

                                </div>
                            </div>

                            {/* Product Selection Section */}
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                    <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">🛍️</span>
                                    Seleção de Produto
                                </h3>
                                
                                {loadingOptions ? (
                                    <div className="flex justify-center items-center py-8">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                                        <span className="ml-3 text-gray-600">Carregando produtos...</span>
                                    </div>
                                ) : availableProducts.length === 0 ? (
                                    <div className="text-center py-8">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7h16" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum produto encontrado</h3>
                                        <p className="text-gray-500 mb-4">
                                            Não há produtos disponíveis no momento. Entre em contato com o administrador para adicionar produtos ao catálogo.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {availableProducts.map((product) => (
                                            <div
                                                key={product.id}
                                                onClick={() => handleCurrentProductChange(product.id)}
                                                className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-lg ${
                                                    currentProduct.product_id == product.id 
                                                        ? 'border-purple-500 bg-purple-50 shadow-md' 
                                                        : 'border-gray-200 hover:border-purple-300'
                                                }`}
                                            >
                                                {currentProduct.product_id == product.id && (
                                                    <div className="absolute top-2 right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                )}
                                                
                                                <div className="aspect-w-3 aspect-h-2 mb-4">
                                                    <img
                                                        src={product.image_url && product.image_url.trim() !== '' 
                                                            ? product.image_url 
                                                            : 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=200&fit=crop'}
                                                        alt={product.name}
                                                        className="w-full h-32 object-cover rounded-md transition-opacity duration-200"
                                                        onError={(e) => {
                                                            if (e.target.src !== 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=200&fit=crop') {
                                                                e.target.src = 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=200&fit=crop';
                                                            }
                                                        }}
                                                    />
                                                </div>
                                                
                                                <h4 className="font-semibold text-gray-900 mb-2">{product.name}</h4>
                                                <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                                                
                                                <div className="flex justify-between items-center">
                                                    <span className="text-lg font-bold text-purple-600">{formatBRL(product.price)}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                
                                {/* Product Customization & Add to Cart */}
                                {currentProduct.product_id && (
                                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                        <h4 className="font-medium text-blue-800 mb-4">Personalizar Produto: {currentProduct.product_name}</h4>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Tamanho</label>
                                                <select
                                                    value={currentProduct.size}
                                                    onChange={e => setCurrentProduct(prev => ({...prev, size: e.target.value}))}
                                                    className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                >
                                                    {Object.entries(sizePricing).map(([size, info]) => (
                                                        <option key={size} value={size}>
                                                            {info.name} {info.basePrice > 0 && `(+R$ ${info.basePrice})`}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={currentProduct.quantity}
                                                    onChange={e => setCurrentProduct(prev => ({...prev, quantity: parseInt(e.target.value) || 1}))}
                                                    className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-3">🎨 Design do Bordado</label>
                                            
                                            {loadingOptions ? (
                                                <div className="text-center py-8">
                                                    <div className="inline-flex items-center px-4 py-2 text-sm text-gray-600">
                                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Carregando designs...
                                                    </div>
                                                </div>
                                            ) : embroideryDesigns.length === 0 ? (
                                                <div className="text-center py-8 text-gray-500">
                                                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <p>Nenhum design disponível</p>
                                                </div>
                                            ) : (
                                                (() => {
                                                    const groupedDesigns = embroideryDesigns.reduce((groups, design) => {
                                                        const category = design.category || 'Outros';
                                                        if (!groups[category]) {
                                                            groups[category] = [];
                                                        }
                                                        groups[category].push(design);
                                                        return groups;
                                                    }, {});

                                                    const categoryIcons = {
                                                        'Animais': '🐾',
                                                        'Brasões': '🛡️',
                                                        'Iniciais': '🔤',
                                                        'Natureza': '🌿',
                                                        'Personagens': '👑',
                                                        'Outros': '🎨'
                                                    };

                                                    // Set first category as default if none selected
                                                    if (!selectedCategory && Object.keys(groupedDesigns).length > 0) {
                                                        setSelectedCategory(Object.keys(groupedDesigns)[0]);
                                                    }

                                                    return (
                                                        <div className="space-y-4">
                                                            {/* Category Tabs */}
                                                            <div className="flex flex-wrap gap-2">
                                                                {Object.entries(groupedDesigns).map(([category, designs]) => (
                                                                    <button
                                                                        key={category}
                                                                        type="button"
                                                                        onClick={() => setSelectedCategory(category)}
                                                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                                                                            selectedCategory === category
                                                                                ? 'bg-blue-600 text-white shadow-md'
                                                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                                        }`}
                                                                    >
                                                                        <span className="text-base">{categoryIcons[category] || '🎨'}</span>
                                                                        {category}
                                                                        <span className="bg-white/20 text-xs px-1.5 py-0.5 rounded-full">
                                                                            {designs.length}
                                                                        </span>
                                                                    </button>
                                                                ))}
                                                            </div>

                                                            {/* Selected Category Designs */}
                                                            {selectedCategory && groupedDesigns[selectedCategory] && (
                                                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-200">
                                                                        <h5 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                                                                            <span className="text-lg">{categoryIcons[selectedCategory] || '🎨'}</span>
                                                                            {selectedCategory}
                                                                            <span className="ml-2 px-2 py-1 text-xs bg-white text-gray-600 rounded-full">
                                                                                {groupedDesigns[selectedCategory].length} design{groupedDesigns[selectedCategory].length !== 1 ? 's' : ''}
                                                                            </span>
                                                                        </h5>
                                                                    </div>
                                                                    
                                                                    <div className="p-4">
                                                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                                                            {groupedDesigns[selectedCategory].map((design) => (
                                                                                <div
                                                                                    key={design.id}
                                                                                    onClick={() => setCurrentProduct(prev => ({...prev, embroidery_design: design.id}))}
                                                                                    className={`relative cursor-pointer rounded-lg border-2 p-3 transition-all hover:shadow-md ${
                                                                                        currentProduct.embroidery_design == design.id
                                                                                            ? 'border-blue-500 bg-blue-50 shadow-md'
                                                                                            : 'border-gray-200 hover:border-gray-300'
                                                                                    }`}
                                                                                >
                                                                                    <div className="aspect-square rounded-md overflow-hidden bg-gray-100 mb-2">
                                                                                        {design.image_url && design.image_url.trim() !== '' ? (
                                                                                            <img
                                                                                                src={design.image_url}
                                                                                                alt={design.name}
                                                                                                className="w-full h-full object-cover"
                                                                                                loading="lazy"
                                                                                                onError={(e) => {
                                                                                                    console.warn('Image failed to load:', design.image_url);
                                                                                                    e.target.src = '/images/placeholder-embroidery.svg';
                                                                                                    e.target.onerror = null; // Prevent infinite error loops
                                                                                                }}
                                                                                            />
                                                                                        ) : (
                                                                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                                                                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                                                                                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                                                                                </svg>
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                    
                                                                                    {currentProduct.embroidery_design == design.id && (
                                                                                        <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                                                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                                            </svg>
                                                                                        </div>
                                                                                    )}
                                                                                    
                                                                                    <div className="text-center">
                                                                                        <h4 className="text-sm font-medium text-gray-900 truncate" title={design.name}>
                                                                                            {design.name}
                                                                                        </h4>
                                                                                        {design.description && (
                                                                                            <p className="text-xs text-gray-500 mt-1 line-clamp-2" title={design.description}>
                                                                                                {design.description}
                                                                                            </p>
                                                                                        )}
                                                                                        {design.additional_cost > 0 && (
                                                                                            <span className="inline-block mt-1 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                                                                                                +R$ {design.additional_cost}
                                                                                            </span>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })()
                                            )}
                                            
                                            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-3">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <span className="text-blue-600">📝</span>
                                                    <span className="text-blue-700 font-medium">Nome para bordado:</span>
                                                    <span className="text-blue-900 font-semibold">
                                                        {data.child_name || 'Digite o nome da criança acima'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Fonte</label>
                                                <select
                                                    value={currentProduct.embroidery_font}
                                                    onChange={e => setCurrentProduct(prev => ({...prev, embroidery_font: e.target.value}))}
                                                    className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                    disabled={loadingOptions}
                                                >
                                                    {embroideryFonts.map((font) => (
                                                        <option key={font.id} value={font.id}>
                                                            {font.display_name || font.name}
                                                            {font.additional_cost > 0 && ` (+R$ ${font.additional_cost})`}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Cor</label>
                                                <select
                                                    value={currentProduct.embroidery_color}
                                                    onChange={e => setCurrentProduct(prev => ({...prev, embroidery_color: e.target.value}))}
                                                    className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                    disabled={loadingOptions}
                                                >
                                                    {embroideryColors.map((color) => (
                                                        <option key={color.id} value={color.id}>
                                                            {color.name}
                                                            {color.additional_cost > 0 && ` (+R$ ${color.additional_cost})`}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Posição</label>
                                                <select
                                                    value={currentProduct.embroidery_position}
                                                    onChange={e => setCurrentProduct(prev => ({...prev, embroidery_position: e.target.value}))}
                                                    className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                    disabled={loadingOptions}
                                                >
                                                    {embroideryPositions.map((position) => (
                                                        <option key={position.id} value={position.id}>
                                                            {position.display_name || position.name}
                                                            {position.additional_cost > 0 && ` (+R$ ${position.additional_cost})`}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        
                                        <div className="flex justify-between items-center">
                                            <div className="text-sm text-gray-600">
                                                {(() => {
                                                    const pricing = calculateCurrentProductPrice();
                                                    const { breakdown } = pricing;
                                                    return (
                                                        <div className="space-y-1">
                                                            <div>
                                                                Base: <span className="font-medium">{formatBRL(breakdown.basePrice || 0)}</span>
                                                                {breakdown.sizePrice > 0 && (
                                                                    <span> + Tamanho: <span className="font-medium">{formatBRL(breakdown.sizePrice)}</span></span>
                                                                )}
                                                                {breakdown.embroideryCost?.total > 0 && (
                                                                    <span> + Bordado: <span className="font-medium">{formatBRL(breakdown.embroideryCost.total)}</span></span>
                                                                )}
                                                            </div>
                                                            <div className="font-semibold text-purple-600">
                                                                Unitário: {formatBRL(pricing.unitTotal)} × {breakdown.quantity} = <span className="text-lg">{formatBRL(pricing.totalPrice)}</span>
                                                            </div>
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={addProductToCart}
                                                disabled={!currentProduct.product_id || !currentProduct.embroidery_design || !data.child_name?.trim()}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                                Adicionar ao Carrinho
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Baby's Name Section */}
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                    <span className="w-8 h-8 bg-pink-100 text-pink-600 rounded-lg flex items-center justify-center">👶</span>
                                    Dados da Criança
                                </h3>
                                
                                <div className="max-w-md">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nome da Criança *
                                        </label>
                                        <input
                                            type="text"
                                            name="child_name"
                                            value={data.child_name}
                                            onChange={e => {
                                                const newChildName = e.target.value;
                                                setData('child_name', newChildName);
                                                
                                                // Auto-sync to current product embroidery text
                                                if (currentProduct.product_id) {
                                                    setCurrentProduct(prev => ({...prev, embroidery_text: newChildName}));
                                                }
                                                
                                                // Auto-sync to ALL products already in cart
                                                if (data.products.length > 0) {
                                                    setData('products', data.products.map(product => ({
                                                        ...product,
                                                        embroidery_text: newChildName
                                                    })));
                                                }
                                            }}
                                            className="w-full rounded-lg focus:ring-purple-500 border-gray-300 focus:border-purple-500"
                                            placeholder="Helena"
                                            required
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Este nome será usado para personalizar todos os bordados do pedido
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Order Details Section */}
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                    <span className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">📋</span>
                                    Resumo do Pedido
                                </h3>
                                
                                {data.products && data.products.length > 0 ? (
                                    <div className="space-y-4">
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                            <h4 className="font-medium text-green-800 mb-4 flex items-center gap-2">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5M6 18a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4z" />
                                                </svg>
                                                Itens do Pedido ({data.products.length} {data.products.length === 1 ? 'item' : 'itens'})
                                            </h4>
                                            
                                            <div className="space-y-3">
                                                {data.products.map((product, index) => {
                                                    const selectedDesign = embroideryDesigns.find(d => d.id == product.embroidery_design);
                                                    return (
                                                        <div key={product.id || index} className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                                                            <div className="flex-shrink-0">
                                                                <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 border">
                                                                    {selectedDesign?.image_url && selectedDesign.image_url.trim() !== '' ? (
                                                                        <img
                                                                            src={selectedDesign.image_url}
                                                                            alt={selectedDesign.name}
                                                                            className="w-full h-full object-cover"
                                                                            onError={(e) => {
                                                                                e.target.src = '/images/placeholder-embroidery.svg';
                                                                                e.target.onerror = null; // Prevent infinite error loops
                                                                            }}
                                                                        />
                                                                    ) : (
                                                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                                                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                                                            </svg>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div className="flex-1 min-w-0">
                                                                <div className="font-medium text-gray-900 truncate">{product.product_name}</div>
                                                                <div className="text-sm text-gray-600 mt-1">
                                                                    <span className="inline-flex items-center gap-1 font-medium text-pink-600">
                                                                        👶 "{product.embroidery_text || data.child_name}"
                                                                    </span>
                                                                    <span className="ml-2 text-gray-500">
                                                                        • Tam: {product.size} • Qtd: {product.quantity}
                                                                    </span>
                                                                </div>
                                                                <div className="text-xs text-gray-500 mt-1">
                                                                    🎨 {selectedDesign?.name || 'Design'} • 
                                                                    {embroideryFonts.find(f => f.id == product.embroidery_font)?.display_name || 'Fonte'} • 
                                                                    {embroideryColors.find(c => c.id == product.embroidery_color)?.name || 'Cor'} • 
                                                                    {embroideryPositions.find(p => p.id == product.embroidery_position)?.display_name || 'Posição'}
                                                                </div>
                                                            </div>

                                                            <div className="text-right flex items-center gap-3">
                                                                <div>
                                                                    <div className="font-bold text-green-600">{formatBRL(product.total_price || 0)}</div>
                                                                    <div className="text-xs text-gray-500">
                                                                        {formatBRL(product.unit_total || (
                                                                            (parseFloat(product.unit_price || 0) + 
                                                                             parseFloat(product.size_price || 0) + 
                                                                             parseFloat(product.embroidery_cost || 0))
                                                                        ))} × {product.quantity}
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeProductFromCart(index)}
                                                                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                                                                    title="Remover item"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            
                                            <div className="mt-4 pt-4 border-t border-green-200">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-medium text-green-800">Subtotal dos Produtos:</span>
                                                    <span className="font-bold text-green-600 text-lg">
                                                        {formatBRL(data.products.reduce((sum, p) => sum + parseFloat(p.total_price || 0), 0))}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {data.products.length} {data.products.length === 1 ? 'produto' : 'produtos'} • 
                                                    Unidades: {data.products.reduce((sum, p) => sum + parseInt(p.quantity || 0), 0)}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                            <h4 className="font-medium text-blue-800 mb-2">💰 Valor Total do Pedido</h4>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span>Produtos:</span>
                                                    <span>{formatBRL(data.products.reduce((sum, p) => sum + parseFloat(p.total_price || 0), 0))}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span>Frete:</span>
                                                    <span>{formatBRL(parseFloat(data.shipping_amount || 0))}</span>
                                                </div>
                                                <div className="border-t border-blue-200 pt-2">
                                                    <div className="flex justify-between font-bold text-lg">
                                                        <span className="text-blue-800">Total:</span>
                                                        <span className="text-blue-600">
                                                            {formatBRL(
                                                                data.products.reduce((sum, p) => sum + parseFloat(p.total_price || 0), 0) + 
                                                                parseFloat(data.shipping_amount || 0)
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5M6 18a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4z" />
                                        </svg>
                                        <p className="text-lg font-medium">Nenhum produto no carrinho</p>
                                        <p className="text-sm">Adicione produtos acima para ver o resumo do pedido</p>
                                    </div>
                                )}
                            </div>

                            {/* Product Specifications Section */}
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                    <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">🎨</span>
                                    Especificações do Kit
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Mesa Livre (Detalhes) *
                                        </label>
                                        <textarea
                                            value={data.mesa_livre_details}
                                            onChange={e => setData('mesa_livre_details', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                            placeholder="Descreva os detalhes da mesa livre/trabalho personalizado..."
                                            rows="3"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Chaveiros *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.chaveiros}
                                            onChange={e => setData('chaveiros', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                            placeholder="Ex: 2 chaveiros personalizados"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Cor Principal do Kit *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.kit_main_color}
                                            onChange={e => setData('kit_main_color', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                            placeholder="Ex: Rosa, Azul, Amarelo..."
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Alças *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.alcas}
                                            onChange={e => setData('alcas', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                            placeholder="Ex: Alças em tecido rosa"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Faixa *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.faixa}
                                            onChange={e => setData('faixa', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                            placeholder="Ex: Faixa decorativa floral"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Friso *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.friso}
                                            onChange={e => setData('friso', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                            placeholder="Ex: Friso em tecido coordenado"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Viés *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.vies}
                                            onChange={e => setData('vies', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                            placeholder="Ex: Viés em cor contrastante"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Zíper *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.ziper}
                                            onChange={e => setData('ziper', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                            placeholder="Ex: Zíper invisível rosa"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Previsão de Produção *
                                        </label>
                                        <input
                                            type="date"
                                            value={data.production_estimate}
                                            onChange={e => setData('production_estimate', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                            min={new Date(Date.now() + 86400000).toISOString().split('T')[0]} // Tomorrow
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Previsão de Entrega *
                                        </label>
                                        <input
                                            type="date"
                                            value={data.delivery_estimate}
                                            onChange={e => setData('delivery_estimate', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                            min={data.production_estimate || new Date(Date.now() + 172800000).toISOString().split('T')[0]} // After production or day after tomorrow
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <span className="text-orange-500 text-lg">ℹ️</span>
                                        <div>
                                            <h4 className="text-orange-800 font-medium">Especificações Obrigatórias</h4>
                                            <p className="text-orange-700 text-sm">
                                                Todas estas especificações são necessárias para o controle de produção e inventário do kit personalizado.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Section */}
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6">💰 Informações de Pagamento</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Valor do Frete *</label>
                                        <input
                                            type="text"
                                            value={data.shipping_amount ? formatBRLNumber(data.shipping_amount) : ''}
                                            onChange={e => {
                                                const formatted = formatBrazilianCurrency(e.target.value);
                                                const parsed = parseBrazilianCurrencyValue(formatted);
                                                setData('shipping_amount', parsed);
                                            }}
                                            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                            placeholder="25,00"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Forma de Pagamento *</label>
                                        <select
                                            value={data.payment_method}
                                            onChange={e => setData('payment_method', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                            required
                                        >
                                            {Object.entries(paymentMethods).map(([value, label]) => (
                                                <option key={value} value={value}>{label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Valor Recebido *</label>
                                        <input
                                            type="text"
                                            value={data.received_amount ? formatBRLNumber(data.received_amount) : ''}
                                            onChange={e => {
                                                const formatted = formatBrazilianCurrency(e.target.value);
                                                const parsed = parseBrazilianCurrencyValue(formatted);
                                                setData('received_amount', parsed);
                                            }}
                                            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                            placeholder="150,00"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Data do Pagamento *</label>
                                        <input
                                            type="date"
                                            value={data.payment_date}
                                            onChange={e => setData('payment_date', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Delivery Address Section */}
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                    <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">📦</span>
                                    Endereço de Entrega
                                    <span className="text-sm font-normal text-gray-500">(Opcional - Cliente pode preencher depois)</span>
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Endereço
                                        </label>
                                        <input
                                            type="text"
                                            value={data.delivery_address}
                                            onChange={e => setData('delivery_address', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                            placeholder="Rua das Flores"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Número
                                        </label>
                                        <input
                                            type="text"
                                            value={data.delivery_number}
                                            onChange={e => setData('delivery_number', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                            placeholder="123"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Complemento
                                        </label>
                                        <input
                                            type="text"
                                            value={data.delivery_complement}
                                            onChange={e => setData('delivery_complement', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                            placeholder="Apto 12B"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Bairro
                                        </label>
                                        <input
                                            type="text"
                                            value={data.delivery_neighborhood}
                                            onChange={e => setData('delivery_neighborhood', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                            placeholder="Jardim Primavera"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Cidade
                                        </label>
                                        <input
                                            type="text"
                                            value={data.delivery_city}
                                            onChange={e => setData('delivery_city', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                            placeholder="São Paulo"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Estado
                                        </label>
                                        <select
                                            value={data.delivery_state}
                                            onChange={e => setData('delivery_state', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                        >
                                            <option value="">Selecione...</option>
                                            <option value="AC">Acre (AC)</option>
                                            <option value="AL">Alagoas (AL)</option>
                                            <option value="AP">Amapá (AP)</option>
                                            <option value="AM">Amazonas (AM)</option>
                                            <option value="BA">Bahia (BA)</option>
                                            <option value="CE">Ceará (CE)</option>
                                            <option value="DF">Distrito Federal (DF)</option>
                                            <option value="ES">Espírito Santo (ES)</option>
                                            <option value="GO">Goiás (GO)</option>
                                            <option value="MA">Maranhão (MA)</option>
                                            <option value="MT">Mato Grosso (MT)</option>
                                            <option value="MS">Mato Grosso do Sul (MS)</option>
                                            <option value="MG">Minas Gerais (MG)</option>
                                            <option value="PA">Pará (PA)</option>
                                            <option value="PB">Paraíba (PB)</option>
                                            <option value="PR">Paraná (PR)</option>
                                            <option value="PE">Pernambuco (PE)</option>
                                            <option value="PI">Piauí (PI)</option>
                                            <option value="RJ">Rio de Janeiro (RJ)</option>
                                            <option value="RN">Rio Grande do Norte (RN)</option>
                                            <option value="RS">Rio Grande do Sul (RS)</option>
                                            <option value="RO">Rondônia (RO)</option>
                                            <option value="RR">Roraima (RR)</option>
                                            <option value="SC">Santa Catarina (SC)</option>
                                            <option value="SP">São Paulo (SP)</option>
                                            <option value="SE">Sergipe (SE)</option>
                                            <option value="TO">Tocantins (TO)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            CEP
                                        </label>
                                        <input
                                            type="text"
                                            value={data.delivery_zipcode}
                                            onChange={e => setData('delivery_zipcode', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                            placeholder="01234-567"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Data Prevista de Entrega
                                        </label>
                                        <input
                                            type="date"
                                            value={data.estimated_delivery_date}
                                            onChange={e => setData('estimated_delivery_date', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Prazo de Entrega (dias)
                                        </label>
                                        <input
                                            type="number"
                                            value={data.delivery_days}
                                            onChange={e => setData('delivery_days', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                            placeholder="7"
                                            min="1"
                                        />
                                    </div>
                                </div>

                                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <span className="text-blue-500 text-lg">ℹ️</span>
                                        <div>
                                            <h4 className="text-blue-800 font-medium">Endereço Opcional</h4>
                                            <p className="text-blue-700 text-sm">
                                                O endereço pode ser preenchido agora ou depois pelo cliente através do link personalizado.
                                                Se deixar em branco, o cliente receberá um formulário para completar os dados de entrega.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-end">
                                <a
                                    href={route('sales.index')}
                                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-center"
                                >
                                    Cancelar
                                </a>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {processing ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processando...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Registrar Pedido
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}