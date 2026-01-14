"""
EZ STUDIOS - Adaptador Roblox/Luau
Converte MapaGerado em código Luau executável no Roblox Studio
"""

from types import MapaGerado, Setor, TileInstance, BuildLimitExceeded
from typing import Dict

class RobloxAdapter:
    """Adaptador para gerar código Luau a partir de mapas"""

    def __init__(self, max_parts: int = 5000, block_size: int = 4):
        self.max_parts = max_parts
        self.block_size = block_size

    def generate_luau_script(self, mapa: MapaGerado) -> str:
        """Gera script Luau completo para construir o mapa"""

        if len(mapa.tiles) > self.max_parts:
            raise BuildLimitExceeded(
                f"Mapa com {len(mapa.tiles)} tiles excede limite de {self.max_parts}"
            )

        script = f"""-- EZ STUDIOS - Mapa Gerado Proceduralmente
-- ID: {mapa.id}
-- Seed: {mapa.seed}
-- Dimensões: {mapa.largura}x{mapa.altura}
-- Tiles: {len(mapa.tiles)}
-- Setores: {len(mapa.setores)}

local MapBuilder = {{}}

-- Configurações
local BLOCK_SIZE = {self.block_size}
local TILE_COLORS = {{
    chao_1 = Color3.fromRGB(120, 120, 120),
    parede_1 = Color3.fromRGB(60, 60, 60),
    porta_1 = Color3.fromRGB(139, 69, 19)
}}

local TILE_MATERIALS = {{
    chao_1 = Enum.Material.SmoothPlastic,
    parede_1 = Enum.Material.Concrete,
    porta_1 = Enum.Material.Wood
}}

-- Função para criar um tile
function MapBuilder.CreateTile(parent, tileId, x, y)
    local part = Instance.new("Part")
    part.Name = tileId .. "_" .. x .. "_" .. y
    part.Size = Vector3.new(BLOCK_SIZE, 1, BLOCK_SIZE)
    part.Position = Vector3.new(x * BLOCK_SIZE, 0, y * BLOCK_SIZE)
    part.Anchored = true
    part.Color = TILE_COLORS[tileId] or Color3.new(1, 1, 1)
    part.Material = TILE_MATERIALS[tileId] or Enum.Material.Plastic

    -- Paredes mais altas
    if tileId == "parede_1" then
        part.Size = Vector3.new(BLOCK_SIZE, 10, BLOCK_SIZE)
        part.Position = Vector3.new(x * BLOCK_SIZE, 5, y * BLOCK_SIZE)
    end

    part.Parent = parent
    return part
end

-- Dados do mapa (setores)
local SETORES = {{
"""

        # Adicionar setores
        for setor in mapa.setores:
            script += f"""    {{
        id = "{setor.id}",
        tipo = "{setor.tipo}",
        x = {setor.x},
        y = {setor.y},
        largura = {setor.largura},
        altura = {setor.altura}
    }},
"""

        script += """}}

-- Função para construir o mapa completo
function MapBuilder.BuildMap(workspace)
    local mapFolder = Instance.new("Folder")
    mapFolder.Name = "GeneratedMap_""" + mapa.id + """"
    mapFolder.Parent = workspace

    print("Construindo mapa...")
    local tilesBuilt = 0

"""

        # Gerar tiles em batches
        batch_size = 100
        for i in range(0, len(mapa.tiles), batch_size):
            batch = mapa.tiles[i:i+batch_size]
            script += f"    -- Batch {i//batch_size + 1}
"

            for tile in batch:
                script += f'    MapBuilder.CreateTile(mapFolder, "{tile.tile_id}", {tile.x}, {tile.y})
'

            script += f"    tilesBuilt = tilesBuilt + {len(batch)}
"
            script += f'    print("Construído: " .. tilesBuilt .. " tiles")
'
            script += "    task.wait(0.1) -- Evitar lag

"

        script += """    
    print("Mapa completo! Total de tiles: " .. tilesBuilt)
    return mapFolder
end

-- Função para marcar setores especiais
function MapBuilder.MarkSpecialSectors(mapFolder)
    for _, setorData in ipairs(SETORES) do
        if setorData.tipo == "spawn" or setorData.tipo == "boss" or setorData.tipo == "loja" then
            local marker = Instance.new("Part")
            marker.Name = setorData.tipo:upper() .. "_MARKER"
            marker.Size = Vector3.new(2, 10, 2)
            marker.Position = Vector3.new(
                (setorData.x + setorData.largura/2) * BLOCK_SIZE,
                5,
                (setorData.y + setorData.altura/2) * BLOCK_SIZE
            )
            marker.Anchored = true
            marker.CanCollide = false
            marker.Transparency = 0.5

            if setorData.tipo == "spawn" then
                marker.Color = Color3.fromRGB(0, 255, 0)
            elseif setorData.tipo == "boss" then
                marker.Color = Color3.fromRGB(255, 0, 0)
            elseif setorData.tipo == "loja" then
                marker.Color = Color3.fromRGB(0, 0, 255)
            end

            marker.Parent = mapFolder
        end
    end
end

-- Executar construção
local map = MapBuilder.BuildMap(workspace)
MapBuilder.MarkSpecialSectors(map)

return MapBuilder
"""

        return script

    def save_script_to_file(self, mapa: MapaGerado, filename: str) -> None:
        """Salva script Luau em arquivo"""
        script = self.generate_luau_script(mapa)
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(script)
