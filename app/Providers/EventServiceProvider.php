<?php

namespace App\Providers;

use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;
use App\Listeners\MostrarDialogBienvenida;
use App\Listeners\ActualizarUltimoAcceso;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }

    protected $listen = [
        Login::class => [
            MostrarDialogBienvenida::class,
        ],
        Logout::class => [
            ActualizarUltimoAcceso::class,
        ],
    ];
}
