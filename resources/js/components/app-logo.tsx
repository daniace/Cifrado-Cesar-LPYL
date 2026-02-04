import LogoCipherMail from '@/pages/conversaciones/componentes/icono-cipher-mail';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-10 items-center justify-center rounded-md text-sidebar-primary-foreground">
                <LogoCipherMail className="size-8" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    Cifrado César
                </span>
            </div>
        </>
    );
}
