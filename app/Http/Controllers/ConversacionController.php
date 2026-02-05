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
     * Muestra donde es emisor O receptor, ordenadas por fecha_ultimo_mensaje.
     */
    public function index()
    {
        $usuarioAutenticado = auth()->id();

        $cantidadMensajesNoLeidos = Mensaje::where('receptor_id', $usuarioAutenticado)->where('leido', false)->count();

        $conversaciones = Conversacion::query()
            ->where('id_emisor', $usuarioAutenticado)
            ->orWhere('id_receptor', $usuarioAutenticado)
            ->with(['emisor', 'receptor', 'ultimoMensaje'])
            ->orderByDesc('fecha_ultimo_mensaje')
            ->get();

        return Inertia::render('conversaciones/index', [
            'conversaciones' => $conversaciones,
            'mostrar_dialog_bienvenida' => session('mostrar_dialog_bienvenida', false),
            'cantidad_mensajes_no_leidos' => $cantidadMensajesNoLeidos,
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
        //dd($request->all());

        $validated = $request->validated();

        $conversacion = DB::transaction(function () use ($validated) {
            // Crear conversación
            $conversacion = Conversacion::create([
                'asunto' => $validated['asunto'],
                'desplazamiento_asunto' => $validated['desplazamiento_asunto'],
                'excepciones_asunto' => $validated['excepciones_asunto'] ?? null,
                'id_emisor' => auth()->id(),
                'id_receptor' => $validated['id_receptor'],
                'fecha_ultimo_mensaje' => now(),
            ]);

            // Crear primer mensaje
            Mensaje::create([
                'conversacion_id' => $conversacion->id,
                'emisor_id' => auth()->id(),
                'contenido' => $validated['contenido'],
                'desplazamiento_contenido' => $validated['desplazamiento_contenido'],
                'excepciones_contenido' => $validated['excepciones_contenido'] ?? null,
            ]);

            return $conversacion;
        });

        return redirect()->route('conversaciones.index');
    }

    /**
     * Muestra conversación con todos sus mensajes (vista tipo chat).
     */
    public function show(Conversacion $conversacion)
    {
        //dd($conversacion);

        $usuarioAutenticado = auth()->id();

        $conversacion->load([
            'emisor',
            'receptor',
            'mensajes' => fn ($q) => $q->with('emisor')->orderBy('created_at'),
        ]);

        // Marcar mensajes no leídos como leídos
        $conversacion->mensajes()
            ->where('emisor_id', '!=', $usuarioAutenticado)
            ->where('leido', false)
            ->update(['leido' => true]);

        return Inertia::render('conversaciones/show', [
            'conversacion' => $conversacion,
        ]);
    }

    public function enviados() {
        $usuarioAutenticado = auth()->id();

        $conversaciones = Conversacion::query()
            ->where('id_emisor', $usuarioAutenticado)
            ->with(['emisor', 'receptor', 'ultimoMensaje'])
            ->orderByDesc('fecha_ultimo_mensaje')
            ->get();

        return Inertia::render('conversaciones/enviados', [
            'conversaciones' => $conversaciones,
        ]);
    }
}
