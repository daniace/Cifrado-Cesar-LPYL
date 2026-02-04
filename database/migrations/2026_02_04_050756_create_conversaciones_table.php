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
        Schema::create('conversaciones', function (Blueprint $table) {
            $table->id();
            $table->string('asunto');
            $table->integer('desplazamiento_asunto');
            $table->json('excepciones_asunto')->nullable();
            $table->foreignId('id_emisor')->constrained('users');
            $table->foreignId('id_receptor')->constrained('users');
            $table->timestamp('fecha_ultimo_mensaje')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('conversaciones');
    }
};
