<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Mensaje extends Model
{
    /** @use HasFactory<\Database\Factories\MensajeFactory> */
    use HasFactory;

    protected $fillable = [
        'conversacion_id',
        'emisor_id',
        'contenido',
        'desplazamiento_contenido',
        'excepciones_contenido',
        'leido',
    ];

    protected function casts(): array
    {
        return [
            'leido' => 'boolean',
            'excepciones_contenido' => 'array',
        ];
    }

    public function conversacion(): BelongsTo
    {
        return $this->belongsTo(Conversacion::class, 'conversacion_id');
    }

    public function emisor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'emisor_id');
    }

    public function marcarLeido(): bool
    {
        return $this->update(['leido' => true]);
    }
}
