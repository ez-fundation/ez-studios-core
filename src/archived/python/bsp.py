"""
EZ STUDIOS - Binary Space Partitioning (BSP)
Para divisão procedural de espaços em setores
"""

import random
from typing import List, Optional, Literal
from dataclasses import dataclass
from types import Setor

@dataclass
class BSPNode:
    """Nó da árvore BSP"""
    x: int
    y: int
    largura: int
    altura: int
    left: Optional['BSPNode'] = None
    right: Optional['BSPNode'] = None
    is_leaf: bool = True
    tipo: str = "generico"

class BSPGenerator:
    """Gerador de particionamento binário de espaço"""

    def __init__(
        self,
        largura: int,
        altura: int,
        min_size: int = 8,
        max_depth: int = 4,
        seed: Optional[str] = None
    ):
        self.largura = largura
        self.altura = altura
        self.min_size = min_size
        self.max_depth = max_depth

        if seed:
            random.seed(seed)

        self.root = BSPNode(0, 0, largura, altura)

    def can_split(self, node: BSPNode, direction: Literal["horizontal", "vertical"]) -> bool:
        """Verifica se nó pode ser dividido"""
        if direction == "horizontal":
            return node.altura >= self.min_size * 2
        else:
            return node.largura >= self.min_size * 2

    def split_node(self, node: BSPNode, depth: int) -> None:
        """Divide um nó recursivamente"""
        if depth >= self.max_depth:
            return

        # Decidir direção da divisão
        can_split_h = self.can_split(node, "horizontal")
        can_split_v = self.can_split(node, "vertical")

        if not can_split_h and not can_split_v:
            return

        if can_split_h and can_split_v:
            split_horizontal = random.random() > 0.5
        elif can_split_h:
            split_horizontal = True
        else:
            split_horizontal = False

        if split_horizontal:
            # Divisão horizontal
            split_min = self.min_size
            split_max = node.altura - self.min_size
            split_y = random.randint(split_min, split_max)

            node.left = BSPNode(
                node.x,
                node.y,
                node.largura,
                split_y
            )
            node.right = BSPNode(
                node.x,
                node.y + split_y,
                node.largura,
                node.altura - split_y
            )
        else:
            # Divisão vertical
            split_min = self.min_size
            split_max = node.largura - self.min_size
            split_x = random.randint(split_min, split_max)

            node.left = BSPNode(
                node.x,
                node.y,
                split_x,
                node.altura
            )
            node.right = BSPNode(
                node.x + split_x,
                node.y,
                node.largura - split_x,
                node.altura
            )

        node.is_leaf = False

        # Recursão
        self.split_node(node.left, depth + 1)
        self.split_node(node.right, depth + 1)

    def generate(self) -> BSPNode:
        """Gera árvore BSP completa"""
        self.split_node(self.root, 0)
        return self.root

    def get_leaves(self, node: Optional[BSPNode] = None) -> List[BSPNode]:
        """Retorna todas as folhas (setores finais)"""
        if node is None:
            node = self.root

        if node.is_leaf:
            return [node]

        leaves = []
        if node.left:
            leaves.extend(self.get_leaves(node.left))
        if node.right:
            leaves.extend(self.get_leaves(node.right))

        return leaves

    def to_setores(self, tipo_padrao: str = "generico") -> List[Setor]:
        """Converte folhas em objetos Setor"""
        leaves = self.get_leaves()
        setores = []

        for i, leaf in enumerate(leaves):
            setor = Setor(
                id=f"setor_{i}",
                x=leaf.x,
                y=leaf.y,
                largura=leaf.largura,
                altura=leaf.altura,
                tipo=tipo_padrao
            )
            setores.append(setor)

        return setores

    def assign_types(self, setores: List[Setor]) -> List[Setor]:
        """Atribui tipos especiais a setores"""
        if not setores:
            return setores

        # Primeiro setor: spawn
        setores[0].tipo = "spawn"

        # Último setor: boss (se tiver mais de 1)
        if len(setores) > 1:
            setores[-1].tipo = "boss"

        # Alguns aleatórios: loja
        num_lojas = min(2, len(setores) // 3)
        if len(setores) > 3:
            loja_indices = random.sample(range(1, len(setores) - 1), num_lojas)
            for idx in loja_indices:
                setores[idx].tipo = "loja"

        return setores
