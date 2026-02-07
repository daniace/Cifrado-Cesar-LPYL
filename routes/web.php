<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\ConversacionController;
use App\Http\Controllers\MensajeController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

// Nuevas rutas para conversaciones
Route::middleware('auth')->group(function () {
    
    Route::get('conversaciones/enviados', [ConversacionController::class, 'enviados'])
        ->name('conversaciones.enviados');

    Route::get('conversaciones/componentes/detalle-conversacion/{conversacion}', [ConversacionController::class, 'detalleConversacion'])
        ->name('conversaciones.componentes.detalle-conversacion');

    Route::resource('conversaciones', ConversacionController::class)
        ->only(['index', 'create', 'store'])
        ->parameters(['conversaciones' => 'conversacion']);

    Route::resource('conversaciones.mensajes', MensajeController::class)
        ->only(['store'])
        ->shallow()
        ->parameters(['conversaciones' => 'conversacion']);

    Route::patch('/conversaciones/{conversacion}/leer', [ConversacionController::class, 'marcarLeida'])
        ->name('conversaciones.leer');
});

require __DIR__.'/settings.php';

