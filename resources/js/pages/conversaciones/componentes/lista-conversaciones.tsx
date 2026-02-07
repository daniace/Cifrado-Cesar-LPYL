import { ConversacionModelo } from "@/types/conversacion-modelo";
import descifrar from "@/lib/descifrar";
import { usePage, router } from "@inertiajs/react";
import { User } from "@/types/auth";
import { Circle } from "lucide-react";

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
        // Solo marcar si hay mensajes no leídos del receptor (yo)
        const tieneNoLeidos = conversacion.mensajes?.some(m => m.emisor_id !== auth.user.id && !m.leido);

        if (tieneNoLeidos) {
            router.patch(`/conversaciones/${conversacion.id}/leer`, {}, {
                preserveScroll: true,
                only: ['conversaciones']
            });
        }
    }

    return (
        <div className="border border-gray-300 rounded-lg p-4 w-1/2">
            <div className="flex flex-col gap-2">
                {conversaciones.map((conv) => {
                    const tieneNoLeidos = conv.mensajes?.some(m => m.emisor_id !== auth.user.id && !m.leido);

                    return (
                        <div
                            key={conv.id}
                            onClick={() => {
                                marcarLeido(conv);
                                if (seleccionada?.id === conv.id) {
                                    onSelect(null);
                                } else {
                                    onSelect(conv);
                                }
                            }}
                            className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${seleccionada?.id === conv.id
                                ? 'bg-gray-200 dark:bg-gray-700 border-blue-500'
                                : 'border-gray-300'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className={`font-semibold ${tieneNoLeidos ? 'text-blue-600 dark:text-blue-400 font-bold' : ''}`}>
                                    {descifrar(String(conv.asunto), Number(conv.desplazamiento_asunto), conv.excepciones_asunto as Record<number, string>)}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {conv.fecha_ultimo_mensaje ? new Date(conv.fecha_ultimo_mensaje).toLocaleString() : 'N/A'}
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                                <div className="text-sm">
                                    {conv.id_emisor === auth.user.id
                                        ? `Para: ${usuarios?.find(u => u.id === conv.id_receptor)?.nombre_usuario}`
                                        : `De: ${usuarios?.find(u => u.id === conv.id_emisor)?.nombre_usuario}`
                                    }
                                </div>
                                {tieneNoLeidos ? (
                                    <Circle className="fill-blue-500 w-3 h-3" />
                                ) : (
                                    <Circle className="fill-[#8E8E93] w-3 h-3" />
                                )}
                                <div className="text-sm text-gray-500">{conv.mensajes?.filter(mensajes => mensajes.emisor_id !== auth.user.id && !mensajes.leido).length}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}