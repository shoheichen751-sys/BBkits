<?php

namespace App\Providers;

use App\Events\SaleOrderConfirmed;
use App\Events\SalePaymentApproved;
use App\Events\SaleProductionStarted;
use App\Events\SalePhotoSent;
use App\Events\SaleOrderShipped;
use App\Events\SalePaymentRejected;
use App\Listeners\SendWhatsAppNotification;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event to listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],

        // WhatsApp Notification Events
        SaleOrderConfirmed::class => [
            SendWhatsAppNotification::class,
        ],

        SalePaymentApproved::class => [
            SendWhatsAppNotification::class,
        ],

        SaleProductionStarted::class => [
            SendWhatsAppNotification::class,
        ],

        SalePhotoSent::class => [
            SendWhatsAppNotification::class,
        ],

        SaleOrderShipped::class => [
            SendWhatsAppNotification::class,
        ],

        SalePaymentRejected::class => [
            SendWhatsAppNotification::class,
        ],
    ];

    /**
     * Register any events for your application.
     */
    public function boot(): void
    {
        //
    }

    /**
     * Determine if events and listeners should be automatically discovered.
     */
    public function shouldDiscoverEvents(): bool
    {
        return false;
    }
}