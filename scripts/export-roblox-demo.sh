#!/bin/bash
# ==============================================================================
# EZ Studios Core v2.3.0 - Export Roblox Demo
# Generates example Lua code from Intent Compiler
# ==============================================================================

set -e

echo "🎮 Exporting Roblox Demo World..."
echo ""

# Create output directory
mkdir -p dist/roblox-demo

# Generate demo using TypeScript
echo "🧠 Generating world via Intent Compiler..."
pnpm tsx src/typescript/tests/demo-export.ts

echo ""
echo "✅ Demo exported successfully!"
echo "   Output: ./dist/roblox-demo/"
echo ""
echo "📋 Files generated:"
ls -lh dist/roblox-demo/
echo ""
echo "💡 Import these .lua files into Roblox Studio"
