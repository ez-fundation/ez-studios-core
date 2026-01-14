/**
 * Compilador de Intenção → Regras → Mapa → Código
 * Fluxo canônico do Protocolo Entropia Zero
 */

import { generateBspTree, flattenToSectors } from "../core/bsp/bsp";
import {
  ConfigBSP,
  ConfigWFC,
  Intencao,
  MapaGerado,
  PlanoDeGeracao,
  Regra,
  Tile,
} from "../core/models/types";
import { deserializeMapa, serializeMapa } from "../core/models/serialization";
import { runToCompletion } from "../core/wfc/wfc";
import { globalLogger } from "../infra/logging/logger";

/**
 * Mapeamento de Intenção → Regras base
 * Tabela que converte categorias e parâmetros em regras internas
 */
function mapearIntencaoParaRegras(intencao: Intencao): Regra[] {
  const regras: Regra[] = [];

  if (intencao.categoria === "Mapa") {
    const params = intencao.parametros as any;

    // Regra base: estrutura de mapa
    regras.push({
      id: `regra_mapa_base_${intencao.id}`,
      categoria: "Mapa",
      condicoes: {
        temBossRoom: params.temBossRoom || false,
        quantidadeAreas: params.quantidadeAreas || 3,
      },
      acoes: {
        criarBSP: true,
        criarWFC: true,
      },
      prioridade: 100,
    });

    // Regra de dificuldade
    if (params.dificuldade) {
      regras.push({
        id: `regra_dificuldade_${intencao.id}`,
        categoria: "Mapa",
        condicoes: {
          dificuldade: params.dificuldade,
        },
        acoes: {
          ajustarDensidade: params.dificuldade === "hard" ? 0.8 : 0.5,
        },
        prioridade: 50,
      });
    }
  }

  return regras;
}

/**
 * Configura BSP baseado em regras
 */
function configurarBSP(regras: Regra[], largura: number, altura: number): ConfigBSP {
  const config: ConfigBSP = {
    largura,
    altura,
    profundidadeMaxima: 6,
    tamanhoMinimoSala: 8,
  };

  // Ajustar baseado em regras
  for (const regra of regras) {
    if (regra.condicoes.quantidadeAreas) {
      // Estimar profundidade baseado em quantidade de áreas desejadas
      const profundidadeEstimada = Math.ceil(
        Math.log2(regra.condicoes.quantidadeAreas)
      );
      config.profundidadeMaxima = Math.min(profundidadeEstimada + 2, 8);
    }
  }

  return config;
}

/**
 * Configura WFC baseado em regras
 */
function configurarWFC(regras: Regra[], tiles: Tile[]): ConfigWFC {
  const config: ConfigWFC = {
    largura: 64,
    altura: 64,
    tiles,
    distribuicao: "ponderada",
    maxTentativas: 1000,
  };

  // Ajustar baseado em regras
  for (const regra of regras) {
    if (regra.acoes.ajustarDensidade) {
      // Ajustar pesos dos tiles baseado em densidade
      const densidade = regra.acoes.ajustarDensidade;
      config.tiles = config.tiles.map((t) => ({
        ...t,
        peso: t.tipo === "parede" ? densidade * 2 : 1,
      }));
    }
  }

  return config;
}

import { IEngineAdapter } from "../adapters";

/**
 * Mapeamento de Intenção → Regras base
 */
// ... (rest of helper functions mapearIntencaoParaRegras, configurarBSP, configurarWFC remain the same)

/**
 * Compila uma intenção completa
 */
export function compilarIntencao(
  intencao: Intencao,
  tiles: Tile[],
  adapter: IEngineAdapter,
  seed?: string,
  studentId?: string
): PlanoDeGeracao {
  const startTime = Date.now();
  const intentId = intencao.id;
  const seedUsado = seed || Math.random().toString(36).substring(7);
  const rng = criarRNG(seedUsado);

  try {
    // 1. Mapear intenção para regras
    const regras = mapearIntencaoParaRegras(intencao);

    // 2. Configurar BSP
    const configBSP = configurarBSP(regras, 128, 128);
    const bspTree = generateBspTree(configBSP, rng);
    const setores = flattenToSectors(bspTree);

    // 3. Configurar WFC
    const configWFC = configurarWFC(regras, tiles);
    const { mapaParcialOuCompleto, status } = runToCompletion(configWFC, rng);

    // 4. Criar MapaGerado
    const mapa: MapaGerado = {
      id: `mapa_${intentId}_${Date.now()}`,
      seed: seedUsado,
      dimensoes: {
        largura: configWFC.largura,
        altura: configWFC.altura,
      },
      setores,
      tiles: mapaParcialOuCompleto,
      metadados: {
        autorId: studentId,
        criadoEm: new Date().toISOString(),
        stats: {
          numSetores: setores.length,
          numTiles: mapaParcialOuCompleto.length,
          densidade: mapaParcialOuCompleto.length / (configWFC.largura * configWFC.altura),
          tempoGeracaoMs: Date.now() - startTime,
        },
      },
    };

    // 5. Gerar código usando o adaptador fornecido (Agnosis!)
    const codigoGerado = adapter.generateCode(mapa);

    // 6. Registrar sucesso
    const duracao = Date.now() - startTime;
    globalLogger.registrarSucesso(
      intentId,
      intencao.categoria,
      seedUsado,
      adapter.engineName,
      adapter.getBuildStats(mapa),
      duracao,
      studentId
    );

    return {
      intencao,
      regras,
      mapa,
      codigoGerado,
      logs: globalLogger.obterLogsEstruturados(),
    };
  } catch (error) {
    const duracao = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorType = error instanceof Error ? error.name : "UnknownError";

    globalLogger.registrarErro(
      intentId,
      intencao.categoria,
      seedUsado,
      adapter.engineName,
      errorType,
      errorMessage,
      studentId,
      duracao
    );

    throw error;
  }
}

/**
 * Cria um gerador de números aleatórios seeded
 */
function criarRNG(seed: string): () => number {
  let state = 0;

  // Hash simples da seed
  for (let i = 0; i < seed.length; i++) {
    state = ((state << 5) - state) + seed.charCodeAt(i);
    state = state & state; // Manter 32-bit
  }

  return function () {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
}
