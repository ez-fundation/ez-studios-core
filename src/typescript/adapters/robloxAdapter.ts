/**
 * Adaptador Roblox Oficial (Portado do Python Original)
 * Gera código Luau otimizado com suporte a materiais, batching e setores especiais
 */

import { IEngineAdapter, RobloxAdapterOptions } from "./index";
import { MapaGerado } from "../core/models/types";
import { serializeMapa } from "../core/models/serialization";

export class RobloxAdapter implements IEngineAdapter {
    readonly engineName = "Roblox";
    readonly fileExtension = "lua";

    private defaults: Required<RobloxAdapterOptions> = {
        maxParts: 5000,
        blockSize: 4,
        baseFolderName: "GeneratedMap",
        colorScheme: {
            chao_1: "Color3.fromRGB(120, 120, 120)",
            parede_1: "Color3.fromRGB(60, 60, 60)",
            porta_1: "Color3.fromRGB(139, 69, 19)",
            spawn: "Color3.fromRGB(0, 255, 0)",
            boss: "Color3.fromRGB(255, 0, 0)",
            loja: "Color3.fromRGB(0, 0, 255)",
        },
    };

    generateCode(mapa: MapaGerado, options?: RobloxAdapterOptions): string {
        const opt = { ...this.defaults, ...options };
        const numTiles = mapa.tiles.length;

        if (numTiles > opt.maxParts) {
            throw new Error(`Limite de partes excedido: ${numTiles} > ${opt.maxParts}`);
        }

        const mapaJson = serializeMapa(mapa).replace(/"/g, '\\"');

        let script = `-- EZ STUDIOS - Protocolo Entropia Zero
-- ID: ${mapa.id}
-- Seed: ${mapa.seed}
-- Tiles: ${numTiles}
-- Gerado em: ${new Date().toISOString()}

local MapBuilder = {}

-- Configurações
local BLOCK_SIZE = ${opt.blockSize}
local TILE_COLORS = {
`;

        // Injetar esquema de cores
        for (const [id, color] of Object.entries(opt.colorScheme)) {
            script += `    ["${id}"] = ${color},\n`;
        }

        script += `}

local TILE_MATERIALS = {
    chao_1 = Enum.Material.SmoothPlastic,
    parede_1 = Enum.Material.Concrete,
    porta_1 = Enum.Material.Wood
}

-- Função para criar um tile (Otimizado)
function MapBuilder.CreateTile(parent, tileId, x, y)
    local part = Instance.new("Part")
    part.Name = tileId .. "_" .. x .. "_" .. y
    part.Size = Vector3.new(BLOCK_SIZE, 1, BLOCK_SIZE)
    part.Position = Vector3.new(x * BLOCK_SIZE, 0, y * BLOCK_SIZE)
    part.Anchored = true
    part.Color = TILE_COLORS[tileId] or Color3.new(1, 1, 1)
    part.Material = TILE_MATERIALS[tileId] or Enum.Material.Plastic

    -- Altura especial para paredes
    if string.find(tileId, "parede") then
        part.Size = Vector3.new(BLOCK_SIZE, 10, BLOCK_SIZE)
        part.Position = Vector3.new(x * BLOCK_SIZE, 5, y * BLOCK_SIZE)
    end

    part.Parent = parent
    return part
end

-- Dados dos Setores para marcação posterior
local SETORES = {
`;

        for (const setor of mapa.setores) {
            script += `    { id = "${setor.id}", tipo = "${setor.tipo}", x = ${setor.bounds.x}, y = ${setor.bounds.y}, w = ${setor.bounds.largura}, h = ${setor.bounds.altura} },\n`;
        }

        script += `}

-- Execução por Lotes (evita travamento do servidor)
function MapBuilder.BuildMap(workspace)
    local mapFolder = Instance.new("Folder")
    mapFolder.Name = "${opt.baseFolderName}_" .. "${mapa.id}"
    mapFolder.Parent = workspace

    print("[EZ Studios] Iniciando construção...")
    local tilesBuilt = 0
`;

        // Processamento em batches de 100 tiles
        const batchSize = 100;
        for (let i = 0; i < mapa.tiles.length; i += batchSize) {
            const batch = mapa.tiles.slice(i, i + batchSize);
            script += `\n    -- Lote ${Math.floor(i / batchSize) + 1}\n`;
            for (const tile of batch) {
                script += `    MapBuilder.CreateTile(mapFolder, "${tile.tileId}", ${tile.x}, ${tile.y})\n`;
            }
            script += `    tilesBuilt = tilesBuilt + ${batch.length}\n`;
            script += `    task.wait(0.05) -- Throttle para estabilidade\n`;
        }

        script += `
    print("[EZ Studios] Mapa concluído. Total: " .. tilesBuilt .. " tiles")
    return mapFolder
end

-- Marcação visual de setores especiais (Spawn, Boss, Loja)
function MapBuilder.MarkSectors(mapFolder)
    for _, s in ipairs(SETORES) do
        if TILE_COLORS[s.tipo] then
            local marker = Instance.new("Part")
            marker.Name = "MARKER_" .. s.tipo
            marker.Size = Vector3.new(2, 20, 2)
            marker.Position = Vector3.new((s.x + s.w/2) * BLOCK_SIZE, 10, (s.y + s.h/2) * BLOCK_SIZE)
            marker.Anchored = true
            marker.CanCollide = false
            marker.Transparency = 0.5
            marker.Color = TILE_COLORS[s.tipo]
            marker.Parent = mapFolder
        end
    end
end

-- Início do Fluxo
local folder = MapBuilder.BuildMap(workspace)
MapBuilder.MarkSectors(folder)

return MapBuilder
`;

        return script;
    }

    getBuildStats(mapa: MapaGerado) {
        return {
            engine: this.engineName,
            tiles: mapa.tiles.length,
            setores: mapa.setores.length,
            estimatedParts: mapa.tiles.length + mapa.setores.length,
        };
    }
}
