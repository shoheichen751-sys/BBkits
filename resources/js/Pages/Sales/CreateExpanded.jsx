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
    const [validationErrors, setValidationErrors] = useState({});
    
    // Dynamic embroidery options from API
    const [embroideryFonts, setEmbroideryFonts] = useState([]);
    const [embroideryColors, setEmbroideryColors] = useState([]);
    const [embroideryPositions, setEmbroideryPositions] = useState([]);
    const [embroideryDesigns, setEmbroideryDesigns] = useState([]);
    const [availableProducts, setAvailableProducts] = useState([]);
    const [loadingOptions, setLoadingOptions] = useState(true);
    
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
    
    // Calculate real-time price for current product being customized
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
                embroidery_text: data.child_name || '' // Auto-fill with current child name
            }));
            // Product selected for customization
        }
    };
    
    // Add current product to cart
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
        
        // Calculate product total with embroidery and size pricing - ensure all values are numbers
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
        
        console.log('🧮 Calculation Debug:', {
            basePrice, sizePrice, embroideryCost, quantity, unitTotal, productTotal,
            fontCost: selectedFont?.additional_cost || 0,
            colorCost: selectedColor?.additional_cost || 0,
            positionCost: selectedPosition?.additional_cost || 0
        });
        
        // Add to cart with properly calculated values
        const newProduct = {
            ...currentProduct,
            id: Date.now(), // Unique ID for cart item
            unit_price: basePrice, // Ensure it's a number
            size_price: sizePrice,
            embroidery_cost: embroideryCost,
            quantity: quantity,
            unit_total: unitTotal, // Price per unit including all costs
            total_price: productTotal // Total price including quantity
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
            embroidery_text: data.child_name || '',
            embroidery_font: embroideryFonts.length > 0 ? embroideryFonts[0].id : '',
            embroidery_color: embroideryColors.length > 0 ? embroideryColors[0].id : '',
            embroidery_position: embroideryPositions.length > 0 ? embroideryPositions[0].id : '',
            embroidery_design: embroideryDesigns.length > 0 ? embroideryDesigns[0].id : ''
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
            const productsTotal = data.products.reduce((sum, product) => sum + parseFloat(product.total_price || 0), 0);
            const shippingAmount = parseFloat(data.shipping_amount || 0);
            const totalAmount = productsTotal + shippingAmount;
            setData('total_amount', totalAmount.toFixed(2));
            
            console.log('💰 Total Calculation:', {
                productsCount: data.products.length,
                productsTotal,
                shippingAmount,
                totalAmount,
                products: data.products.map(p => ({ 
                    name: p.product_name, 
                    total: p.total_price, 
                    qty: p.quantity 
                }))
            });
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
        const errors = [];
        
        // 1. Validate Cart/Products First (most important)
        if (!data.products || data.products.length === 0) {
            errors.push({
                field: 'products',
                message: '🛍️ Por favor, adicione pelo menos um produto ao carrinho',
                section: 'Produtos'
            });
        } else {
            // Validate each product in cart
            data.products.forEach((product, index) => {
                if (!product.embroidery_design) {
                    errors.push({
                        field: `products[${index}].embroidery_design`,
                        message: `🎨 Produto "${product.product_name}" precisa de um design para bordado`,
                        section: 'Produtos'
                    });
                }
                // embroidery_text is now auto-synced from child_name, no need to validate separately
            });
        }
        
        // 2. Validate Client Information
        if (!data.client_name || !data.client_name.trim()) {
            errors.push({
                field: 'client_name',
                message: '👤 Nome da cliente é obrigatório',
                section: 'Dados da Cliente'
            });
        }
        
        if (!data.client_email || !data.client_email.trim()) {
            errors.push({
                field: 'client_email', 
                message: '📧 E-mail da cliente é obrigatório',
                section: 'Dados da Cliente'
            });
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.client_email)) {
                errors.push({
                    field: 'client_email',
                    message: '📧 Por favor, insira um e-mail válido (ex: cliente@email.com)',
                    section: 'Dados da Cliente'
                });
            }
        }
        
        if (!data.client_phone || !data.client_phone.trim()) {
            errors.push({
                field: 'client_phone',
                message: '📱 Telefone da cliente é obrigatório',
                section: 'Dados da Cliente'
            });
        } else {
            const phoneRegex = /^\d{10,11}$/;
            const cleanPhone = data.client_phone.replace(/\D/g, '');
            if (!phoneRegex.test(cleanPhone)) {
                errors.push({
                    field: 'client_phone',
                    message: '📱 Telefone deve ter 10 ou 11 dígitos (ex: (11) 98765-4321)',
                    section: 'Dados da Cliente'
                });
            }
        }
        
        // Validate CPF if provided
        if (data.client_cpf && data.client_cpf.trim()) {
            const cpfRegex = /^\d{11}$/;
            const cleanCPF = data.client_cpf.replace(/\D/g, '');
            if (!cpfRegex.test(cleanCPF)) {
                errors.push({
                    field: 'client_cpf',
                    message: '🆔 CPF deve ter 11 dígitos (ex: 123.456.789-00)',
                    section: 'Dados da Cliente'
                });
            }
        }
        
        // 3. Validate Child Information
        if (!data.child_name || !data.child_name.trim()) {
            errors.push({
                field: 'child_name',
                message: '👶 Nome da criança é obrigatório para personalização',
                section: 'Dados da Criança'
            });
        }
        
        // 4. Validate Payment Information
        if (!data.shipping_amount || parseFloat(data.shipping_amount) < 0) {
            errors.push({
                field: 'shipping_amount',
                message: '🚚 Valor do frete é obrigatório e deve ser maior ou igual a zero',
                section: 'Pagamento'
            });
        }
        
        if (!data.received_amount || parseFloat(data.received_amount) <= 0) {
            errors.push({
                field: 'received_amount',
                message: '💰 Valor recebido é obrigatório e deve ser maior que zero',
                section: 'Pagamento'
            });
        }
        
        if (!data.payment_date) {
            errors.push({
                field: 'payment_date',
                message: '📅 Data do pagamento é obrigatória',
                section: 'Pagamento'
            });
        }
        
        if (!data.payment_method) {
            errors.push({
                field: 'payment_method',
                message: '💳 Forma de pagamento deve ser selecionada',
                section: 'Pagamento'
            });
        }
        
        // 5. Validate Amount Logic
        const totalAmount = parseFloat(data.total_amount || 0);
        const receivedAmount = parseFloat(data.received_amount || 0);
        
        if (receivedAmount > totalAmount && totalAmount > 0) {
            errors.push({
                field: 'received_amount',
                message: `💰 Valor recebido (${formatBRL(receivedAmount)}) não pode ser maior que o total (${formatBRL(totalAmount)})`,
                section: 'Pagamento'
            });
        }
        
        // Display errors if any
        if (errors.length > 0) {
            // Set validation error state for field highlighting
            const errorFields = {};
            errors.forEach(error => {
                errorFields[error.field] = error.message;
            });
            setValidationErrors(errorFields);
            
            // Show first error as main message
            toast.error(errors[0].message);
            
            // Log all errors for debugging
            console.log('❌ Validation Errors:', errors);
            
            // If multiple errors, show summary
            if (errors.length > 1) {
                setTimeout(() => {
                    toast.error(`⚠️ Total de ${errors.length} erros encontrados. Verifique todos os campos destacados.`);
                }, 1000);
            }
            
            // Scroll to first error field
            setTimeout(() => {
                const firstErrorField = document.querySelector(`[name="${errors[0].field}"], #${errors[0].field}`);
                if (firstErrorField) {
                    firstErrorField.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                    firstErrorField.focus();
                }
            }, 500);
            
            return false;
        }
        
        // Clear validation errors on success
        setValidationErrors({});
        console.log('✅ Form validation passed');
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

    // Removed old handleProductSelect function - replaced by cart system

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
                                            name="client_name"
                                            value={data.client_name}
                                            onChange={e => {
                                                setData('client_name', e.target.value);
                                                // Clear error when user starts typing
                                                if (validationErrors.client_name) {
                                                    setValidationErrors(prev => ({ ...prev, client_name: undefined }));
                                                }
                                            }}
                                            className={`w-full rounded-lg focus:ring-purple-500 ${
                                                validationErrors.client_name 
                                                    ? 'border-red-500 focus:border-red-500 bg-red-50' 
                                                    : 'border-gray-300 focus:border-purple-500'
                                            }`}
                                            placeholder="Maria Silva"
                                            required
                                        />
                                        {(errors.client_name || validationErrors.client_name) && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {validationErrors.client_name || errors.client_name}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            E-mail *
                                        </label>
                                        <input
                                            type="email"
                                            name="client_email"
                                            value={data.client_email}
                                            onChange={e => {
                                                setData('client_email', e.target.value);
                                                if (validationErrors.client_email) {
                                                    setValidationErrors(prev => ({ ...prev, client_email: undefined }));
                                                }
                                            }}
                                            className={`w-full rounded-lg focus:ring-purple-500 ${
                                                validationErrors.client_email 
                                                    ? 'border-red-500 focus:border-red-500 bg-red-50' 
                                                    : 'border-gray-300 focus:border-purple-500'
                                            }`}
                                            placeholder="maria@email.com"
                                            required
                                        />
                                        {(errors.client_email || validationErrors.client_email) && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {validationErrors.client_email || errors.client_email}
                                            </p>
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
                                                onClick={() => handleCurrentProductChange(product.id)}
                                                className={`
                                                    relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-lg
                                                    ${currentProduct.product_id == product.id 
                                                        ? 'border-purple-500 bg-purple-50 shadow-md' 
                                                        : 'border-gray-200 hover:border-purple-300'
                                                    }
                                                `}
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
                                
                                {/* Product Customization & Add to Cart */}
                                {currentProduct.product_id && (
                                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                        <h4 className="font-medium text-blue-800 mb-4 flex items-center gap-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                                            </svg>
                                            Personalizar Produto: {currentProduct.product_name}
                                        </h4>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">🎨 Design do Bordado</label>
                                                <select
                                                    value={currentProduct.embroidery_design}
                                                    onChange={e => setCurrentProduct(prev => ({...prev, embroidery_design: e.target.value}))}
                                                    className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 mb-4"
                                                    disabled={loadingOptions}
                                                >
                                                    <option value="">Selecione um design</option>
                                                    {embroideryDesigns.map((design) => (
                                                        <option key={design.id} value={design.id}>
                                                            {design.name} - {design.description}
                                                        </option>
                                                    ))}
                                                </select>
                                                
                                                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <span className="text-blue-600">📝</span>
                                                        <span className="text-blue-700 font-medium">Nome para bordado:</span>
                                                        <span className="text-blue-900 font-semibold">
                                                            {data.child_name || 'Digite o nome da criança abaixo'}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-blue-600 mt-1">
                                                        O nome será automaticamente usado para todos os bordados
                                                    </p>
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
                                
                                {/* Shopping Cart */}
                                {data.products && data.products.length > 0 && (
                                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                        <h4 className="font-medium text-green-800 mb-4 flex items-center gap-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5M6 18a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4z" />
                                            </svg>
                                            Carrinho ({data.products.length} {data.products.length === 1 ? 'item' : 'itens'})
                                        </h4>
                                        
                                        <div className="space-y-3">
                                            {data.products.map((product, index) => (
                                                <div key={product.id || index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                                                    <div className="flex-1">
                                                        <div className="font-medium text-gray-900">{product.product_name}</div>
                                                        <div className="text-sm text-gray-600">
                                                            {product.embroidery_text} • Tamanho: {product.size} • Qtd: {product.quantity}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {embroideryDesigns.find(d => d.id == product.embroidery_design)?.name || 'Sem design'} • 
                                                            {embroideryFonts.find(f => f.id == product.embroidery_font)?.display_name || 'Fonte'} • 
                                                            {embroideryColors.find(c => c.id == product.embroidery_color)?.name || 'Cor'} • 
                                                            {embroideryPositions.find(p => p.id == product.embroidery_position)?.display_name || 'Posição'}
                                                        </div>
                                                    </div>
                                                    <div className="text-right mr-4">
                                                        <div className="font-bold text-green-600">{formatBRL(product.total_price || 0)}</div>
                                                        <div className="text-xs text-gray-500">
                                                            {formatBRL(product.unit_total || (
                                                                (parseFloat(product.unit_price || 0) + 
                                                                 parseFloat(product.size_price || 0) + 
                                                                 parseFloat(product.embroidery_cost || 0))
                                                            ))} × {product.quantity}
                                                        </div>
                                                        <div className="text-xs text-gray-400">
                                                            Base: {formatBRL(product.unit_price || 0)}
                                                            {product.size_price > 0 && ` +${formatBRL(product.size_price)}`}
                                                            {product.embroidery_cost > 0 && ` +${formatBRL(product.embroidery_cost)}`}
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeProductFromCart(index)}
                                                        className="text-red-600 hover:text-red-800 p-1"
                                                        title="Remover item"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        <div className="mt-4 pt-4 border-t border-green-200">
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium text-green-800">Total dos Produtos:</span>
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
                                )}
                            </div>

                            {/* Pagamento Section */}
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                    <span className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                                        💰
                                    </span>
                                    Informações de Pagamento
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Total dos Produtos
                                        </label>
                                        <div className="w-full rounded-lg border-gray-300 bg-gray-50 px-3 py-2 text-gray-700 font-semibold">
                                            {formatBRL(data.products.reduce((sum, p) => sum + parseFloat(p.total_price || 0), 0))}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {data.products.length} {data.products.length === 1 ? 'produto' : 'produtos'} no carrinho
                                        </p>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Total Geral (Produtos + Frete)
                                        </label>
                                        <div className="w-full rounded-lg border-gray-300 bg-green-50 px-3 py-2 text-green-700 font-bold text-lg">
                                            {formatBRL(
                                                data.products.reduce((sum, p) => sum + parseFloat(p.total_price || 0), 0) + 
                                                parseFloat(data.shipping_amount || 0)
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Este é o valor total que a cliente pagará
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
                                        {/* Simplified payment status message - stable rendering */}
                                        {data.received_amount && data.total_amount && parseFloat(data.received_amount) > 0 && parseFloat(data.total_amount) > 0 && (
                                            <div className="text-sm mt-1">
                                                {parseFloat(data.received_amount) < parseFloat(data.total_amount) ? (
                                                    <div className="text-orange-600">
                                                        ⚠️ Pagamento parcial - Restante: {formatBRL(parseFloat(data.total_amount) - parseFloat(data.received_amount))}
                                                    </div>
                                                ) : (
                                                    <div className="text-green-600">
                                                        ✅ Pagamento completo
                                                    </div>
                                                )}
                                            </div>
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

                            {/* Global Child Name Section */}
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                    <span className="w-8 h-8 bg-pink-100 text-pink-600 rounded-lg flex items-center justify-center">
                                        👶
                                    </span>
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
                                                
                                                // Clear validation error
                                                if (validationErrors.child_name) {
                                                    setValidationErrors(prev => ({ ...prev, child_name: undefined }));
                                                }
                                            }}
                                            className={`w-full rounded-lg focus:ring-purple-500 ${
                                                validationErrors.child_name 
                                                    ? 'border-red-500 focus:border-red-500 bg-red-50' 
                                                    : 'border-gray-300 focus:border-purple-500'
                                            }`}
                                            placeholder="Helena"
                                            required
                                        />
                                        {(errors.child_name || validationErrors.child_name) && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {validationErrors.child_name || errors.child_name}
                                            </p>
                                        )}
                                        <p className="text-xs text-gray-500 mt-1">
                                            Este nome será usado como sugestão para bordados
                                        </p>
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

                            {/* Product Specifications Section - Manual Entry by Sales Staff */}
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                    <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                                        🎨
                                    </span>
                                    Especificações do Kit (Preenchimento Manual)
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Mesa livre (detalhes no bolso frontal) *
                                        </label>
                                        <textarea
                                            value={data.mesa_livre_details || ''}
                                            onChange={e => setData('mesa_livre_details', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                                            rows={3}
                                            placeholder="Ex: Bolso frontal com detalhes específicos..."
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Chaveiros *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.chaveiros || ''}
                                            onChange={e => setData('chaveiros', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                                            placeholder="Ex: 2x chaveiros personalizados"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Cor principal do kit *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.kit_main_color || ''}
                                            onChange={e => setData('kit_main_color', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                                            placeholder="Ex: Azul marinho"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Alças *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.alcas || ''}
                                            onChange={e => setData('alcas', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                                            placeholder="Ex: Pretas, material resistente"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Faixa *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.faixa || ''}
                                            onChange={e => setData('faixa', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                                            placeholder="Ex: Rosa com detalhes dourados"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Friso (contorno da bolsa) *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.friso || ''}
                                            onChange={e => setData('friso', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                                            placeholder="Ex: Contorno branco"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Viés (contorno dos bolsos laterais) *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.vies || ''}
                                            onChange={e => setData('vies', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                                            placeholder="Ex: Azul claro nos bolsos laterais"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Zíper *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.ziper || ''}
                                            onChange={e => setData('ziper', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                                            placeholder="Ex: Dourado YKK"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Previsão de confecção *
                                        </label>
                                        <input
                                            type="date"
                                            value={data.production_estimate || ''}
                                            onChange={e => setData('production_estimate', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Previsão de entrega *
                                        </label>
                                        <input
                                            type="date"
                                            value={data.delivery_estimate || ''}
                                            onChange={e => setData('delivery_estimate', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <span className="text-orange-500 text-lg">ℹ️</span>
                                        <div>
                                            <h4 className="text-orange-800 font-medium">Controle de Inventário - Etapa 3</h4>
                                            <p className="text-orange-700 text-sm">
                                                Estas especificações são essenciais para o controle de inventário e planejamento da produção.
                                                Todos os campos são obrigatórios para garantir informações completas ao cliente.
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