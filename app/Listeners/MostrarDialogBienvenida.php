<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Auth\Events\Login;
use App\Models\User;

class MostrarDialogBienvenida
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(Login $event): void
    {
        $user = User::whereKey($event->user->getAuthIdentifier())->first();
        // Solo mostrar el dialog si el usuario ya había iniciado sesión antes
        // Quizas lo cambio para tambien mostrarlo pero cambiar el mensaje de bienvenida
        if (!is_null($user->ultima_conexion)) {
            session()->flash('mostrar_dialog_bienvenida', true);
        }
    }
}
