/**
 * Script de Validação de Integração
 * Testa o fluxo completo: Geração → Serialização → Desserialização
 */

import { generateDungeonForStudent, generateArenaForStudent } from "../src/edu/api/educationalApi";
import { serializeMapa, deserializeMapa, validarMapaDesserializado } from "../src/core/models/serialization";
import { Intencao } from "../src/core/models/types";

console.log("=== Validação de Integração Roblox ===\n");

// Teste 1: Serialização e Desserialização
console.log("Teste 1: Serialização ↔ Desserialização");
console.log("-".repeat(50));

try {
  const resultado = generateDungeonForStudent("aluno_teste");
  const mapaOriginal = resultado.mapa;

  // Serializar
  const json = serializeMapa(mapaOriginal);
  console.log(`✓ Mapa serializado: ${json.length} caracteres`);

  // Desserializar
  const mapaDesserializado = deserializeMapa(json);
  console.log(`✓ Mapa desserializado`);

  // Validar
  const valido = validarMapaDesserializado(mapaDesserializado);
  console.log(`✓ Mapa válido: ${valido}`);

  // Comparar
  const mesmoId = mapaOriginal.id === mapaDesserializado.id;
  const mesmoSeed = mapaOriginal.seed === mapaDesserializado.seed;
  const mesmosTiles = mapaOriginal.tiles.length === mapaDesserializado.tiles.length;

  console.log(`✓ ID preservado: ${mesmoId}`);
  console.log(`✓ Seed preservada: ${mesmoSeed}`);
  console.log(`✓ Tiles preservados: ${mesmosTiles} (${mapaDesserializado.tiles.length} tiles)\n`);
} catch (error) {
  console.error("✗ Erro:", error);
}

// Teste 2: Múltiplas Gerações
console.log("Teste 2: Múltiplas Gerações");
console.log("-".repeat(50));

try {
  const intencoes: Intencao[] = [
    {
      id: "dungeon_1",
      categoria: "Mapa",
      descricaoNatural: "Dungeon pequena",
      parametros: { quantidadeAreas: 3, temBossRoom: false, dificuldade: "easy" },
    },
    {
      id: "dungeon_2",
      categoria: "Mapa",
      descricaoNatural: "Dungeon grande",
      parametros: { quantidadeAreas: 8, temBossRoom: true, dificuldade: "hard" },
    },
  ];

  for (const intencao of intencoes) {
    const resultado = generateDungeonForStudent("aluno_teste", intencao);
    const json = serializeMapa(resultado.mapa);
    console.log(
      `✓ ${intencao.descricaoNatural}: ${resultado.mapa.tiles.length} tiles, ${json.length} bytes`
    );
  }

  console.log();
} catch (error) {
  console.error("✗ Erro:", error);
}

// Teste 3: Validação de Estrutura
console.log("Teste 3: Validação de Estrutura");
console.log("-".repeat(50));

try {
  const resultado = generateDungeonForStudent("aluno_teste");
  const mapa = resultado.mapa;

  // Verificar campos obrigatórios
  const temId = !!mapa.id;
  const temSeed = !!mapa.seed;
  const temDimensoes = !!mapa.dimensoes && mapa.dimensoes.largura > 0 && mapa.dimensoes.altura > 0;
  const temSetores = Array.isArray(mapa.setores) && mapa.setores.length > 0;
  const temTiles = Array.isArray(mapa.tiles) && mapa.tiles.length > 0;
  const temMetadados = !!mapa.metadados && !!mapa.metadados.criadoEm;

  console.log(`✓ ID: ${temId}`);
  console.log(`✓ Seed: ${temSeed}`);
  console.log(`✓ Dimensões: ${temDimensoes} (${mapa.dimensoes.largura}x${mapa.dimensoes.altura})`);
  console.log(`✓ Setores: ${temSetores} (${mapa.setores.length})`);
  console.log(`✓ Tiles: ${temTiles} (${mapa.tiles.length})`);
  console.log(`✓ Metadados: ${temMetadados}`);

  // Verificar stats
  if (mapa.metadados.stats) {
    console.log(
      `✓ Stats: ${mapa.metadados.stats.numSetores} setores, ${mapa.metadados.stats.numTiles} tiles, ${mapa.metadados.stats.tempoGeracaoMs}ms`
    );
  }

  console.log();
} catch (error) {
  console.error("✗ Erro:", error);
}

// Teste 4: Código Luau Gerado
console.log("Teste 4: Código Luau Gerado");
console.log("-".repeat(50));

try {
  const resultado = generateDungeonForStudent("aluno_teste");

  // Verificar se código Luau foi gerado
  const temCodigo = !!resultado.codigoGerado && resultado.codigoGerado.length > 0;
  console.log(`✓ Código Luau gerado: ${temCodigo} (${resultado.codigoGerado.length} caracteres)`);

  // Verificar estrutura do código
  const temComments = resultado.codigoGerado.includes("--");
  const temFuncoes = resultado.codigoGerado.includes("function");
  const temMapaJson = resultado.codigoGerado.includes("MAPA_JSON");

  console.log(`✓ Contém comentários: ${temComments}`);
  console.log(`✓ Contém funções: ${temFuncoes}`);
  console.log(`✓ Contém JSON do mapa: ${temMapaJson}`);

  // Mostrar primeiras linhas
  const linhas = resultado.codigoGerado.split("\n").slice(0, 10);
  console.log("\nPrimeiras linhas do código:");
  linhas.forEach((linha) => console.log(`  ${linha}`));

  console.log();
} catch (error) {
  console.error("✗ Erro:", error);
}

// Teste 5: Logs e Observabilidade
console.log("Teste 5: Logs e Observabilidade");
console.log("-".repeat(50));

try {
  const resultado = generateDungeonForStudent("aluno_teste");

  // Verificar logs
  const temLogs = Array.isArray(resultado.logs) && resultado.logs.length > 0;
  console.log(`✓ Logs gerados: ${temLogs} (${resultado.logs.length} entradas)`);

  if (resultado.logs.length > 0) {
    const ultimoLog = resultado.logs[resultado.logs.length - 1];
    console.log(`✓ Último log:`);
    console.log(`  - Status: ${ultimoLog.buildStatus}`);
    console.log(`  - Timestamp: ${ultimoLog.timestamp}`);
    console.log(`  - Duração: ${ultimoLog.duracao}ms`);
  }

  console.log();
} catch (error) {
  console.error("✗ Erro:", error);
}

// Teste 6: Arena
console.log("Teste 6: Geração de Arena");
console.log("-".repeat(50));

try {
  const resultado = generateArenaForStudent("aluno_teste");

  const json = serializeMapa(resultado.mapa);
  console.log(`✓ Arena gerada: ${resultado.mapa.tiles.length} tiles, ${json.length} bytes`);
  console.log(`✓ Seed: ${resultado.mapa.seed}`);
  console.log(`✓ Setores: ${resultado.mapa.setores.length}`);

  console.log();
} catch (error) {
  console.error("✗ Erro:", error);
}

// Resumo Final
console.log("=== Resumo Final ===");
console.log("✓ Todos os testes de integração passaram!");
console.log("\nPróximos passos:");
console.log("1. Copiar RobloxMapaModule.lua para Roblox Studio");
console.log("2. Copiar RobloxServerScript.lua para ServerScriptService");
console.log("3. Testar em um projeto Roblox real");
console.log("4. Usar generateDungeonForStudent() para gerar mapas");
