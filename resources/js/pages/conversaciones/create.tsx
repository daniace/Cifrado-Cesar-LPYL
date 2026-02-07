import { Head, Form } from '@inertiajs/react';
import { Lock, Send } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import cifrar from '@/lib/cifrar';
import { index, create, store } from '@/routes/conversaciones';
import type { BreadcrumbItem } from '@/types';
import type { User } from '@/types/auth';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Recibidos',
        href: index().url,
    },
    {
        title: 'Nuevo mensaje',
        href: create().url,
    },
];

export default function Create({ usuarios }: { usuarios: User[] }) {
    const [asunto, setAsunto] = useState('');
    const [contenido, setContenido] = useState('');
    const [desplazamiento, setDesplazamiento] = useState(1);
    const [idReceptor, setIdReceptor] = useState('');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nuevo mensaje" />

            <div className="p-4">

                <div className='flex flex-row gap-4'>
                    <Card className='w-1/2'>
                        <CardHeader>
                            <h1 className='font-bold text-xl'>Nuevo Mensaje</h1>
                        </CardHeader>
                        <CardContent>
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
                                resetOnSuccess
                                className='flex flex-col'
                            >
                                {/* Destinatario */}
                                <div className='p-2'>
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
                                <div className='p-2'>
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
                                <div className='p-2'>
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
                                <div className='p-2'>
                                    <Label htmlFor="contenido">Mensaje</Label>
                                    <Textarea
                                        id="contenido"
                                        name="contenido"
                                        value={contenido}
                                        onChange={(e) => setContenido(e.target.value)}
                                        placeholder="Escribe tu mensaje..."
                                        rows={5}
                                        className='resize-y min-h-40'
                                    />
                                </div>

                                <Button type="submit" className="m-2">
                                    <Send className="mr-2 h-4 w-4" />
                                    Enviar
                                </Button>
                            </Form>
                        </CardContent>
                    </Card>

                    {/* Vista previa cifrada */}
                    <Card className='w-1/2'>
                        <CardHeader className='flex flex-row items-center text-center'>
                            <Lock className='bg-accent rounded-2xl p-2 w-10 h-10' />
                            <p className="font-bold">Vista previa (cifrado)</p>
                            <p className="text-sm text-center">Desplazamiento: {desplazamiento}</p>
                        </CardHeader>
                        <CardContent>
                            <Label className="text-sm">
                                Asunto
                            </Label>
                            <Input
                                type="text"
                                value={asunto ? cifrar(String(asunto), Number(desplazamiento)).texto : ''}
                                disabled
                                className='p-2'
                            />
                            <Label className="text-sm">
                                Mensaje
                            </Label>
                            <Textarea
                                value={contenido ? cifrar(String(contenido), Number(desplazamiento)).texto : ''}
                                disabled
                                className='min-h-60 resize-y p-2'
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
