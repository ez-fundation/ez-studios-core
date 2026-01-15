
import { intentCompiler } from "../src/typescript/compiler/intentCompiler";
import { RobloxAdapter } from "../src/typescript/adapters/robloxAdapter";

async function main() {
  console.log("=== Testing Intent Compiler ===");
  
  const adapter = new RobloxAdapter();
  const prompts = [
    "Fire Sword",
    "Zombie Guard",
    "Huge Dungeon"
  ];

  for (const prompt of prompts) {
    console.log(`\n> Processing prompt: "${prompt}"...`);
    try {
      // Mock tiles for now as we don't need full WFC layout for simple test
      const result = await intentCompiler.compilarComPrompt(prompt, [], adapter);
      console.log(`  [SUCCESS] Generated: ${result.resultado.id}`);
      console.log(`  Category: ${result.intencao.categoria}`);
      console.log(`  Code Snippet: ${result.codigoGerado.substring(0, 100).replace(/\n/g, ' ')}...`);
      console.log(`  Tags: ${result.intencao.parametros.tags.join(", ")}`);
    } catch (error) {
      console.error(`  [ERROR] Failed:`, error);
    }
  }
}

main();
