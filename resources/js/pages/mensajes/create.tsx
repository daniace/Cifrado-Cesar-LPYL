import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { create } from '@/routes/mensajes';
import type { BreadcrumbItem } from '@/types';
import { MensajeModelo } from '@/types/mensaje-modelo';
import { User } from '@/types/auth';
import FormRedactar from './componentes/form-redactar';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Redactar Mensaje',
        href: create().url,
    },
];

export default function Create({ usuarios }: { usuarios: User[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Index" />
            <div className='grid grid-cols-2 gap-4 py-4'>
                <FormRedactar usuarios={usuarios} onUsuarioSelect={() => { }} />
            </div>
        </AppLayout>
    );
}
