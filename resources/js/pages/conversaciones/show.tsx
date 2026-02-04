import { Head, Form, usePage, usePoll } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { User } from '@/types/auth';
import descifrar from '@/lib/descifrar';
import cifrar from '@/lib/cifrar';
import { ArrowLeft, Send } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { index, show } from '@/actions/App/Http/Controllers/ConversacionController';
import { store as storeMensaje } from '@/actions/App/Http/Controllers/MensajeController';

interface Mensaje {
    id: number;
    conversacion_id: number;
    emisor_id: number;
    contenido: string;
    desplazamiento_contenido: number;
    excepciones_contenido: Record<number, string> | null;
    leido: boolean;
    created_at: string;
    emisor: User;
}

interface Conversacion {
    id: number;
    asunto: string;
    desplazamiento_asunto: number;
    excepciones_asunto: Record<number, string> | null;
    id_emisor: number;
    id_receptor: number;
    emisor: User;
    receptor: User;
    mensajes: Mensaje[];
}

interface Props {
    conversacion: Conversacion;
}

export default function Show({ conversacion }: Props) {
    const { auth } = usePage<{ auth: { user: User } }>().props;

    usePoll(5000, {
        only: ['conversacion'],
    });

    const asuntoDescifrado = descifrar(
        conversacion.asunto,
        conversacion.desplazamiento_asunto,
        conversacion.excepciones_asunto ?? {}
    );

    const otroUsuario = conversacion.id_emisor === auth.user.id
        ? conversacion.receptor
        : conversacion.emisor;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Conversaciones', href: index().url },
        { title: asuntoDescifrado, href: show(conversacion.id).url },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={asuntoDescifrado} />

            <div className="flex flex-col h-[calc(100vh-8rem)]">
                {/* Header */}
                <div className="border-b border-gray-700 p-4">
                    <div className="flex items-center gap-4">
                        <Link
                            href={index().url}
                            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="font-bold text-lg">{asuntoDescifrado}</h1>
                            <p className="text-sm text-gray-400">
                                Conversación con {otroUsuario?.nombre_usuario ?? 'Usuario'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Mensajes */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {conversacion.mensajes.map((mensaje) => {
                        const isMe = mensaje.emisor_id === auth.user.id;
                        const contenidoDescifrado = descifrar(
                            mensaje.contenido,
                            mensaje.desplazamiento_contenido,
                            mensaje.excepciones_contenido ?? {}
                        );

                        return (
                            <div
                                key={mensaje.id}
                                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[75%] rounded-lg p-3 ${isMe
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-700 text-white'
                                        }`}
                                >
                                    <p className="text-xs font-semibold mb-1 opacity-75">
                                        {mensaje.emisor?.nombre_usuario ?? 'Usuario'}
                                    </p>
                                    <p>{contenidoDescifrado}</p>
                                    <p className="text-[10px] opacity-50 text-right mt-1">
                                        {new Date(mensaje.created_at).toLocaleString('es-AR')}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Formulario de respuesta */}
                <div className="border-t border-gray-700 p-4">
                    <Form
                        method="post"
                        action={storeMensaje(conversacion.id).url}
                        className="flex gap-2"
                        transform={(data) => {
                            const contenidoCifrado = cifrar(String(data.contenido), Number(data.desplazamiento_contenido));
                            return {
                                contenido: contenidoCifrado.texto,
                                desplazamiento_contenido: Number(data.desplazamiento_contenido),
                                excepciones_contenido: contenidoCifrado.excepciones,
                            };
                        }}
                    >
                        <Input
                            type="number"
                            name="desplazamiento_contenido"
                            min={1}
                            max={25}
                            defaultValue={3}
                            className="w-20"
                            placeholder="Desp."
                        />
                        <Input
                            type="text"
                            name="contenido"
                            placeholder="Escribe un mensaje..."
                            className="flex-1"
                            required
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <Send className="w-4 h-4" />
                            Enviar
                        </button>
                    </Form>
                </div>
            </div>
        </AppLayout>
    );
}
