import { Head, Form, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { User } from '@/types/auth';
import cifrar from '@/lib/cifrar';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { index, create, store } from '@/actions/App/Http/Controllers/ConversacionController';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Conversaciones', href: index().url },
    { title: 'Nueva Conversación', href: create().url },
];

interface Props {
    usuarios: User[];
}

export default function Create({ usuarios }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nueva Conversación" />

            <div className="max-w-2xl mx-auto p-4">
                <h1 className="text-2xl font-bold mb-6">Nueva Conversación</h1>

                <Form
                    method="post"
                    action={store().url}
                    className="space-y-4"
                    transform={(data) => {
                        const asuntoCifrado = cifrar(String(data.asunto), Number(data.desplazamiento));
                        const contenidoCifrado = cifrar(String(data.contenido), Number(data.desplazamiento));
                        return {
                            asunto: asuntoCifrado.texto,
                            desplazamiento_asunto: Number(data.desplazamiento),
                            excepciones_asunto: asuntoCifrado.excepciones,
                            id_receptor: data.id_receptor,
                            contenido: contenidoCifrado.texto,
                            desplazamiento_contenido: Number(data.desplazamiento),
                            excepciones_contenido: contenidoCifrado.excepciones,
                        };
                    }}
                >
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Destinatario
                        </label>
                        <select
                            name="id_receptor"
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white"
                            required
                        >
                            <option value="">Selecciona un usuario</option>
                            {usuarios.map((usuario) => (
                                <option key={usuario.id} value={usuario.id}>
                                    {usuario.nombre_usuario} ({usuario.email})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Desplazamiento (1-25)
                        </label>
                        <Input
                            type="number"
                            name="desplazamiento"
                            min={1}
                            max={25}
                            defaultValue={3}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Asunto
                        </label>
                        <Input
                            type="text"
                            name="asunto"
                            placeholder="Asunto de la conversación"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Mensaje
                        </label>
                        <textarea
                            name="contenido"
                            placeholder="Escribe tu mensaje..."
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white min-h-[150px]"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <Send className="w-4 h-4" />
                        Enviar Conversación
                    </button>
                </Form>
            </div>
        </AppLayout>
    );
}
