<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMensajeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'asunto' => 'required|string|max:255',
            'contenido' => 'required|string',
            'desplazamiento' => 'required|integer',
            'id_emisor' => 'required|exists:usuarios,id',
            'id_receptor' => 'required|exists:usuarios,id',
            'leido' => 'required|boolean',
            'id_conversacion' => 'required|uuid|unique:mensajes,id_conversacion',
            'id_mensaje_anterior' => 'nullable|exists:mensajes,id',
        ];
    }
}
