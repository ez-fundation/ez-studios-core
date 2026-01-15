/**
 * Analytics Engine (Protocolo Entropia Zero)
 * Agrega logs do GlobalLogger em métricas de alto nível para o Dashboard.
 */

import { globalLogger } from "./logger";
import { LogEntrada } from "../../core/models/types";

export interface SystemMetrics {
    totalBuilds: number;
    successRate: number;
    avgDuration: number;
    totalXP: number;
    categoryDistribution: Record<string, number>;
    engineDistribution: Record<string, number>;
    hoursSaved: number; // Métrica de Valor: Procedural vs Manual
}

export class AnalyticsEngine {
    /**
     * Calcula métricas em tempo real a partir dos logs
     */
    public getMetrics(): SystemMetrics {
        const logs = globalLogger.obterLogsEstruturados();
        const totalBuilds = logs.length;

        if (totalBuilds === 0) {
            return this.getEmptyMetrics();
        }

        const successLogs = logs.filter(l => l.buildStatus === "success");
        const successRate = (successLogs.length / totalBuilds) * 100;

        const totalDuration = successLogs.reduce((acc, l) => acc + (Number(l.duracao) || 0), 0);
        const avgDuration = successLogs.length > 0 ? totalDuration / successLogs.length : 0;

        // Distribuição
        const categoryDistribution: Record<string, number> = {};
        const engineDistribution: Record<string, number> = {};

        logs.forEach(log => {
            categoryDistribution[log.categoria] = (categoryDistribution[log.categoria] || 0) + 1;
            engineDistribution[log.engineAlvo] = (engineDistribution[log.engineAlvo] || 0) + 1;
        });

        // XP e Horas Economizadas
        // Premissa: Cada geração de sucesso economiza ~30 min (0.5h) de trabalho manual
        const hoursSaved = successLogs.length * 0.5;
        const totalXP = successLogs.length * 50;

        return {
            totalBuilds,
            successRate,
            avgDuration,
            totalXP,
            categoryDistribution,
            engineDistribution,
            hoursSaved
        };
    }

    private getEmptyMetrics(): SystemMetrics {
        return {
            totalBuilds: 0,
            successRate: 0,
            avgDuration: 0,
            totalXP: 0,
            categoryDistribution: {},
            engineDistribution: {},
            hoursSaved: 0
        };
    }
}

export const analyticsEngine = new AnalyticsEngine();
