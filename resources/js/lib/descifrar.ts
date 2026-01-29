// Esta desencriptacion toma como parametro el texto a desencriptar y el desplazamiento
// ademas toma como parametro un objeto con las excepciones que se hicieron en la encriptacion
// y retorna el texto desencriptado.

export default function descifrar(texto: string, desplazamiento: number, excepciones: Record<number, string> = {}): string {
    const normalizado = texto.normalize('NFD').replace(/[̀-ͯ]/g, '');
    let descifrado = '';

    for (let i = 0; i < normalizado.length; i++) {
        const codigo = normalizado.charCodeAt(i);

        if (codigo >= 65 && codigo <= 90) {
            descifrado += String.fromCharCode(((codigo - 65 - desplazamiento + 26) % 26 + 26) % 26 + 65);
        } else if (codigo >= 97 && codigo <= 122) {
            descifrado += String.fromCharCode(((codigo - 97 - desplazamiento + 26) % 26 + 26) % 26 + 97);
        } else if (codigo >= 48 && codigo <= 57) {
            descifrado += String.fromCharCode(((codigo - 48 - desplazamiento + 10) % 10 + 10) % 10 + 48);
        } else {
            descifrado += normalizado[i];
        }
    }

    // Separa los caracteres del texto desencriptado en un arreglo
    // y reemplaza los caracteres que esten en el objeto excepciones
    // Ej: sueno.split('') -> ['s', 'u', 'e', 'n', 'o']
    //     excepciones -> {3: 'ñ'}
    //     caracteres -> ['s', 'u', 'e', 'ñ', 'o']
    //     caracteres.join('') -> 'sueño'
    const caracteres = descifrado.split('');
    Object.entries(excepciones).forEach(([index, char]) => {
        if (Number(index) < caracteres.length) {
            caracteres[Number(index)] = char;
        }
    });

    return caracteres.join('');
}
