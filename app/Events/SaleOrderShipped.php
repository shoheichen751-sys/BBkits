<?php

namespace App\Events;

use App\Models\Sale;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SaleOrderShipped
{
    use Dispatchable, SerializesModels;

    public Sale $sale;
    public ?string $trackingCode;

    /**
     * Create a new event instance.
     */
    public function __construct(Sale $sale, ?string $trackingCode = null)
    {
        $this->sale = $sale;
        $this->trackingCode = $trackingCode;
    }
}
