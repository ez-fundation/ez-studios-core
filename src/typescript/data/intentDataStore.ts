import { Intencao } from "../core/models/types";

export interface IntentLogEntry {
    timestamp: string;
    prompt: string;
    intent: Intencao;
    userCorrection: Partial<Intencao> | null;
    metadata: {
        model: string;
        version: string;
        sessionId: string;
    };
}

/**
 * Repositório de Dados de Intenção para Treinamento de IA
 * Salva logs de interações para futuro Fine-Tuning
 */
export class IntentDataStore {
    private storageKey = "ez_studios_intent_dataset";

    /**
     * Registra uma nova intenção gerada pela IA
     */
    logIntent(prompt: string, intent: Intencao, model: string): void {
        const entry: IntentLogEntry = {
            timestamp: new Date().toISOString(),
            prompt,
            intent,
            userCorrection: null,
            metadata: {
                model,
                version: "2.3.0",
                sessionId: this.getOrCreateSessionId()
            }
        };

        this.saveEntry(entry);
        console.log(`[DataStore] Intenção logada para dataset: ${intent.id}`);
    }

    /**
     * Registra uma correção feita pelo usuário (RLHF)
     */
    logCorrection(intentId: string, correction: Partial<Intencao>): void {
        const dataset = this.getDataset();
        const index = dataset.findIndex(e => e.intent.id === intentId);

        if (index !== -1) {
            dataset[index].userCorrection = correction;
            localStorage.setItem(this.storageKey, JSON.stringify(dataset));
            console.log(`[DataStore] Feedback humano (RLHF) registrado para: ${intentId}`);
        }
    }

    /**
     * Exporta o dataset para formato JSONL (usado para treino de IA)
     */
    exportForTraining(): string {
        const dataset = this.getDataset();
        return dataset.map(entry => JSON.stringify(entry)).join("\n");
    }

    private saveEntry(entry: IntentLogEntry): void {
        const dataset = this.getDataset();
        dataset.push(entry);
        // Persistência local (pode ser migrada para backend no futuro)
        if (typeof localStorage !== "undefined") {
            localStorage.setItem(this.storageKey, JSON.stringify(dataset));
        }
    }

    private getDataset(): IntentLogEntry[] {
        if (typeof localStorage === "undefined") return [];
        const raw = localStorage.getItem(this.storageKey);
        return raw ? JSON.parse(raw) : [];
    }

    private getOrCreateSessionId(): string {
        return "session_" + Math.random().toString(36).substring(7);
    }
}

export const intentDataStore = new IntentDataStore();
