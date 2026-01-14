#!/bin/bash
# ==============================================================================
# EZ Studios Core v2.3.0 - Development Environment Launcher
# ==============================================================================

set -e

echo "🚀 Starting EZ Studios Development Environment..."
echo ""

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    pnpm install
    echo ""
fi

# Start dev server
echo "⚡ Starting Vite dev server..."
echo "   URL: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop"
echo ""

pnpm run dev
