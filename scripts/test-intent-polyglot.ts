
import { intentCompiler } from "../src/typescript/compiler/intentCompiler";
import { RobloxAdapter } from "../src/typescript/adapters/robloxAdapter";

async function main() {
  console.log("=== Testing Polyglot Intent (i18n) ===");
  
  const adapter = new RobloxAdapter();
  const prompts = [
    { text: "Fire Sword", lang: "EN" },
    { text: "Espada de Fogo", lang: "PT" },
    { text: "Ice Potion", lang: "EN" },
    { text: "Poção de Gelo", lang: "PT" },
    { text: "Uma masmorra cyberpunk", lang: "PT (Mixed)" },
    { text: "A futuristic dungeon", lang: "EN (Mixed)" }
  ];

  for (const p of prompts) {
    console.log(`\n---------------------------------------------------`);
    console.log(`> Processing [${p.lang}]: "${p.text}"...`);
    try {
      const result = await intentCompiler.compilarComPrompt(p.text, [], adapter);
      console.log(`  [SUCCESS] Generated: ${result.resultado.id}`);
      console.log(`  Category: ${result.intencao.categoria}`);
      console.log(`  Estética: ${result.intencao.parametros.estetica}`);
      console.log(`  Tags: ${result.intencao.parametros.tags.join(", ")}`);
    } catch (error) {
      console.error(`  [ERROR] Failed:`, error);
    }
  }
}

main();
