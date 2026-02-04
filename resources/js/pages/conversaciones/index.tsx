import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { User } from '@/types/auth';
import descifrar from '@/lib/descifrar';
import { Circle, Plus } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { index, show, create } from '@/actions/App/Http/Controllers/ConversacionController';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Conversaciones',
        href: index().url,
    },
];

interface Mensaje {
    id: number;
    contenido: string;
    emisor_id: number;
    leido: boolean;
    created_at: string;
}

interface Conversacion {
    id: number;
    asunto: string;
    desplazamiento_asunto: number;
    excepciones_asunto: Record<number, string> | null;
    id_emisor: number;
    id_receptor: number;
    fecha_ultimo_mensaje: string;
    emisor: User;
    receptor: User;
    ultimo_mensaje: Mensaje | null;
}

interface Props {
    conversaciones: Conversacion[];
}

export default function Index({ conversaciones }: Props) {
    const { auth } = usePage<{ auth: { user: User } }>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Conversaciones" />

            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Bandeja de Entrada</h1>
                    <Link
                        href={create().url}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Nueva Conversación
                    </Link>
                </div>

                {conversaciones.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <p>No tienes conversaciones aún.</p>
                        <p className="text-sm mt-2">¡Inicia una nueva conversación!</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {conversaciones.map((conversacion) => {
                            const otroUsuario = conversacion.id_emisor === auth.user.id
                                ? conversacion.receptor
                                : conversacion.emisor;

                            const asuntoDescifrado = descifrar(
                                conversacion.asunto,
                                conversacion.desplazamiento_asunto,
                                conversacion.excepciones_asunto ?? {}
                            );

                            return (
                                <Link
                                    key={conversacion.id}
                                    href={show(conversacion.id).url}
                                    className="block border border-gray-700 rounded-lg p-4 hover:bg-gray-800 transition-colors"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-white">
                                                    {otroUsuario?.nombre_usuario ?? 'Usuario'}
                                                </span>
                                                {conversacion.ultimo_mensaje && !conversacion.ultimo_mensaje.leido && conversacion.ultimo_mensaje.emisor_id !== auth.user.id && (
                                                    <Circle className="w-3 h-3 text-blue-500 fill-blue-500" />
                                                )}
                                            </div>
                                            <div className="font-medium text-gray-300 mt-1">
                                                {asuntoDescifrado}
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {conversacion.fecha_ultimo_mensaje
                                                ? new Date(conversacion.fecha_ultimo_mensaje).toLocaleDateString('es-AR')
                                                : ''}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
