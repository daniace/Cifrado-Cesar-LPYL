import { Form, Link, usePage } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowLeft, Lock, Send } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import cifrar from '@/lib/cifrar';
import descifrar from '@/lib/descifrar';
import { index } from '@/routes/conversaciones';
import type { User } from '@/types/auth';
import type { ConversacionModelo } from '@/types/conversacion-modelo';

export default function DetalleConversacion({
    conversacion,
}: {
    conversacion: ConversacionModelo | null;
}) {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const [contenido, setContenido] = useState('');
    const [desplazamiento, setDesplazamiento] = useState(1);
    const [conversacionActualizada, setConversacionActualizada] =
        useState<ConversacionModelo | null>(conversacion);

    useEffect(() => {
        setConversacionActualizada(conversacion);
    }, [conversacion]);

    useEffect(() => {
        if (!conversacionActualizada?.id) return;

        const fetchUpdatedConversation = async () => {
            try {
                const response = await fetch(
                    `/conversaciones/componentes/detalle-conversacion/${conversacionActualizada.id}`,
                );
                if (response.ok) {
                    const data = await response.json();
                    console.log(JSON.stringify(response, null, 2));
                    setConversacionActualizada(data.conversacion);
                }
            } catch (error) {
                console.error('Error fetching updated conversation:', error);
            }
        };

        const intervaloId = setInterval(fetchUpdatedConversation, 5000);

        return () => clearInterval(intervaloId);
    }, [conversacionActualizada?.id]);

    if (!conversacionActualizada) {
        return (
            <div className="flex h-[80vh] w-full flex-col items-center justify-center rounded-lg border border-secondary p-8 text-gray-500 italic">
                <p className="text-xl">
                    Hola,{' '}
                    <span className="font-semibold">
                        {auth.user.nombre_usuario}
                    </span>
                    !
                </p>
            </div>
        );
    }

    const otroUsuario =
        conversacionActualizada.id_emisor === auth.user.id
            ? conversacionActualizada.receptor
            : conversacionActualizada.emisor;

    return (
        <div className="w-full rounded-lg border border-gray-300 p-4">
            <div className="flex items-start gap-4 border-b p-4">
                <Link href={index().url}>
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div className="flex w-full items-start gap-3">
                    <Avatar className="h-10 w-10">
                        <AvatarImage
                            src={otroUsuario?.avatar}
                            alt={otroUsuario?.nombre}
                        />
                        <AvatarFallback>
                            {otroUsuario?.nombre.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="grid w-full gap-1">
                        <div className="flex items-center justify-between">
                            <div className="text-sm font-semibold">
                                {otroUsuario?.nombre} {otroUsuario?.apellido} -
                                ({otroUsuario?.nombre_usuario})
                            </div>
                            <div className="text-xs text-muted-foreground">
                                {conversacionActualizada.created_at
                                    ? new Date(
                                          conversacionActualizada.created_at,
                                      ).toLocaleString('en-US', {
                                          month: 'short',
                                          day: 'numeric',
                                          year: 'numeric',
                                          hour: 'numeric',
                                          minute: 'numeric',
                                          second: 'numeric',
                                          hour12: true,
                                      })
                                    : 'N/A'}
                            </div>
                        </div>
                        <div className="text-xs font-medium">
                            {descifrar(
                                String(conversacionActualizada.asunto),
                                Number(
                                    conversacionActualizada.desplazamiento_asunto,
                                ),
                                conversacionActualizada.excepciones_asunto as Record<
                                    number,
                                    string
                                >,
                            )}
                        </div>
                        <div className="line-clamp-1 text-xs">
                            {otroUsuario?.email}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mensajes */}
            <ScrollArea className="h-[500px]">
                <div className="flex-1 space-y-4 overflow-y-auto py-4">
                    {conversacionActualizada.mensajes &&
                    conversacionActualizada.mensajes.length > 0 ? (
                        conversacionActualizada.mensajes.map((mensaje) => {
                            const usuarioActual =
                                mensaje.emisor_id === auth.user.id;
                            return (
                                <div
                                    key={mensaje.id}
                                    className={`flex ${usuarioActual ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[70%] rounded-lg p-3 ${usuarioActual ? 'bg-primary text-accent' : 'bg-secondary text-foreground'}`}
                                    >
                                        <p>
                                            {descifrar(
                                                String(mensaje.contenido),
                                                Number(
                                                    mensaje.desplazamiento_contenido,
                                                ),
                                                mensaje.excepciones_contenido as Record<
                                                    number,
                                                    string
                                                >,
                                            )}
                                        </p>
                                        <div className="mt-1 text-right text-[10px] text-muted-foreground">
                                            {formatDistanceToNow(
                                                new Date(mensaje.created_at),
                                                {
                                                    addSuffix: true,
                                                    locale: es,
                                                },
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-center text-muted-foreground italic">
                            No hay mensajes en esta conversación.
                        </p>
                    )}
                </div>
            </ScrollArea>
            {/* Formulario de respuesta */}
            <Separator />
            <Form
                method="post"
                action={`/conversaciones/${conversacionActualizada.id}/mensajes`}
                disableWhileProcessing
                onSubmit={(e) => {
                    e.preventDefault();
                }}
                transform={(data) => {
                    const cifradoContenido = cifrar(
                        String(data.contenido),
                        Number(data.desplazamiento),
                    );
                    return {
                        contenido: cifradoContenido.texto,
                        desplazamiento_contenido: Number(data.desplazamiento),
                        excepciones_contenido: cifradoContenido.excepciones,
                    };
                }}
                onSuccess={() => {
                    setContenido('');
                }}
                className="pt-4"
                options={{
                    preserveScroll: true,
                    preserveState: true,
                    only: ['conversacion'],
                }}
            >
                {() => (
                    <div className="grid gap-4">
                        <Textarea
                            name="contenido"
                            value={contenido}
                            onChange={(e) => setContenido(e.target.value)}
                            placeholder={`Responder a ${otroUsuario?.nombre}.`}
                            className="min-h-[100px] resize-none bg-background/50"
                        />

                        <Collapsible open={!!contenido}>
                            <CollapsibleContent>
                                <div className="mb-4 flex items-center gap-2 rounded-md bg-muted px-4 py-3 text-sm text-muted-foreground">
                                    <Lock className="h-4 w-4" />
                                    <span className="truncate font-mono">
                                        Vista Previa Cifrado:{' '}
                                        {
                                            cifrar(
                                                String(contenido),
                                                Number(desplazamiento),
                                            ).texto
                                        }
                                    </span>
                                </div>
                            </CollapsibleContent>
                        </Collapsible>

                        <div className="flex items-center justify-between">
                            <div className="ml-2 flex w-60 flex-row">
                                <Label className="mb-2 p-2">
                                    Desplazamiento
                                </Label>
                                <Input
                                    type="number"
                                    name="desplazamiento"
                                    min={1}
                                    max={25}
                                    value={desplazamiento}
                                    onChange={(e) =>
                                        setDesplazamiento(
                                            Number(e.target.value),
                                        )
                                    }
                                    placeholder="Key"
                                    className="h-8 w-20 justify-center text-center"
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={!contenido.trim()}
                                className="bg-primary text-accent hover:bg-primary/80"
                            >
                                <Send className="mr-2 h-4 w-4" />
                                Enviar
                            </Button>
                        </div>
                    </div>
                )}
            </Form>
        </div>
    );
}
