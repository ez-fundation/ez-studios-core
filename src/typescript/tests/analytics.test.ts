import { globalLogger } from '../infra/logging/logger';
import { analyticsEngine } from '../infra/logging/analyticsEngine';

async function testAnalyticsAggregation() {
    console.log('🧪 Iniciando Teste de Analytics (Fase 35)...\n');

    // 1. Limpar e Injetar Logs de Teste
    globalLogger.limpar();

    console.log('1. Injetando Logs Simulados...');
    globalLogger.registrarSucesso("intent_1", "Mapa", "seed_1", "Roblox", { numTiles: 100 }, 1200);
    globalLogger.registrarSucesso("intent_2", "Item", "seed_2", "Roblox", { dano: 10 }, 800);
    globalLogger.registrarErro("intent_3", "Mapa", "seed_3", "Roblox", "Overflow", "Critical Error", undefined, 500);

    // 2. Processar Métricas
    console.log('2. Processando Métricas via AnalyticsEngine...');
    const metrics = analyticsEngine.getMetrics();

    console.log(`   - Total de Builds: ${metrics.totalBuilds} (Esperado: 3)`);
    console.log(`   - Taxa de Sucesso: ${metrics.successRate.toFixed(1)}% (Esperado: 66.7%)`);
    console.log(`   - Duração Média: ${metrics.avgDuration.toFixed(0)}ms (Esperado: 1000ms)`);
    console.log(`   - Horas Salvas: ${metrics.hoursSaved}h (Esperado: 1.0h)`);
    console.log(`   - XP Total: ${metrics.totalXP} (Esperado: 100)`);

    // 3. Validação
    if (metrics.totalBuilds === 3 && metrics.hoursSaved === 1.0) {
        console.log('\n✅ AnalyticsEngine validado com sucesso!');
    } else {
        console.error('\n❌ Falha na validação das métricas.');
        process.exit(1);
    }
}

testAnalyticsAggregation().catch(console.error);
