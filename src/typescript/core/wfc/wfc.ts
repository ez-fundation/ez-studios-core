/**
 * Wave Function Collapse (WFC) 2D Simplificado
 * Implementação com entropia de Shannon
 */

import {
  ConfigWFC,
  ContradictionError,
  GridWFC,
  ResultadoColapso,
  Tile,
  TileInstance,
} from "../models/types";

/**
 * Calcula entropia de Shannon para um conjunto de possibilidades
 * H = -Σ(p_i * log2(p_i))
 */
function calcularEntropia(
  possibilidades: Set<string>,
  tiles: Map<string, Tile>
): number {
  if (possibilidades.size === 0) return 0;
  if (possibilidades.size === 1) return 0;

  let entropia = 0;
  const totalPeso = Array.from(possibilidades).reduce(
    (sum, tileId) => sum + (tiles.get(tileId)?.peso || 1),
    0
  );

  for (const tileId of possibilidades) {
    const peso = (tiles.get(tileId)?.peso || 1) / totalPeso;
    if (peso > 0) {
      entropia -= peso * Math.log2(peso);
    }
  }

  return entropia;
}

/**
 * Inicializa grid com todas as possibilidades abertas
 */
export function initializeGrid(config: ConfigWFC): GridWFC {
  const tileMap = new Map(config.tiles.map((t) => [t.id, t]));
  const celulas: Set<string>[][] = [];
  const entropias: number[][] = [];
  const colapsadas: boolean[][] = [];

  for (let y = 0; y < config.altura; y++) {
    celulas[y] = [];
    entropias[y] = [];
    colapsadas[y] = [];

    for (let x = 0; x < config.largura; x++) {
      // Inicialmente, todas as possibilidades estão abertas
      const possibilidades = new Set(config.tiles.map((t) => t.id));
      celulas[y][x] = possibilidades;
      entropias[y][x] = calcularEntropia(possibilidades, tileMap);
      colapsadas[y][x] = false;
    }
  }

  return {
    largura: config.largura,
    altura: config.altura,
    celulas,
    entropias,
    colapsadas,
  };
}

/**
 * Encontra a célula com maior entropia (excluindo colapsadas)
 */
function encontrarCelulaMaiorEntropia(grid: GridWFC): { x: number; y: number } | null {
  let maxEntropia = -1;
  let posicao: { x: number; y: number } | null = null;

  for (let y = 0; y < grid.altura; y++) {
    for (let x = 0; x < grid.largura; x++) {
      if (!grid.colapsadas[y][x] && grid.entropias[y][x] > maxEntropia) {
        maxEntropia = grid.entropias[y][x];
        posicao = { x, y };
      }
    }
  }

  return posicao;
}

/**
 * Obtém vizinhos válidos de uma célula
 */
function obterVizinhos(
  x: number,
  y: number,
  grid: GridWFC
): { norte?: { x: number; y: number }; sul?: { x: number; y: number }; leste?: { x: number; y: number }; oeste?: { x: number; y: number } } {
  const vizinhos: any = {};

  if (y > 0) vizinhos.norte = { x, y: y - 1 };
  if (y < grid.altura - 1) vizinhos.sul = { x, y: y + 1 };
  if (x < grid.largura - 1) vizinhos.leste = { x: x + 1, y };
  if (x > 0) vizinhos.oeste = { x: x - 1, y };

  return vizinhos;
}

/**
 * Propaga restrições para vizinhos após colapso
 */
