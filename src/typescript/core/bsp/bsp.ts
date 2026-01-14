/**
 * Binary Space Partitioning (BSP) para Divisão de Espaço
 * Gera setores retangulares para organização de mapas
 */

import { BspNode, ConfigBSP, Setor } from "../models/types";

let nodeCounter = 0;

/**
 * Gera árvore BSP recursivamente
 */
export function generateBspTree(config: ConfigBSP, rng: () => number): BspNode {
  nodeCounter = 0;
  return generateBspTreeRecursivo(
    {
      x: 0,
      y: 0,
      largura: config.largura,
      altura: config.altura,
    },
    0,
    config,
    rng
  );
}

/**
 * Recursão interna para geração de BSP
 */
function generateBspTreeRecursivo(
  bounds: { x: number; y: number; largura: number; altura: number },
  profundidade: number,
  config: ConfigBSP,
  rng: () => number
): BspNode {
  const node: BspNode = {
    id: `bsp_${nodeCounter++}`,
    bounds,
  };

  // Critério de parada: profundidade máxima ou tamanho mínimo atingido
  if (
    profundidade >= config.profundidadeMaxima ||
    (bounds.largura <= config.tamanhoMinimoSala &&
      bounds.altura <= config.tamanhoMinimoSala)
  ) {
    // Criar setor folha
    node.setor = {
      id: `setor_${node.id}`,
      bounds,
      tipo: profundidade === 0 ? "hub" : "sala",
    };
    return node;
  }

  // Decidir se divide horizontalmente ou verticalmente
  const podeHorizontal = bounds.altura >= config.tamanhoMinimoSala * 2;
  const podeVertical = bounds.largura >= config.tamanhoMinimoSala * 2;

  let direcao: "horizontal" | "vertical";

  if (podeHorizontal && podeVertical) {
    // Escolher aleatoriamente
    direcao = rng() < 0.5 ? "horizontal" : "vertical";
  } else if (podeHorizontal) {
    direcao = "horizontal";
  } else if (podeVertical) {
    direcao = "vertical";
  } else {
    // Não pode dividir mais
    node.setor = {
      id: `setor_${node.id}`,
      bounds,
      tipo: "sala",
    };
    return node;
  }

  node.direcao = direcao;

  if (direcao === "horizontal") {
    // Dividir horizontalmente (em Y)
    const minAltura = Math.ceil(config.tamanhoMinimoSala);
    const maxAltura = bounds.altura - minAltura;
    const posicaoDivisao = minAltura + Math.floor(rng() * (maxAltura - minAltura));

    node.esquerda = generateBspTreeRecursivo(
      {
        x: bounds.x,
        y: bounds.y,
        largura: bounds.largura,
        altura: posicaoDivisao,
      },
      profundidade + 1,
      config,
      rng
    );

    node.direita = generateBspTreeRecursivo(
      {
        x: bounds.x,
        y: bounds.y + posicaoDivisao,
        largura: bounds.largura,
        altura: bounds.altura - posicaoDivisao,
      },
      profundidade + 1,
      config,
      rng
    );
  } else {
    // Dividir verticalmente (em X)
    const minLargura = Math.ceil(config.tamanhoMinimoSala);
    const maxLargura = bounds.largura - minLargura;
    const posicaoDivisao = minLargura + Math.floor(rng() * (maxLargura - minLargura));

    node.esquerda = generateBspTreeRecursivo(
      {
        x: bounds.x,
        y: bounds.y,
        largura: posicaoDivisao,
        altura: bounds.altura,
      },
      profundidade + 1,
      config,
      rng
    );

    node.direita = generateBspTreeRecursivo(
      {
        x: bounds.x + posicaoDivisao,
        y: bounds.y,
        largura: bounds.largura - posicaoDivisao,
        altura: bounds.altura,
      },
      profundidade + 1,
      config,
      rng
    );
  }

  return node;
}

/**
 * Converte árvore BSP em lista de setores (folhas)
 */
export function flattenToSectors(tree: BspNode): Setor[] {
  const setores: Setor[] = [];

  function traversar(node: BspNode) {
    if (node.setor) {
      setores.push(node.setor);
    }

    if (node.esquerda) traversar(node.esquerda);
    if (node.direita) traversar(node.direita);
  }

  traversar(tree);
  return setores;
}

/**
 * Valida que todos os setores respeitam tamanhos mínimos
 */
export function validarSetores(setores: Setor[], tamanhoMinimo: number): boolean {
  return setores.every(
    (setor) =>
      setor.bounds.largura >= tamanhoMinimo && setor.bounds.altura >= tamanhoMinimo
  );
}
