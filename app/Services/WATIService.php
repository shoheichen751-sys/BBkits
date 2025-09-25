<?php

namespace App\Services;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class WATIService
{
    private ?string $baseUrl;
    private ?string $accessToken;
    private ?string $instanceId;
    private PendingRequest $client;

    public function __construct()
    {
        $this->baseUrl = config('services.wati.base_url');
        $this->accessToken = config('services.wati.access_token');
        $this->instanceId = config('services.wati.instance_id');

        $this->client = Http::timeout(30)
            ->retry(3, 1000)
            ->withHeaders([
                'Authorization' => 'Bearer ' . $this->accessToken,
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ]);
    }

    /**
     * Check if WATI is enabled and configured
     */
    public function isEnabled(): bool
    {
        return config('services.wati.enabled', false) &&
               !empty($this->accessToken) &&
               !empty($this->instanceId);
    }

    /**
     * Make API request to WATI
     */
    private function makeRequest(string $endpoint, array $data = [], string $method = 'POST'): array
    {
        if (!$this->isEnabled()) {
            throw new \Exception('WATI service is not enabled or configured');
        }

        try {
            $url = $this->baseUrl . $endpoint;

            $response = match($method) {
                'GET' => $this->client->get($url, $data),
                'POST' => $this->client->post($url, $data),
                'PUT' => $this->client->put($url, $data),
                'DELETE' => $this->client->delete($url, $data),
                default => throw new \InvalidArgumentException("Unsupported HTTP method: {$method}")
            };

            if ($response->failed()) {
                Log::error('WATI API Error', [
                    'endpoint' => $endpoint,
                    'status' => $response->status(),
                    'response' => $response->body(),
                ]);

                throw new \Exception('WATI API request failed: ' . $response->body());
            }

            return $response->json() ?? [];

        } catch (\Exception $e) {
            Log::error('WATI Service Exception', [
                'endpoint' => $endpoint,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            // If fallback to text is enabled, we might want to handle this gracefully
            if (config('services.wati.fallback_to_text', true)) {
                // Here we could integrate with SMS service as fallback
                Log::info('WATI failed, fallback enabled but not implemented');
            }

            throw $e;
        }
    }

    // ==================== TEMPLATE MESSAGE METHODS ====================

    /**
     * Send template message
     */
    public function sendTemplateMessage(string $phoneNumber, string $templateName, array $parameters = []): array
    {
        $data = [
            'whatsappNumber' => $this->formatPhoneNumber($phoneNumber),
            'template_name' => $templateName,
        ];

        // Add parameters if provided
        if (!empty($parameters)) {
            $data['parameters'] = $parameters;
        }

        return $this->makeRequest('/sendTemplateMessage', $data);
    }

    /**
     * Send session message (within 24h window)
     */
    public function sendSessionMessage(string $phoneNumber, string $message): array
    {
        $data = [
            'whatsappNumber' => $this->formatPhoneNumber($phoneNumber),
            'message' => $message,
        ];

        return $this->makeRequest('/sendSessionMessage', $data);
    }

    /**
     * Send interactive message with buttons
     */
    public function sendButtonMessage(string $phoneNumber, string $message, array $buttons): array
    {
        $data = [
            'whatsappNumber' => $this->formatPhoneNumber($phoneNumber),
            'message' => $message,
            'buttons' => array_map(function($button, $index) {
                return [
                    'id' => $button['id'] ?? "btn_{$index}",
                    'title' => $button['title'],
                    'type' => 'QUICK_REPLY'
                ];
            }, $buttons, array_keys($buttons))
        ];

        return $this->makeRequest('/sendInteractiveButtonsMessage', $data);
    }

    /**
     * Send file/media message
     */
    public function sendFileMessage(string $phoneNumber, string $fileUrl, string $fileName, string $caption = ''): array
    {
        $data = [
            'whatsappNumber' => $this->formatPhoneNumber($phoneNumber),
            'file_url' => $fileUrl,
            'file_name' => $fileName,
            'caption' => $caption,
        ];

        return $this->makeRequest('/sendSessionFile', $data);
    }

    // ==================== BBKits SPECIFIC NOTIFICATION METHODS ====================

    /**
     * Send order confirmation message
     */
    public function sendOrderConfirmation(array $saleData): bool
    {
        try {
            $template = config('services.wati.templates.order_confirmation');
            $parameters = [
                ['type' => 'text', 'text' => $saleData['client_name']],
                ['type' => 'text', 'text' => $saleData['unique_token']],
                ['type' => 'text', 'text' => $saleData['child_name']],
                ['type' => 'text', 'text' => 'R$ ' . number_format($saleData['total_amount'], 2, ',', '.')],
            ];

            $result = $this->sendTemplateMessage($saleData['client_phone'], $template, $parameters);

            $this->logNotification('order_confirmation', $saleData['id'], $saleData['client_phone'], $result);
            return isset($result['result']) && $result['result'] === 'success';

        } catch (\Exception $e) {
            Log::error('Failed to send order confirmation WhatsApp', [
                'sale_id' => $saleData['id'],
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Send payment approved message
     */
    public function sendPaymentApproved(array $saleData): bool
    {
        try {
            $template = config('services.wati.templates.payment_approved');
            $parameters = [
                ['type' => 'text', 'text' => $saleData['client_name']],
                ['type' => 'text', 'text' => $saleData['unique_token']],
                ['type' => 'text', 'text' => $saleData['child_name']],
            ];

            $result = $this->sendTemplateMessage($saleData['client_phone'], $template, $parameters);

            $this->logNotification('payment_approved', $saleData['id'], $saleData['client_phone'], $result);
            return isset($result['result']) && $result['result'] === 'success';

        } catch (\Exception $e) {
            Log::error('Failed to send payment approved WhatsApp', [
                'sale_id' => $saleData['id'],
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Send production started message
     */
    public function sendProductionStarted(array $saleData): bool
    {
        try {
            $template = config('services.wati.templates.production_started');
            $parameters = [
                ['type' => 'text', 'text' => $saleData['client_name']],
                ['type' => 'text', 'text' => $saleData['unique_token']],
                ['type' => 'text', 'text' => $saleData['child_name']],
            ];

            $result = $this->sendTemplateMessage($saleData['client_phone'], $template, $parameters);

            $this->logNotification('production_started', $saleData['id'], $saleData['client_phone'], $result);
            return isset($result['result']) && $result['result'] === 'success';

        } catch (\Exception $e) {
            Log::error('Failed to send production started WhatsApp', [
                'sale_id' => $saleData['id'],
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Send photo approval request
     */
    public function sendPhotoApproval(array $saleData, string $photoUrl): bool
    {
        try {
            $template = config('services.wati.templates.photo_approval');
            $parameters = [
                ['type' => 'text', 'text' => $saleData['client_name']],
                ['type' => 'text', 'text' => $saleData['unique_token']],
                ['type' => 'text', 'text' => $saleData['child_name']],
                ['type' => 'image', 'image' => ['link' => $photoUrl]],
            ];

            $result = $this->sendTemplateMessage($saleData['client_phone'], $template, $parameters);

            $this->logNotification('photo_approval', $saleData['id'], $saleData['client_phone'], $result);
            return isset($result['result']) && $result['result'] === 'success';

        } catch (\Exception $e) {
            Log::error('Failed to send photo approval WhatsApp', [
                'sale_id' => $saleData['id'],
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Send order shipped message
     */
    public function sendOrderShipped(array $saleData, string $trackingCode = ''): bool
    {
        try {
            $template = config('services.wati.templates.order_shipped');
            $parameters = [
                ['type' => 'text', 'text' => $saleData['client_name']],
                ['type' => 'text', 'text' => $saleData['unique_token']],
                ['type' => 'text', 'text' => $saleData['child_name']],
            ];

            // Add tracking code if provided
            if ($trackingCode) {
                $parameters[] = ['type' => 'text', 'text' => $trackingCode];
            }

            $result = $this->sendTemplateMessage($saleData['client_phone'], $template, $parameters);

            $this->logNotification('order_shipped', $saleData['id'], $saleData['client_phone'], $result);
            return isset($result['result']) && $result['result'] === 'success';

        } catch (\Exception $e) {
            Log::error('Failed to send order shipped WhatsApp', [
                'sale_id' => $saleData['id'],
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Send payment rejected message
     */
    public function sendPaymentRejected(array $saleData, string $reason = ''): bool
    {
        try {
            $template = config('services.wati.templates.payment_rejected');
            $parameters = [
                ['type' => 'text', 'text' => $saleData['client_name']],
                ['type' => 'text', 'text' => $saleData['unique_token']],
                ['type' => 'text', 'text' => $reason ?: 'Não especificado'],
            ];

            $result = $this->sendTemplateMessage($saleData['client_phone'], $template, $parameters);

            $this->logNotification('payment_rejected', $saleData['id'], $saleData['client_phone'], $result);
            return isset($result['result']) && $result['result'] === 'success';

        } catch (\Exception $e) {
            Log::error('Failed to send payment rejected WhatsApp', [
                'sale_id' => $saleData['id'],
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Send final payment reminder
     */
    public function sendFinalPaymentReminder(array $saleData, float $remainingAmount): bool
    {
        try {
            $template = config('services.wati.templates.final_payment_reminder');
            $parameters = [
                ['type' => 'text', 'text' => $saleData['client_name']],
                ['type' => 'text', 'text' => $saleData['unique_token']],
                ['type' => 'text', 'text' => 'R$ ' . number_format($remainingAmount, 2, ',', '.')],
            ];

            $result = $this->sendTemplateMessage($saleData['client_phone'], $template, $parameters);

            $this->logNotification('final_payment_reminder', $saleData['id'], $saleData['client_phone'], $result);
            return isset($result['result']) && $result['result'] === 'success';

        } catch (\Exception $e) {
            Log::error('Failed to send final payment reminder WhatsApp', [
                'sale_id' => $saleData['id'],
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    // ==================== CONTACT MANAGEMENT METHODS ====================

    /**
     * Add or update contact
     */
    public function upsertContact(string $phoneNumber, array $contactData): array
    {
        $data = [
            'whatsappNumber' => $this->formatPhoneNumber($phoneNumber),
            'name' => $contactData['name'],
            'customParams' => [
                [
                    'name' => 'email',
                    'value' => $contactData['email'] ?? ''
                ],
                [
                    'name' => 'client_id',
                    'value' => $contactData['client_id'] ?? ''
                ],
                [
                    'name' => 'last_order',
                    'value' => $contactData['last_order'] ?? ''
                ]
            ]
        ];

        return $this->makeRequest('/addContact', $data);
    }

    /**
     * Get contact information
     */
    public function getContact(string $phoneNumber): array
    {
        return $this->makeRequest('/getContact', [
            'whatsappNumber' => $this->formatPhoneNumber($phoneNumber)
        ], 'GET');
    }

    // ==================== UTILITY METHODS ====================

    /**
     * Format phone number for WATI (remove special characters and ensure correct format)
     */
    private function formatPhoneNumber(string $phoneNumber): string
    {
        // Remove all non-numeric characters
        $clean = preg_replace('/[^0-9]/', '', $phoneNumber);

        // Add country code if not present (assuming Brazil +55)
        if (strlen($clean) === 11 && !str_starts_with($clean, '55')) {
            $clean = '55' . $clean;
        }

        return $clean;
    }

    /**
     * Test WATI connection
     */
    public function testConnection(): bool
    {
        try {
            // Try to get message templates to test connection
            $response = $this->makeRequest('/getMessageTemplates', [], 'GET');
            return isset($response['messageTemplates']) || isset($response['result']);
        } catch (\Exception $e) {
            Log::error('WATI connection test failed', ['error' => $e->getMessage()]);
            return false;
        }
    }

    /**
     * Get available message templates
     */
    public function getMessageTemplates(): array
    {
        try {
            $cacheKey = 'wati_message_templates';
            return Cache::remember($cacheKey, 3600, function () {
                $response = $this->makeRequest('/getMessageTemplates', [], 'GET');
                return $response['messageTemplates'] ?? [];
            });
        } catch (\Exception $e) {
            Log::error('Failed to get message templates', ['error' => $e->getMessage()]);
            return [];
        }
    }

    /**
     * Get messages by WhatsApp number
     */
    public function getMessages(string $phoneNumber, int $limit = 50): array
    {
        try {
            return $this->makeRequest('/getMessages', [
                'whatsappNumber' => $this->formatPhoneNumber($phoneNumber),
                'limit' => $limit
            ], 'GET');
        } catch (\Exception $e) {
            Log::error('Failed to get messages', ['error' => $e->getMessage()]);
            return [];
        }
    }

    /**
     * Log notification for tracking and debugging
     */
    private function logNotification(string $type, int $saleId, string $phoneNumber, array $result): void
    {
        Log::info('WATI notification sent', [
            'type' => $type,
            'sale_id' => $saleId,
            'phone' => $this->formatPhoneNumber($phoneNumber),
            'success' => isset($result['result']) && $result['result'] === 'success',
            'result' => $result,
        ]);

        // Store in database for tracking (optional)
        try {
            \DB::table('notification_logs')->insert([
                'type' => 'whatsapp',
                'event_type' => $type,
                'recipient' => $this->formatPhoneNumber($phoneNumber),
                'sale_id' => $saleId,
                'status' => isset($result['result']) && $result['result'] === 'success' ? 'sent' : 'failed',
                'response_data' => json_encode($result),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        } catch (\Exception $e) {
            // Don't fail the notification if logging fails
            Log::warning('Failed to log notification to database', ['error' => $e->getMessage()]);
        }
    }

    /**
     * Send bulk template messages
     */
    public function sendBulkTemplateMessages(array $recipients, string $templateName, array $parameters = []): array
    {
        $results = [];

        foreach ($recipients as $recipient) {
            try {
                $result = $this->sendTemplateMessage($recipient['phone'], $templateName, $parameters);
                $results[] = [
                    'phone' => $recipient['phone'],
                    'name' => $recipient['name'] ?? '',
                    'success' => isset($result['result']) && $result['result'] === 'success',
                    'result' => $result,
                ];

                // Add small delay between messages to avoid rate limits
                usleep(100000); // 0.1 second delay

            } catch (\Exception $e) {
                $results[] = [
                    'phone' => $recipient['phone'],
                    'name' => $recipient['name'] ?? '',
                    'success' => false,
                    'error' => $e->getMessage(),
                ];
            }
        }

        return $results;
    }

    /**
     * Handle webhook from WATI
     */
    public function processWebhook(array $webhookData): array
    {
        Log::info('WATI webhook received', $webhookData);

        $eventType = $webhookData['eventType'] ?? null;
        $data = $webhookData['data'] ?? [];

        try {
            switch ($eventType) {
                case 'onMessageReceived':
                    return $this->handleMessageReceived($data);
                case 'onMessageSent':
                    return $this->handleMessageSent($data);
                case 'onTemplateMessageSent':
                    return $this->handleTemplateMessageSent($data);
                default:
                    Log::info('Unknown WATI webhook event', ['event' => $eventType]);
                    return ['status' => 'ignored'];
            }
        } catch (\Exception $e) {
            Log::error('WATI webhook processing failed', [
                'event' => $eventType,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    private function handleMessageReceived(array $data): array
    {
        // Handle incoming message from customer
        // This could trigger auto-responses or update customer support systems
        Log::info('Message received from customer', $data);
        return ['status' => 'processed'];
    }

    private function handleMessageSent(array $data): array
    {
        // Handle confirmation that message was sent
        Log::info('Message sent confirmation', $data);
        return ['status' => 'processed'];
    }

    private function handleTemplateMessageSent(array $data): array
    {
        // Handle confirmation that template message was sent
        Log::info('Template message sent confirmation', $data);
        return ['status' => 'processed'];
    }
}