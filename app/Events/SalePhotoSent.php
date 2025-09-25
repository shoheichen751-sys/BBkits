<?php

namespace App\Events;

use App\Models\Sale;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SalePhotoSent
{
    use Dispatchable, SerializesModels;

    public Sale $sale;
    public string $photoUrl;

    /**
     * Create a new event instance.
     */
    public function __construct(Sale $sale, string $photoUrl)
    {
        $this->sale = $sale;
        $this->photoUrl = $photoUrl;
    }
}
