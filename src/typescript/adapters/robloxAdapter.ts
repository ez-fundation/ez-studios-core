/**
 * Adaptador Roblox Oficial Holístico (v1.5)
 * Gera código Luau para Mapas, Atores e Itens procedurais
 */

import { IEngineAdapter, RobloxAdapterOptions } from "./index";
import { ProceduralEntity, MapaGerado, ActorInstance, ItemInstance, MarketplaceMetadata } from "../core/models/types";
import { resolveAssetBehavior, resolveAssetDefinition } from "../data/assetRegistry";
import { globalTemplateEngine } from "../core/templateEngine";

export class RobloxAdapter implements IEngineAdapter {
    readonly engineName = "Roblox";
    readonly fileExtension = "lua";

    private defaults: Required<RobloxAdapterOptions> = {
        maxParts: 10000,
        blockSize: 4,
        baseFolderName: "EZ_Holistic_Entity",
        colorScheme: {
            chao_1: "Color3.fromRGB(120, 120, 120)",
            parede_1: "Color3.fromRGB(60, 60, 60)",
            porta_1: "Color3.fromRGB(139, 69, 19)",
            spawn: "Color3.fromRGB(0, 255, 0)",
            boss: "Color3.fromRGB(255, 0, 0)",
            loja: "Color3.fromRGB(0, 0, 255)",
        },
    };

    generateCode(entidade: ProceduralEntity, options?: RobloxAdapterOptions): string {
        const opt = { ...this.defaults, ...options };

        if ("tiles" in entidade) {
            return this.generateMapCode(entidade as MapaGerado, opt);
        } else if ("raridade" in entidade) {
            return this.generateItemCode(entidade as ItemInstance, opt);
        } else if ("IA" in entidade) {
            return this.generateActorCode(entidade as ActorInstance, opt);
        }

        throw new Error("Tipo de entidade procedural não suportado pelo adaptador Roblox.");
    }

    private generateMapCode(mapa: MapaGerado, opt: Required<RobloxAdapterOptions>): string {
        let script = `-- EZ STUDIOS - Mapa Volumétrico 3D
-- ID: ${mapa.id} | Hash: ${mapa.metadados.hashGeracao}

local MapBuilder = {}
local BLOCK_SIZE = ${opt.blockSize}
local FLOOR_HEIGHT = ${opt.blockSize}

function MapBuilder.CreateTile(parent, tileId, x, y, z)
    local part = Instance.new("Part")
    part.Size = Vector3.new(BLOCK_SIZE, string.find(tileId, "parede") and FLOOR_HEIGHT or 1, BLOCK_SIZE)
    part.Position = Vector3.new(x * BLOCK_SIZE, (z * FLOOR_HEIGHT) + (part.Size.Y / 2), y * BLOCK_SIZE)
    part.Anchored = true
    part.Parent = parent
    return part
end

function MapBuilder.Build(workspace)
    local folder = Instance.new("Folder", workspace)
    folder.Name = "Map_" .. "${mapa.id}"
`;

        const batchSize = 100;
        for (let i = 0; i < mapa.tiles.length; i += batchSize) {
            const batch = mapa.tiles.slice(i, i + batchSize);
            for (const tile of batch) {
                script += `    MapBuilder.CreateTile(folder, "${tile.tileId}", ${tile.x}, ${tile.y}, ${tile.z})\n`;
            }
            script += `    task.wait(0.01)\n`;
        }

        script += `    return folder\nend\nMapBuilder.Build(workspace)\nreturn MapBuilder`;
        return script;
    }

    private applyArtisticFinalization(instanceName: string, metadados: MarketplaceMetadata): string {
        const estetica = metadados.estetica || "Quantum";
        let script = "";

        if (estetica === "Quantum") {
            script += `    ${instanceName}.Material = Enum.Material.Neon\n`;
            script += `    local light = Instance.new("PointLight", ${instanceName})\n`;
            script += `    light.Color = ${instanceName}.Color\n`;
            script += `    light.Range = 10\n`;
        } else if (estetica === "Cybernetic") {
            script += `    ${instanceName}.Material = Enum.Material.Metal\n`;
            script += `    ${instanceName}.Reflectance = 0.5\n`;
            script += `    local selection = Instance.new("SelectionBox", ${instanceName})\n`;
            script += `    selection.Adornee = ${instanceName}\n`;
            script += `    selection.Color3 = Color3.fromRGB(0, 255, 255)\n`;
        } else if (estetica === "Realistic") {
            script += `    ${instanceName}.Material = Enum.Material.Pebble\n`;
        } else if (estetica === "LowPoly") {
            script += `    ${instanceName}.Material = Enum.Material.SmoothPlastic\n`;
        }

        return script;
    }

