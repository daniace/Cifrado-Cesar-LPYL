<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Auth\Events\Logout;
use App\Models\User;

class ActualizarUltimoAcceso
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
    public function handle(Logout $event): void
    {
        if (! $event->user){
            return;
        }

        User::whereKey(
            $event->user->getAuthIdentifier()
            )->update([
                'ultima_conexion' => now()
            ],
        );
    }
}
