import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Form, usePoll } from '@inertiajs/react';
import { useState } from 'react';
import { Send } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import descifrar from '@/lib/descifrar';
import cifrar from '@/lib/cifrar';
import { store } from '@/actions/App/Http/Controllers/MensajeController';
import type { User } from '@/types/auth';

interface Mensaje {
    id: number;
    contenido: string;
    emisor_id: number;
    leido: boolean;
    created_at: string;
    desplazamiento_contenido: number;
    excepciones_contenido: Record<number, string> | null;
    emisor: User;
}

interface ConversacionCompleta {
    id: number;
    asunto: string;
    desplazamiento_asunto: number;
    excepciones_asunto: Record<number, string> | null;
    id_emisor: number;
    id_receptor: number;
    emisor: User;
    receptor: User;
    mensajes: Mensaje[];
}

interface MailDisplayProps {
    conversacion: ConversacionCompleta | null;
    currentUserId: number;
    onMessageSent?: () => void;
}

export function MailDisplay({ conversacion, currentUserId, onMessageSent }: MailDisplayProps) {
    const [desplazamiento, setDesplazamiento] = useState(3);
    const [contenido, setContenido] = useState('');

    if (!conversacion) {
        return (
            <div className="flex h-full items-center justify-center text-muted-foreground">
                <p>Selecciona una conversación para ver los mensajes</p>
            </div>
        );
    }

    const otroUsuario = conversacion.id_emisor === currentUserId
        ? conversacion.receptor
        : conversacion.emisor;

    const asuntoDescifrado = descifrar(
        conversacion.asunto,
        conversacion.desplazamiento_asunto,
        conversacion.excepciones_asunto ?? {}
    );

    return (
        <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-start p-4">
                <div className="flex items-start gap-4 text-sm">
                    <Avatar>
                        <AvatarFallback>
                            {otroUsuario?.nombre_usuario?.charAt(0).toUpperCase() ?? 'U'}
                        </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                        <div className="font-semibold">{otroUsuario?.nombre_usuario}</div>
                        <div className="line-clamp-1 text-xs">{asuntoDescifrado}</div>
                        <div className="line-clamp-1 text-xs text-muted-foreground">
                            {otroUsuario?.email}
                        </div>
                    </div>
                </div>
            </div>

            <Separator />

            {/* Mensajes */}
            <ScrollArea className="flex-1 p-4">
                <div className="flex flex-col gap-4">
                    {conversacion.mensajes.map((mensaje) => {
                        const esPropio = mensaje.emisor_id === currentUserId;
                        const contenidoDescifrado = descifrar(
                            mensaje.contenido,
                            mensaje.desplazamiento_contenido,
                            mensaje.excepciones_contenido ?? {}
                        );

                        return (
                            <div
                                key={mensaje.id}
                                className={`flex flex-col gap-1 ${esPropio ? 'items-end' : 'items-start'}`}
                            >
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span>{mensaje.emisor?.nombre_usuario ?? 'Usuario'}</span>
                                    <span>•</span>
                                    <span>
                                        {format(new Date(mensaje.created_at), "d 'de' MMM, HH:mm", { locale: es })}
                                    </span>
                                </div>
                                <div
                                    className={`rounded-lg px-3 py-2 max-w-[80%] ${esPropio
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted'
                                        }`}
                                >
                                    <p className="text-sm whitespace-pre-wrap">{contenidoDescifrado}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </ScrollArea>

            <Separator />

            {/* Formulario de respuesta */}
            <div className="p-4">
                <Form
                    method="post"
                    action={store(conversacion.id).url}
                    className="space-y-4"
                    transform={(data) => {
                        const cifrado = cifrar(String(data.contenido), Number(data.desplazamiento));
                        return {
                            contenido: cifrado.texto,
                            desplazamiento_contenido: Number(data.desplazamiento),
                            excepciones_contenido: cifrado.excepciones,
                        };
                    }}
                    onSuccess={() => {
                        setContenido('');
                        onMessageSent?.();
                    }}
                    onSubmit={(e) => {
                        e.preventDefault();
                    }}
                >
                    <div className="flex items-center gap-2">
                        <Label htmlFor="desplazamiento" className="text-xs text-muted-foreground">
                            Cifrado:
                        </Label>
                        <Input
                            id="desplazamiento"
                            type="number"
                            name="desplazamiento"
                            min={1}
                            max={25}
                            value={desplazamiento}
                            onChange={(e) => setDesplazamiento(Number(e.target.value))}
                            className="w-16 h-8"
                            required
                        />
                    </div>
                    <div className="flex gap-2">
                        <Textarea
                            name="contenido"
                            placeholder={`Responder a ${otroUsuario?.nombre_usuario}...`}
                            className="min-h-[80px] resize-none flex-1"
                            value={contenido}
                            onChange={(e) => setContenido(e.target.value)}
                            required
                        />
                        <Button type="submit" size="icon" className="h-auto">
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
}

export type { ConversacionCompleta, Mensaje };
