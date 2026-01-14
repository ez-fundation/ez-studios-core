#!/bin/bash
# ==============================================================================
# EZ Studios Core v2.3.0 - Production Build Script
# ==============================================================================

set -e

echo "🏗️  Building EZ Studios Core v2.3.0..."
echo ""

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist/
echo "✓ Clean complete"
echo ""

# TypeScript compilation
echo "📦 Compiling TypeScript..."
pnpm tsc
echo "✓ TypeScript compiled"
echo ""

# Vite build
echo "⚡ Building with Vite..."
pnpm vite build
echo "✓ Vite build complete"
echo ""

# Build stats
echo "📊 Build Statistics:"
echo "   - Bundle size: $(du -sh dist | cut -f1)"
echo "   - Files: $(find dist -type f | wc -l | tr -d ' ')"
echo ""

echo "✅ Production build complete!"
echo "   Output: ./dist/"
