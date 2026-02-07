import { Link } from '@inertiajs/react';
import { BookOpen, Folder, Inbox, Send } from 'lucide-react';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import BotonRedactar from '@/pages/conversaciones/componentes/boton-redactar';
import { index, create, enviados } from '@/routes/conversaciones';
import type { NavItem } from '@/types';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Recibidos',
        href: index().url,
        icon: Inbox,
    },
    {
        title: 'Enviados',
        href: enviados().url,
        icon: Send,
    }
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repositorio',
        href: 'https://github.com/daniace/Cifrado-Cesar-LPYL',
        icon: Folder,
    },
    {
        title: 'Documentación',
        href: 'https://github.com/daniace/Cifrado-Cesar-LPYL/wiki',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="floating">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={index().url} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                        <SidebarMenuButton size="lg" asChild className='bg-primary hover:bg-primary/80 mt-1.5'>
                            <Link href={create().url} prefetch>
                                <BotonRedactar />
                            </Link>
                        </SidebarMenuButton>

                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