function propagarRestrições(
  grid: GridWFC,
  x: number,
  y: number,
  tiles: Map<string, Tile>
): boolean {
  const fila: Array<{ x: number; y: number }> = [{ x, y }];
  const visitadas = new Set<string>();

  while (fila.length > 0) {
    const { x: cx, y: cy } = fila.shift()!;
    const chave = `${cx},${cy}`;

    if (visitadas.has(chave)) continue;
    visitadas.add(chave);

    const tileColapsado = Array.from(grid.celulas[cy][cx])[0];
    const tile = tiles.get(tileColapsado);

    if (!tile) continue;

    const vizinhos = obterVizinhos(cx, cy, grid);

    // Verificar cada direção
    for (const [direcao, vizinho] of Object.entries(vizinhos)) {
      if (!vizinho) continue;

      const { x: vx, y: vy } = vizinho;
      const possibilidadesValidas = tile.conexoesPermitidas
        .filter((c) => c.direcao === direcao)
        .flatMap((c) => c.tilesCompatíveis);

      if (possibilidadesValidas.length === 0) continue;

      // Remover possibilidades inválidas do vizinho
      const possibilidadesAntes = grid.celulas[vy][vx].size;
      const novasPossibilidades = new Set(
        Array.from(grid.celulas[vy][vx]).filter((id) =>
          possibilidadesValidas.includes(id)
        )
      );

      if (novasPossibilidades.size === 0) {
        // Contradição!
        return false;
      }

      if (novasPossibilidades.size < possibilidadesAntes) {
        grid.celulas[vy][vx] = novasPossibilidades;
        grid.entropias[vy][vx] = calcularEntropia(novasPossibilidades, tiles);
        fila.push({ x: vx, y: vy });
      }
    }
  }

  return true;
}

/**
 * Executa um passo de colapso WFC
 */
export function stepCollapse(
  grid: GridWFC,
  tiles: Map<string, Tile>,
  rng: () => number
): ResultadoColapso {
  // Encontrar célula com maior entropia
  const posicao = encontrarCelulaMaiorEntropia(grid);

  if (!posicao) {
    // Todas as células foram colapsadas
    return {
      gridAtualizado: grid,
      status: "completo",
    };
  }

  const { x, y } = posicao;
  const possibilidades = Array.from(grid.celulas[y][x]);

  if (possibilidades.length === 0) {
    throw new ContradictionError(posicao, []);
  }

  // Escolher aleatoriamente um tile (ponderado por peso)
  const totalPeso = possibilidades.reduce(
    (sum, tileId) => sum + (tiles.get(tileId)?.peso || 1),
    0
  );

  let sorteio = rng() * totalPeso;
  let tileEscolhido = possibilidades[0];

  for (const tileId of possibilidades) {
    const peso = tiles.get(tileId)?.peso || 1;
    sorteio -= peso;
    if (sorteio <= 0) {
      tileEscolhido = tileId;
      break;
    }
  }

  // Colapsar célula
  grid.celulas[y][x] = new Set([tileEscolhido]);
  grid.entropias[y][x] = 0;
  grid.colapsadas[y][x] = true;

  // Propagar restrições
  const propagacaoOk = propagarRestrições(grid, x, y, tiles);

  if (!propagacaoOk) {
    throw new ContradictionError(posicao, Array.from(grid.celulas[y][x]));
  }

  return {
    gridAtualizado: grid,
    status: "ok",
    posicaoColapsada: posicao,
  };
}

/**
 * Executa WFC até conclusão ou contradição
 */
export function runToCompletion(
  config: ConfigWFC,
  rng: () => number
): { mapaParcialOuCompleto: TileInstance[]; status: "ok" | "contradiction" } {
  const tileMap = new Map(config.tiles.map((t) => [t.id, t]));
  const grid = initializeGrid(config);

  try {
    while (true) {
      const resultado = stepCollapse(grid, tileMap, rng);

      if (resultado.status === "completo") {
        break;
      }
    }

    // Converter grid para TileInstances
    const tiles: TileInstance[] = [];
    for (let y = 0; y < grid.altura; y++) {
      for (let x = 0; x < grid.largura; x++) {
        const tileId = Array.from(grid.celulas[y][x])[0];
        if (tileId) {
          tiles.push({
            tileId,
            x,
            y,
          });
        }
      }
    }

    return { mapaParcialOuCompleto: tiles, status: "ok" };
  } catch (error) {
    if (error instanceof ContradictionError) {
      // Retornar mapa parcial
      const tiles: TileInstance[] = [];
      for (let y = 0; y < grid.altura; y++) {
        for (let x = 0; x < grid.largura; x++) {
          if (grid.colapsadas[y][x]) {
            const tileId = Array.from(grid.celulas[y][x])[0];
            if (tileId) {
              tiles.push({
                tileId,
                x,
                y,
              });
            }
          }
        }
      }
      return { mapaParcialOuCompleto: tiles, status: "contradiction" };
    }
    throw error;
  }
}
