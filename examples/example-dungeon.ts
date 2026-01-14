/**
 * Exemplo Completo: Geração de Dungeon
 * Demonstra o fluxo completo do Motor Procedural Educacional
 */

import { generateDungeonForStudent, logIntentAndBuild } from "../src/edu/api/educationalApi";
import { Intencao } from "../src/core/models/types";

// Exemplo 1: Usar função padrão
console.log("=== Exemplo 1: Dungeon Padrão ===\n");

try {
  const resultado1 = generateDungeonForStudent("aluno_001");

  console.log(`✓ Dungeon gerada com sucesso!`);
  console.log(`  ID do Mapa: ${resultado1.mapa.id}`);
  console.log(`  Seed: ${resultado1.mapa.seed}`);
  console.log(`  Setores: ${resultado1.mapa.setores.length}`);
  console.log(`  Tiles: ${resultado1.mapa.tiles.length}`);
  console.log(`  Tempo: ${resultado1.mapa.metadados.stats?.tempoGeracaoMs}ms\n`);
} catch (error) {
  console.error("✗ Erro ao gerar dungeon:", error);
}

// Exemplo 2: Usar intenção customizada
console.log("=== Exemplo 2: Dungeon Customizada ===\n");

try {
  const intencaoCustomizada: Intencao = {
    id: "intencao_custom_001",
    categoria: "Mapa",
    descricaoNatural: "Quero uma dungeon com 8 áreas principais e uma sala de boss no final",
    parametros: {
      quantidadeAreas: 8,
      temBossRoom: true,
      dificuldade: "hard",
    },
  };

  const resultado2 = logIntentAndBuild("aluno_002", intencaoCustomizada);

  console.log(`✓ Dungeon customizada gerada!`);
  console.log(`  Intenção: ${resultado2.intencao.descricaoNatural}`);
  console.log(`  Regras aplicadas: ${resultado2.regras.length}`);
  console.log(`  Código Luau gerado: ${resultado2.codigoGerado.length} caracteres\n`);

  // Mostrar primeiras linhas do código Luau
  const linhasLuau = resultado2.codigoGerado.split("\n").slice(0, 5);
  console.log("Primeiras linhas do código Luau:");
  linhasLuau.forEach((linha) => console.log(`  ${linha}`));
  console.log();
} catch (error) {
  console.error("✗ Erro ao gerar dungeon customizada:", error);
}

// Exemplo 3: Múltiplas gerações (teste de reprodutibilidade)
console.log("=== Exemplo 3: Teste de Reprodutibilidade ===\n");

try {
  const seed = "test_seed_123";
  const intencao: Intencao = {
    id: "intencao_repro_001",
    categoria: "Mapa",
    descricaoNatural: "Teste de seed determinística",
    parametros: {
      quantidadeAreas: 3,
      temBossRoom: false,
      dificuldade: "normal",
    },
  };

  // Gerar duas vezes com a mesma seed
  const resultado3a = logIntentAndBuild("aluno_003", intencao);
  const resultado3b = logIntentAndBuild("aluno_003", intencao);

  console.log(`✓ Duas gerações concluídas`);
  console.log(`  Primeira: ${resultado3a.mapa.tiles.length} tiles`);
  console.log(`  Segunda: ${resultado3b.mapa.tiles.length} tiles`);
  console.log(`  Mesmo número de tiles? ${resultado3a.mapa.tiles.length === resultado3b.mapa.tiles.length}\n`);
} catch (error) {
  console.error("✗ Erro no teste de reprodutibilidade:", error);
}

console.log("=== Exemplos Concluídos ===");
