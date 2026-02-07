import { Head, usePage, usePoll } from '@inertiajs/react';
import { useState } from 'react';

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
    // const [conversacionSeleccionadaId, setConversacionSeleccionadaId] = useState<number | null>(null);
    const [conversacionSeleccionada, setConversacionSeleccionada] = useState<ConversacionModelo | null>(null);

    usePoll(5000, {
        only: ["conversaciones"]
    },
        {
            keepAlive: true
        }
    )

    const handleSelectConversacion = (conversacion: ConversacionModelo | null) => {
        setConversacionSeleccionada(conversacion);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Recibidos" />

            {mostrar_dialog_bienvenida && (
                <DialogBienvenida cantidad_mensajes_no_leidos={cantidad_mensajes_no_leidos} />
            )}

            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center">
                    <h1 className="text-2xl font-bold">Recibidos</h1>
                </div>

                <div className="flex flex-row gap-2">
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
