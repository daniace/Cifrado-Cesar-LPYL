import { MensajeModelo } from "@/types/mensaje-modelo";
import { User } from "@/types/auth";
import { usePage } from "@inertiajs/react";

export default function Test_Detalle({ mensajes, emisores }: { mensajes: MensajeModelo[], emisores: User[] }) {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    return (
        <div>
            {mensajes.map((mensaje) => (
                <div key={mensaje.id} className="mb-2">
                    {mensaje.id_emisor === auth.user.id ? (
                        <div className="flex flex-col gap-2 bg-blue-600 justify-end border-2 border-blue-600 rounded-lg p-2 w-2/3 h-fit ml-auto">
                            <div>
                                {mensaje.asunto}
                            </div>
                            <div>
                                {mensaje.contenido}
                            </div>
                            <div>
                                De: {auth.user.nombre_usuario}
                            </div>
                            <div>
                                Para: {emisores.find(u => u.id === mensaje.id_receptor)?.nombre_usuario}
                            </div>
                            <br></br>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2 bg-gray-600 justify-start border-2 border-gray-600 rounded-lg p-2 w-2/3 h-fit mr-auto">
                            <div>
                                {mensaje.asunto}
                            </div>
                            <div>
                                {mensaje.contenido}
                            </div>
                            <div>
                                De: {emisores.find(u => u.id === mensaje.id_emisor)?.nombre_usuario}
                            </div>
                            <div>
                                Para: {auth.user.nombre_usuario}
                            </div>
                            <br></br>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
} 