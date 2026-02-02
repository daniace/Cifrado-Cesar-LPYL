import { Head, Form, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/mensajes';
import type { BreadcrumbItem } from '@/types';
import { MensajeModelo } from '@/types/mensaje-modelo';
import { User } from '@/types/auth';
import descifrar from '@/lib/descifrar';
import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { store } from '@/routes/mensajes';
import cifrar from '@/lib/cifrar';
import { DialogBienvenida } from './componentes/dialog-bienvenida';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Index',
        href: index().url,
    },
];

interface Props {
    mensajes: MensajeModelo[],
}

export default function Index({ mensajes }: Props) {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const [mensajeSeleccionado, setMensajeSeleccionado] = useState<MensajeModelo | null>(null);

    const conversaciones = useMemo(() => {
        const map = new Map<string, MensajeModelo>();
        mensajes.forEach((m) => {
            map.set(m.id_conversacion, m);
        });
        return Array.from(map.values()).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }, [mensajes]);

    const mensajesConversacion = useMemo(() => {
        if (!mensajeSeleccionado) return [];
        return mensajes.filter(m => m.id_conversacion === mensajeSeleccionado.id_conversacion);
    }, [mensajes, mensajeSeleccionado]);

    const handleMensajeSeleccionado = (mensaje: MensajeModelo) => {
        setMensajeSeleccionado(mensaje);
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            {usePage<{ flash: { mostrar_dialog_bienvenida: boolean } }>().props.flash.mostrar_dialog_bienvenida && (
                <DialogBienvenida mensajesSinFiltrar={mensajes} />
            )}
            <Head title="Index" />
            <div className='grid grid-cols-2 gap-4 py-4'>
                <div id='lista-mensajes' className='border border-gray-300 rounded-lg p-4'>
                    <h1 className='font-bold'>Mensajes</h1>
                    <ul>
                        {conversaciones.map((mensaje) => (
                            <li
                                key={mensaje.id_conversacion}
                                onClick={() => handleMensajeSeleccionado(mensaje)}
                                className={`border border-gray-300 rounded-lg p-2 cursor-pointer hover:bg-gray-800 mb-2 ${mensajeSeleccionado?.id_conversacion === mensaje.id_conversacion ? 'bg-gray-800' : ''}`}
                            >
                                <span className='font-bold block text-sm mb-1 truncate'>
                                    {descifrar(mensaje.asunto, mensaje.desplazamiento, mensaje.excepciones_asunto)}
                                </span>
                                <span className='text-xs text-gray-500 truncate block'>
                                    {descifrar(String(mensaje.contenido), Number(mensaje.desplazamiento), mensaje.excepciones_contenido as Record<number, string>)}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div id='detalle-mensaje' className='border border-gray-300 rounded-lg p-4'>
                    <h1 className='font-bold'>Detalle del mensaje</h1>
                    {mensajesConversacion.length > 0 ? (
                        <div className="flex flex-col gap-4 mb-4 max-h-[500px] overflow-y-auto">
                            {mensajesConversacion.map((msg) => {
                                const isMe = msg.id_emisor === auth.user.id;
                                return (
                                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[75%] rounded-lg p-3 ${isMe ? 'bg-blue-600' : 'bg-gray-700'}`}>
                                            <p className="font-bold text-sm mb-1 text-white">
                                                {descifrar(String(msg.asunto), Number(msg.desplazamiento), msg.excepciones_asunto as Record<number, string>)}
                                            </p>
                                            <p className="text-white">
                                                {descifrar(String(msg.contenido), Number(msg.desplazamiento), msg.excepciones_contenido as Record<number, string>)}
                                            </p>
                                            <div className="text-[10px] text-gray-300 text-right mt-1">
                                                {msg.created_at ? new Date(msg.created_at).toLocaleString() : ''}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">Selecciona una conversación.</p>
                    )}
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
