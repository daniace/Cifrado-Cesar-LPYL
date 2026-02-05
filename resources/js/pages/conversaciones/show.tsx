import { Head, Form, usePage, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { ConversacionModelo } from '@/types/conversacion-modelo';
import { User } from '@/types/auth';
import descifrar from '@/lib/descifrar';
import cifrar from '@/lib/cifrar';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Send } from 'lucide-react';

export default function Show({ conversacion }: { conversacion: ConversacionModelo }) {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const [contenido, setContenido] = useState('');
    const [desplazamiento, setDesplazamiento] = useState(1);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Conversaciones',
            href: '/conversaciones',
        },
        {
            title: descifrar(String(conversacion.asunto), Number(conversacion.desplazamiento_asunto), conversacion.excepciones_asunto as Record<number, string>),
            href: `/conversaciones/${conversacion.id}`,
        },
    ];

    // Determinar el otro usuario en la conversación
    const otroUsuario = conversacion.id_emisor === auth.user.id
        ? conversacion.receptor
        : conversacion.emisor;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={descifrar(String(conversacion.asunto), Number(conversacion.desplazamiento_asunto), conversacion.excepciones_asunto as Record<number, string>)} />

            <div className="flex flex-col h-[calc(100vh-200px)] p-4">
                {/* Header */}
                <div className="flex items-center gap-4 pb-4 border-b border-gray-300">
                    <Link href="/conversaciones">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold">
                            {descifrar(String(conversacion.asunto), Number(conversacion.desplazamiento_asunto), conversacion.excepciones_asunto as Record<number, string>)}
                        </h1>
                        <p className="text-sm text-gray-500">
                            Conversación con {otroUsuario?.nombre} {otroUsuario?.apellido}
                        </p>
                    </div>
                </div>

                {/* Mensajes */}
                <div className="flex-1 overflow-y-auto py-4 space-y-4">
                    {conversacion.mensajes && conversacion.mensajes.length > 0 ? (
                        conversacion.mensajes.map((mensaje) => {
                            const isMe = mensaje.emisor_id === auth.user.id;
                            return (
                                <div
                                    key={mensaje.id}
                                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[70%] rounded-lg p-3 ${isMe ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white'}`}
                                    >
                                        <p>
                                            {descifrar(
                                                String(mensaje.contenido),
                                                Number(mensaje.desplazamiento_contenido),
                                                mensaje.excepciones_contenido as Record<number, string>
                                            )}
                                        </p>
                                        <div className="text-[10px] text-gray-300 text-right mt-1">
                                            {new Date(mensaje.created_at).toLocaleString('es-AR')}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-center text-gray-500 italic">No hay mensajes en esta conversación.</p>
                    )}
                </div>

                {/* Formulario de respuesta */}
                <Form
                    method="post"
                    action={`/conversaciones/${conversacion.id}/mensajes`}
                    disableWhileProcessing
                    onSubmit={(e) => {
                        e.preventDefault();
                    }}
                    transform={(data) => {
                        const cifradoContenido = cifrar(String(data.contenido), Number(data.desplazamiento));
                        return {
                            contenido: cifradoContenido.texto,
                            desplazamiento_contenido: Number(data.desplazamiento),
                            excepciones_contenido: cifradoContenido.excepciones,
                        };
                    }}
                    onSuccess={() => {
                        setContenido('');
                    }}
                    className="border-t border-gray-300 pt-4"
                >
                    <div className="flex gap-2 items-end">
                        <div className="shrink-0 w-20">
                            <Input
                                type="number"
                                name="desplazamiento"
                                min={1}
                                max={25}
                                value={desplazamiento}
                                onChange={(e) => setDesplazamiento(Number(e.target.value))}
                                placeholder="Clave"
                                className="text-center"
                            />
                        </div>
                        <div className="flex-1">
                            <Input
                                type="text"
                                name="contenido"
                                value={contenido}
                                onChange={(e) => setContenido(e.target.value)}
                                placeholder="Escribe un mensaje..."
                            />
                        </div>
                        <Button type="submit" disabled={!contenido.trim()}>
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </Form>
            </div>
        </AppLayout>
    );
}
