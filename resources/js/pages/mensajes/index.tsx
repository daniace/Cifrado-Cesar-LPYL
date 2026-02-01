import { Head, Form, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/mensajes';
import type { BreadcrumbItem } from '@/types';
import { MensajeModelo } from '@/types/mensaje-modelo';
import { User } from '@/types/auth';
import descifrar from '@/lib/descifrar';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { store } from '@/routes/mensajes';
import cifrar from '@/lib/cifrar';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Index',
        href: index().url,
    },
];

export default function Index({ mensajes }: { mensajes: MensajeModelo[] }) {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const [mensajeSeleccionado, setMensajeSeleccionado] = useState<MensajeModelo | null>(null);
    const handleMensajeSeleccionado = (mensaje: MensajeModelo) => {
        setMensajeSeleccionado(mensaje);
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Index" />
            <div className='grid grid-cols-2 gap-4 py-4'>
                <div id='lista-mensajes' className='border border-gray-300 rounded-lg p-4'>
                    <h1 className='font-bold'>Mensajes</h1>
                    <ul>
                        {mensajes.map((mensaje) => (
                            <li
                                key={mensaje.id}
                                onClick={() => handleMensajeSeleccionado(mensaje)}
                                className='border border-gray-300 rounded-lg p-2 cursor-pointer hover:bg-gray-800'
                            >{descifrar(mensaje.asunto, mensaje.desplazamiento, mensaje.excepciones_asunto)}</li>
                        ))}
                    </ul>
                </div>
                <div id='detalle-mensaje' className='border border-gray-300 rounded-lg p-4'>
                    <h1 className='font-bold'>Detalle del mensaje</h1>
                    <p>{descifrar(String(mensajeSeleccionado?.contenido), Number(mensajeSeleccionado?.desplazamiento), mensajeSeleccionado?.excepciones_contenido as Record<number, string>)}</p>
                    <div className='flex gap-2 mt-2' style={{ display: mensajeSeleccionado ? 'flex' : 'none' }}>
                        <Form
                            method='post'
                            action={store().url}
                            id='form-responder'
                            className='flex gap-2 flex-col w-full border border-gray-300 rounded-lg p-4'
                            transform={data => {
                                const asuntoCifrado = cifrar(String(data.asunto), Number(data.desplazamiento));
                                const contenidoCifrado = cifrar(String(data.contenido), Number(data.desplazamiento));
                                return {
                                    ...data,
                                    asunto: asuntoCifrado.texto,
                                    contenido: contenidoCifrado.texto,
                                    desplazamiento: data.desplazamiento,
                                    excepciones_asunto: asuntoCifrado.excepciones,
                                    excepciones_contenido: contenidoCifrado.excepciones,
                                    id_conversacion: mensajeSeleccionado?.id_conversacion,
                                    id_mensaje_anterior: mensajeSeleccionado?.id,
                                    id_emisor: auth.user.id,
                                    id_receptor: mensajeSeleccionado?.id_emisor,
                                    leido: false,
                                };
                            }}
                            onSubmit={(e) => {
                                e.preventDefault();
                            }}
                            onError={(errors) => {
                                console.log(errors)
                            }}
                            disableWhileProcessing
                        >
                            <Input
                                type='number'
                                name='desplazamiento'
                                placeholder='Desplazamiento'
                                min={1}
                                required
                            />
                            <Input
                                type='text'
                                name='asunto'
                                placeholder='Asunto'
                                required
                                defaultValue={'Re: '}
                            />
                            <Input
                                type='text'
                                name='contenido'
                                placeholder='Contenido'
                                required
                            />
                            <button type='submit' className='bg-blue-500 text-white px-4 py-2 rounded-lg'>Responder</button>
                            <button className='bg-red-500 text-white px-4 py-2 rounded-lg' onClick={() => setMensajeSeleccionado(null)}>Cerrar</button>
                        </Form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
