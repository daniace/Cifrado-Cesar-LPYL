import { MailPlus } from 'lucide-react';

export default function NuevoMensaje() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <MailPlus className="size-5 fill-accent-foreground text-white dark:text-black" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm dark:text-black">
                <span className="mb-0.5 truncate leading-tight font-semibold dark:text-black">
                    Nuevo Mensaje
                </span>
            </div>
        </>
    );
}