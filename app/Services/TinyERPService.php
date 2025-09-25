<?php

namespace App\Services;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class TinyERPService
{
    private ?string $baseUrl;
    private ?string $token;
    private PendingRequest $client;

    public function __construct()
    {
        $this->baseUrl = config('services.tiny_erp.base_url', 'https://api.tiny.com.br/api2');
        $this->token = config('services.tiny_erp.token');

        $this->client = Http::timeout(30)
            ->retry(3, 1000)
            ->withHeaders([
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ]);
    }

    /**
     * Make API request to Tiny ERP
     */
    private function makeRequest(string $endpoint, array $data = [], string $method = 'POST'): array
    {
        try {
            if (!$this->token) {
                throw new \Exception('Tiny ERP token not configured');
            }

            $data['token'] = $this->token;
            $data['formato'] = 'JSON';

            $response = match($method) {
                'GET' => $this->client->get($this->baseUrl . $endpoint, $data),
                'POST' => $this->client->post($this->baseUrl . $endpoint, $data),
                'PUT' => $this->client->put($this->baseUrl . $endpoint, $data),
                'DELETE' => $this->client->delete($this->baseUrl . $endpoint, $data),
                default => throw new \InvalidArgumentException("Unsupported HTTP method: {$method}")
            };

            if ($response->failed()) {
                Log::error('Tiny ERP API Error', [
                    'endpoint' => $endpoint,
                    'status' => $response->status(),
                    'response' => $response->body(),
                ]);

                throw new \Exception('Tiny ERP API request failed: ' . $response->body());
            }

            $result = $response->json();

            // Check for API errors in response
            if (isset($result['retorno']['erro'])) {
                $error = $result['retorno']['erro'];
                Log::error('Tiny ERP API Business Error', [
                    'endpoint' => $endpoint,
                    'error' => $error,
                ]);

                throw new \Exception('Tiny ERP API error: ' . $error);
            }

            return $result;
        } catch (\Exception $e) {
            Log::error('Tiny ERP Service Exception', [
                'endpoint' => $endpoint,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            throw $e;
        }
    }

    // ==================== ORDER METHODS ====================

    /**
     * Create order in Tiny ERP
     */
    public function createOrder(array $orderData): array
    {
        $tinyOrder = $this->formatOrderForTiny($orderData);

        return $this->makeRequest('/pedidos.incluir.php', [
            'pedido' => json_encode($tinyOrder)
        ]);
    }

    /**
     * Get order details from Tiny ERP
     */
    public function getOrder(string $orderId): array
    {
        return $this->makeRequest('/pedido.obter.php', [
            'id' => $orderId
        ], 'GET');
    }

    /**
     * Update order in Tiny ERP
     */
    public function updateOrder(string $orderId, array $orderData): array
    {
        $tinyOrder = $this->formatOrderForTiny($orderData);
        $tinyOrder['id'] = $orderId;

        return $this->makeRequest('/pedido.alterar.php', [
            'pedido' => json_encode($tinyOrder)
        ]);
    }

    /**
     * Search orders in Tiny ERP
     */
    public function searchOrders(array $filters = []): array
    {
        $params = [];

        if (isset($filters['date_from'])) {
            $params['dataIni'] = $filters['date_from'];
        }

        if (isset($filters['date_to'])) {
            $params['dataFim'] = $filters['date_to'];
        }

        if (isset($filters['page'])) {
            $params['pagina'] = $filters['page'];
        }

        return $this->makeRequest('/pedidos.pesquisa.php', $params, 'GET');
    }

    // ==================== INVOICE METHODS ====================

    /**
     * Generate invoice from order
     */
    public function generateInvoice(string $orderId): array
    {
        return $this->makeRequest('/pedido.gerar.nfe.php', [
            'idPedido' => $orderId
        ]);
    }

    /**
     * Create invoice directly
     */
    public function createInvoice(array $invoiceData): array
    {
        $tinyInvoice = $this->formatInvoiceForTiny($invoiceData);

        return $this->makeRequest('/nfe.incluir.php', [
            'nota' => json_encode($tinyInvoice)
        ]);
    }

    /**
     * Get invoice details
     */
    public function getInvoice(string $invoiceId): array
    {
        return $this->makeRequest('/nfe.obter.php', [
            'id' => $invoiceId
        ], 'GET');
    }

    /**
     * Get invoice XML
     */
    public function getInvoiceXml(string $invoiceId): array
    {
        return $this->makeRequest('/nfe.obter.xml.php', [
            'id' => $invoiceId
        ], 'GET');
    }

    /**
     * Get invoice link (PDF)
     */
    public function getInvoiceLink(string $invoiceId): array
    {
        return $this->makeRequest('/nfe.obter.link.php', [
            'id' => $invoiceId
        ], 'GET');
    }

    // ==================== SHIPPING METHODS ====================

    /**
     * Send objects for shipping
     */
    public function sendShipping(array $shippingData): array
    {
        $tinyShipping = $this->formatShippingForTiny($shippingData);

        return $this->makeRequest('/envios.incluir.php', [
            'envio' => json_encode($tinyShipping)
        ]);
    }

    /**
     * Get shipping labels
     */
    public function getShippingLabel(string $shippingId): array
    {
        return $this->makeRequest('/envio.obter.etiqueta.php', [
            'id' => $shippingId
        ], 'GET');
    }

    /**
     * Search shipping
     */
    public function searchShipping(array $filters = []): array
    {
        return $this->makeRequest('/envios.pesquisa.php', $filters, 'GET');
    }

    /**
     * Get shipping methods
     */
    public function getShippingMethods(): array
    {
        $cacheKey = 'tiny_erp_shipping_methods';

        return Cache::remember($cacheKey, 3600, function () {
            return $this->makeRequest('/formas.envio.php', [], 'GET');
        });
    }

    /**
     * Update order tracking information
     */
    public function updateOrderTracking(string $orderId, string $trackingCode, string $shippingMethod = null): array
    {
        $data = [
            'id' => $orderId,
            'codigo_rastreamento' => $trackingCode,
        ];

        if ($shippingMethod) {
            $data['forma_envio'] = $shippingMethod;
        }

        return $this->makeRequest('/pedido.alterar.situacao.php', $data);
    }

    // ==================== PRODUCT METHODS ====================

    /**
     * Create product in Tiny ERP
     */
    public function createProduct(array $productData): array
    {
        $tinyProduct = $this->formatProductForTiny($productData);

        return $this->makeRequest('/produtos.incluir.php', [
            'produto' => json_encode($tinyProduct)
        ]);
    }

    /**
     * Update product in Tiny ERP
     */
    public function updateProduct(string $productId, array $productData): array
    {
        $tinyProduct = $this->formatProductForTiny($productData);
        $tinyProduct['id'] = $productId;

        return $this->makeRequest('/produto.alterar.php', [
            'produto' => json_encode($tinyProduct)
        ]);
    }

    /**
     * Update product inventory
     */
    public function updateProductInventory(string $productId, float $quantity, string $operation = 'B'): array
    {
        return $this->makeRequest('/produto.alterar.estoque.php', [
            'id' => $productId,
            'estoque' => $quantity,
            'operacao' => $operation // 'B' = Balanço, 'E' = Entrada, 'S' = Saída
        ]);
    }

    // ==================== FORMATTING METHODS ====================

    private function formatOrderForTiny(array $orderData): array
    {
        return [
            'data_pedido' => $orderData['order_date'] ?? date('d/m/Y'),
            'data_prevista' => $orderData['expected_date'] ?? date('d/m/Y'),
            'numero_ordem_compra' => $orderData['purchase_order_number'] ?? '',
            'situacao' => $orderData['status'] ?? 'Aberto',
            'cliente' => [
                'nome' => $orderData['customer']['name'],
                'tipo_pessoa' => $orderData['customer']['type'] ?? 'F', // F = Física, J = Jurídica
                'cpf_cnpj' => $orderData['customer']['document'],
                'endereco' => $orderData['customer']['address']['street'] ?? '',
                'numero' => $orderData['customer']['address']['number'] ?? '',
                'complemento' => $orderData['customer']['address']['complement'] ?? '',
                'bairro' => $orderData['customer']['address']['neighborhood'] ?? '',
                'cep' => $orderData['customer']['address']['zipcode'] ?? '',
                'cidade' => $orderData['customer']['address']['city'] ?? '',
                'uf' => $orderData['customer']['address']['state'] ?? '',
                'telefone' => $orderData['customer']['phone'] ?? '',
                'email' => $orderData['customer']['email'] ?? '',
            ],
            'itens' => array_map(function($item) {
                return [
                    'item' => [
                        'codigo' => $item['sku'],
                        'descricao' => $item['name'],
                        'unidade' => $item['unit'] ?? 'UN',
                        'quantidade' => $item['quantity'],
                        'valor_unitario' => $item['unit_price'],
                    ]
                ];
            }, $orderData['items']),
            'obs' => $orderData['notes'] ?? '',
            'obs_internas' => $orderData['internal_notes'] ?? '',
        ];
    }

    private function formatInvoiceForTiny(array $invoiceData): array
    {
        return [
            'natureza_operacao' => $invoiceData['operation_nature'] ?? 'Venda',
            'data_emissao' => $invoiceData['issue_date'] ?? date('d/m/Y'),
            'data_saida' => $invoiceData['exit_date'] ?? date('d/m/Y'),
            'tipo_documento' => $invoiceData['document_type'] ?? '1', // 1 = Saída
            'finalidade_nfe' => $invoiceData['purpose'] ?? '1', // 1 = Normal
            'cliente' => $invoiceData['customer'],
            'itens' => $invoiceData['items'],
            'obs' => $invoiceData['notes'] ?? '',
        ];
    }

    private function formatShippingForTiny(array $shippingData): array
    {
        return [
            'id_pedido' => $shippingData['order_id'],
            'forma_envio' => $shippingData['shipping_method'],
            'nome_destinatario' => $shippingData['recipient_name'],
            'endereco_destinatario' => [
                'endereco' => $shippingData['address']['street'],
                'numero' => $shippingData['address']['number'],
                'complemento' => $shippingData['address']['complement'] ?? '',
                'bairro' => $shippingData['address']['neighborhood'],
                'cep' => $shippingData['address']['zipcode'],
                'cidade' => $shippingData['address']['city'],
                'uf' => $shippingData['address']['state'],
            ],
            'observacoes' => $shippingData['notes'] ?? '',
        ];
    }

    private function formatProductForTiny(array $productData): array
    {
        return [
            'nome' => $productData['name'],
            'codigo' => $productData['sku'],
            'preco' => $productData['price'],
            'preco_promocional' => $productData['promotional_price'] ?? 0,
            'ncm' => $productData['ncm'] ?? '',
            'origem' => $productData['origin'] ?? '0',
            'gtin' => $productData['gtin'] ?? '',
            'situacao' => $productData['status'] ?? 'A', // A = Ativo, I = Inativo
            'tipo' => $productData['type'] ?? 'P', // P = Produto, S = Serviço
            'classe_ipi' => $productData['ipi_class'] ?? '',
            'valor_ipi_fixo' => $productData['ipi_value'] ?? 0,
            'cod_lista_servicos' => $productData['service_list_code'] ?? '',
            'descricao_complementar' => $productData['additional_description'] ?? '',
            'garantia' => $productData['warranty'] ?? '',
            'cest' => $productData['cest'] ?? '',
            'obs' => $productData['notes'] ?? '',
        ];
    }

    // ==================== WEBHOOK METHODS ====================

    /**
     * Process Tiny ERP webhook data
     */
    public function processWebhook(array $webhookData): array
    {
        Log::info('Processing Tiny ERP webhook', $webhookData);

        $eventType = $webhookData['evento'] ?? null;
        $data = $webhookData['dados'] ?? [];

        switch ($eventType) {
            case 'pedido.incluido':
                return $this->handleOrderCreated($data);
            case 'pedido.alterado':
                return $this->handleOrderUpdated($data);
            case 'nfe.autorizada':
                return $this->handleInvoiceAuthorized($data);
            case 'envio.postado':
                return $this->handleShippingPosted($data);
            default:
                Log::warning('Unknown Tiny ERP webhook event', ['event' => $eventType]);
                return ['status' => 'ignored'];
        }
    }

    private function handleOrderCreated(array $data): array
    {
        Log::info('Handling order created webhook', $data);
        // Handle order creation logic here
        return ['status' => 'processed'];
    }

    private function handleOrderUpdated(array $data): array
    {
        Log::info('Handling order updated webhook', $data);
        // Handle order update logic here
        return ['status' => 'processed'];
    }

    private function handleInvoiceAuthorized(array $data): array
    {
        Log::info('Handling invoice authorized webhook', $data);
        // Handle invoice authorization logic here
        return ['status' => 'processed'];
    }

    private function handleShippingPosted(array $data): array
    {
        Log::info('Handling shipping posted webhook', $data);
        // Handle shipping posted logic here
        return ['status' => 'processed'];
    }

    // ==================== UTILITY METHODS ====================

    /**
     * Test API connection
     */
    public function testConnection(): bool
    {
        try {
            $response = $this->makeRequest('/info.php', [], 'GET');
            return isset($response['retorno']['status']) && $response['retorno']['status'] === 'OK';
        } catch (\Exception $e) {
            Log::error('Tiny ERP connection test failed', ['error' => $e->getMessage()]);
            return false;
        }
    }

    /**
     * Get API status
     */
    public function getStatus(): array
    {
        return $this->makeRequest('/info.php', [], 'GET');
    }
}