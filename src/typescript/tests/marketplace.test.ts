import { RobloxAdapter } from '../adapters/robloxAdapter';
import { ItemInstance, ActorInstance } from '../core/models/types';

async function testMarketplaceSync() {
    console.log('🧪 Iniciando Teste de Marketplace Sync (Fase 34)...\n');

    const adapter = new RobloxAdapter();

    // 1. Simular Item com ID Real (Espada de Fogo)
    const itemEspada: ItemInstance = {
        id: "test_sword",
        tipo: "Item",
        raridade: "lendario",
        blueprintId: "bp_sword_001",
        stats: { dano: 50 },
        efeitos: [],
        metadados: {
            tags: ["espada", "fogo"],
            estetica: "Quantum",
            hashGeracao: "abc",
            seed: "test_seed",
            versaoMotor: "2.3.0",
            criadoEm: new Date().toISOString(),
            autorId: "test"
        }
    };

    console.log('1. Gerando código para Item com ID Real (Espada)...');
    const codeSword = adapter.generateCode(itemEspada);

    if (codeSword.includes('rbxassetid://123456789')) {
        console.log('   ✅ SUCESSO: ID Real "rbxassetid://123456789" encontrado no código.');
    } else {
        console.error('   ❌ FALHA: ID Real não encontrado no código.');
    }

    // 2. Simular Item sem ID Real (Fallback)
    const itemPao: ItemInstance = {
        id: "test_bread",
        tipo: "Item",
        raridade: "comum",
        blueprintId: "bp_bread_001",
        stats: { cura: 10 },
        efeitos: [],
        metadados: {
            tags: ["comida", "pao"],
            estetica: "Realistic",
            hashGeracao: "def",
            seed: "test_seed",
            versaoMotor: "2.3.0",
            criadoEm: new Date().toISOString(),
            autorId: "test"
        }
    };

    console.log('\n2. Gerando código para Item SEM ID Real (Fallback)...');
    const codeBread = adapter.generateCode(itemPao);

    if (codeBread.includes('Mode: Procedural Fallback')) {
        console.log('   ✅ SUCESSO: Modo "Procedural Fallback" ativado corretamente.');
    } else {
        console.error('   ❌ FALHA: Fallback não ativado.');
    }

    console.log('\n✅ Teste de Marketplace Sync concluído!');
}

testMarketplaceSync().catch(console.error);
