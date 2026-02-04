<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Conversacion extends Model
{
    use HasFactory;

    protected $table = 'conversaciones';

    protected $fillable = [
        'asunto',
        'desplazamiento_asunto',
        'excepciones_asunto',
        'id_emisor',
        'id_receptor',
        'fecha_ultimo_mensaje',
    ];

    protected function casts(): array
    {
        return [
            'excepciones_asunto' => 'array',
            'fecha_ultimo_mensaje' => 'datetime',
        ];
    }

    public function emisor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_emisor');
    }

    public function receptor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_receptor');
    }

    public function mensajes(): HasMany
    {
        return $this->hasMany(Mensaje::class, 'conversacion_id');
    }

    public function ultimoMensaje(): HasOne
    {
        return $this->hasOne(Mensaje::class, 'conversacion_id')->latestOfMany();
    }
}
