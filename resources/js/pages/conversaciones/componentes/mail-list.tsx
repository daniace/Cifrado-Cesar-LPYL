import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import descifrar from '@/lib/descifrar';
import type { User } from '@/types/auth';

interface Mensaje {
    id: number;
    contenido: string;
    emisor_id: number;
    leido: boolean;
    created_at: string;
    desplazamiento_contenido: number;
    excepciones_contenido: Record<number, string> | null;
}

interface Conversacion {
    id: number;
    asunto: string;
    desplazamiento_asunto: number;
    excepciones_asunto: Record<number, string> | null;
    id_emisor: number;
    id_receptor: number;
    fecha_ultimo_mensaje: string;
    emisor: User;
    receptor: User;
    ultimo_mensaje: Mensaje | null;
}

interface MailListProps {
    conversaciones: Conversacion[];
    selectedId: number | null;
    onSelect: (conversacion: Conversacion) => void;
    currentUserId: number;
}

export function MailList({ conversaciones, selectedId, onSelect, currentUserId }: MailListProps) {
    return (
        <ScrollArea className="h-full">
            <div className="flex flex-col gap-2 p-4">
                {conversaciones.map((conversacion) => {
                    const otroUsuario = conversacion.id_emisor === currentUserId
                        ? conversacion.receptor
                        : conversacion.emisor;

                    const asuntoDescifrado = descifrar(
                        conversacion.asunto,
                        conversacion.desplazamiento_asunto,
                        conversacion.excepciones_asunto ?? {}
                    );

                    const tieneNoLeido = conversacion.ultimo_mensaje
                        && !conversacion.ultimo_mensaje.leido
                        && conversacion.ultimo_mensaje.emisor_id !== currentUserId;

                    // Preview del último mensaje (descifrado)
                    const previewMensaje = conversacion.ultimo_mensaje
                        ? descifrar(
                            conversacion.ultimo_mensaje.contenido,
                            conversacion.ultimo_mensaje.desplazamiento_contenido,
                            conversacion.ultimo_mensaje.excepciones_contenido ?? {}
                        ).substring(0, 50)
                        : '';

                    return (
                        <button
                            key={conversacion.id}
                            onClick={() => onSelect(conversacion)}
                            className={cn(
                                "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
                                selectedId === conversacion.id && "bg-muted"
                            )}
                        >
                            <div className="flex w-full flex-col gap-1">
                                <div className="flex items-center">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold">
                                            {otroUsuario?.nombre_usuario ?? 'Usuario'}
                                        </span>
                                        {tieneNoLeido && (
                                            <Circle className="h-2 w-2 fill-blue-500 text-blue-500" />
                                        )}
                                    </div>
                                    <div className={cn(
                                        "ml-auto text-xs",
                                        selectedId === conversacion.id ? "text-foreground" : "text-muted-foreground"
                                    )}>
                                        {conversacion.fecha_ultimo_mensaje && formatDistanceToNow(
                                            new Date(conversacion.fecha_ultimo_mensaje),
                                            { addSuffix: true, locale: es }
                                        )}
                                    </div>
                                </div>
                                <div className="text-xs font-medium">{asuntoDescifrado}</div>
                            </div>
                            <div className="line-clamp-2 text-xs text-muted-foreground">
                                {previewMensaje || 'Sin mensajes'}
                            </div>
                        </button>
                    );
                })}
            </div>
        </ScrollArea>
    );
}

// Export type for reuse
export type { Conversacion, Mensaje };
