import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/mensajes';
import type { BreadcrumbItem } from '@/types';
import { MensajeModelo } from '@/types/mensaje-modelo';
import { User } from '@/types/auth';
import descifrar from '@/lib/descifrar';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Index',
        href: index().url,
    },
];

export default function Index({ mensajes, remitente }: { mensajes: MensajeModelo[], remitente: User }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Index" />
            <div className='grid grid-cols-2 gap-4 py-4'>
                <div id='lista-mensajes' className='border border-gray-300 rounded-lg p-4'>
                    <h1>Mensajes</h1>
                    <ul>
                        {mensajes.map((mensaje) => (
                            <li key={mensaje.id}>{descifrar(mensaje.asunto, mensaje.desplazamiento, mensaje.excepciones_asunto)}</li>
                        ))}
                    </ul>
                </div>
                <div id='detalle-mensaje' className='border border-gray-300 rounded-lg p-4'>
                    <h1>Detalle del mensaje</h1>
                </div>
            </div>
        </AppLayout>
    );
}
