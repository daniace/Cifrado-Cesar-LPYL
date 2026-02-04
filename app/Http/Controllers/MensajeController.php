<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMensajeRequest;
use App\Http\Requests\UpdateMensajeRequest;
use App\Models\Mensaje;
use App\Models\User;
use Inertia\Inertia;

class MensajeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $usuarioAutenticado = auth()->user()->id;

        $mensajes = Mensaje::where(function ($query) use ($usuarioAutenticado) {
            $query->where('id_receptor', $usuarioAutenticado);
        })->orderBy('created_at', 'asc')->get();

        foreach ($mensajes as $mensaje) {
            $emisores[] = User::where('id', '=', $mensaje->id_emisor)->first();
        }

        return Inertia::render('mensajes/index', [
            'mensajes' => $mensajes,
            'emisores' => $emisores,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Todos los usuarios excepto el autenticado
        $usuarios = User::where('id', '!=', auth()->user()->id)->get();

        return Inertia::render('mensajes/create', [
            'usuarios' => $usuarios,
        ]);

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMensajeRequest $request)
    {
        //
        // dd($request->all());
        $validated = $request->validated();

        Mensaje::create($validated);

        return redirect()->route('mensajes.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Mensaje $mensaje)
    {
        //
        return Inertia::render('mensajes/componentes/test-detalle', [
            'mensajes' => Mensaje::where('id_conversacion', $mensaje->id_conversacion)->get(),
            'usuario' => User::where('id', $mensaje->id_emisor)->first(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Mensaje $mensaje)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMensajeRequest $request, Mensaje $mensaje)
    {
        // dd($request->all());
        if ($request->validated()) {
            $mensaje->marcarLeido();
        }
        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Mensaje $mensaje)
    {
        //
    }

    public function enviados()
    {
        $usuarioAutenticado = auth()->user()->id;
        return Inertia::render('mensajes/enviados', [
            'mensajes' => Mensaje::where(function ($query) use ($usuarioAutenticado) {
                $query->where('id_emisor', $usuarioAutenticado);
            })->orderBy('created_at', 'asc')->get(),
        ]);
    }
}
