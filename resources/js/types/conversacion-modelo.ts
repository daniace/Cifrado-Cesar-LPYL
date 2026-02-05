import { User } from "./auth";
import { MensajeModelo } from "./mensaje-modelo";

export interface ConversacionModelo {
    id: number;
    asunto: string;
    desplazamiento_asunto: number;
    excepciones_asunto: Record<number, string> | null;
    id_emisor: number;
    id_receptor: number;
    fecha_ultimo_mensaje: string | null;
    created_at: string;
    updated_at: string;
    // Relaciones cargadas
    emisor?: User;
    receptor?: User;
    mensajes?: MensajeModelo[];
    ultimo_mensaje?: MensajeModelo;
}
