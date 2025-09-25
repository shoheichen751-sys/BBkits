<?php

namespace App\Events;

use App\Models\Sale;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SalePaymentRejected
{
    use Dispatchable, SerializesModels;

    public Sale $sale;
    public ?string $rejectionReason;

    /**
     * Create a new event instance.
     */
    public function __construct(Sale $sale, ?string $rejectionReason = null)
    {
        $this->sale = $sale;
        $this->rejectionReason = $rejectionReason;
    }
}
