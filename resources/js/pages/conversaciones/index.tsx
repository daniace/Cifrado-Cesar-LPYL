import { Head, usePage, usePoll } from '@inertiajs/react';
import { useMemo, useState } from 'react';

import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/conversaciones';
import type { BreadcrumbItem, User } from '@/types';
import type { ConversacionModelo } from '@/types/conversacion-modelo';

import DetalleConversacion from './componentes/detalle-conversacion';
import { DialogBienvenida } from './componentes/dialog-bienvenida';
import ListaConversaciones from './componentes/lista-conversaciones';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Recibidos',
        href: index().url,
    },
];

interface Props {
    conversaciones: ConversacionModelo[];
    cantidad_mensajes_no_leidos: number;
    usuarios_emisores: User[];
}

export default function Index({ conversaciones, cantidad_mensajes_no_leidos, usuarios_emisores }: Props) {
    const { mostrar_dialog_bienvenida } = usePage<{ mostrar_dialog_bienvenida: boolean }>().props;
    const [conversacionSeleccionadaId, setConversacionSeleccionadaId] = useState<number | null>(null);

    usePoll(5000, {
        only: ["conversaciones"]
    },
        {
            keepAlive: true
        }
    )

    // Mandar la conversacion al detalle mensaje
    const conversacionSeleccionada = useMemo(() => {
        if (conversacionSeleccionadaId === null) return null;
        return conversaciones.find(conversacion => conversacion.id === conversacionSeleccionadaId) ?? null;
    }, [conversaciones, conversacionSeleccionadaId]);

    const handleSelectConversacion = (conversacion: ConversacionModelo | null) => {
        setConversacionSeleccionadaId(conversacion?.id ?? null);
    };

    // Alternativa con UseEffect (No se hizo por afectar al rendimiento segun Docs)
    // useEffect(() => {
    //     if (conversacionSeleccionadaId !== null) {
    //         const conversacion = conversaciones.find(conversacion => conversacion.id === conversacionSeleccionadaId);
    //         if (conversacion) {
    //             setConversacionSeleccionada(conversacion);
    //         }
    //     }
    // }, [conversaciones, conversacionSeleccionadaId]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Recibidos" />

            {mostrar_dialog_bienvenida && (
                <DialogBienvenida cantidad_mensajes_no_leidos={cantidad_mensajes_no_leidos} />
            )}

            <div className="flex flex-col gap-4 p-4">
                {/* Header con botón de nueva conversación */}
                <div className="flex items-center">
                    <h1 className="text-2xl font-bold">Recibidos</h1>
                </div>

                <div className="flex flex-row">
                    <ListaConversaciones
                        conversaciones={conversaciones}
                        onSelect={handleSelectConversacion}
                        seleccionada={conversacionSeleccionada}
                        usuarios={usuarios_emisores}
                    />
                    <DetalleConversacion conversacion={conversacionSeleccionada || null} />
                </div>

            </div>


        </AppLayout>
    );
}
