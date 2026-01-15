
import { intentCompiler } from "../src/typescript/compiler/intentCompiler";
import { RobloxAdapter } from "../src/typescript/adapters/robloxAdapter";

async function main() {
  console.log("=== Testing Fuzzy Intent (Brain Upgrade) ===");
  
  const adapter = new RobloxAdapter();
  const prompts = [
    "Fire Swoord", // Typo in Sword
    "Ice Postion", // Typo in Potion
    "Huge Dunggeon", // Typo in Dungeon
    "make it green" // Context test (should refer to last category)
  ];

  for (const prompt of prompts) {
    console.log(`\n---------------------------------------------------`);
    console.log(`> Processing prompt (Fuzzy): "${prompt}"...`);
    try {
      const result = await intentCompiler.compilarComPrompt(prompt, [], adapter);
      console.log(`  [SUCCESS] Generated: ${result.resultado.id}`);
      console.log(`  Category: ${result.intencao.categoria}`);
      console.log(`  Tags: ${result.intencao.parametros.tags.join(", ")}`);
    } catch (error) {
      console.error(`  [ERROR] Failed:`, error);
    }
  }
}

main();
