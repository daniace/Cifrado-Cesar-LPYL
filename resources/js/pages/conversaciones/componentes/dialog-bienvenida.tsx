import { usePage } from "@inertiajs/react"
import { Inbox } from "lucide-react"
import { useState } from "react"
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
import type { User } from "@/types/auth"

export function DialogBienvenida({ cantidad_mensajes_no_leidos }: { cantidad_mensajes_no_leidos: number }) {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const [open, setOpen] = useState(true);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    {auth.user.ultima_conexion === null ? (
                        <DialogDescription>
                            ¡Bienvenido {auth.user.nombre_usuario} a Cifrado César!
                        </DialogDescription>
                    ) : (
                        <DialogTitle>¡Bienvenido de nuevo, {auth.user.nombre_usuario}!</DialogTitle>
                    )}
                    {cantidad_mensajes_no_leidos > 0 ? (
                        <DialogDescription>
                            Tienes <b>{cantidad_mensajes_no_leidos}</b> mensajes nuevos desde tu última conexión el <b>{auth.user.ultima_conexion ? new Date(auth.user.ultima_conexion).toLocaleString('es-AR', { dateStyle: 'long', timeStyle: 'short', hour12: true }) : 'Nunca'}</b>
                        </DialogDescription>
                    ) : (
                        <DialogDescription>
                            No tienes mensajes nuevos desde tu última conexión el <b>{auth.user.ultima_conexion ? new Date(auth.user.ultima_conexion).toLocaleString('es-AR', { dateStyle: 'long', timeStyle: 'short', hour12: true }) : 'Nunca'}</b>
                        </DialogDescription>
                    )}
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
