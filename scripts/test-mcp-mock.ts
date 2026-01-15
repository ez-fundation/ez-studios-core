
import { globalLogger } from "../src/typescript/infra/logging/logger";
import { globalTemplateEngine } from "../src/typescript/core/templateEngine";
import { intentCompiler } from "../src/typescript/compiler/intentCompiler";
import { RobloxAdapter } from "../src/typescript/adapters/robloxAdapter";

// Mock do MCP Handler (simulação direta)
async function simulateMcpServer() {
    console.log("=== Testing MCP 2.0 Features ===");

    // 1. Test Resource: ez://logs/latest
    console.log("\n> [Resource] Reading 'ez://logs/latest'...");
    globalLogger.registrarSucesso("test_id", "Mapa", "123", "Roblox", {}, 100);
    const logs = globalLogger.obterLogsEstruturados();
    console.log(`  [SUCCESS] Logs retrieved: ${logs.length} entries. Last entry: ${logs[logs.length-1].intentId}`);

    // 2. Test Tool: hot_reload_registry
    console.log("\n> [Tool] Executing 'hot_reload_registry'...");
    globalTemplateEngine.clearCache(); 
    // Manual verification: check console for "Cache limpo"
    console.log("  [SUCCESS] Cache clear triggered.");

    // 3. Test Tool: preview_intent
    console.log("\n> [Tool] Executing 'preview_intent' for 'Fire Dungeon'...");
    const adapter = new RobloxAdapter();
    const result = await intentCompiler.compilarComPrompt("Fire Dungeon", [], adapter);
    
    // Simulate ASCII generation logic from server.ts
    let ascii = "🗺️ MAP PREVIEW 🗺️\n";
    if (result.resultado && "tiles" in result.resultado) {
        const tiles = (result.resultado as any).tiles;
        for(let z=0; z<3; z++) { // Limit to 3 levels for test
            ascii += `\n[Level ${z}]\n`;
            for(let x=0; x<5; x++) { // Limit to 5x5
                let row = "";
                for(let y=0; y<5; y++) {
                    const t = tiles.find((t:any) => t.x === x && t.y === y && t.z === z);
                    row += t ? "█" : ".";
                }
                ascii += row + "\n";
            }
        }
    }
    console.log(ascii);
    console.log("  [SUCCESS] Preview generated.");
}

simulateMcpServer();
