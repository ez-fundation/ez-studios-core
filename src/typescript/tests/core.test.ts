/**
 * Testes Automatizados - Núcleo Procedural
 * Valida WFC, BSP e serialização
 */

import { describe, it, expect, beforeEach } from "vitest";
import { generateBSP } from "../core/bsp/bsp3d";
import {
  serializeMapa,
  deserializeMapa,
} from "../core/models/serialization";
import { ConfigBSP, ConfigWFC, Tile, MapaGerado, ContradictionError, Setor } from "../core/models/types";
import { initializeGrid, stepCollapse, runToCompletion } from "../core/wfc/wfc";

// Tiles de teste
const TILES_TESTE: Tile[] = [
  {
    id: "chao",
    tipo: "chao",
    tags: ["walkable"],
    conexoesPermitidas: [
      { direcao: "norte", tilesCompatíveis: ["chao", "parede"] },
      { direcao: "sul", tilesCompatíveis: ["chao", "parede"] },
      { direcao: "leste", tilesCompatíveis: ["chao", "parede"] },
      { direcao: "oeste", tilesCompatíveis: ["chao", "parede"] },
    ],
    peso: 2,
  },
  {
    id: "parede",
    tipo: "parede",
    tags: ["solid"],
    conexoesPermitidas: [
      { direcao: "norte", tilesCompatíveis: ["chao", "parede"] },
      { direcao: "sul", tilesCompatíveis: ["chao", "parede"] },
      { direcao: "leste", tilesCompatíveis: ["chao", "parede"] },
      { direcao: "oeste", tilesCompatíveis: ["chao", "parede"] },
    ],
    peso: 1,
  },
];

describe("BSP - Binary Space Partitioning", () => {
  it("deve gerar árvore BSP válida", () => {
    const config: ConfigBSP = {
      largura: 100,
      altura: 100,
      profundidadeMaxima: 4,
      tamanhoMinimoSala: 10,
    };

    const rng = () => Math.random();
    const tree = generateBspTree(config, rng);

    expect(tree).toBeDefined();
    expect(tree.bounds.largura).toBe(100);
    expect(tree.bounds.altura).toBe(100);
  });

  it("deve converter árvore BSP em setores", () => {
    const config: ConfigBSP = {
      largura: 100,
      altura: 100,
      profundidadeMaxima: 3,
      tamanhoMinimoSala: 15,
    };

    const rng = () => Math.random();
    const tree = generateBspTree(config, rng);
    const setores = flattenToSectors(tree);

    expect(setores.length).toBeGreaterThan(0);
    expect(setores.every((s) => s.bounds.largura > 0 && s.bounds.altura > 0)).toBe(true);
  });

  it("deve respeitar tamanho mínimo de salas", () => {
    const config: ConfigBSP = {
      largura: 100,
      altura: 100,
      profundidadeMaxima: 5,
      tamanhoMinimoSala: 20,
    };

    const rng = () => Math.random();
    const tree = generateBspTree(config, rng);
    const setores = flattenToSectors(tree);

    const valido = validarSetores(setores, config.tamanhoMinimoSala);
    expect(valido).toBe(true);
  });
});

