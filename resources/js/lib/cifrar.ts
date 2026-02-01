import type { TextoCifrado } from "@/types/texto-cifrado";

// Esta encriptacion tiene en cuenta que se reemplaza la 'ñ' por 'n' y la 'Ñ' por 'N', 
// ademas las vocales acentuadas se reemplazan por las vocales no acentuadas tanto en mayusculas como en minusculas 
// y los números tambien aplican el desplazamiento, ejemplo: si el desplazamiento es 3 y hay un numero 1, 
// su encriptacion es 4, y si hay un numero 9, su encriptacion es 2

export default function cifrar(texto: string, desplazamiento: number): TextoCifrado {
    const excepciones: Record<number, string> = {};
    // Detecta los caracteres especiales antes de normalizar el texto
    for (let i = 0; i < texto.length; i++) {
        if (texto[i].match(/[áéíóúÁÉÍÓÚñÑ]/)) {
            excepciones[i] = texto[i];
        }
    }

    const normalizado = texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    let cifrado = '';

    for (let i = 0; i < normalizado.length; i++) {
        const codigo = normalizado.charCodeAt(i);

        // Mayusculas
        if (codigo >= 65 && codigo <= 90) {
            cifrado += String.fromCharCode(((codigo - 65 + desplazamiento) % 26 + 26) % 26 + 65);
        }
        // Minusculas
        else if (codigo >= 97 && codigo <= 122) {
            cifrado += String.fromCharCode(((codigo - 97 + desplazamiento) % 26 + 26) % 26 + 97);
        }
        // Numeros
        else if (codigo >= 48 && codigo <= 57) {
            cifrado += String.fromCharCode(((codigo - 48 + desplazamiento) % 10 + 10) % 10 + 48);
        } else {
            cifrado += normalizado[i];
        }
    }

    return { texto: cifrado, excepciones };
}