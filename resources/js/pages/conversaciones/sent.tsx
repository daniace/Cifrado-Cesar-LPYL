import { Head, usePage, usePoll } from '@inertiajs/react';
import { useState, useCallback } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { User } from '@/types/auth';
import { sent } from '@/actions/App/Http/Controllers/ConversacionController';
import { getMensajes } from '@/actions/App/Http/Controllers/ConversacionController';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { MailList, type Conversacion } from './componentes/mail-list';
import { MailDisplay, type ConversacionCompleta } from './componentes/mail-display';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Enviados',
        href: sent().url,
    },
];

interface Props {
    conversaciones: Conversacion[];
}

export default function Sent({ conversaciones }: Props) {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const [selectedConversacion, setSelectedConversacion] = useState<ConversacionCompleta | null>(null);
    const [loading, setLoading] = useState(false);

    usePoll(5000, {
        only: ['conversaciones'],
    });

    const handleSelect = useCallback(async (conversacion: Conversacion) => {
        setLoading(true);
        try {
            const response = await fetch(getMensajes(conversacion.id).url);
            const data = await response.json();
            setSelectedConversacion(data);
        } catch (error) {
            console.error('Error loading conversation:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleMessageSent = useCallback(() => {
        if (selectedConversacion) {
            // Refresh the selected conversation
            handleSelect({ id: selectedConversacion.id } as Conversacion);
        }
    }, [selectedConversacion, handleSelect]);

    // Filter for unread
    const unreadConversaciones = conversaciones.filter(
        (c) => c.ultimo_mensaje && !c.ultimo_mensaje.leido && c.ultimo_mensaje.emisor_id !== auth.user.id
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Inbox" />

            <ResizablePanelGroup direction="horizontal" className="h-full min-h-[calc(100vh-4rem)]">
                {/* Panel izquierdo: Lista de conversaciones */}
                <ResizablePanel defaultSize={35} minSize={25} maxSize={50}>
                    <Tabs defaultValue="all" className="h-full flex flex-col">
                        <div className="flex items-center px-4 py-2">
                            <h1 className="text-xl font-bold">Inbox</h1>
                        </div>
                        <Separator />
                        <div className="px-4 py-2">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="all">
                                    Todos
                                </TabsTrigger>
                                <TabsTrigger value="unread">
                                    No leídos ({unreadConversaciones.length})
                                </TabsTrigger>
                            </TabsList>
                        </div>
                        <TabsContent value="all" className="flex-1 m-0">
                            <MailList
                                conversaciones={conversaciones}
                                selectedId={selectedConversacion?.id ?? null}
                                onSelect={handleSelect}
                                currentUserId={auth.user.id}
                            />
                        </TabsContent>
                        <TabsContent value="unread" className="flex-1 m-0">
                            <MailList
                                conversaciones={unreadConversaciones}
                                selectedId={selectedConversacion?.id ?? null}
                                onSelect={handleSelect}
                                currentUserId={auth.user.id}
                            />
                        </TabsContent>
                    </Tabs>
                </ResizablePanel>

                <ResizableHandle withHandle />

                {/* Panel derecho: Detalle de conversación */}
                <ResizablePanel defaultSize={65}>
                    {loading ? (
                        <div className="flex h-full items-center justify-center">
                            <div className="animate-pulse text-muted-foreground">Cargando...</div>
                        </div>
                    ) : (
                        <MailDisplay
                            conversacion={selectedConversacion}
                            currentUserId={auth.user.id}
                            onMessageSent={handleMessageSent}
                        />
                    )}
                </ResizablePanel>
            </ResizablePanelGroup>
        </AppLayout>
    );
}