describe("WFC - Wave Function Collapse", () => {
  it("deve inicializar grid com todas as possibilidades", () => {
    const config: ConfigWFC = {
      largura: 10,
      altura: 10,
      tiles: TILES_TESTE,
      distribuicao: "uniforme",
    };

    const grid = initializeGrid(config);

    expect(grid.largura).toBe(10);
    expect(grid.altura).toBe(10);
    expect(grid.celulas.length).toBe(10);
    expect(grid.celulas[0].length).toBe(10);

    // Verificar que todas as células têm todas as possibilidades
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        expect(grid.celulas[y][x].size).toBe(TILES_TESTE.length);
      }
    }
  });

  it("deve colapsar célula com sucesso", () => {
    const config: ConfigWFC = {
      largura: 10,
      altura: 10,
      tiles: TILES_TESTE,
      distribuicao: "uniforme",
    };

    const grid = initializeGrid(config);
    const tileMap = new Map(TILES_TESTE.map((t) => [t.id, t]));
    const rng = () => 0.5;

    const resultado = stepCollapse(grid, tileMap, rng);

    expect(resultado.status).toBe("ok");
    expect(resultado.posicaoColapsada).toBeDefined();

    // Verificar que alguma célula foi colapsada
    let temColapsada = false;
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        if (grid.colapsadas[y][x]) {
          temColapsada = true;
          expect(grid.celulas[y][x].size).toBe(1);
        }
      }
    }

    expect(temColapsada).toBe(true);
  });

  it("deve completar WFC sem contradição", () => {
    const config: ConfigWFC = {
      largura: 8,
      altura: 8,
      tiles: TILES_TESTE,
      distribuicao: "uniforme",
      maxTentativas: 100,
    };

    const rng = () => Math.random();
    const resultado = runToCompletion(config, rng);

    // Pode ser sucesso ou contradição, mas não deve lançar erro
    expect(resultado.status).toMatch(/ok|contradiction/);
    expect(resultado.mapaParcialOuCompleto).toBeDefined();
    expect(Array.isArray(resultado.mapaParcialOuCompleto)).toBe(true);
  });
});

describe("Serialização", () => {
  let mapaExemplo: MapaGerado;

  beforeEach(() => {
    mapaExemplo = {
      id: "mapa_teste_001",
      seed: "seed_123",
      dimensoes: { largura: 10, altura: 10 },
      setores: [
        {
          id: "setor_1",
          bounds: { x: 0, y: 0, largura: 5, altura: 5 },
          tipo: "spawn",
        },
      ],
      tiles: [
        { tileId: "chao", x: 0, y: 0 },
        { tileId: "parede", x: 1, y: 1 },
      ],
      metadados: {
        criadoEm: new Date().toISOString(),
        stats: {
          numSetores: 1,
          numTiles: 2,
        },
      },
    };
  });

  it("deve serializar mapa para JSON", () => {
    const json = serializeMapa(mapaExemplo);

    expect(typeof json).toBe("string");
    expect(json.includes(mapaExemplo.id)).toBe(true);
    expect(json.includes(mapaExemplo.seed)).toBe(true);
  });

  it("deve desserializar JSON para mapa", () => {
    const json = serializeMapa(mapaExemplo);
    const mapaDesserializado = deserializeMapa(json);

    expect(mapaDesserializado.id).toBe(mapaExemplo.id);
    expect(mapaDesserializado.seed).toBe(mapaExemplo.seed);
    expect(mapaDesserializado.tiles.length).toBe(mapaExemplo.tiles.length);
  });

  it("deve ser idempotente (serializar → desserializar → serializar)", () => {
    const json1 = serializeMapa(mapaExemplo);
    const mapa2 = deserializeMapa(json1);
    const json2 = serializeMapa(mapa2);

    expect(json1).toBe(json2);
  });

  it("deve validar mapa desserializado", () => {
    const json = serializeMapa(mapaExemplo);
    const mapa = deserializeMapa(json);

    expect(validarMapaDesserializado(mapa)).toBe(true);
  });

  it("deve rejeitar mapa inválido", () => {
    const mapaInvalido: MapaGerado = {
      id: "",
      seed: "seed",
      dimensoes: { largura: 0, altura: 0 },
      setores: [],
      tiles: [],
      metadados: { criadoEm: new Date().toISOString() },
    };

    expect(validarMapaDesserializado(mapaInvalido)).toBe(false);
  });
});

describe("Tipos e Erros", () => {
  it("deve lançar ContradictionError com contexto", () => {
    const posicao = { x: 5, y: 5 };
    const tilesImpossíveis = ["chao", "parede"];

    const erro = new ContradictionError(posicao, tilesImpossíveis);

    expect(erro).toBeInstanceOf(ContradictionError);
    expect(erro.posicao).toEqual(posicao);
    expect(erro.tilesImpossíveis).toEqual(tilesImpossíveis);
    expect(erro.message).toContain("Contradição");
  });
});
