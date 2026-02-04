<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreConversacionRequest;
use App\Models\Conversacion;
use App\Models\Mensaje;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ConversacionController extends Controller
{
    /**
     * Lista conversaciones del usuario autenticado.
     */
    public function index()
    {
        $userId = auth()->id();

        $conversaciones = Conversacion::query()
            ->where('id_emisor', $userId)
            ->orWhere('id_receptor', $userId)
            ->with(['emisor', 'receptor', 'ultimoMensaje'])
            ->orderByDesc('fecha_ultimo_mensaje')
            ->get();

        return Inertia::render('conversaciones/index', [
            'conversaciones' => $conversaciones,
        ]);
    }

    /**
     * Formulario para crear nueva conversación.
     */
    public function create()
    {
        $usuarios = User::where('id', '!=', auth()->id())->get();

        return Inertia::render('conversaciones/create', [
            'usuarios' => $usuarios,
        ]);
    }

    /**
     * Crea conversación + primer mensaje en transacción.
     */
    public function store(StoreConversacionRequest $request)
    {
        $validated = $request->validated();

        $conversacion = DB::transaction(function () use ($validated) {
            $conversacion = Conversacion::create([
                'asunto' => $validated['asunto'],
                'desplazamiento_asunto' => $validated['desplazamiento_asunto'],
                'excepciones_asunto' => $validated['excepciones_asunto'] ?? null,
                'id_emisor' => auth()->id(),
                'id_receptor' => $validated['id_receptor'],
                'fecha_ultimo_mensaje' => now(),
            ]);

            Mensaje::create([
                'conversacion_id' => $conversacion->id,
                'emisor_id' => auth()->id(),
                'contenido' => $validated['contenido'],
                'desplazamiento_contenido' => $validated['desplazamiento_contenido'],
                'excepciones_contenido' => $validated['excepciones_contenido'] ?? null,
            ]);

            return $conversacion;
        });

        return redirect()->route('conversaciones.show', $conversacion);
    }

    /**
     * Muestra conversación con sus mensajes.
     */
    public function show(Conversacion $conversacion)
    {
        // TODO: Revisar policy - temporalmente desactivado
        // $this->authorize('view', $conversacion);

        $conversacion->load([
            'emisor',
            'receptor',
            'mensajes' => fn ($q) => $q->with('emisor')->orderBy('created_at'),
        ]);

        // Marcar mensajes no leídos como leídos
        $conversacion->mensajes()
            ->where('emisor_id', '!=', auth()->id())
            ->where('leido', false)
            ->update(['leido' => true]);

        return Inertia::render('conversaciones/show', [
            'conversacion' => $conversacion,
        ]);
    }

    public function edit(Conversacion $conversacion)
    {
        //
    }

    public function update(Conversacion $conversacion)
    {
        //
    }

    public function destroy(Conversacion $conversacion)
    {
        //
    }

    public function sent()
    {
        $userId = auth()->id();

        $conversaciones = Conversacion::query()
            ->where('id_emisor', $userId)
            ->with(['emisor', 'receptor', 'ultimoMensaje'])
            ->orderByDesc('fecha_ultimo_mensaje')
            ->get();

        return Inertia::render('conversaciones/sent', [
            'conversaciones' => $conversaciones,
        ]);
    }

    /**
     * Obtiene conversación con mensajes (JSON para dashboard).
     */
    public function getMensajes(Conversacion $conversacion)
    {
        $this->authorize('view', $conversacion);

        $conversacion->load([
            'emisor',
            'receptor',
            'mensajes' => fn ($q) => $q->with('emisor')->orderBy('created_at'),
        ]);

        // Marcar mensajes no leídos como leídos
        $conversacion->mensajes()
            ->where('emisor_id', '!=', auth()->id())
            ->where('leido', false)
            ->update(['leido' => true]);

        return response()->json($conversacion);
    }
}
