<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mensaje extends Model
{
    /** @use HasFactory<\Database\Factories\MensajeFactory> */
    use HasFactory;

    protected $fillable = [
        'asunto',
        'contenido',
        'desplazamiento',
        'excepciones_asunto',
        'excepciones_contenido',
        'id_emisor',
        'id_receptor',
        'leido',
        'id_conversacion',
        'id_mensaje_anterior',
    ];

    protected $casts = [
        'leido' => 'boolean',
        'excepciones_asunto' => 'array',
        'excepciones_contenido' => 'array',
    ];

    public function emisor()
    {
        return $this->belongsTo(User::class, 'id_emisor');
    }

    public function receptor()
    {
        return $this->belongsTo(User::class, 'id_receptor');
    }

    public function anterior()
    {
        return $this->belongsTo(Mensaje::class, 'id_mensaje_anterior');
    }
}
