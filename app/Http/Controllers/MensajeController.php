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
        $usuarioAutenticado = auth()->id();

        // Verificar que el usuario puede responder (sin policy)
        // if ($conversacion->id_emisor !== $userId && $conversacion->id_receptor !== $userId) {
        //     abort(403, 'No tienes acceso a esta conversación.');
        // }

        $validated = $request->validated();

        Mensaje::create([
            'conversacion_id' => $conversacion->id,
            'emisor_id' => $usuarioAutenticado,
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

    public function show(Mensaje $mensaje)
    {
        dd($mensaje);
    }
}
