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

// Route::get('dashboard', function () {
//     return Inertia::render('dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

// Nuevas rutas para conversaciones
Route::middleware('auth')->group(function () {
    
    Route::get('conversaciones/enviados', [ConversacionController::class, 'enviados'])
        ->name('conversaciones.enviados');

    Route::resource('conversaciones', ConversacionController::class)
        ->only(['index', 'create', 'store', 'show'])
        ->parameters(['conversaciones' => 'conversacion']);

    Route::resource('conversaciones.mensajes', MensajeController::class)
        ->only(['store'])
        ->shallow()
        ->parameters(['conversaciones' => 'conversacion']);

    Route::patch('/conversaciones/{conversacion}/leer', [ConversacionController::class, 'marcarLeida'])
        ->name('conversaciones.leer');
});

require __DIR__.'/settings.php';

