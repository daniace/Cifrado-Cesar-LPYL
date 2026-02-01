export interface MensajeModelo {
    id: number;
    asunto: string;
    contenido: string;
    desplazamiento: number;
    excepciones_asunto: Record<number, string>;
    excepciones_contenido: Record<number, string>;
    id_emisor: number;
    id_receptor: number;
    leido: boolean;
    id_conversacion: string;
    id_mensaje_anterior: number;
    created_at: string;
    updated_at: string;
}