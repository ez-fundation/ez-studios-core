"""
EZ STUDIOS - Core Type Definitions
Protocolo Entropia Zero: Contratos explícitos
"""

from typing import List, Dict, Any, Optional, Literal
from dataclasses import dataclass, field
from datetime import datetime
import json

@dataclass
class Tile:
    """Representa um tipo de tile no sistema WFC"""
    id: str
    tipo: Literal["chao", "parede", "porta", "objeto"]
    tags: List[str] = field(default_factory=list)
    conexoes_permitidas: Dict[str, List[str]] = field(default_factory=dict)
    peso: float = 1.0  # Probabilidade relativa

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "tipo": self.tipo,
            "tags": self.tags,
            "conexoesPermitidas": self.conexoes_permitidas,
            "peso": self.peso
        }

@dataclass
class Setor:
    """Representa um setor gerado por BSP"""
    id: str
    x: int
    y: int
    largura: int
    altura: int
    tipo: Literal["spawn", "boss", "loja", "hub", "generico"] = "generico"

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "bounds": {
                "x": self.x,
                "y": self.y,
                "largura": self.largura,
                "altura": self.altura
            },
            "tipo": self.tipo
        }

@dataclass
class TileInstance:
    """Instância de um tile em uma posição específica"""
    tile_id: str
    x: int
    y: int

    def to_dict(self) -> dict:
        return {
            "tileId": self.tile_id,
            "x": self.x,
            "y": self.y
        }

@dataclass
class MapaGerado:
    """Mapa completo gerado pelo sistema"""
    id: str
    seed: str
    setores: List[Setor]
    tiles: List[TileInstance]
    largura: int
    altura: int
    metadados: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "seed": self.seed,
            "largura": self.largura,
            "altura": self.altura,
            "setores": [s.to_dict() for s in self.setores],
            "tiles": [t.to_dict() for t in self.tiles],
            "metadados": self.metadados
        }

    def to_json(self) -> str:
        return json.dumps(self.to_dict(), indent=2)

@dataclass
class Intencao:
    """Intenção do usuário para geração"""
    id: str
    categoria: Literal["Mapa", "Progressao", "Economia", "Social"]
    descricao_natural: str
    parametros: Dict[str, Any]

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "categoria": self.categoria,
            "descricaoNatural": self.descricao_natural,
            "parametros": self.parametros
        }

@dataclass
class LogEntrada:
    """Log padronizado de cada operação"""
    timestamp: str
    student_id: str
    intent_id: str
    categoria: str
    engine_alvo: str
    seed: str
    map_stats: Dict[str, int]
    build_status: Literal["success", "error"]
    error_type: Optional[str] = None
    error_message: Optional[str] = None

    def to_dict(self) -> dict:
        return {
            "timestamp": self.timestamp,
            "studentId": self.student_id,
            "intentId": self.intent_id,
            "categoria": self.categoria,
            "engineAlvo": self.engine_alvo,
            "seed": self.seed,
            "mapStats": self.map_stats,
            "buildStatus": self.build_status,
            "errorType": self.error_type,
            "errorMessage": self.error_message
        }

class WFCContradiction(Exception):
    """Erro quando WFC encontra contradição"""
    pass

class BuildLimitExceeded(Exception):
    """Erro quando limites de build são excedidos"""
    pass
