
/**
 * Calcula a distância de Levenshtein entre duas strings
 * @param a String A
 * @param b String B
 * @returns Número de edições necessárias (menor = mais parecido)
 */
export function levenshteinDistance(a: string, b: string): number {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = [];

    // Increment along the first column of each row
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    // Increment each column in the first row
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    // Fill in the rest of the matrix
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    Math.min(
                        matrix[i][j - 1] + 1, // insertion
                        matrix[i - 1][j] + 1 // deletion
                    )
                );
            }
        }
    }

    return matrix[b.length][a.length];
}

/**
 * Verifica se a stringalvo contém a keyword com tolerância a typos
 * @param text Texto completo
 * @param keyword Palavra-chave
 * @param tolerance Tolerância (default 2)
 */
export function fuzzyIncludes(text: string, keyword: string, tolerance: number = 2): boolean {
    const words = text.split(/\s+/);
    for (const word of words) {
        if (Math.abs(word.length - keyword.length) > tolerance) continue;
        if (levenshteinDistance(word, keyword) <= tolerance) return true;
    }
    return false;
}
