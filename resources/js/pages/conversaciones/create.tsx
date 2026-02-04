import { Head, Form } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { User } from '@/types/auth';
import cifrar from '@/lib/cifrar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Lock, Send } from 'lucide-react';
import { index, create, store } from '@/actions/App/Http/Controllers/ConversacionController';
import { useState } from 'react';
import { disable } from '@/routes/two-factor';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Inbox', href: index().url },
    { title: 'Nuevo Mensaje', href: create().url },
];

export default function Create({ usuarios }: { usuarios: User[] }) {
    const [desplazamiento, setDesplazamiento] = useState(3);
    const [asunto, setAsunto] = useState('');
    const [contenido, setContenido] = useState('');
    const [idReceptor, setIdReceptor] = useState('');

    const asuntoCifrado = asunto ? cifrar(asunto, desplazamiento).texto : '';
    const contenidoCifrado = contenido ? cifrar(contenido, desplazamiento).texto : '';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nuevo Mensaje" />

            <div className="max-w-5xl mx-auto p-4">
                <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:gap-10">
                    {/* Columna Izquierda: Formulario */}
                    <Card className="h-full flex flex-col">
                        <CardHeader>
                            <CardTitle>Redactar Mensaje</CardTitle>
                            <CardDescription>
                                Configura el cifrado y escribe tu mensaje.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <Form
                                method="post"
                                action={store().url}
                                className="space-y-4 h-full flex flex-col"
                                transform={(data) => {
                                    const asuntoCifrado = cifrar(String(data.asunto), Number(data.desplazamiento));
                                    const contenidoCifrado = cifrar(String(data.contenido), Number(data.desplazamiento));
                                    return {
                                        asunto: asuntoCifrado.texto,
                                        desplazamiento_asunto: Number(data.desplazamiento),
                                        excepciones_asunto: asuntoCifrado.excepciones,
                                        id_receptor: data.id_receptor,
                                        contenido: contenidoCifrado.texto,
                                        desplazamiento_contenido: Number(data.desplazamiento),
                                        excepciones_contenido: contenidoCifrado.excepciones,
                                    };
                                }}
                            >
                                <div className="space-y-4 flex-1">
                                    <div className="space-y-2">
                                        <Label htmlFor="id_receptor">Destinatario</Label>
                                        <input type="hidden" name="id_receptor" value={idReceptor} />
                                        <Select onValueChange={setIdReceptor} required>
                                            <SelectTrigger id="id_receptor">
                                                <SelectValue placeholder="Selecciona un usuario" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Destinatarios</SelectLabel>
                                                    {usuarios.map((usuario) => (
                                                        <SelectItem key={usuario.id} value={String(usuario.id)}>
                                                            {usuario.nombre_usuario} ({usuario.email})
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="desplazamiento">Desplazamiento (1-25)</Label>
                                        <Input
                                            id="desplazamiento"
                                            type="number"
                                            name="desplazamiento"
                                            min={1}
                                            max={25}
                                            value={desplazamiento}
                                            onChange={(e) => setDesplazamiento(Number(e.target.value))}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="asunto">Asunto</Label>
                                        <Input
                                            id="asunto"
                                            type="text"
                                            name="asunto"
                                            placeholder="Asunto de la conversación"
                                            value={asunto}
                                            onChange={(e) => setAsunto(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2 flex flex-col flex-1">
                                        <Label htmlFor="contenido">Mensaje</Label>
                                        <Textarea
                                            id="contenido"
                                            name="contenido"
                                            placeholder="Escribe tu mensaje..."
                                            className="min-h-[150px] flex-1 resize-none"
                                            value={contenido}
                                            onChange={(e) => setContenido(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <Button type="submit" className="w-full mt-auto">
                                    <Send className="w-4 h-4 mr-2" />
                                    Enviar Mensaje
                                </Button>
                            </Form>
                        </CardContent>
                    </Card>

                    {/* Columna Derecha: Vista Previa */}
                    <Card className="bg-muted/50 border-dashed h-full flex flex-col">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500/10 text-yellow-500">
                                    <Lock className="w-4 h-4" />
                                </span>
                                <CardTitle>Vista Previa Cifrada</CardTitle>
                            </div>
                            <CardDescription>
                                Simulación de cómo verá el mensaje el destinatario.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 flex-1 flex flex-col">
                            <div className="space-y-2">
                                <Label className="text-xs uppercase text-muted-foreground">
                                    Asunto (+{desplazamiento})
                                </Label>
                                <div className="rounded-md border bg-background p-3 text-sm break-all">
                                    {asuntoCifrado || <span className="text-muted-foreground italic">Escribe un asunto...</span>}
                                </div>
                            </div>

                            <div className="space-y-2 flex-1 flex flex-col">
                                <Label className="text-xs uppercase text-muted-foreground">
                                    Mensaje
                                </Label>
                                <div className="rounded-md border bg-background p-3 text-sm break-all min-h-[100px] flex-1">
                                    {contenidoCifrado || <span className="text-muted-foreground italic">Escribe un mensaje...</span>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
