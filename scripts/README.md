# Scripts Directory - EZ Studios v2.3.0

Modern build and development scripts for the Polyglot Core architecture.

---

## 🚀 Quick Reference

| Script | Purpose | Usage |
|--------|---------|-------|
| `build.sh` | Production build | `./scripts/build.sh` |
| `dev-all.sh` | Start dev environment | `./scripts/dev-all.sh` |
| `export-roblox-demo.sh` | Export demo world | `./scripts/export-roblox-demo.sh` |
| `validate-polyglot-registry.sh` | Validate asset registry | `./scripts/validate-polyglot-registry.sh` |

---

## 📋 Script Details

### `build.sh`
Production build with TypeScript compilation and Vite bundling.
- Cleans `dist/` directory
- Compiles TypeScript
- Bundles with Vite
- Shows build statistics

### `dev-all.sh`
Launches development environment.
- Checks dependencies
- Starts Vite dev server on port 5173
- Auto-installs if needed

### `export-roblox-demo.sh`
Generates example Lua code for Roblox Studio.
- Uses Intent Compiler
- Exports to `dist/roblox-demo/`
- Ready for Studio import

### `validate-polyglot-registry.sh`
Validates AssetRegistry integrity.
- Checks for required Roblox behaviors
- Warns about missing Unity/Godot behaviors
- Exits with error if validation fails

---

## 🗂️ Legacy Scripts

Obsolete scripts moved to `legacy/`:
- `setup_ez_studios.sh` (v3.0, Jan 10) - Old Python/Luau architecture

---

**Last Updated:** 2026-01-14  
**Version:** 2.3.0
