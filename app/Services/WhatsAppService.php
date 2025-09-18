<?php

namespace App\Services;

use App\Models\Sale;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class WhatsAppService
{
    protected $baseUrl;
    protected $accessToken;
    protected $instanceId;

    public function __construct()
    {
        $this->baseUrl = config('services.wati.base_url', 'https://live-server-113671.wati.io/api/v1');
        $this->accessToken = config('services.wati.access_token');
        $this->instanceId = config('services.wati.instance_id');
    }

    /**
     * Send order confirmation message
     */
    public function sendOrderConfirmation(Sale $sale)
    {
        try {
            Log::info('Sending WhatsApp order confirmation', ['sale_id' => $sale->id]);

            $phone = $this->formatPhoneNumber($sale->client_phone);
            if (!$phone) {
                return ['success' => false, 'message' => 'Número de telefone inválido'];
            }

            $message = $this->buildOrderConfirmationMessage($sale);
            
            $response = $this->sendTemplateMessage($phone, 'order_confirmation', [
                'customer_name' => $sale->client_name,
                'order_number' => $sale->unique_token,
                'total_amount' => 'R$ ' . number_format($sale->total_amount, 2, ',', '.'),
                'client_page_url' => $sale->getPersonalizedPageUrl()
            ]);

            if ($response['success']) {
                $sale->update([
                    'whatsapp_confirmation_sent' => true,
                    'whatsapp_confirmation_sent_at' => now()
                ]);
                
                Log::info('WhatsApp order confirmation sent successfully', [
                    'sale_id' => $sale->id,
                    'phone' => $phone,
                    'message_id' => $response['message_id'] ?? null
                ]);
            }

            return $response;
        } catch (\Exception $e) {
            Log::error('WhatsApp order confirmation exception', [
                'sale_id' => $sale->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    /**
     * Send payment approval notification
     */
    public function sendPaymentApproved(Sale $sale)
    {
        try {
            Log::info('Sending WhatsApp payment approved notification', ['sale_id' => $sale->id]);

            $phone = $this->formatPhoneNumber($sale->client_phone);
            if (!$phone) {
                return ['success' => false, 'message' => 'Número de telefone inválido'];
            }

            $response = $this->sendTemplateMessage($phone, 'payment_approved', [
                'customer_name' => $sale->client_name,
                'order_number' => $sale->unique_token,
                'production_time' => '3-5 dias úteis'
            ]);

            if ($response['success']) {
                $sale->update([
                    'whatsapp_payment_approved_sent' => true,
                    'whatsapp_payment_approved_sent_at' => now()
                ]);
            }

            return $response;
        } catch (\Exception $e) {
            Log::error('WhatsApp payment approved exception', [
                'sale_id' => $sale->id,
                'error' => $e->getMessage()
            ]);
            
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    /**
     * Send production started notification
     */
    public function sendProductionStarted(Sale $sale)
    {
        try {
            Log::info('Sending WhatsApp production started notification', ['sale_id' => $sale->id]);

            $phone = $this->formatPhoneNumber($sale->client_phone);
            if (!$phone) {
                return ['success' => false, 'message' => 'Número de telefone inválido'];
            }

            $response = $this->sendTemplateMessage($phone, 'production_started', [
                'customer_name' => $sale->client_name,
                'order_number' => $sale->unique_token,
                'product_details' => $this->getProductDetails($sale)
            ]);

            if ($response['success']) {
                $sale->update([
                    'whatsapp_production_started_sent' => true,
                    'whatsapp_production_started_sent_at' => now()
                ]);
            }

            return $response;
        } catch (\Exception $e) {
            Log::error('WhatsApp production started exception', [
                'sale_id' => $sale->id,
                'error' => $e->getMessage()
            ]);
            
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    /**
     * Send photo approval request
     */
    public function sendPhotoApprovalRequest(Sale $sale)
    {
        try {
            Log::info('Sending WhatsApp photo approval request', ['sale_id' => $sale->id]);

            $phone = $this->formatPhoneNumber($sale->client_phone);
            if (!$phone) {
                return ['success' => false, 'message' => 'Número de telefone inválido'];
            }

            // First send the photo if available
            if ($sale->product_photo_data) {
                $photoResponse = $this->sendPhoto($phone, $sale->product_photo_data, 
                    '📸 Aqui está a foto do seu bordado personalizado!');
                
                if (!$photoResponse['success']) {
                    Log::warning('Failed to send photo via WhatsApp', [
                        'sale_id' => $sale->id,
                        'error' => $photoResponse['message']
                    ]);
                }
            }

            // Then send the approval request message
            $response = $this->sendTemplateMessage($phone, 'photo_approval', [
                'customer_name' => $sale->client_name,
                'order_number' => $sale->unique_token,
                'approval_link' => $sale->getPersonalizedPageUrl()
            ]);

            if ($response['success']) {
                $sale->update([
                    'whatsapp_photo_sent' => true,
                    'whatsapp_photo_sent_at' => now()
                ]);
            }

            return $response;
        } catch (\Exception $e) {
            Log::error('WhatsApp photo approval exception', [
                'sale_id' => $sale->id,
                'error' => $e->getMessage()
            ]);
            
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    /**
     * Send shipping notification
     */
    public function sendShippingNotification(Sale $sale)
    {
        try {
            Log::info('Sending WhatsApp shipping notification', ['sale_id' => $sale->id]);

            $phone = $this->formatPhoneNumber($sale->client_phone);
            if (!$phone) {
                return ['success' => false, 'message' => 'Número de telefone inválido'];
            }

            $trackingUrl = $this->generateTrackingUrl($sale->tracking_code);

            $response = $this->sendTemplateMessage($phone, 'order_shipped', [
                'customer_name' => $sale->client_name,
                'order_number' => $sale->unique_token,
                'tracking_code' => $sale->tracking_code,
                'tracking_url' => $trackingUrl,
                'delivery_estimate' => $this->calculateDeliveryEstimate($sale)
            ]);

            if ($response['success']) {
                $sale->update([
                    'whatsapp_shipping_sent' => true,
                    'whatsapp_shipping_sent_at' => now()
                ]);
            }

            return $response;
        } catch (\Exception $e) {
            Log::error('WhatsApp shipping notification exception', [
                'sale_id' => $sale->id,
                'error' => $e->getMessage()
            ]);
            
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    /**
     * Send payment rejection notification
     */
    public function sendPaymentRejected(Sale $sale, $reason)
    {
        try {
            Log::info('Sending WhatsApp payment rejected notification', [
                'sale_id' => $sale->id,
                'reason' => $reason
            ]);

            $phone = $this->formatPhoneNumber($sale->client_phone);
            if (!$phone) {
                return ['success' => false, 'message' => 'Número de telefone inválido'];
            }

            $response = $this->sendTemplateMessage($phone, 'payment_rejected', [
                'customer_name' => $sale->client_name,
                'order_number' => $sale->unique_token,
                'rejection_reason' => $reason,
                'client_page_url' => $sale->getPersonalizedPageUrl()
            ]);

            if ($response['success']) {
                $sale->update([
                    'whatsapp_payment_rejected_sent' => true,
                    'whatsapp_payment_rejected_sent_at' => now()
                ]);
            }

            return $response;
        } catch (\Exception $e) {
            Log::error('WhatsApp payment rejected exception', [
                'sale_id' => $sale->id,
                'error' => $e->getMessage()
            ]);
            
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    /**
     * Send final payment reminder
     */
    public function sendFinalPaymentReminder(Sale $sale)
    {
        try {
            Log::info('Sending WhatsApp final payment reminder', ['sale_id' => $sale->id]);

            $phone = $this->formatPhoneNumber($sale->client_phone);
            if (!$phone) {
                return ['success' => false, 'message' => 'Número de telefone inválido'];
            }

            $remainingAmount = $sale->getRemainingAmount();

            $response = $this->sendTemplateMessage($phone, 'final_payment_reminder', [
                'customer_name' => $sale->client_name,
                'order_number' => $sale->unique_token,
                'remaining_amount' => 'R$ ' . number_format($remainingAmount, 2, ',', '.'),
                'payment_link' => $sale->getPersonalizedPageUrl()
            ]);

            if ($response['success']) {
                $sale->update([
                    'whatsapp_final_payment_reminder_sent' => true,
                    'whatsapp_final_payment_reminder_sent_at' => now()
                ]);
            }

            return $response;
        } catch (\Exception $e) {
            Log::error('WhatsApp final payment reminder exception', [
                'sale_id' => $sale->id,
                'error' => $e->getMessage()
            ]);
            
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    /**
     * Send custom message
     */
    public function sendCustomMessage($phone, $message, $templateName = null)
    {
        try {
            $phone = $this->formatPhoneNumber($phone);
            if (!$phone) {
                return ['success' => false, 'message' => 'Número de telefone inválido'];
            }

            if ($templateName) {
                return $this->sendTemplateMessage($phone, $templateName, ['message' => $message]);
            } else {
                return $this->sendTextMessage($phone, $message);
            }
        } catch (\Exception $e) {
            Log::error('WhatsApp custom message exception', [
                'phone' => $phone,
                'error' => $e->getMessage()
            ]);
            
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    /**
     * Send template message via WATI
     */
    private function sendTemplateMessage($phone, $templateName, $parameters = [])
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->accessToken,
                'Content-Type' => 'application/json'
            ])->timeout(30)->post($this->baseUrl . '/sendTemplateMessage', [
                'whatsappNumber' => $phone,
                'templateName' => $templateName,
                'broadcastName' => 'BBKits Automated Messages',
                'parameters' => array_values($parameters)
            ]);

            if ($response->successful()) {
                $result = $response->json();
                
                if (isset($result['result']) && $result['result'] === true) {
                    return [
                        'success' => true,
                        'message_id' => $result['info']['messageId'] ?? null,
                        'message' => 'Mensagem WhatsApp enviada com sucesso'
                    ];
                } else {
                    $error = $result['info'] ?? 'Erro desconhecido';
                    Log::error('WATI template message failed', [
                        'phone' => $phone,
                        'template' => $templateName,
                        'error' => $error,
                        'response' => $result
                    ]);
                    
                    return $this->handleMessageFailure($phone, $templateName, $parameters, $error);
                }
            } else {
                Log::error('WATI API request failed', [
                    'phone' => $phone,
                    'template' => $templateName,
                    'status' => $response->status(),
                    'response' => $response->body()
                ]);
                
                return $this->handleMessageFailure($phone, $templateName, $parameters, 'Falha na API WATI');
            }
        } catch (\Exception $e) {
            Log::error('WATI template message exception', [
                'phone' => $phone,
                'template' => $templateName,
                'error' => $e->getMessage()
            ]);
            
            return $this->handleMessageFailure($phone, $templateName, $parameters, $e->getMessage());
        }
    }

    /**
     * Send text message via WATI
     */
    private function sendTextMessage($phone, $message)
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->accessToken,
                'Content-Type' => 'application/json'
            ])->timeout(30)->post($this->baseUrl . '/sendSessionMessage/' . $phone, [
                'messageText' => $message
            ]);

            if ($response->successful()) {
                $result = $response->json();
                
                return [
                    'success' => true,
                    'message_id' => $result['info']['messageId'] ?? null,
                    'message' => 'Mensagem de texto enviada com sucesso'
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Falha ao enviar mensagem de texto: ' . $response->status()
                ];
            }
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Erro ao enviar mensagem de texto: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Send photo via WATI
     */
    private function sendPhoto($phone, $photoData, $caption = '')
    {
        try {
            // Convert base64 to file if needed
            if (str_starts_with($photoData, 'data:image')) {
                $photoUrl = $this->uploadBase64Image($photoData);
            } else {
                $photoUrl = $photoData; // Assume it's already a URL
            }

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->accessToken,
                'Content-Type' => 'application/json'
            ])->timeout(30)->post($this->baseUrl . '/sendSessionFile/' . $phone, [
                'messageText' => $caption,
                'media' => $photoUrl
            ]);

            if ($response->successful()) {
                return [
                    'success' => true,
                    'message' => 'Foto enviada com sucesso'
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Falha ao enviar foto: ' . $response->status()
                ];
            }
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Erro ao enviar foto: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Handle message sending failure with fallback
     */
    private function handleMessageFailure($phone, $templateName, $parameters, $error)
    {
        // Try sending as plain text message as fallback
        $fallbackMessage = $this->buildFallbackMessage($templateName, $parameters);
        
        $fallbackResult = $this->sendTextMessage($phone, $fallbackMessage);
        
        if ($fallbackResult['success']) {
            return [
                'success' => true,
                'fallback' => true,
                'message' => 'Template falhou, mas mensagem de texto enviada como alternativa',
                'original_error' => $error
            ];
        }
        
        return [
            'success' => false,
            'message' => 'Falha no template e no fallback: ' . $error
        ];
    }

    /**
     * Build fallback message for failed templates
     */
    private function buildFallbackMessage($templateName, $parameters)
    {
        $messages = [
            'order_confirmation' => "🎉 Olá {$parameters['customer_name']}! Seu pedido BBKits #{$parameters['order_number']} foi recebido com sucesso! Valor: {$parameters['total_amount']}. Acompanhe em: {$parameters['client_page_url']}",
            
            'payment_approved' => "✅ Ótimas notícias {$parameters['customer_name']}! O pagamento do seu pedido #{$parameters['order_number']} foi aprovado e já iniciamos a produção! Prazo: {$parameters['production_time']}.",
            
            'production_started' => "🏭 Olá {$parameters['customer_name']}! Iniciamos a produção do seu pedido #{$parameters['order_number']}. Detalhes: {$parameters['product_details']}. Em breve enviaremos a foto!",
            
            'photo_approval' => "📸 {$parameters['customer_name']}, seu bordado ficou lindo! Pedido #{$parameters['order_number']}. Por favor, aprove a foto em: {$parameters['approval_link']}",
            
            'order_shipped' => "🚚 Seu pedido #{$parameters['order_number']} foi enviado! Código de rastreamento: {$parameters['tracking_code']}. Acompanhe: {$parameters['tracking_url']}. Previsão: {$parameters['delivery_estimate']}",
            
            'payment_rejected' => "❌ {$parameters['customer_name']}, precisamos revisar o pagamento do pedido #{$parameters['order_number']}. Motivo: {$parameters['rejection_reason']}. Acesse: {$parameters['client_page_url']}",
            
            'final_payment_reminder' => "💰 {$parameters['customer_name']}, para finalizar seu pedido #{$parameters['order_number']}, falta o pagamento de {$parameters['remaining_amount']}. Finalize em: {$parameters['payment_link']}"
        ];
        
        return $messages[$templateName] ?? 'Mensagem BBKits: ' . json_encode($parameters);
    }

    /**
     * Build order confirmation message
     */
    private function buildOrderConfirmationMessage(Sale $sale)
    {
        $message = "🎉 Olá {$sale->client_name}!\n\n";
        $message .= "Seu pedido BBKits #{$sale->unique_token} foi recebido com sucesso!\n\n";
        $message .= "📋 *Detalhes do Pedido:*\n";
        
        if ($sale->child_name) {
            $message .= "👶 Nome: {$sale->child_name}\n";
        }
        
        if ($sale->embroidery_position) {
            $message .= "📍 Posição: {$sale->embroidery_position}\n";
        }
        
        if ($sale->embroidery_color) {
            $message .= "🎨 Cor: {$sale->embroidery_color}\n";
        }
        
        if ($sale->embroidery_font) {
            $message .= "✏️ Fonte: {$sale->embroidery_font}\n";
        }
        
        $message .= "💰 Valor Total: R$ " . number_format($sale->total_amount, 2, ',', '.') . "\n\n";
        $message .= "🔗 Acompanhe seu pedido: {$sale->getPersonalizedPageUrl()}\n\n";
        $message .= "Obrigado por escolher a BBKits! 💕";
        
        return $message;
    }

    /**
     * Get product details for messages
     */
    private function getProductDetails(Sale $sale)
    {
        $details = [];
        
        if ($sale->child_name) {
            $details[] = "Nome: " . $sale->child_name;
        }
        
        if ($sale->embroidery_position) {
            $details[] = "Posição: " . $sale->embroidery_position;
        }
        
        if ($sale->embroidery_color) {
            $details[] = "Cor: " . $sale->embroidery_color;
        }
        
        return implode(', ', $details) ?: 'Bordado personalizado BBKits';
    }

    /**
     * Format phone number for WhatsApp
     */
    private function formatPhoneNumber($phone)
    {
        if (!$phone) {
            return null;
        }
        
        // Remove all non-numeric characters
        $phone = preg_replace('/[^0-9]/', '', $phone);
        
        // Add country code if not present
        if (strlen($phone) === 11 && substr($phone, 0, 1) === '1') {
            $phone = '55' . $phone; // Brazil country code
        } elseif (strlen($phone) === 10) {
            $phone = '55' . $phone; // Brazil country code
        } elseif (strlen($phone) === 13 && substr($phone, 0, 2) === '55') {
            // Already has country code
        } else {
            // Invalid format
            return null;
        }
        
        return $phone;
    }

    /**
     * Generate tracking URL
     */
    private function generateTrackingUrl($trackingCode)
    {
        if (str_starts_with($trackingCode, 'BB') && str_ends_with($trackingCode, 'BR')) {
            // BBKits internal tracking
            return config('app.url') . '/tracking/' . $trackingCode;
        } else {
            // Correios tracking
            return 'https://www.correios.com.br/rastreamento?objeto=' . $trackingCode;
        }
    }

    /**
     * Calculate delivery estimate
     */
    private function calculateDeliveryEstimate(Sale $sale)
    {
        $baseDate = now();
        
        // Estimate based on state
        $deliveryDays = match ($sale->delivery_state ?? 'SP') {
            'SP' => 2,
            'RJ', 'MG', 'ES' => 3,
            'PR', 'SC', 'RS' => 4,
            default => 7
        };
        
        $estimatedDate = $baseDate->addBusinessDays($deliveryDays);
        
        return $estimatedDate->format('d/m/Y');
    }

    /**
     * Upload base64 image for WhatsApp sharing
     */
    private function uploadBase64Image($base64Data)
    {
        try {
            // Extract file extension and data
            preg_match('/data:image\/([a-zA-Z0-9]+);base64,(.*)/', $base64Data, $matches);
            $extension = $matches[1] ?? 'jpg';
            $data = $matches[2] ?? $base64Data;
            
            // Generate filename
            $filename = 'whatsapp_' . time() . '_' . uniqid() . '.' . $extension;
            $path = 'whatsapp_images/' . $filename;
            
            // Store the file
            Storage::disk('public')->put($path, base64_decode($data));
            
            // Return public URL
            return Storage::disk('public')->url($path);
        } catch (\Exception $e) {
            Log::error('Error uploading base64 image for WhatsApp', [
                'error' => $e->getMessage()
            ]);
            
            return null;
        }
    }

    /**
     * Test WATI connection
     */
    public function testConnection()
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->accessToken,
                'Content-Type' => 'application/json'
            ])->timeout(10)->get($this->baseUrl . '/getProfile');

            if ($response->successful()) {
                $result = $response->json();
                return [
                    'success' => true,
                    'message' => 'Conexão com WATI estabelecida com sucesso',
                    'data' => $result
                ];
            }
            
            return [
                'success' => false,
                'message' => 'Falha na conexão com WATI: ' . $response->status()
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Erro de conexão WATI: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Get WhatsApp messaging statistics
     */
    public function getMessagingStats($dateFrom = null, $dateTo = null)
    {
        $dateFrom = $dateFrom ?: now()->subDays(30);
        $dateTo = $dateTo ?: now();
        
        return [
            'total_sent' => Sale::whereBetween('created_at', [$dateFrom, $dateTo])
                               ->where('whatsapp_confirmation_sent', true)
                               ->count(),
            'payment_approvals' => Sale::whereBetween('created_at', [$dateFrom, $dateTo])
                                      ->where('whatsapp_payment_approved_sent', true)
                                      ->count(),
            'photo_requests' => Sale::whereBetween('created_at', [$dateFrom, $dateTo])
                                   ->where('whatsapp_photo_sent', true)
                                   ->count(),
            'shipping_notifications' => Sale::whereBetween('created_at', [$dateFrom, $dateTo])
                                           ->where('whatsapp_shipping_sent', true)
                                           ->count(),
            'success_rate' => $this->calculateSuccessRate($dateFrom, $dateTo)
        ];
    }

    /**
     * Calculate messaging success rate
     */
    private function calculateSuccessRate($dateFrom, $dateTo)
    {
        $totalOrders = Sale::whereBetween('created_at', [$dateFrom, $dateTo])->count();
        
        if ($totalOrders === 0) {
            return 100;
        }
        
        $successfulMessages = Sale::whereBetween('created_at', [$dateFrom, $dateTo])
            ->where(function ($query) {
                $query->where('whatsapp_confirmation_sent', true)
                      ->orWhere('whatsapp_payment_approved_sent', true)
                      ->orWhere('whatsapp_photo_sent', true)
                      ->orWhere('whatsapp_shipping_sent', true);
            })
            ->count();
        
        return round(($successfulMessages / $totalOrders) * 100, 2);
    }
}