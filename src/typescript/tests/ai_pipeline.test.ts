import { globalLLM } from '../compiler/llmAdapter';
import { compilarComPrompt } from '../compiler/intentCompiler';
import { RobloxAdapter } from '../adapters/robloxAdapter';
import { intentDataStore } from '../data/intentDataStore';

async function testAIPipeline() {
    console.log('🧪 Iniciando Teste da Pipeline de IA...\n');

    const prompt = "Uma espada lendária de gelo eterno";
    console.log(`Prompt Simulado: "${prompt}"`);

    // 1. Testar Compilação com Prompt (IA)
    console.log('\n1. Compilando com IA...');
    const plano = await compilarComPrompt(prompt, [], new RobloxAdapter());

    console.log(`   - Categoria Detectada: ${plano.intencao.categoria}`);
    console.log(`   - Tags: ${plano.intencao.parametros.tags.join(', ')}`);
    console.log(`   - Modelo: ${plano.intencao.parametros.model}`);

    // 2. Simular Correção Humana (RLHF)
    console.log('\n2. Simulando Feedback Humano (RLHF)...');
    intentDataStore.logCorrection(plano.intencao.id, {
        descricaoNatural: prompt + " [CORREÇÃO: Adicionar tag 'mágica']"
    });

    // 3. Verificar Exportação para Treino
    console.log('\n3. Verificando Dataset para Treino...');
    const exportData = intentDataStore.exportForTraining();
    console.log('   - Dataset Exportado (Amostra):');
    console.log(exportData.substring(0, 200) + '...');

    console.log('\n✅ Pipeline de IA e Estratégia de Dados Verificadas!');
}

testAIPipeline().catch(console.error);
