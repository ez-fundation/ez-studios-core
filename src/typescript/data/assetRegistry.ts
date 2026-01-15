export interface AssetBehavior {
    /**
     * Caminho para o template Lua do Roblox (src/templates/...)
     */
    roblox?: string;
    /**
     * Caminho para o template C# da Unity (src/templates/...)
     */
    unity?: string;
    /**
     * Caminho para o template GDScript do Godot (src/templates/...)
     */
    godot?: string;
}

export interface AssetDefinition {
    id: string;
    category: "Item" | "Actor" | "Mapa";
    tags: string[];
    /**
     * IDs de assets reais na loja da engine (opcional)
     */
    modelIds?: {
        roblox?: string; // rbxassetid://...
        unity?: string;
    };
    /**
     * Comportamento programável poliglota
     */
    behavior: AssetBehavior;
    /**
     * Configuração de fallback procedural (se não houver modelId)
     */
    fallbackConfig: {
        color: string; // Hex ou RGB string
        size: [number, number, number];
        shape: "Box" | "Sphere" | "Cylinder" | "Mesh";
    };
}

/**
 * Registro central de Assets Procedurais
 */
export const ASSET_REGISTRY: AssetDefinition[] = [
    {
        id: "sword_fire",
        category: "Item",
        tags: ["espada", "fogo", "weapon", "melee"],
        behavior: {
            roblox: "roblox/lua/sword_fire.lua",
            unity: "unity/csharp/FireSword.cs",
        },
        modelIds: {
            roblox: "rbxassetid://123456789", // Realistic Fire Sword
            unity: "unity_asset_sword_fire_v1"
        },
        fallbackConfig: {
            color: "#FF4500",
            size: [0.5, 4, 0.5],
            shape: "Box"
        }
    },
    {
        id: "potion_heal",
        category: "Item",
        tags: ["pocao", "cura", "health", "consumivel"],
        behavior: {
            roblox: "roblox/lua/potion_heal.lua"
        },
        modelIds: {
            roblox: "rbxassetid://987654321", // Sci-Fi Potion
        },
        fallbackConfig: {
            color: "#00FF00",
            size: [1, 1, 1],
            shape: "Cylinder"
        }
    },
    {
        id: "npc_guard",
        category: "Actor",
        tags: ["npc", "guard", "soldado"],
        behavior: {
            roblox: "roblox/lua/npc_guard.lua"
        },
        modelIds: {
            roblox: "rbxassetid://456123789", // Professional NPC Body
        },
        fallbackConfig: {
            color: "#0000FF",
            size: [2, 5, 2],
            shape: "Box"
        }
    },
    {
        id: "npc_zombie",
        category: "Actor",
        tags: ["npc", "monstro", "zombie", "agressivo"],
        behavior: {
            roblox: "roblox/lua/npc_zombie.lua"
        },
        fallbackConfig: {
            color: "#005500",
            size: [2, 5, 2],
            shape: "Box"
        }
    }
];

export function resolveAssetBehavior(category: string, tags: string[], engine: "roblox" | "unity" | "godot"): string {
    // Simple heuristic: Find first asset that matches category and at least one tag
    const asset = ASSET_REGISTRY.find(a =>
        a.category === category &&
        a.tags.some(t => tags.map(x => x.toLowerCase()).includes(t.toLowerCase())) &&
        a.behavior[engine] // Must have behavior for target engine
    );

    if (asset && asset.behavior[engine]) {
        return asset.behavior[engine]!;
    }

    return getDefaultBehavior(category, engine);
}

export function resolveAssetDefinition(category: string, tags: string[]): AssetDefinition | undefined {
    return ASSET_REGISTRY.find(a =>
        a.category === category &&
        a.tags.some(t => tags.map(x => x.toLowerCase()).includes(t.toLowerCase()))
    );
}

function getDefaultBehavior(category: string, engine: string): string {
    if (engine === "roblox") {
        return "roblox/lua/generic.lua";
    }
    return "// Generic Behavior";
}
