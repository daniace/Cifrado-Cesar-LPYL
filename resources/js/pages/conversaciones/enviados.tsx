import { Head, usePoll } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, User } from '@/types';
import { ConversacionModelo } from '@/types/conversacion-modelo';
import { useState } from 'react';
import { PenSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import ListaConversaciones from './componentes/lista-conversaciones';
import DetalleConversacion from './componentes/detalle-conversacion';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Enviados',
        href: '/conversaciones/enviados',
    },
];

interface Props {
    conversaciones: ConversacionModelo[];
    usuarios_receptores: User[];
}

export default function Enviados({ conversaciones, usuarios_receptores }: Props) {
    const [conversacionSeleccionada, setConversacionSeleccionada] = useState<ConversacionModelo | null>(null);

    usePoll(5000, {
        only: ["conversaciones"]
    },
        {
            keepAlive: true
        }
    )

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Enviados" />

            <div className="flex flex-col gap-4 p-4">
                {/* Header con botón de nueva conversación */}
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Enviados</h1>
                    <Link href="/conversaciones/create">
                        <Button>
                            <PenSquare className="w-4 h-4 mr-2" />
                            Nuevo Mensaje
                        </Button>
                    </Link>
                </div>

                <div className="flex flex-row gap-4 mt-8">
                    <ListaConversaciones
                        conversaciones={conversaciones}
                        onSelect={setConversacionSeleccionada}
                        seleccionada={conversacionSeleccionada}
                        usuarios={usuarios_receptores}
                    />
                    <DetalleConversacion conversacion={conversacionSeleccionada || null} />
                </div>

            </div>


        </AppLayout>
    );
}
