import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/mensajes';
import type { BreadcrumbItem } from '@/types';
import { MensajeModelo } from '@/types/mensaje-modelo';
import { User } from '@/types/auth';
import descifrar from '@/lib/descifrar';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Index',
        href: index().url,
    },
];

export default function Index({ mensajes, remitente }: { mensajes: MensajeModelo[], remitente: User }) {
    const [detalle, setDetalle] = useState<string>('');
    const handleDetalle = (id: number) => {
        const mensaje = mensajes.find((mensaje) => mensaje.id === id);
        if (mensaje) {
            setDetalle(descifrar(mensaje.contenido, mensaje.desplazamiento, mensaje.excepciones_contenido));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Index" />
            <div className='grid grid-cols-2 gap-4 py-4'>
                <div id='lista-mensajes' className='border border-gray-300 rounded-lg p-4'>
                    <h1 className='font-bold'>Mensajes</h1>
                    <ul>
                        {mensajes.map((mensaje) => (
                            <li key={mensaje.id} onClick={() => handleDetalle(mensaje.id)}>{descifrar(mensaje.asunto, mensaje.desplazamiento, mensaje.excepciones_asunto)}</li>
                        ))}
                    </ul>
                </div>
                <div id='detalle-mensaje' className='border border-gray-300 rounded-lg p-4'>
                    <h1 className='font-bold'>Detalle del mensaje</h1>
                    <p>{detalle}</p>
                    <div className='flex gap-2 mt-2' style={{ display: detalle ? 'flex' : 'none' }}>
                        <input type="text" className='border border-gray-300 rounded-lg p-2' placeholder='Responder' />
                        <button className='bg-blue-500 text-white px-4 py-2 rounded-lg'>Responder</button>
                        <button className='bg-red-500 text-white px-4 py-2 rounded-lg' onClick={() => setDetalle('')}>Cerrar</button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
