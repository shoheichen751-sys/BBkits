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
        
        notes: ''
    });

    const [showPreview, setShowPreview] = useState(false);
    const [receiptPreview, setReceiptPreview] = useState(null);
    
    // Dynamic embroidery options from API
    const [embroideryFonts, setEmbroideryFonts] = useState([]);
    const [embroideryColors, setEmbroideryColors] = useState([]);
    const [embroideryPositions, setEmbroideryPositions] = useState([]);
    const [availableProducts, setAvailableProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [loadingOptions, setLoadingOptions] = useState(true);
    const [totalWithEmbroidery, setTotalWithEmbroidery] = useState(0);
    
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
        embroidery_position: ''
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
                
                const [fontsRes, colorsRes, positionsRes, productsRes] = await Promise.all([
                    axios.get('/api/embroidery/fonts'),
                    axios.get('/api/embroidery/colors'),
                    axios.get('/api/embroidery/positions'),
                    axios.get('/api/products')
                ]);
                
                setEmbroideryFonts(fontsRes.data);
                setEmbroideryColors(colorsRes.data);
                setEmbroideryPositions(positionsRes.data);
                setAvailableProducts(productsRes.data);
                
                // Set default values for current product being added
                setCurrentProduct(prev => ({
                    ...prev,
                    embroidery_font: fontsRes.data.length > 0 ? fontsRes.data[0].id : '',
                    embroidery_color: colorsRes.data.length > 0 ? colorsRes.data[0].id : '',
                    embroidery_position: positionsRes.data.length > 0 ? positionsRes.data[0].id : ''
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
    
    // Handle product selection for current product being added
    const handleCurrentProductChange = (productId) => {
        const selectedProd = availableProducts.find(p => p.id == productId);
        if (selectedProd) {
            setCurrentProduct(prev => ({
                ...prev,
                product_id: productId,
                product_name: selectedProd.name,
                product_category: selectedProd.product_category ? selectedProd.product_category.name : 'N/A',
                unit_price: parseFloat(selectedProd.price || 0),
                embroidery_text: data.child_name || '' // Auto-fill child name
            }));
            setSelectedProduct(selectedProd);
        }
    };
    
    // Add current product to cart
    const addProductToCart = () => {
        if (!currentProduct.product_id) {
            toast.error('Por favor, selecione um produto');
            return;
        }
        
        if (!currentProduct.embroidery_text.trim()) {
            toast.error('Por favor, digite o nome para bordado');
            return;
        }
        
        // Calculate product total with embroidery and size pricing
        const sizePrice = sizePricing[currentProduct.size]?.basePrice || 0;
        
        let embroideryCost = 0;
        const selectedFont = embroideryFonts.find(f => f.id == currentProduct.embroidery_font);
        const selectedColor = embroideryColors.find(c => c.id == currentProduct.embroidery_color);
        const selectedPosition = embroideryPositions.find(p => p.id == currentProduct.embroidery_position);
        
        if (selectedFont) embroideryCost += parseFloat(selectedFont.additional_cost || 0);
        if (selectedColor) embroideryCost += parseFloat(selectedColor.additional_cost || 0);
        if (selectedPosition) embroideryCost += parseFloat(selectedPosition.additional_cost || 0);
        
        const productTotal = (currentProduct.unit_price + sizePrice + embroideryCost) * currentProduct.quantity;
        
        // Add to cart
        const newProduct = {
            ...currentProduct,
            id: Date.now(), // Unique ID for cart item
            size_price: sizePrice,
            embroidery_cost: embroideryCost,
            total_price: productTotal
        };
        
        setData('products', [...data.products, newProduct]);
        
        // Reset current product form
        setCurrentProduct({
            product_id: '',
            product_name: '',
            product_category: '',
            size: 'P',
            quantity: 1,
            unit_price: 0,
            has_embroidery: true,
            embroidery_text: '',
            embroidery_font: embroideryFonts.length > 0 ? embroideryFonts[0].id : '',
            embroidery_color: embroideryColors.length > 0 ? embroideryColors[0].id : '',
            embroidery_position: embroideryPositions.length > 0 ? embroideryPositions[0].id : ''
        });
        
        toast.success('Produto adicionado ao carrinho!');
    };
    
    // Remove product from cart
    const removeProductFromCart = (productIndex) => {
        const updatedProducts = data.products.filter((_, index) => index !== productIndex);
        setData('products', updatedProducts);
        toast.success('Produto removido do carrinho!');
    };
    
    // Calculate total from all products in cart plus shipping
    useEffect(() => {
        const calculateTotal = () => {
            const productsTotal = data.products.reduce((sum, product) => sum + product.total_price, 0);
            const shippingAmount = parseFloat(data.shipping_amount || 0);
            const totalAmount = productsTotal + shippingAmount;
            setTotalWithEmbroidery(totalAmount);
            setData('total_amount', totalAmount.toFixed(2));
        };
        
        calculateTotal();
    }, [data.products, data.shipping_amount]);

    const handleReceiptChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('payment_receipt', file);
            
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setReceiptPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Use centralized Brazilian currency utilities (rename to avoid conflicts)
    const formatBrazilianCurrency = formatBrazilianCurrencyInput;
    const parseBrazilianCurrencyValue = parseBrazilianCurrency;

    const validateForm = () => {
        const requiredFields = [
            'client_name', 'client_email', 'client_phone',
            'child_name', 'shipping_amount', 'received_amount', 'payment_date', 'payment_method'
        ];
        
        // Check if products array has items
        if (data.products && data.products.length === 0) {
            toast.error('Por favor, adicione pelo menos um produto ao carrinho');
            return;
        }

        const missingFields = requiredFields.filter(field => !data[field]);
        
        if (missingFields.length > 0) {
            toast.error('Por favor, preencha todos os campos obrigatórios');
            return false;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.client_email)) {
            toast.error('Por favor, insira um e-mail válido');
            return false;
        }

        // Validate phone
        const phoneRegex = /^\d{10,11}$/;
        const cleanPhone = data.client_phone.replace(/\D/g, '');
        if (!phoneRegex.test(cleanPhone)) {
            toast.error('Por favor, insira um telefone válido');
            return false;
        }

        // Validate CPF
        const cpfRegex = /^\d{11}$/;
        const cleanCPF = data.client_cpf.replace(/\D/g, '');
        if (data.client_cpf && !cpfRegex.test(cleanCPF)) {
            toast.error('Por favor, insira um CPF válido');
            return false;
        }

        // Validate amounts
        if (parseFloat(data.received_amount) > parseFloat(data.total_amount)) {
            toast.error('Valor recebido não pode ser maior que o valor total');
            return false;
        }

        return true;
    };

    const submit = (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        post(route('sales.store'), {
            onSuccess: () => {
                toast.success('Venda registrada com sucesso! Cliente receberá o link personalizado. 🎉');
            },
            onError: (errors) => {
                Object.keys(errors).forEach(key => {
                    toast.error(errors[key]);
                });
            },
        });
    };

    const formatPhone = (value) => {
        const cleaned = value.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
        if (match) {
            return `(${match[1]}) ${match[2]}-${match[3]}`;
        }
        const match2 = cleaned.match(/^(\d{2})(\d{4})(\d{4})$/);
        if (match2) {
            return `(${match2[1]}) ${match2[2]}-${match2[3]}`;
        }
        return value;
    };

    const formatCPF = (value) => {
        const cleaned = value.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);
        if (match) {
            return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`;
        }
        return value;
    };

    const formatCEP = (value) => {
        const cleaned = value.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{5})(\d{3})$/);
        if (match) {
            return `${match[1]}-${match[2]}`;
        }
        return value;
    };

    const handleProductSelect = (product) => {
        setSelectedProduct(product);
        
        // Auto-populate form fields with validation
        const newData = {
            ...data,
            product_category: product.category_id || product.product_category?.id,
            product_price: product.price ? product.price.toString() : '0',
            product_size: product.available_sizes?.[0] || 'P' // Default to first available size
        };
        
        setData(newData);
    };

    const paymentMethods = {
        pix: 'PIX',
        boleto: 'Boleto',
        cartao: 'Cartão',
        dinheiro: 'Dinheiro'
    };

    const states = [
        'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
        'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
        'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
    ];

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
                                    <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                                        👤
                                    </span>
                                    Dados da Cliente
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nome Completo *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.client_name}
                                            onChange={e => setData('client_name', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                            placeholder="Maria Silva"
                                            required
                                        />
                                        {errors.client_name && (
                                            <p className="text-red-500 text-sm mt-1">{errors.client_name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            E-mail *
                                        </label>
                                        <input
                                            type="email"
                                            value={data.client_email}
                                            onChange={e => setData('client_email', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                            placeholder="maria@email.com"
                                            required
                                        />
                                        {errors.client_email && (
                                            <p className="text-red-500 text-sm mt-1">{errors.client_email}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Telefone *
                                        </label>
                                        <input
                                            type="tel"
                                            value={data.client_phone}
                                            onChange={e => setData('client_phone', formatPhone(e.target.value))}
                                            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                            placeholder="(11) 98765-4321"
                                            required
                                        />
                                        {errors.client_phone && (
                                            <p className="text-red-500 text-sm mt-1">{errors.client_phone}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            CPF
                                        </label>
                                        <input
                                            type="text"
                                            value={data.client_cpf}
                                            onChange={e => setData('client_cpf', formatCPF(e.target.value))}
                                            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                            placeholder="123.456.789-00"
                                        />
                                        {errors.client_cpf && (
                                            <p className="text-red-500 text-sm mt-1">{errors.client_cpf}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Product Selection Section */}
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                    <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                                        🛍️
                                    </span>
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
                                                onClick={() => handleProductSelect(product)}
                                                className={`
                                                    relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-lg
                                                    ${selectedProduct?.id === product.id 
                                                        ? 'border-purple-500 bg-purple-50 shadow-md' 
                                                        : 'border-gray-200 hover:border-purple-300'
                                                    }
                                                `}
                                            >
                                                {selectedProduct?.id === product.id && (
                                                    <div className="absolute top-2 right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                )}
                                                
                                                <div className="aspect-w-3 aspect-h-2 mb-4">
                                                    <img
                                                        src={product.image_url || 'https://via.placeholder.com/300x200/E5E7EB/9CA3AF?text=Sem+Imagem'}
                                                        alt={product.name}
                                                        className="w-full h-32 object-cover rounded-md"
                                                        onError={(e) => {
                                                            e.target.src = 'https://via.placeholder.com/300x200/E5E7EB/9CA3AF?text=Sem+Imagem';
                                                        }}
                                                    />
                                                </div>
                                                
                                                <h4 className="font-semibold text-gray-900 mb-2">{product.name}</h4>
                                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                                                
                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-lg font-bold text-purple-600">
                                                            {formatBRL(product.price)}
                                                        </span>
                                                        <span className="text-sm text-gray-500">
                                                            Est: {product.stock_quantity}
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="flex flex-wrap gap-1">
                                                        <span className="text-xs text-gray-500">Tamanhos:</span>
                                                        {product.available_sizes?.map((size) => (
                                                            <span key={size} className="px-2 py-1 bg-gray-100 text-xs rounded">
                                                                {size}
                                                            </span>
                                                        ))}
                                                    </div>
                                                    
                                                    {product.allows_embroidery && (
                                                        <div className="flex items-center gap-1">
                                                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                                                ✨ Aceita bordado
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                
                                {selectedProduct && (
                                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span className="font-medium text-green-800">Produto Selecionado:</span>
                                        </div>
                                        <p className="text-green-700">
                                            <strong>{selectedProduct.name}</strong> - {formatBRL(selectedProduct.price)}
                                        </p>
                                        <p className="text-sm text-green-600">
                                            Os campos de produto foram preenchidos automaticamente abaixo.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Pagamento Section with Product Info */}
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                    <span className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                                        💰
                                    </span>
                                    Seleção de Produtos
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Produto *
                                        </label>
                                        <select
                                            value={data.product_id}
                                            onChange={e => handleProductChange(e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                            disabled={loadingOptions}
                                            required
                                        >
                                            <option value="">Selecione um produto</option>
                                            {loadingOptions ? (
                                                <option>Carregando...</option>
                                            ) : (
                                                availableProducts.map((product) => (
                                                    <option key={product.id} value={product.id}>
                                                        {product.name} - {formatBRL(product.price)}
                                                    </option>
                                                ))
                                            )}
                                        </select>
                                        {errors.product_id && (
                                            <p className="text-red-500 text-sm mt-1">{errors.product_id}</p>
                                        )}
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Categoria
                                        </label>
                                        <input
                                            type="text"
                                            value={data.product_category}
                                            className="w-full rounded-lg border-gray-300 bg-gray-50 text-gray-600"
                                            placeholder="Será preenchida automaticamente"
                                            disabled
                                            readOnly
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Tamanho *
                                        </label>
                                        <select
                                            value={data.product_size}
                                            onChange={e => setData('product_size', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                            required
                                        >
                                            {selectedProduct ? (
                                                selectedProduct.available_sizes?.map((size) => {
                                                    const sizeInfo = sizePricing[size] || { name: size, basePrice: 0 };
                                                    return (
                                                        <option key={size} value={size}>
                                                            {sizeInfo.name} {sizeInfo.basePrice > 0 && formatAdditionalCost(sizeInfo.basePrice)}
                                                        </option>
                                                    );
                                                })
                                            ) : (
                                                Object.entries(sizePricing).map(([size, info]) => (
                                                    <option key={size} value={size}>
                                                        {info.name} {info.basePrice > 0 && formatAdditionalCost(info.basePrice)}
                                                    </option>
                                                ))
                                            )}
                                        </select>
                                        {errors.product_size && (
                                            <p className="text-red-500 text-sm mt-1">{errors.product_size}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Preço Base do Produto *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.product_price ? formatBRL(data.product_price) : ''}
                                            className="w-full rounded-lg border-gray-300 bg-gray-50 text-gray-600"
                                            placeholder="Será preenchido automaticamente"
                                            disabled
                                            readOnly
                                        />
                                        {errors.product_price && (
                                            <p className="text-red-500 text-sm mt-1">{errors.product_price}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Total Calculado
                                        </label>
                                        <div className="w-full rounded-lg border-gray-300 bg-gray-50 px-3 py-2 text-gray-700">
                                            {formatBRL(totalWithEmbroidery)}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Preço base + tamanho + bordado
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Valor do Frete *
                                        </label>
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
                                        {errors.shipping_amount && (
                                            <p className="text-red-500 text-sm mt-1">{errors.shipping_amount}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Forma de Pagamento *
                                        </label>
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
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Valor Recebido *
                                        </label>
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
                                        {errors.received_amount && (
                                            <p className="text-red-500 text-sm mt-1">{errors.received_amount}</p>
                                        )}
                                        {data.received_amount && data.total_amount && (
                                            <p className="text-sm text-gray-600 mt-1">
                                                {parseFloat(data.received_amount) < parseFloat(data.total_amount) ? (
                                                    <span className="text-orange-600">
                                                        ⚠️ Pagamento parcial - Restante: {formatBRL(parseFloat(data.total_amount) - parseFloat(data.received_amount))}
                                                    </span>
                                                ) : (
                                                    <span className="text-green-600">
                                                        ✅ Pagamento completo
                                                    </span>
                                                )}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Data do Pagamento *
                                        </label>
                                        <input
                                            type="date"
                                            value={data.payment_date}
                                            onChange={e => setData('payment_date', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                            required
                                        />
                                        {errors.payment_date && (
                                            <p className="text-red-500 text-sm mt-1">{errors.payment_date}</p>
                                        )}
                                    </div>

                                    {/* Payment Receipt Upload */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Comprovante de Pagamento
                                        </label>
                                        <input
                                            type="file"
                                            onChange={handleReceiptChange}
                                            accept="image/*,.pdf"
                                            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                        />
                                        {errors.payment_receipt && (
                                            <p className="text-red-500 text-sm mt-1">{errors.payment_receipt}</p>
                                        )}
                                        {receiptPreview && (
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-600 mb-2">Pré-visualização:</p>
                                                <img 
                                                    src={receiptPreview} 
                                                    alt="Comprovante de pagamento" 
                                                    className="max-w-xs max-h-32 object-contain rounded-lg border"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Bordado Section */}
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                    <span className="w-8 h-8 bg-pink-100 text-pink-600 rounded-lg flex items-center justify-center">
                                        🎨
                                    </span>
                                    Personalização do Bordado
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nome da Criança *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.child_name}
                                            onChange={e => setData('child_name', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                            placeholder="Helena"
                                            required
                                        />
                                        {errors.child_name && (
                                            <p className="text-red-500 text-sm mt-1">{errors.child_name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Posição do Bordado
                                        </label>
                                        <select
                                            value={data.embroidery_position}
                                            onChange={e => setData('embroidery_position', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                            disabled={loadingOptions}
                                        >
                                            {loadingOptions ? (
                                                <option>Carregando...</option>
                                            ) : (
                                                embroideryPositions.map((position) => (
                                                    <option key={position.id} value={position.id}>
                                                        {position.display_name || position.name}
                                                        {position.additional_cost > 0 && formatAdditionalCost(position.additional_cost)}
                                                    </option>
                                                ))
                                            )}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Cor do Bordado
                                        </label>
                                        <select
                                            value={data.embroidery_color}
                                            onChange={e => setData('embroidery_color', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                            disabled={loadingOptions}
                                        >
                                            {loadingOptions ? (
                                                <option>Carregando...</option>
                                            ) : (
                                                embroideryColors.map((color) => (
                                                    <option key={color.id} value={color.id}>
                                                        {color.name}
                                                        {color.additional_cost > 0 && formatAdditionalCost(color.additional_cost)}
                                                    </option>
                                                ))
                                            )}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Fonte do Bordado
                                        </label>
                                        <select
                                            value={data.embroidery_font}
                                            onChange={e => setData('embroidery_font', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                            disabled={loadingOptions}
                                        >
                                            {loadingOptions ? (
                                                <option>Carregando...</option>
                                            ) : (
                                                embroideryFonts.map((font) => (
                                                    <option key={font.id} value={font.id}>
                                                        {font.display_name || font.name}
                                                        {font.additional_cost > 0 && formatAdditionalCost(font.additional_cost)}
                                                    </option>
                                                ))
                                            )}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Entrega Section */}
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                    <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                                        📦
                                    </span>
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
                                            {states.map(state => (
                                                <option key={state} value={state}>{state}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            CEP
                                        </label>
                                        <input
                                            type="text"
                                            value={data.delivery_zipcode}
                                            onChange={e => setData('delivery_zipcode', formatCEP(e.target.value))}
                                            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                            placeholder="01234-567"
                                        />
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
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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