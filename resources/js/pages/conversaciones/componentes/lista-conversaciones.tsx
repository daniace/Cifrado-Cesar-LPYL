
import { router, usePage } from "@inertiajs/react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

import descifrar from "@/lib/descifrar";
import { cn } from "@/lib/utils";
import { leer } from "@/routes/conversaciones";
import type { User } from "@/types/auth";
import type { ConversacionModelo } from "@/types/conversacion-modelo";

export default function ListaConversaciones({
    conversaciones,
    onSelect,
    seleccionada,
    usuarios,
}: {
    conversaciones: ConversacionModelo[];
    onSelect: (conversacion: ConversacionModelo | null) => void;
    seleccionada?: ConversacionModelo | null;
    usuarios?: User[];
}) {

    const { auth } = usePage<{ auth: { user: User } }>().props;

    function marcarLeido(conversacion: ConversacionModelo) {
        const tieneNoLeidos = conversacion.mensajes?.some(mensaje => mensaje.emisor_id !== auth.user.id && !mensaje.leido);

        if (tieneNoLeidos) {
            router.patch(leer(conversacion.id).url, {}, {
                preserveScroll: true,
                only: ['conversaciones']
            });
        }
    }

    return (
        <div className="flex flex-col gap-2 p-2 pt-2 w-1/2 border rounded-lg">
            {conversaciones.map((conversacion) => {
                const tieneNoLeidos = conversacion.mensajes?.some(mensaje => mensaje.emisor_id !== auth.user.id && !mensaje.leido);

                return (
                    <button
                        key={conversacion.id}
                        onClick={() => {
                            marcarLeido(conversacion);
                            if (seleccionada?.id === conversacion.id) {
                                onSelect(null);
                            } else {
                                onSelect(conversacion);
                            }
                        }}
                        className={cn(
                            "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
                            seleccionada?.id === conversacion.id && "bg-muted"
                        )}
                    >
                        <div className="flex w-full flex-col gap-1">
                            <div className="flex items-center">
                                <div className="flex items-center gap-2">
                                    <div className="font-semibold">
                                        {conversacion.id_emisor === auth.user.id
                                            ? (
                                                usuarios?.find(usuario => usuario.id === conversacion.id_receptor)?.nombre + " " +
                                                usuarios?.find(usuario => usuario.id === conversacion.id_receptor)?.apellido
                                            )
                                            : (
                                                usuarios?.find(usuario => usuario.id === conversacion.id_emisor)?.nombre + " " +
                                                usuarios?.find(usuario => usuario.id === conversacion.id_emisor)?.apellido
                                            )
                                        }
                                    </div>
                                    {tieneNoLeidos && (
                                        <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                                    )}
                                </div>
                                <div
                                    className={cn(
                                        "ml-auto text-xs",
                                        seleccionada?.id === conversacion.id
                                            ? "text-foreground"
                                            : "text-muted-foreground"
                                    )}
                                >
                                    {conversacion.fecha_ultimo_mensaje
                                        ? formatDistanceToNow(new Date(conversacion.fecha_ultimo_mensaje), {
                                            addSuffix: true,
                                            locale: es,
                                        })
                                        : "N/A"}
                                </div>
                            </div>
                            <div className="text-xs font-medium">
                                {descifrar(String(conversacion.asunto), Number(conversacion.desplazamiento_asunto), conversacion.excepciones_asunto as Record<number, string>)}
                            </div>
                        </div>
                        <div className="line-clamp-2 text-xs text-muted-foreground">
                            {conversacion.ultimo_mensaje?.contenido
                                ? descifrar(String(conversacion.ultimo_mensaje.contenido), Number(conversacion.ultimo_mensaje.desplazamiento_contenido), conversacion.ultimo_mensaje.excepciones_contenido as Record<number, string>)
                                : "No hay mensajes"}
                        </div>
                    </button>
                );
            })}
        </div>
    );
}