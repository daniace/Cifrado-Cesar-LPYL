<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMensajeRequest;
use App\Http\Requests\UpdateMensajeRequest;
use App\Models\Conversacion;
use App\Models\Mensaje;

class MensajeController extends Controller
{
    /**
     * Crea nuevo mensaje en una conversación existente.
     * Ruta: POST /conversaciones/{conversacion}/mensajes
     */
    public function store(StoreMensajeRequest $request, Conversacion $conversacion)
    {
        $this->authorize('reply', $conversacion);

        $validated = $request->validated();

        Mensaje::create([
            'conversacion_id' => $conversacion->id,
            'emisor_id' => auth()->id(),
            'contenido' => $validated['contenido'],
            'desplazamiento_contenido' => $validated['desplazamiento_contenido'],
            'excepciones_contenido' => $validated['excepciones_contenido'] ?? null,
        ]);

        // Actualizar fecha_ultimo_mensaje
        $conversacion->update(['fecha_ultimo_mensaje' => now()]);

        return back();
    }

    /**
     * Marca mensaje como leído.
     * Ruta: PATCH /mensajes/{mensaje}
     */
    public function update(UpdateMensajeRequest $request, Mensaje $mensaje)
    {
        $mensaje->marcarLeido();

        return back();
    }
}
