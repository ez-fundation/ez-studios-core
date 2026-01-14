#!/usr/bin/env tsx
/**
 * Validation script for Polyglot Asset Registry
 * Ensures all assets have required behaviors
 */

import { ASSET_REGISTRY } from '../src/typescript/data/assetRegistry';

console.log('🔍 Validating Asset Registry...\n');

let errors = 0;
let warnings = 0;

ASSET_REGISTRY.forEach((asset, index) => {
    console.log(`[${index + 1}/${ASSET_REGISTRY.length}] ${asset.id} (${asset.category})`);

    // Check for Roblox behavior (required)
    if (!asset.behavior.roblox) {
        console.error(`  ❌ Missing Roblox behavior`);
        errors++;
    } else {
        console.log(`  ✓ Roblox behavior present (${asset.behavior.roblox.length} chars)`);
    }

    // Check for Unity behavior (optional but recommended)
    if (!asset.behavior.unity) {
        console.warn(`  ⚠️  Missing Unity behavior (optional)`);
        warnings++;
    }

    // Check for Godot behavior (optional)
    if (!asset.behavior.godot) {
        console.warn(`  ⚠️  Missing Godot behavior (optional)`);
        warnings++;
    }

    console.log('');
});

console.log('📊 Summary:');
console.log(`   Total assets: ${ASSET_REGISTRY.length}`);
console.log(`   Errors: ${errors}`);
console.log(`   Warnings: ${warnings}`);
console.log('');

if (errors > 0) {
    console.error('❌ Validation failed!');
    process.exit(1);
} else {
    console.log('✅ All assets valid!');
    process.exit(0);
}
