<?php

use App\Http\Controllers\ConversacionController;
use App\Http\Controllers\MensajeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('conversaciones/sent', [ConversacionController::class, 'sent'])
        ->name('conversaciones.sent');

    Route::get('conversaciones/{conversacion}/mensajes', [ConversacionController::class, 'getMensajes'])
        ->name('conversaciones.mensajes');

    Route::resource('conversaciones', ConversacionController::class)
        ->only(['index', 'create', 'store', 'show'])
        ->parameters(['conversaciones' => 'conversacion']);

    Route::resource('conversaciones.mensajes', MensajeController::class)
        ->only(['store'])
        ->parameters(['conversaciones' => 'conversacion']);

    Route::patch('/mensajes/{mensaje}', [MensajeController::class, 'update'])
        ->name('mensajes.update');
});

require __DIR__.'/settings.php';
