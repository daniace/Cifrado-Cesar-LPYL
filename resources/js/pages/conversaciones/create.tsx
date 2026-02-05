import { Head, Form } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { User } from '@/types/auth';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import cifrar from '@/lib/cifrar';
import { useState } from 'react';
import { store } from '@/routes/conversaciones';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Conversaciones',
        href: '/conversaciones',
    },
    {
        title: 'Nueva conversación',
        href: '/conversaciones/create',
    },
];

interface Props {
    usuarios: User[];
}

export default function Create({ usuarios }: Props) {
    const [asunto, setAsunto] = useState('');
    const [contenido, setContenido] = useState('');
    const [desplazamiento, setDesplazamiento] = useState(1);
    const [idReceptor, setIdReceptor] = useState('');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nueva conversación" />

            <div className="max-w-2xl mx-auto p-4">
                <h1 className="text-2xl font-bold mb-6">Nueva conversación</h1>

                <Form
                    method="post"
                    action={store().url}
                    disableWhileProcessing
                    onSubmit={(e) => {
                        e.preventDefault();
                    }}
                    transform={(data) => {
                        const cifradoAsunto = cifrar(String(data.asunto), Number(data.desplazamiento));
                        const cifradoContenido = cifrar(String(data.contenido), Number(data.desplazamiento));
                        return {
                            id_receptor: idReceptor,
                            asunto: cifradoAsunto.texto,
                            desplazamiento_asunto: Number(data.desplazamiento),
                            excepciones_asunto: cifradoAsunto.excepciones,
                            contenido: cifradoContenido.texto,
                            desplazamiento_contenido: Number(data.desplazamiento),
                            excepciones_contenido: cifradoContenido.excepciones,
                        };
                    }}
                    onError={(errors) => {
                        console.log(errors);
                    }}
                    onSuccess={() => {
                        toast.success('Mensaje enviado!');
                    }}
                    className="space-y-4"
                    resetOnSuccess
                >
                    {/* Destinatario */}
                    <div className="space-y-2">
                        <Label htmlFor="id_receptor">Destinatario</Label>
                        <Select
                            value={idReceptor}
                            onValueChange={(value) => setIdReceptor(value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un destinatario" />
                            </SelectTrigger>
                            <SelectContent>
                                {usuarios.map((usuario) => (
                                    <SelectItem key={usuario.id} value={String(usuario.id)}>
                                        {usuario.nombre} {usuario.apellido} (@{usuario.nombre_usuario})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Desplazamiento */}
                    <div className="space-y-2">
                        <Label htmlFor="desplazamiento">Desplazamiento (clave de cifrado)</Label>
                        <Input
                            id="desplazamiento"
                            name="desplazamiento"
                            type="number"
                            min={1}
                            max={25}
                            value={desplazamiento}
                            onChange={(e) => setDesplazamiento(Number(e.target.value))}
                        />
                    </div>

                    {/* Asunto */}
                    <div className="space-y-2">
                        <Label htmlFor="asunto">Asunto</Label>
                        <Input
                            id="asunto"
                            name="asunto"
                            type="text"
                            value={asunto}
                            onChange={(e) => setAsunto(e.target.value)}
                            placeholder="Escribe el asunto..."
                        />
                    </div>

                    {/* Contenido */}
                    <div className="space-y-2">
                        <Label htmlFor="contenido">Mensaje</Label>
                        <Textarea
                            id="contenido"
                            name="contenido"
                            value={contenido}
                            onChange={(e) => setContenido(e.target.value)}
                            placeholder="Escribe tu mensaje..."
                            rows={5}
                        />
                    </div>

                    {/* Vista previa cifrada */}
                    <div className="border border-gray-300 rounded-lg p-4 bg-gray-900">
                        <p className="font-bold mb-2">Vista previa (cifrado)</p>
                        <p className="text-sm">
                            <span className="text-gray-400">Asunto:</span>{' '}
                            {asunto ? cifrar(asunto, desplazamiento).texto : '—'}
                        </p>
                        <p className="text-sm">
                            <span className="text-gray-400">Mensaje:</span>{' '}
                            {contenido ? cifrar(contenido, desplazamiento).texto : '—'}
                        </p>
                    </div>

                    <Button type="submit" className="w-full">
                        Crear conversación
                    </Button>
                </Form>
            </div>
        </AppLayout>
    );
}
