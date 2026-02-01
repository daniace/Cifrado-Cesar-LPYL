<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\MensajeController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::resource('mensajes', MensajeController::class)->middleware('auth');
Route::get('/enviados', [MensajeController::class, 'enviados'])->name('mensajes.enviados')->middleware('auth');

require __DIR__.'/settings.php';
