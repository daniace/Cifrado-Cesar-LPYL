import { Head, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { ConversacionModelo } from '@/types/conversacion-modelo';
import { User } from '@/types/auth';
import descifrar from '@/lib/descifrar';
import { useState, useMemo } from 'react';
import { Circle, PenSquare, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { DialogBienvenida } from './componentes/dialog-bienvenida';
import { show } from '@/routes/conversaciones';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Conversaciones',
        href: '/conversaciones',
    },
];

interface Props {
    conversaciones: ConversacionModelo[];
    cantidad_mensajes_no_leidos: number;
}

export default function Index({ conversaciones, cantidad_mensajes_no_leidos }: Props) {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const { mostrar_dialog_bienvenida } = usePage<{ mostrar_dialog_bienvenida: boolean }>().props;
    const [conversacionSeleccionada, setConversacionSeleccionada] = useState<ConversacionModelo | null>(null);

    // Ordenar por fecha_ultimo_mensaje descendente
    const conversacionesOrdenadas = useMemo(() => {
        return [...conversaciones].sort((a, b) => {
            const fechaA = a.fecha_ultimo_mensaje ? new Date(a.fecha_ultimo_mensaje).getTime() : 0;
            const fechaB = b.fecha_ultimo_mensaje ? new Date(b.fecha_ultimo_mensaje).getTime() : 0;
            return fechaB - fechaA;
        });
    }, [conversaciones]);

    const handleConversacionClick = (conversacion: ConversacionModelo) => {
        // Navegar a la vista de la conversación
        router.visit(`/conversaciones/${conversacion.id}`);
    };

    // Determinar el otro usuario en la conversación
    const getOtroUsuario = (conv: ConversacionModelo): User | undefined => {
        if (conv.id_emisor === auth.user.id) {
            return conv.receptor;
        }
        return conv.emisor;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Conversaciones" />

            {mostrar_dialog_bienvenida && (
                <DialogBienvenida cantidad_mensajes_no_leidos={cantidad_mensajes_no_leidos} />
            )}

            <div className="flex flex-col gap-4 p-4">
                {/* Header con botón de nueva conversación */}
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Bandeja de entrada</h1>
                    <Link href="/conversaciones/create">
                        <Button>
                            <PenSquare className="w-4 h-4 mr-2" />
                            Nueva conversación
                        </Button>
                    </Link>
                </div>

                {/* Lista de conversaciones */}
                <div className="border border-gray-300 rounded-lg p-4">
                    {conversacionesOrdenadas.length === 0 ? (
                        <p className="text-gray-500 italic">No tienes conversaciones aún.</p>
                    ) : (
                        <ul className="space-y-2">
                            {conversacionesOrdenadas.map((conv) => {
                                const otroUsuario = getOtroUsuario(conv);
                                const tieneNoLeidos = conv.ultimo_mensaje &&
                                    conv.ultimo_mensaje.emisor_id !== auth.user.id &&
                                    !conv.ultimo_mensaje.leido;

                                return (
                                    <li
                                        key={conv.id}
                                        // onClick={() => handleConversacionClick(conv)}
                                        onClick={() => router.visit(show(conv.id).url, {
                                            only: ['conversacion'],
                                        })}
                                        // onClick={() => alert(JSON.stringify(conv.id))}
                                        className={`border border-gray-300 rounded-lg p-3 cursor-pointer hover:bg-gray-800 transition-colors ${conversacionSeleccionada?.id === conv.id ? 'bg-gray-800' : ''
                                            }`}
                                    >
                                        <div className="grid grid-cols-[1fr_auto] gap-2">
                                            <div className="min-w-0">
                                                <div className="font-bold truncate">
                                                    {otroUsuario?.nombre} {otroUsuario?.apellido}
                                                </div>
                                                <div className="font-medium text-sm truncate">
                                                    {descifrar(conv.asunto, conv.desplazamiento_asunto, conv.excepciones_asunto as Record<number, string>)}
                                                </div>
                                                {conv.ultimo_mensaje && (
                                                    <div className="text-xs text-gray-500 truncate">
                                                        {descifrar(
                                                            conv.ultimo_mensaje.contenido,
                                                            conv.ultimo_mensaje.desplazamiento_contenido,
                                                            conv.ultimo_mensaje.excepciones_contenido as Record<number, string>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                <div className="text-xs text-gray-400">
                                                    {conv.fecha_ultimo_mensaje
                                                        ? new Date(conv.fecha_ultimo_mensaje).toLocaleDateString('es-AR')
                                                        : ''}
                                                </div>
                                                {tieneNoLeidos && (
                                                    <Circle className="w-3 h-3 text-blue-500 fill-blue-500" />
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                );



                            })}
                        </ul>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
