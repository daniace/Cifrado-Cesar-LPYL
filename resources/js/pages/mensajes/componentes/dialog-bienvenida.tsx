import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { usePage } from "@inertiajs/react"
import type { User } from "@/types/auth"
import type { MensajeModelo } from "@/types/mensaje-modelo"
import { Inbox } from "lucide-react"
import { useState } from "react"

export function DialogBienvenida({ mensajesSinFiltrar }: { mensajesSinFiltrar: MensajeModelo[] }) {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const [open, setOpen] = useState(true);

    const filtrarMensajesDesdeUltimoAcceso = (mensajes: MensajeModelo[]) => {
        return Array.from(mensajes).filter((mensaje) => new Date(mensaje.created_at) > new Date(auth.user.ultima_conexion));
    }
    const mensajesDesdeUltimoAcceso = filtrarMensajesDesdeUltimoAcceso(mensajesSinFiltrar);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>¡Bienvenido de nuevo, {auth.user.nombre_usuario}!</DialogTitle>
                    <DialogDescription>
                        Tienes <b>{mensajesDesdeUltimoAcceso.length}</b> mensajes nuevos desde tu última conexión el <b>{auth.user.ultima_conexion ? new Date(auth.user.ultima_conexion).toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short', hour12: true }) : 'Nunca'}</b>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-start sm:flex-col">
                    <DialogClose asChild>
                        <Button className="w-full" variant="default" >
                            <Inbox />
                            Ir a los mensajes
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button className="w-full" variant="outline">Cerrar</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
