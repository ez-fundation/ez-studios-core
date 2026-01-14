/**
 * Adaptador ThreeJS / Web Preview
 * Converte o mapa gerado em uma estrutura de dados leve para visualização no Editor React
 */

import { IEngineAdapter } from "./index";
import { MapaGerado } from "../core/models/types";

export class ThreeJsAdapter implements IEngineAdapter {
    readonly engineName = "ThreeJS";
    readonly fileExtension = "json";

    /**
     * Gera um JSON estruturado para o renderer Web
     */
    generateCode(mapa: MapaGerado, options?: any): string {
        const data = {
            id: mapa.id,
            dimensions: mapa.dimensoes,
            // Mapeamento simplificado para o frontend
            tiles: mapa.tiles.map((t) => ({
                id: t.tileId,
                x: t.x,
                y: t.y,
                // Tradução de tipos de tiles para cores de preview
                color: this.getTileColor(t.tileId),
            })),
            sectors: mapa.setores.map((s) => ({
                id: s.id,
                bounds: s.bounds,
            })),
        };

        return JSON.stringify(data, null, 2);
    }

    getBuildStats(mapa: MapaGerado) {
        return {
            engine: this.engineName,
            tiles: mapa.tiles.length,
            timestamp: new Date().toISOString(),
        };
    }

    /**
     * Helper para cores de preview baseadas no nome do tile
     */
    private getTileColor(tileId: string): string {
        const lowerId = tileId.toLowerCase();
        if (lowerId.includes("parede")) return "#4A4A4A"; // Cinza Escuro
        if (lowerId.includes("chao") || lowerId.includes("grama")) return "#2ECC71"; // Verde
        if (lowerId.includes("agua")) return "#3498DB"; // Azul
        if (lowerId.includes("porta")) return "#E67E22"; // Laranja
        if (lowerId.includes("spawn")) return "#F1C40F"; // Amarelo
        if (lowerId.includes("boss")) return "#E74C3C"; // Vermelho
        return "#FFFFFF"; // Default
    }
}
