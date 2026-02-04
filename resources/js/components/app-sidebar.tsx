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
import { index, create, sent } from '@/actions/App/Http/Controllers/ConversacionController';
import type { NavItem } from '@/types';
import AppLogo from './app-logo';
import NuevoMensaje from '@/pages/conversaciones/componentes/nuevo-mensaje';

const mainNavItems: NavItem[] = [
    {
        title: 'Inbox',
        href: index().url,
        icon: Inbox,
    },
    {
        title: 'Enviados',
        href: sent().url,
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
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={index().url} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                        <SidebarMenuButton size="lg" asChild className='bg-primary text-white hover:bg-primary/80 mt-2'>
                            <Link href={create().url} prefetch>
                                <NuevoMensaje />
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
