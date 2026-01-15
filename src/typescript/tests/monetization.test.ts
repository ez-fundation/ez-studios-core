import { globalLogger } from '../infra/logging/logger';
import { analyticsEngine } from '../infra/logging/analyticsEngine';

async function testMonetizationAggregation() {
    console.log('🧪 Iniciando Teste de Monetização (Fase 37)...\n');

    // 1. Limpar e Injetar Logs de Teste
    globalLogger.limpar();

    console.log('1. Injetando Logs Simulados (Itens e Atores)...');
    // 10 Itens de Sucesso
    for (let i = 1; i <= 10; i++) {
        globalLogger.registrarSucesso(`item_${i}`, "Item", `seed_${i}`, "Roblox", { dano: 10 }, 800);
    }
    // 10 Mapas de Sucesso
    for (let i = 1; i <= 10; i++) {
        globalLogger.registrarSucesso(`map_${i}`, "Mapa", `seed_map_${i}`, "Roblox", { tiles: 100 }, 1500);
    }

    // 2. Processar Métricas
    console.log('2. Processando Métricas de Receita...');
    const metrics = analyticsEngine.getMetrics();

    // Marketplace: 10 itens * 0.1 (venda) * R$ 50 (ticket) * 0.6 (comissão) = R$ 30
    const expectedMarketplace = 30;
    // Commissions: 20 total * 0.05 (taxa) * R$ 200 (ticket) = R$ 200
    const expectedCommissions = 200;
    // Premium: 20 total * R$ 2.5 = R$ 50
    const expectedPremium = 50;

    const expectedTotal = expectedMarketplace + expectedCommissions + expectedPremium;

    console.log(`   - Marketplace Revenue: R$ ${metrics.revenueBySource.marketplace} (Esperado: R$ ${expectedMarketplace})`);
    console.log(`   - Commissions Revenue: R$ ${metrics.revenueBySource.commissions} (Esperado: R$ ${expectedCommissions})`);
    console.log(`   - Premium Payouts: R$ ${metrics.revenueBySource.premium} (Esperado: R$ ${expectedPremium})`);
    console.log(`   - Total Projetado: R$ ${metrics.projectedEarnings} (Esperado: R$ ${expectedTotal})`);

    // 3. Validação
    if (metrics.projectedEarnings === expectedTotal) {
        console.log('\n✅ AnalyticsEngine (Monetização) validado com sucesso!');
    } else {
        console.error(`\n❌ Falha na validação financeira. Obtido: ${metrics.projectedEarnings}, Esperado: ${expectedTotal}`);
        process.exit(1);
    }
}

testMonetizationAggregation().catch(console.error);
