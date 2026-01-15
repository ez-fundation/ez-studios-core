
/**
 * EZ Studios - Sistema de Internacionalização de Intenção (Polyglot Layer)
 * Mapeia palavras humanas em múltiplos idiomas para Conceitos Canônicos do Sistema.
 */

// Conceitos Canônicos que o sistema entende internamente
export type CanonicalConcept = 
    | "CATEGORY_MAP" | "CATEGORY_ITEM" | "CATEGORY_ACTOR"
    | "TAG_FIRE" | "TAG_ICE" | "TAG_SWORD" | "TAG_POTION" | "TAG_MONSTER" | "TAG_NPC"
    | "AESTHETIC_CYBER" | "AESTHETIC_MEDIEVAL" | "AESTHETIC_LOWPOLY" | "UNKNOWN";

// Dicionário de sinônimos por idioma
const dictionaries: Record<string, Record<string, CanonicalConcept[]>> = {
    "pt": {
        "mapa": ["CATEGORY_MAP"], "mundo": ["CATEGORY_MAP"], "dungeon": ["CATEGORY_MAP"], "masmorra": ["CATEGORY_MAP"], "cidade": ["CATEGORY_MAP"],
        "item": ["CATEGORY_ITEM"], "espada": ["CATEGORY_ITEM", "TAG_SWORD"], "faca": ["CATEGORY_ITEM", "TAG_SWORD"], "arma": ["CATEGORY_ITEM"], "pocao": ["CATEGORY_ITEM", "TAG_POTION"],
        "ator": ["CATEGORY_ACTOR"], "npc": ["CATEGORY_ACTOR", "TAG_NPC"], "monstro": ["CATEGORY_ACTOR", "TAG_MONSTER"], "boss": ["CATEGORY_ACTOR"], "guarda": ["CATEGORY_ACTOR", "TAG_NPC"],
        "fogo": ["TAG_FIRE"], "quente": ["TAG_FIRE"], "infernal": ["TAG_FIRE"],
        "gelo": ["TAG_ICE"], "frio": ["TAG_ICE"], "congelado": ["TAG_ICE"],
        "cyber": ["AESTHETIC_CYBER"], "futurista": ["AESTHETIC_CYBER"], "neon": ["AESTHETIC_CYBER"],
        "medieval": ["AESTHETIC_MEDIEVAL"], "antigo": ["AESTHETIC_MEDIEVAL"],
        "lowpoly": ["AESTHETIC_LOWPOLY"], "simples": ["AESTHETIC_LOWPOLY"]
    },
    "en": {
        "map": ["CATEGORY_MAP"], "world": ["CATEGORY_MAP"], "dungeon": ["CATEGORY_MAP"], "city": ["CATEGORY_MAP"],
        "item": ["CATEGORY_ITEM"], "sword": ["CATEGORY_ITEM", "TAG_SWORD"], "weapon": ["CATEGORY_ITEM"], "potion": ["CATEGORY_ITEM", "TAG_POTION"],
        "actor": ["CATEGORY_ACTOR"], "npc": ["CATEGORY_ACTOR", "TAG_NPC"], "monster": ["CATEGORY_ACTOR", "TAG_MONSTER"], "boss": ["CATEGORY_ACTOR"], "guard": ["CATEGORY_ACTOR", "TAG_NPC"],
        "fire": ["TAG_FIRE"], "hot": ["TAG_FIRE"], "infernal": ["TAG_FIRE"],
        "ice": ["TAG_ICE"], "cold": ["TAG_ICE"], "frozen": ["TAG_ICE"],
        "cyber": ["AESTHETIC_CYBER"], "futuristic": ["AESTHETIC_CYBER"], "neon": ["AESTHETIC_CYBER"],
        "medieval": ["AESTHETIC_MEDIEVAL"], "ancient": ["AESTHETIC_MEDIEVAL"],
        "lowpoly": ["AESTHETIC_LOWPOLY"], "simple": ["AESTHETIC_LOWPOLY"]
    }
    // "es" could be added here
};

import { fuzzyIncludes } from "../utils/fuzzy";

/**
 * Resolve um prompt para uma lista de Conceitos Canônicos detectados.
 * Usa fuzzy matching para encontrar as palavras em todos os dicionários suportados.
 */
export class I18nEngine {
    
    /**
     * Analisa o texto e extrai conceitos conhecidos independente do idioma.
     * @param text Texto de entrada
     */
    public resolveConcepts(text: string): CanonicalConcept[] {
        const detectedConcepts = new Set<CanonicalConcept>();
        const lowerText = text.toLowerCase();

        // Itera sobre todos os idiomas (Polyglot by default)
        for (const lang of Object.keys(dictionaries)) {
            const dict = dictionaries[lang];
            for (const [word, concepts] of Object.entries(dict)) {
                // Se a palavra (ou algo parecido) está no texto...
                if (fuzzyIncludes(lowerText, word, 1)) { // Tolerância 1 para evitar falsos positivos curtos
                    concepts.forEach(c => detectedConcepts.add(c));
                }
            }
        }

        return Array.from(detectedConcepts);
    }
}

export const i18n = new I18nEngine();
