import { User } from "@/types/auth";

export default function SeleccionarDestinatario({ usuarios, onUsuarioSelect }: { usuarios: User[], onUsuarioSelect: (usuario: User) => void }) {
    return (
        <div className="border border-gray-200 rounded-lg p-4">
            <label htmlFor="destinatario" className="p-2">Destinatario</label>
            <select
                id="destinatario"
                onChange={(e) => onUsuarioSelect(usuarios[parseInt(e.target.value)])}
                className="border border-gray-200 rounded-lg p-2"
            >
                <option value="">Selecciona un destinatario</option>
                {usuarios.map((usuario, index) => (
                    <option key={usuario.id} value={index}>{usuario.nombre_usuario}</option>
                ))}
            </select>
        </div>
    );
}