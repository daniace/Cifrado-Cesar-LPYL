import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { create } from '@/routes/mensajes';
import type { BreadcrumbItem } from '@/types';
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
            <Head title="Redactar Mensaje" />
            <div>
                <FormRedactar usuarios={usuarios} onUsuarioSelect={() => { }} />
            </div>
        </AppLayout>
    );
}
