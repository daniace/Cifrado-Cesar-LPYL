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
        // Drop old mensajes table
        Schema::dropIfExists('mensajes');

        // Create new mensajes table with new structure
        Schema::create('mensajes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('conversacion_id')->constrained('conversaciones')->onDelete('cascade');
            $table->foreignId('emisor_id')->constrained('users');
            $table->text('contenido');
            $table->integer('desplazamiento_contenido');
            $table->json('excepciones_contenido')->nullable();
            $table->boolean('leido')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mensajes');

        // Recreate old structure (simplified for rollback)
        Schema::create('mensajes', function (Blueprint $table) {
            $table->id();
            $table->string('asunto');
            $table->text('contenido');
            $table->integer('desplazamiento');
            $table->json('excepciones_asunto')->nullable();
            $table->json('excepciones_contenido')->nullable();
            $table->foreignId('id_emisor')->constrained('users');
            $table->foreignId('id_receptor')->constrained('users');
            $table->boolean('leido')->default(false);
            $table->uuid('id_conversacion');
            $table->foreignId('id_mensaje_anterior')->nullable()->constrained('mensajes');
            $table->timestamps();
        });
    }
};
