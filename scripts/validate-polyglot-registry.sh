#!/bin/bash
# ==============================================================================
# EZ Studios Core v2.3.0 - Validate Polyglot Asset Registry
# Ensures all assets have required behaviors for target engines
# ==============================================================================

set -e

echo "🔍 Validating Polyglot Asset Registry..."
echo ""

# Run TypeScript validation
echo "📋 Checking asset definitions..."
pnpm tsx scripts/validate-registry.ts

echo ""
echo "✅ Validation complete!"
