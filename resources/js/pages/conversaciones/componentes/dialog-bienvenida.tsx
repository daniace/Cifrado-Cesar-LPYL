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
                            ¡Bienvenido <strong>{auth.user.nombre_usuario}</strong> a <i>Cifrado César</i>!
                        </DialogDescription>
                    ) : (
                        <DialogTitle>¡Bienvenido de nuevo, <strong>{auth.user.nombre_usuario}</strong>!</DialogTitle>
                    )}
                    {auth.user.ultima_conexion && (
                        cantidad_mensajes_no_leidos > 0 ? (
                            <DialogDescription>
                                Tienes <strong>{cantidad_mensajes_no_leidos}</strong> mensajes nuevos desde tu última conexión el <strong>{new Date(auth.user.ultima_conexion).toLocaleString('es-AR', { dateStyle: 'long', timeStyle: 'short', hour12: true })}</strong>
                            </DialogDescription>
                        ) : (
                            <DialogDescription>
                                No tienes mensajes nuevos desde tu última conexión el <strong>{new Date(auth.user.ultima_conexion).toLocaleString('es-AR', { dateStyle: 'long', timeStyle: 'short', hour12: true })}</strong>
                            </DialogDescription>
                        )
                    )}
                </DialogHeader>
                <DialogFooter className="sm:justify-start sm:flex-col">
                    <DialogClose asChild>
                        {auth.user.ultima_conexion ? (
                            <Button className="w-full" variant="default" >
                                <Inbox />
                                Ir a los mensajes
                            </Button>
                        ) : (
                            <Button className="w-full" variant="default" >
                                <Inbox />
                                Empezar
                            </Button>
                        )}
                    </DialogClose>
                    <DialogClose asChild>
                        <Button className="w-full" variant="outline">Cerrar</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
