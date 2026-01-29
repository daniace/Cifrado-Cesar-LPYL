<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('mensajes', function (Blueprint $table) {
            $table->id();
            $table->string('asunto');
            $table->text('contenido');
            $table->integer('desplazamiento');
            $table->json('excepciones_asunto')->nullable();
            $table->json('excepciones_contenido')->nullable();
            $table->foreignId('id_emisor')->constrained('usuarios');
            $table->foreignId('id_receptor')->constrained('usuarios');
            $table->boolean('leido')->default(false);
            $table->uuid('id_conversacion')->unique();
            $table->foreignId('id_mensaje_anterior')->nullable()->constrained('mensajes');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mensajes');
    }
};
