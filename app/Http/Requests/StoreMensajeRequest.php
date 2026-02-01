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
            'desplazamiento' => 'required|integer|min:1',
            'excepciones_asunto' => 'nullable|array',
            'excepciones_contenido' => 'nullable|array',
            'id_emisor' => 'required|exists:users,id',
            'id_receptor' => 'required|exists:users,id',
            'leido' => 'required|boolean',
            'id_conversacion' => 'required|uuid',
            'id_mensaje_anterior' => 'nullable|exists:mensajes,id',
        ];

        // // Para propositos de testeo
        // return [
        //     'asunto' => 'nullable|string|max:255',
        //     'contenido' => 'nullable|string',
        //     'desplazamiento' => 'nullable|integer',
        //     'excepciones_asunto' => 'nullable|array',
        //     'excepciones_contenido' => 'nullable|array',
        //     'id_emisor' => 'nullable|exists:users,id',
        //     'id_receptor' => 'nullable|exists:users,id',
        //     'leido' => 'nullable|boolean',
        //     'id_conversacion' => 'nullable|uuid',
        //     'id_mensaje_anterior' => 'nullable|exists:mensajes,id',
        // ];
    }
}
