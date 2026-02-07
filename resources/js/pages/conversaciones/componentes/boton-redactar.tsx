import { MailPlus } from "lucide-react";

export default function BotonRedactar() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md">
                <MailPlus className="size-5 text-white dark:text-black" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold text-white dark:text-black">
                    Redactar
                </span>
            </div>
        </>
    );
}
