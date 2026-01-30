import { Form, usePage } from "@inertiajs/react";
import { Auth, User } from "@/types/auth";
import SeleccionarDestinatario from "./seleccionar-destinatario";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { store } from "@/routes/mensajes";
import { Button } from "@/components/ui/button";
import cifrar from "@/lib/cifrar";
import { useState } from "react";

export default function FormRedactar({ usuarios, onUsuarioSelect }: { usuarios: User[], onUsuarioSelect: (usuario: User) => void }) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const [destinatarioSeleccionado, setDestinatarioSeleccionado] = useState<User | null>(null);
    const [asunto, setAsunto] = useState<string>('');
    const [contenido, setContenido] = useState<string>('');
    const [desplazamiento, setDesplazamiento] = useState<number>(1);

    return (
        <div className="grid grid-cols-2 gap-4 w-full">
            <Form
                method="post"
                action={store().url}
                disableWhileProcessing
                onSubmit={(e) => {
                    e.preventDefault();
                }}
                transform={data => {
                    const cifradoAsunto = cifrar((data.asunto as string), Number(data.desplazamiento));
                    const cifradoContenido = cifrar((data.contenido as string), Number(data.desplazamiento));
                    return {
                        ...data,
                        asunto: cifradoAsunto.texto,
                        contenido: cifradoContenido.texto,
                        desplazamiento: Number(data.desplazamiento),
                        excepciones_asunto: cifradoAsunto.excepciones,
                        excepciones_contenido: cifradoContenido.excepciones,
                        id_emisor: auth.user.id,
                        id_receptor: destinatarioSeleccionado?.id,
                        leido: false,
                        id_conversacion: crypto.randomUUID(),
                        id_mensaje_anterior: null,
                    };
                }}
                className="border border-gray-200 rounded-lg p-4"
                onError={(errors) => {
                    console.log(errors)
                }}
            >
                <SeleccionarDestinatario
                    usuarios={usuarios}
                    onUsuarioSelect={(u) => {
                        setDestinatarioSeleccionado(u);
                        onUsuarioSelect(u);
                    }}
                />
                <Label>Desplazamiento   </Label>
                <Input type="number" name="desplazamiento" min={1} onChange={(e) => setDesplazamiento(Number(e.target.value))} />
                <Label>Asunto</Label>
                <Input type="text" name="asunto" onChange={(e) => setAsunto(e.target.value)} />
                <Label>Contenido</Label>
                <Input type="text" name="contenido" onChange={(e) => setContenido(e.target.value)} />
                <Button type="submit" className="mt-2">Enviar</Button>
            </Form>
            <div className="border border-gray-200 rounded-lg p-4">
                <p className="font-bold">Vista previa</p>
                <p>Asunto: {cifrar(asunto, desplazamiento).texto}</p>
                <p>Contenido: {cifrar(contenido, desplazamiento).texto}</p>
            </div>
        </div>
    );
}