    private generateItemCode(item: ItemInstance, _opt: Required<RobloxAdapterOptions>): string {
        const estetica = item.metadados.estetica || "Quantum";

        // Phase 34: Hybrid Registry Lookup
        const assetDef = resolveAssetDefinition("Item", item.metadados.tags || []);
        const modelId = assetDef?.modelIds?.roblox;
        const behaviorTemplate = resolveAssetBehavior("Item", item.metadados.tags || [], "roblox");
        
        // Render template logic
        let behaviorScript = "-- No behavior template found";
        try {
             behaviorScript = globalTemplateEngine.render(behaviorTemplate, {
                damage: item.stats["dano"] || 10,
                healAmount: 50, // Default fallback
                category: item.tipo
             });
        } catch(e) {
            console.warn("Failed to render item template", e);
        }

        return `-- EZ STUDIOS - Item Factory (v2.3.0 - Hybrid Powered)
-- ID: ${item.id} | Raridade: ${item.raridade} | Estética: ${estetica}
-- Mode: ${modelId ? "Professional Asset" : "Procedural Fallback"}

local ItemFactory = {}

function ItemFactory.Create()
    local tool
    
    if "${modelId || ""}" ~= "" then
        print("[EZ] Loading professional asset: ${modelId}")
        -- Simulation: Usually tool = game:GetService("InsertService"):LoadAsset(ID):GetChildren()[1]
        tool = Instance.new("Tool")
        local idVal = Instance.new("StringValue", tool)
        idVal.Name = "AssetId"
        idVal.Value = "${modelId}"
    else
        tool = Instance.new("Tool")
        local handle = Instance.new("Part", tool)
        handle.Name = "Handle"
        handle.Size = Vector3.new(1, 0.5, 4)
        handle.Color = Color3.fromHSV(math.random(), 0.8, 1)
        ${this.applyArtisticFinalization("handle", item.metadados)}
    end

    tool.Name = "${item.tipo.toUpperCase()}_${item.id}"
    tool.RequiresHandle = true
    
    -- Injetar Stats no Tool
    local stats = Instance.new("Configuration", tool)
    stats.Name = "Attributes"
    
    ${Object.entries(item.stats).map(([k, v]) => `local val_${k} = Instance.new("NumberValue", stats); val_${k}.Name = "${k}"; val_${k}.Value = ${v}`).join("\n    ")}
    
    -- Injetar Script de Comportamento Procedural (Registry)
    local script = Instance.new("Script", tool)
    script.Name = "BehaviorScript"
    script.Source = [[
${behaviorScript}
    ]]
    
    print("[EZ Studios] Item ${item.id} finalizado.")
    return tool
end

return ItemFactory.Create()
`;
    }

    private generateActorCode(actor: ActorInstance, _opt: Required<RobloxAdapterOptions>): string {
        const estetica = actor.metadados.estetica || "Quantum";

        // Phase 34: Hybrid Registry Lookup
        const assetDef = resolveAssetDefinition("Actor", actor.metadados.tags || []);
        const modelId = assetDef?.modelIds?.roblox;
        const aiTemplate = resolveAssetBehavior("Actor", actor.metadados.tags || [], "roblox");

         // Render template logic
         let aiScript = "-- No AI template found";
         try {
              aiScript = globalTemplateEngine.render(aiTemplate, {
                 detectRange: 20, // Default
                 category: actor.nome || "Unnamed"
              });
         } catch(e) {
             console.warn("Failed to render actor template", e);
         }

        return `-- EZ STUDIOS - Actor Engine (v2.3.0 - Hybrid Powered)
-- ID: ${actor.id} | Nome: ${actor.nome}
-- Mode: ${modelId ? "Professional Asset" : "Procedural Fallback"}

local ActorEngine = {}

function ActorEngine.Spawn(position)
    local npc
    
    if "${modelId || ""}" ~= "" then
        -- Simulation: In a real environment, we would load the Model from Roblox Cloud
        npc = Instance.new("Model")
        local idVal = Instance.new("StringValue", npc)
        idVal.Name = "AssetId"
        idVal.Value = "${modelId}"
        
        -- We still need a Humanoid for physics/logic
        Instance.new("Humanoid", npc)
        local hrp = Instance.new("Part", npc)
        hrp.Name = "HumanoidRootPart"
        hrp.Transparency = 1
        hrp.Position = position
    else
        npc = Instance.new("Model")
        Instance.new("Humanoid", npc)
        local hrp = Instance.new("Part", npc)
        hrp.Name = "HumanoidRootPart"
        hrp.Position = position
        hrp.Size = Vector3.new(2, 2, 1)
        hrp.Color = Color3.fromRGB(0, 150, 255)
        ${this.applyArtisticFinalization("hrp", actor.metadados)}
    end

    npc.Name = "${actor.nome}"
    
    -- Configurar IA
    local config = Instance.new("Configuration", npc)
    config.Name = "AI_Config"
    
    local behavior = Instance.new("StringValue", config)
    behavior.Name = "Behavior"
    behavior.Value = "${actor.IA.comportamento}"
    
    -- Injetar Cérebro (Script de IA do Registry)
    local brain = Instance.new("Script", npc)
    brain.Name = "AICore"
    brain.Source = [[
${aiScript}
    ]]
    
    print("[EZ Studios] Ator ${actor.nome} spawnado.")
    return npc
end

return ActorEngine
`;
    }

    getBuildStats(entidade: ProceduralEntity) {
        return {
            engine: this.engineName,
            id: entidade.id,
            hash: entidade.metadados.hashGeracao,
            estetica: entidade.metadados.estetica || "Padrão",
            registryVersion: "2.3.0"
        };
    }
}
