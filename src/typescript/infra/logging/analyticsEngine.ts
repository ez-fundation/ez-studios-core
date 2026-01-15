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
    hoursSaved: number;
    // Phase 37: Monetization Hub
    revenueBySource: {
        marketplace: number; // 40% Commission logic
        commissions: number; // 100% Direct
        premium: number;     // Payouts estimativa
        b2b: number;         // Licensing
    };
    projectedEarnings: number; // Total em R$
    roiTotal: number;          // R$ per Hour Saved
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
        const hoursSaved = successLogs.length * 0.5;
        const totalXP = successLogs.length * 50;

        // Phase 37: Monetization Logic (Simulation based on volume)
        // Premissa: 10% de itens gerados são vendidos no Marketplace (Ticket médio R$ 50)
        const itemCount = categoryDistribution["Item"] || 0;
        const marketplaceRevenue = (itemCount * 0.1) * 50 * 0.6; // 60% para o Arquiteto

        // Premissa: 5% de criações são comissões diretas (Ticket médio R$ 200)
        const commissionRevenue = (successLogs.length * 0.05) * 200;

        // Premissa: Premium payouts baseados em tempo de retenção (Simulado)
        const premiumRevenue = successLogs.length * 2.5;

        const revenueBySource = {
            marketplace: marketplaceRevenue,
            commissions: commissionRevenue,
            premium: premiumRevenue,
            b2b: 0 // Reservado para futuros contratos
        };

        const projectedEarnings = marketplaceRevenue + commissionRevenue + premiumRevenue;
        const roiTotal = hoursSaved > 0 ? projectedEarnings / hoursSaved : 0;

        return {
            totalBuilds,
            successRate,
            avgDuration,
            totalXP,
            categoryDistribution,
            engineDistribution,
            hoursSaved,
            revenueBySource,
            projectedEarnings,
            roiTotal
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
            hoursSaved: 0,
            revenueBySource: { marketplace: 0, commissions: 0, premium: 0, b2b: 0 },
            projectedEarnings: 0,
            roiTotal: 0
        };
    }
}

export const analyticsEngine = new AnalyticsEngine();
