<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class ActionHistory extends Model
{
    protected $fillable = [
        'user_id',
        'action_type',
        'resource_type',
        'resource_id',
        'description',
        'changes',
        'metadata',
        'ip_address',
        'user_agent',
        'performed_at',
    ];

    protected $casts = [
        'changes' => 'array',
        'metadata' => 'array',
        'performed_at' => 'datetime',
    ];

    protected $dates = [
        'performed_at',
        'created_at',
        'updated_at',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function resource()
    {
        if (!$this->resource_type || !$this->resource_id) {
            return null;
        }

        $modelClass = "App\\Models\\{$this->resource_type}";

        if (!class_exists($modelClass)) {
            return null;
        }

        return $modelClass::find($this->resource_id);
    }

    public function scopeForResource($query, $resourceType, $resourceId)
    {
        return $query->where('resource_type', $resourceType)
                    ->where('resource_id', $resourceId);
    }

    public function scopeByAction($query, $actionType)
    {
        return $query->where('action_type', $actionType);
    }

    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeInDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('performed_at', [
            Carbon::parse($startDate)->startOfDay(),
            Carbon::parse($endDate)->endOfDay()
        ]);
    }

    public static function log(
        string $actionType,
        string $description,
        ?string $resourceType = null,
        ?int $resourceId = null,
        ?array $changes = null,
        ?array $metadata = null
    ): self {
        return self::create([
            'user_id' => auth()->id(),
            'action_type' => $actionType,
            'resource_type' => $resourceType,
            'resource_id' => $resourceId,
            'description' => $description,
            'changes' => $changes,
            'metadata' => $metadata,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'performed_at' => now(),
        ]);
    }
}
