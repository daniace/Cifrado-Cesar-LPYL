import type { User } from "./auth";

export interface MensajeModelo {
    id: number;
    conversacion_id: number;
    emisor_id: number;
    contenido: string;
    desplazamiento_contenido: number;
    excepciones_contenido: Record<number, string> | null;
    leido: boolean;
    created_at: string;
    updated_at: string;
    // Relaciones cargadas
    emisor?: User;
}