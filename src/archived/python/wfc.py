"""
EZ STUDIOS - Wave Function Collapse (WFC) Implementation
Com entropia de Shannon e propagação de restrições
"""

import random
import math
from typing import List, Set, Tuple, Optional, Dict
from types import Tile, WFCContradiction

class Cell:
    """Célula individual do grid WFC"""
    def __init__(self, possible_tiles: Set[str]):
        self.possible: Set[str] = possible_tiles.copy()
        self.collapsed: bool = False
        self.tile_id: Optional[str] = None

    def entropy(self, tile_weights: Dict[str, float]) -> float:
        """Calcula entropia de Shannon: H = -Σ(p * log2(p))"""
        if self.collapsed or len(self.possible) == 0:
            return 0.0

        total_weight = sum(tile_weights.get(tid, 1.0) for tid in self.possible)
        if total_weight == 0:
            return 0.0

        entropy = 0.0
        for tid in self.possible:
            p = tile_weights.get(tid, 1.0) / total_weight
            if p > 0:
                entropy -= p * math.log2(p)

        # Adiciona pequeno ruído para quebrar empates
        return entropy + random.random() * 0.001

    def collapse(self, tile_weights: Dict[str, float]) -> str:
        """Colapsa célula para um tile específico com base em pesos"""
        if self.collapsed:
            return self.tile_id

        if len(self.possible) == 0:
            raise WFCContradiction("Célula sem possibilidades")

        # Seleção ponderada
        tiles = list(self.possible)
        weights = [tile_weights.get(tid, 1.0) for tid in tiles]
        self.tile_id = random.choices(tiles, weights=weights, k=1)[0]
        self.collapsed = True
        self.possible = {self.tile_id}
        return self.tile_id

class WFCGrid:
    """Grid 2D para Wave Function Collapse"""

    def __init__(self, width: int, height: int, tiles: List[Tile], seed: Optional[str] = None):
        self.width = width
        self.height = height
        self.tiles = {t.id: t for t in tiles}
        self.tile_weights = {t.id: t.peso for t in tiles}

        if seed:
            random.seed(seed)

        # Inicializar grid com todas as possibilidades
        all_tile_ids = set(t.id for t in tiles)
        self.grid: List[List[Cell]] = [
            [Cell(all_tile_ids) for _ in range(width)]
            for _ in range(height)
        ]

    def get_cell(self, x: int, y: int) -> Optional[Cell]:
        """Pega célula ou None se fora dos limites"""
        if 0 <= x < self.width and 0 <= y < self.height:
            return self.grid[y][x]
        return None

    def get_neighbors(self, x: int, y: int) -> Dict[str, Tuple[int, int]]:
        """Retorna vizinhos nas 4 direções"""
        return {
            "norte": (x, y - 1),
            "sul": (x, y + 1),
            "leste": (x + 1, y),
            "oeste": (x - 1, y)
        }

    def find_lowest_entropy_cell(self) -> Optional[Tuple[int, int]]:
        """Encontra célula não colapsada com menor entropia"""
        min_entropy = float('inf')
        candidates = []

        for y in range(self.height):
            for x in range(self.width):
                cell = self.grid[y][x]
                if not cell.collapsed:
                    entropy = cell.entropy(self.tile_weights)
                    if entropy < min_entropy and len(cell.possible) > 0:
                        min_entropy = entropy
                        candidates = [(x, y)]
                    elif abs(entropy - min_entropy) < 0.001 and len(cell.possible) > 0:
                        candidates.append((x, y))

        return random.choice(candidates) if candidates else None

    def propagate_constraints(self, x: int, y: int) -> None:
        """Propaga restrições a partir de uma célula"""
        stack = [(x, y)]

        while stack:
            cx, cy = stack.pop()
            cell = self.get_cell(cx, cy)

            if not cell or not cell.collapsed:
                continue

            tile = self.tiles[cell.tile_id]
            neighbors = self.get_neighbors(cx, cy)

            for direction, (nx, ny) in neighbors.items():
                neighbor = self.get_cell(nx, ny)
                if not neighbor or neighbor.collapsed:
                    continue

                # Tiles compatíveis nessa direção
                if direction in tile.conexoes_permitidas:
                    allowed = set(tile.conexoes_permitidas[direction])
                else:
                    allowed = set(self.tiles.keys())

                # Reduzir possibilidades
                old_size = len(neighbor.possible)
                neighbor.possible &= allowed

                if len(neighbor.possible) == 0:
                    raise WFCContradiction(f"Contradição em ({nx}, {ny})")

                # Se mudou, propagar recursivamente
                if len(neighbor.possible) < old_size:
                    stack.append((nx, ny))

    def step(self) -> bool:
        """Executa um passo de colapso. Retorna True se ainda há trabalho"""
        pos = self.find_lowest_entropy_cell()
        if not pos:
            return False

        x, y = pos
        cell = self.grid[y][x]
        cell.collapse(self.tile_weights)

        try:
            self.propagate_constraints(x, y)
        except WFCContradiction as e:
            raise e

        return True

    def run_to_completion(self, max_iterations: int = 10000) -> None:
        """Executa até completar ou atingir limite"""
        iterations = 0
        while iterations < max_iterations:
            if not self.step():
                break
            iterations += 1

        if iterations >= max_iterations:
            raise WFCContradiction("Limite de iterações atingido")

    def is_complete(self) -> bool:
        """Verifica se todos estão colapsados"""
        return all(
            cell.collapsed
            for row in self.grid
            for cell in row
        )

    def get_tile_at(self, x: int, y: int) -> Optional[str]:
        """Retorna tile ID em posição"""
        cell = self.get_cell(x, y)
        return cell.tile_id if cell and cell.collapsed else None
