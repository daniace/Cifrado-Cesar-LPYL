<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreConversacionRequest extends FormRequest
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
            'desplazamiento_asunto' => 'required|integer|min:1|max:25',
            'excepciones_asunto' => 'nullable|array',
            'id_receptor' => 'required|exists:users,id',
            // Primer mensaje
            'contenido' => 'required|string',
            'desplazamiento_contenido' => 'required|integer|min:1|max:25',
            'excepciones_contenido' => 'nullable|array',
        ];
    }
}
