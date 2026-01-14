"""
EZ STUDIOS - Compilador de Intenção
Converte intenções em regras e gera mapas procedurais
"""

from datetime import datetime
from typing import Dict, List, Any
import uuid
from types import (
    Intencao, MapaGerado, Tile, Setor, TileInstance,
    LogEntrada, WFCContradiction
)
from wfc import WFCGrid
from bsp import BSPGenerator

class IntentionCompiler:
    """Compila intenções em mapas gerados"""

    def __init__(self):
        self.logs: List[LogEntrada] = []

    def create_basic_tiles(self) -> List[Tile]:
        """Cria conjunto básico de tiles para dungeons"""
        chao = Tile(
            id="chao_1",
            tipo="chao",
            tags=["base", "caminhavel"],
            peso=5.0,
            conexoes_permitidas={
                "norte": ["chao_1", "porta_1", "parede_1"],
                "sul": ["chao_1", "porta_1", "parede_1"],
                "leste": ["chao_1", "porta_1", "parede_1"],
                "oeste": ["chao_1", "porta_1", "parede_1"]
            }
        )

        parede = Tile(
            id="parede_1",
            tipo="parede",
            tags=["bloqueio"],
            peso=2.0,
            conexoes_permitidas={
                "norte": ["parede_1", "chao_1"],
                "sul": ["parede_1", "chao_1"],
                "leste": ["parede_1", "chao_1"],
                "oeste": ["parede_1", "chao_1"]
            }
        )

        porta = Tile(
            id="porta_1",
            tipo="porta",
            tags=["passagem"],
            peso=0.5,
            conexoes_permitidas={
                "norte": ["chao_1", "parede_1"],
                "sul": ["chao_1", "parede_1"],
                "leste": ["chao_1", "parede_1"],
                "oeste": ["chao_1", "parede_1"]
            }
        )

        return [chao, parede, porta]

    def map_intention_to_config(self, intencao: Intencao) -> Dict[str, Any]:
        """Mapeia intenção para configuração de geração"""
        params = intencao.parametros

        config = {
            "largura": params.get("largura", 40),
            "altura": params.get("altura", 40),
            "num_setores": params.get("quantidadeAreas", 3),
            "min_setor_size": params.get("tamanhoMinSetor", 8),
            "tem_boss": params.get("temBossRoom", True),
            "dificuldade": params.get("dificuldade", "normal")
        }

        # Ajustar profundidade BSP baseado em número de setores
        if config["num_setores"] <= 2:
            config["bsp_depth"] = 1
        elif config["num_setores"] <= 4:
            config["bsp_depth"] = 2
        elif config["num_setores"] <= 8:
            config["bsp_depth"] = 3
        else:
            config["bsp_depth"] = 4

        return config

    def generate_from_intention(
        self,
        intencao: Intencao,
        student_id: str = "aluno_padrao",
        seed: Optional[str] = None
    ) -> MapaGerado:
        """Pipeline completo: Intenção → Mapa"""

        if seed is None:
            seed = str(uuid.uuid4())[:8]

        start_time = datetime.utcnow()

        try:
            # 1. Mapear intenção para configuração
            config = self.map_intention_to_config(intencao)

            # 2. Gerar setores com BSP
            bsp = BSPGenerator(
                largura=config["largura"],
                altura=config["altura"],
                min_size=config["min_setor_size"],
                max_depth=config["bsp_depth"],
                seed=seed
            )
            bsp.generate()
            setores = bsp.to_setores()

            if config["tem_boss"]:
                setores = bsp.assign_types(setores)

            # 3. Criar tiles
            tiles_def = self.create_basic_tiles()

            # 4. Gerar mapa com WFC
            wfc_grid = WFCGrid(
                width=config["largura"],
                height=config["altura"],
                tiles=tiles_def,
                seed=seed
            )
            wfc_grid.run_to_completion()

            # 5. Extrair tiles instanciados
            tile_instances = []
            for y in range(wfc_grid.height):
                for x in range(wfc_grid.width):
                    tile_id = wfc_grid.get_tile_at(x, y)
                    if tile_id:
                        tile_instances.append(
                            TileInstance(tile_id=tile_id, x=x, y=y)
                        )

            # 6. Criar mapa final
            mapa = MapaGerado(
                id=f"mapa_{uuid.uuid4().hex[:8]}",
                seed=seed,
                largura=config["largura"],
                altura=config["altura"],
                setores=setores,
                tiles=tile_instances,
                metadados={
                    "autorId": student_id,
                    "criadoEm": start_time.isoformat(),
                    "intencaoId": intencao.id,
                    "stats": {
                        "numSetores": len(setores),
                        "numTiles": len(tile_instances),
                        "densidade": len(tile_instances) / (config["largura"] * config["altura"])
                    }
                }
            )

            # 7. Log de sucesso
            log = LogEntrada(
                timestamp=datetime.utcnow().isoformat(),
                student_id=student_id,
                intent_id=intencao.id,
                categoria=intencao.categoria,
                engine_alvo="Roblox",
                seed=seed,
                map_stats={
                    "numSetores": len(setores),
                    "numTiles": len(tile_instances)
                },
                build_status="success"
            )
            self.logs.append(log)

            return mapa

        except Exception as e:
            # Log de erro
            log = LogEntrada(
                timestamp=datetime.utcnow().isoformat(),
                student_id=student_id,
                intent_id=intencao.id,
                categoria=intencao.categoria,
                engine_alvo="Roblox",
                seed=seed,
                map_stats={"numSetores": 0, "numTiles": 0},
                build_status="error",
                error_type=type(e).__name__,
                error_message=str(e)
            )
            self.logs.append(log)
            raise

    def get_logs_json(self) -> str:
        """Retorna logs em formato JSON"""
        import json
        return json.dumps([log.to_dict() for log in self.logs], indent=2)
