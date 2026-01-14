import { Intencao } from "../core/models/types";

/**
 * Interface para Adaptores de LLM (Nuvem ou Local)
 */
export interface ILLMProvider {
    parse(prompt: string): Promise<Intencao>;
    name: string;
}

/**
 * Provedor Mock para Desenvolvimento e Fallback
 * Simula uma IA processando linguagem natural
 */
export class MockLLMProvider implements ILLMProvider {
    name = "Mock-Intelligence-v1";

    async parse(prompt: string): Promise<Intencao> {
        console.log(`[LLM] Processando: "${prompt}"...`);

        // Simular delay de processamento
        await new Promise(resolve => setTimeout(resolve, 800));

        // Aqui usamos um "Small Brain" (heurística melhorada) enquanto não temos a API Key
        const p = prompt.toLowerCase();
        let categoria: "Mapa" | "Item" | "Actor" = "Mapa";

        if (p.includes("espada") || p.includes("item") || p.includes("arma")) categoria = "Item";
        else if (p.includes("npc") || p.includes("guarda") || p.includes("monstro")) categoria = "Actor";

        return {
            id: `ai_intent_${Date.now()}`,
            categoria,
            descricaoNatural: prompt,
            parametros: {
                ai_generated: true,
                confidence: 0.95,
                model: this.name,
                // O Mock LLM é um pouco mais esperto que o parser básico
                tags: p.split(' ').filter(word => word.length > 4)
            }
        };
    }
}

/**
 * Gerenciador de LLMs
 * Permite alternar entre modelos (Gemma, GPT-4, Local Llama)
 */
export class LLMAdapter {
    private provider: ILLMProvider;

    constructor(provider: ILLMProvider = new MockLLMProvider()) {
        this.provider = provider;
    }

    async processarIntencao(prompt: string): Promise<Intencao> {
        try {
            return await this.provider.parse(prompt);
        } catch (error) {
            console.error("[LLMAdapter] Falha no provedor de IA, usando fallback.", error);
            throw error;
        }
    }

    setProvider(provider: ILLMProvider) {
        this.provider = provider;
        console.log(`[LLMAdapter] Provedor alterado para: ${provider.name}`);
    }
}

export const globalLLM = new LLMAdapter();
