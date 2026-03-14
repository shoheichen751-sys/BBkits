<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StandardThreadSubstitute extends Model
{
    use HasFactory;

    protected $fillable = [
        'specialty_thread_id',
        'standard_thread_id',
        'priority',
        'notes',
    ];

    protected $casts = [
        'priority' => 'integer',
    ];

    // Relationships
    public function specialtyThread()
    {
        return $this->belongsTo(Thread::class, 'specialty_thread_id');
    }

    public function standardThread()
    {
        return $this->belongsTo(Thread::class, 'standard_thread_id');
    }

    // Scopes
    public function scopeOrdered($query)
    {
        return $query->orderBy('priority', 'asc');
    }

    // Static Methods
    public static function findSubstitute(Thread $specialtyThread): ?Thread
    {
        $substitute = static::where('specialty_thread_id', $specialtyThread->id)
            ->ordered()
            ->with('standardThread')
            ->first();

        return $substitute?->standardThread;
    }

    public static function getAvailableSubstitute(Thread $specialtyThread): ?Thread
    {
        return static::where('specialty_thread_id', $specialtyThread->id)
            ->ordered()
            ->with('standardThread')
            ->get()
            ->filter(fn($s) => $s->standardThread->spool_count > 0)
            ->first()?->standardThread;
    }
}
