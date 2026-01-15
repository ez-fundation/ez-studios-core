
import { fuzzyIncludes, levenshteinDistance } from "../src/typescript/utils/fuzzy";

console.log("Levenshtein 'swoord' vs 'sword':", levenshteinDistance("swoord", "sword"));
console.log("Fuzzy Includes 'fire swoord' has 'sword'?", fuzzyIncludes("fire swoord", "sword"));
console.log("Fuzzy Includes 'huge dunggeon' has 'dungeon'?", fuzzyIncludes("huge dunggeon", "dungeon"));
