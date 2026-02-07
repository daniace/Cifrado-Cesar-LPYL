import { ConversacionModelo } from "@/types/conversacion-modelo";
import descifrar from "@/lib/descifrar";
import cifrar from "@/lib/cifrar";
import { Form, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send } from "lucide-react";
import { usePage } from "@inertiajs/react";
import { User } from "@/types/auth";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

export default function DetalleConversacion({ conversacion }: { conversacion: ConversacionModelo | null }) {

    const { auth } = usePage<{ auth: { user: User } }>().props;
    const [contenido, setContenido] = useState('');
    const [desplazamiento, setDesplazamiento] = useState(1);

    if (!conversacion) {
        return (
            <div className="border border-gray-300 rounded-lg p-8 w-full flex flex-col items-center justify-center text-gray-500 italic h-full">
                <p>Hola, {auth.user.nombre_usuario}!
                    <br />
                    Elige una conversación para ver los mensajes.</p>
            </div>
        );
    }

    // Determinar el otro usuario en la conversación
    const otroUsuario = conversacion.id_emisor === auth.user.id
        ? conversacion.receptor
        : conversacion.emisor;

    return (
        <div className="border border-gray-300 rounded-lg p-4 w-full">
            {/* Header */}
            <div className="flex items-center gap-4 pb-4 border-b border-gray-300">
                <Link href="/conversaciones">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <div className="flex items-center gap-2">
                        <Avatar className="rounded-full bg-accent-foreground text-accent w-8 h-8 text-center">
                            <AvatarImage src={otroUsuario?.avatar} />
                            <AvatarFallback>{otroUsuario?.nombre.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <h1 className="text-xl font-bold">
                            {descifrar(String(conversacion.asunto), Number(conversacion.desplazamiento_asunto), conversacion.excepciones_asunto as Record<number, string>)}
                        </h1>
                    </div>
                    <p className="text-sm text-gray-500">
                        Conversación con {otroUsuario?.nombre} {otroUsuario?.apellido}
                    </p>
                </div>
            </div>

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {conversacion.mensajes && conversacion.mensajes.length > 0 ? (
                    conversacion.mensajes.map((mensaje) => {
                        const usuarioActual = mensaje.emisor_id === auth.user.id;
                        return (
                            <div
                                key={mensaje.id}
                                className={`flex ${usuarioActual ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[70%] rounded-lg p-3 ${usuarioActual ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white'}`}
                                >
                                    <p>
                                        {descifrar(
                                            String(mensaje.contenido),
                                            Number(mensaje.desplazamiento_contenido),
                                            mensaje.excepciones_contenido as Record<number, string>
                                        )}
                                    </p>
                                    <div className="text-[10px] text-gray-300 text-right mt-1">
                                        {new Date(mensaje.created_at).toLocaleString('es-AR')}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-center text-gray-500 italic">No hay mensajes en esta conversación.</p>
                )}
                {/* Formulario de respuesta */}
                <Form
                    method="post"
                    action={`/conversaciones/${conversacion.id}/mensajes`}
                    disableWhileProcessing
                    onSubmit={(e) => {
                        e.preventDefault();
                    }}
                    transform={(data) => {
                        const cifradoContenido = cifrar(String(data.contenido), Number(data.desplazamiento));
                        return {
                            contenido: cifradoContenido.texto,
                            desplazamiento_contenido: Number(data.desplazamiento),
                            excepciones_contenido: cifradoContenido.excepciones,
                        };
                    }}
                    onSuccess={() => {
                        setContenido('');
                    }}
                    className="border-t border-gray-300 pt-4"
                >
                    <div className="flex gap-2 items-end">
                        <div className="shrink-0 w-20">
                            <Input
                                type="number"
                                name="desplazamiento"
                                min={1}
                                max={25}
                                value={desplazamiento}
                                onChange={(e) => setDesplazamiento(Number(e.target.value))}
                                placeholder="Clave"
                                className="text-center"
                            />
                        </div>
                        <div className="flex-1">
                            <Input
                                type="text"
                                name="contenido"
                                value={contenido}
                                onChange={(e) => setContenido(e.target.value)}
                                placeholder="Escribe un mensaje..."
                            />
                        </div>
                        <Button type="submit" disabled={!contenido.trim()}>
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </Form>

                {/*Vista previa del mensaje cifrado*/}

                <div className="mt-4">
                    <p>
                        {cifrar(
                            String(contenido),
                            Number(desplazamiento),
                        ).texto}
                    </p>
                </div>
            </div>
        </div>
    );
}