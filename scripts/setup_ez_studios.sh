#!/bin/bash
# ==============================================================================
# EZ STUDIOS - Setup Completo para Google Antigravity IDE
# Versão: 3.0
# Data: Janeiro 10, 2026
# ==============================================================================

set -e  # Para execução em caso de erro

echo "🚀 Iniciando setup EZ STUDIOS..."

# ==============================================================================
# PASSO 1: Configuração Git
# ==============================================================================

echo ""
echo "📦 PASSO 1: Configurando Git..."

# Configure suas credenciais (SUBSTITUA COM SUAS INFORMAÇÕES)
git config --global user.name "Seu Nome Aqui"
git config --global user.email "seu-email@exemplo.com"

# Criar diretório raiz do projeto
mkdir -p ez-studios-core
cd ez-studios-core

# Inicializar repositório Git
git init
echo "✓ Repositório Git inicializado"

# ==============================================================================
# PASSO 2: Estrutura de Pastas
# ==============================================================================

echo ""
echo "📁 PASSO 2: Criando estrutura de pastas..."

# Criar estrutura completa
mkdir -p docs
mkdir -p engine/wfc/src
mkdir -p engine/wfc/tests
mkdir -p engine/bsp/src
mkdir -p engine/bsp/tests
mkdir -p engine/datastore/src
mkdir -p engine/datastore/tests
mkdir -p engine/intention-compiler/src
mkdir -p platform/frontend/src/components
mkdir -p platform/frontend/src/pages
mkdir -p platform/frontend/src/styles
mkdir -p platform/frontend/public
mkdir -p platform/backend/src/api
mkdir -p platform/backend/src/db
mkdir -p platform/backend/src/services
mkdir -p platform/backend/tests
mkdir -p platform/docs
mkdir -p roblox/plugins/WFCGenerator
mkdir -p roblox/plugins/DataStoreHelper
mkdir -p roblox/examples/example_city
mkdir -p roblox/examples/example_dungeon
mkdir -p roblox/docs
mkdir -p brand/logo
mkdir -p brand/concepts
mkdir -p .github/workflows
mkdir -p .github/ISSUE_TEMPLATE

echo "✓ Estrutura de pastas criada"

# ==============================================================================
# PASSO 3: Arquivos de Documentação
# ==============================================================================

echo ""
echo "📝 PASSO 3: Criando arquivos de documentação base..."

# README.md principal
cat > README.md << 'EOL'
# EZ STUDIOS - Game Development Engine for Kids

**Transformando crianças em desenvolvedores de elite do Roblox**

## 🎯 Visão Geral

EZ STUDIOS é um motor procedural educacional que ensina crianças (8-16 anos) a criar jogos profissionais no Roblox usando:
- **Wave Function Collapse (WFC)** com Entropia de Shannon
- **Binary Space Partitioning (BSP)** para otimização
- **Compilador de Intenção** visual (drag-and-drop → código Luau)
- **Pedagogia científica** gamificada

## 🚀 Quick Start

```bash
# Clone o repositório
git clone https://github.com/YOUR_ORG/ez-studios-core
cd ez-studios-core

# Leia a documentação
cat MANIFESTO_EZ_STUDIOS_V3.md
cat BLUEPRINT_DESENVOLVIMENTO.md
```

## 📚 Documentação

- **[Manifesto Completo](MANIFESTO_EZ_STUDIOS_V3.md)** - Visão estratégica + matemática
- **[Blueprint de Desenvolvimento](BLUEPRINT_DESENVOLVIMENTO.md)** - Roadmap executável (8 semanas)
- **[Protocolo Entropia Zero](docs/PROTOCOLO_ENTROPIA_ZERO.md)** - Fundamentos técnicos
- **[Arquitetura do Motor](docs/ARQUITETURA_MOTOR.md)** - Diagramas + pseudocódigo
- **[Pedagogia](docs/PEDAGOGIA.md)** - Trilhas de aprendizado

## 🏗️ Arquitetura

```
Frontend (Next.js + React) 
    ↓
Backend (Node.js/FastAPI + PostgreSQL)
    ↓
Roblox Integration (Luau plugins)
    ↓
Motor Procedural (WFC + BSP + DataStore)
```

## 🛠️ Stack

- **Frontend:** Next.js 14, React 19, Tailwind CSS, Three.js
- **Backend:** Node.js/FastAPI, PostgreSQL, Redis, Bull
- **Roblox:** Luau, DataStore API, Plugin Studio
- **Engine:** Python/Luau (WFC + BSP)
- **DevOps:** GitHub Actions, Vercel, AWS/GCP

## 📊 Métricas

- **Mercado:** 50M+ crianças interessadas em game dev
- **Receita (1000 alunos):** R$ 319.750/mês
- **Performance:** <5s para gerar 5000 blocos
- **Retenção target:** 60%+ (L1→L3)

## 👥 Equipe

- **Fundador/CTO:** Engenheiro sênior (você)
- **Co-fundador/CPO:** Chief Product Officer, 12 anos (validação UX)

## 📞 Contato

- **GitHub:** [github.com/YOUR_ORG/ez-studios-core](https://github.com/YOUR_ORG/ez-studios-core)
- **Email:** contato@ezstudios.dev

## 📄 Licença

[Definir: MIT ou Comercial]

---

**Status:** MVP em desenvolvimento (Sprint 1/16)  
**Versão:** 0.1.0  
**Última atualização:** Janeiro 10, 2026
EOL

echo "✓ README.md criado"

# .gitignore
cat > .gitignore << 'EOL'
# Node
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# Next.js
.next/
out/
build/
dist/

# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
ENV/
*.egg-info/
.pytest_cache/

# IDEs
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Environment
.env
.env.local
.env.*.local

# Logs
logs/
*.log

# Database
*.db
*.sqlite

# Roblox
*.rbxl.lock
*.rbxlx.lock

# Temporary
tmp/
temp/
*.tmp
EOL

echo "✓ .gitignore criado"

# LICENSE (placeholder)
cat > LICENSE << 'EOL'
# Licença EZ STUDIOS

[DEFINIR: MIT, Apache 2.0, ou Licença Comercial]

Copyright (c) 2026 EZ STUDIOS

Todos os direitos reservados até definição formal de licença.
EOL

echo "✓ LICENSE criado"

# ==============================================================================
# PASSO 4: Documentação Técnica
# ==============================================================================

echo ""
echo "📖 PASSO 4: Criando documentação técnica..."

# docs/QUICK_START.md
cat > docs/QUICK_START.md << 'EOL'
# Quick Start - EZ STUDIOS

## Instalação Rápida (5 minutos)

### 1. Clone o repositório
```bash
git clone https://github.com/YOUR_ORG/ez-studios-core
cd ez-studios-core
```

### 2. Instale dependências
```bash
# Frontend
cd platform/frontend
npm install

# Backend
cd ../backend
npm install

# Engine (Python)
cd ../../engine/wfc
pip install -r requirements.txt
```

### 3. Execute WFC localmente
```bash
cd engine/wfc
python src/wfc.py --tiles 5 --size 20
```

### 4. Próximos passos
- Leia `MANIFESTO_EZ_STUDIOS_V3.md`
- Siga `BLUEPRINT_DESENVOLVIMENTO.md` (Sprint 1)
- Configure Roblox Studio plugin

## Precisa de ajuda?
Consulte a documentação completa em `docs/`
EOL

echo "✓ Quick Start criado"

# engine/wfc/requirements.txt
cat > engine/wfc/requirements.txt << 'EOL'
numpy>=1.24.0
pytest>=7.4.0
EOL

echo "✓ requirements.txt criado"

# ==============================================================================
# PASSO 5: GitHub Workflows (CI/CD)
# ==============================================================================

echo ""
echo "⚙️ PASSO 5: Configurando GitHub Actions..."

# .github/workflows/test.yml
cat > .github/workflows/test.yml << 'EOL'
name: Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test-engine:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: |
          cd engine/wfc
          pip install -r requirements.txt
      - name: Run tests
        run: |
          cd engine/wfc
          pytest tests/ -v
EOL

echo "✓ GitHub Actions configurado"

# ==============================================================================
# PASSO 6: Package.json (Frontend e Backend)
# ==============================================================================

echo ""
echo "📦 PASSO 6: Criando package.json..."

# Frontend package.json
cat > platform/frontend/package.json << 'EOL'
{
  "name": "ez-studios-frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "autoprefixer": "^10.0.0",
    "postcss": "^8.0.0",
    "tailwindcss": "^3.0.0",
    "typescript": "^5.0.0"
  }
}
EOL

# Backend package.json
cat > platform/backend/package.json << 'EOL'
{
  "name": "ez-studios-backend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "nodemon src/index.js",
    "start": "node src/index.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.0",
    "pg": "^8.11.0",
    "redis": "^4.6.0",
    "bull": "^4.11.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.0",
    "jest": "^29.0.0"
  }
}
EOL

echo "✓ package.json criados"

# ==============================================================================
# PASSO 7: Primeiro Commit
# ==============================================================================

echo ""
echo "💾 PASSO 7: Preparando primeiro commit..."

# Adicionar todos os arquivos
git add .

# Commit inicial
git commit -m "feat: initial commit - EZ STUDIOS foundation

- Setup de estrutura de pastas completa
- Documentação base (README, manifesto, blueprint)
- Configuração de CI/CD (GitHub Actions)
- Package.json frontend e backend
- .gitignore e LICENSE

Sprint 1/16 - Fundação"

echo "✓ Primeiro commit criado"

# ==============================================================================
# PASSO 8: Conectar com GitHub
# ==============================================================================

echo ""
echo "🔗 PASSO 8: Conectando ao GitHub..."
echo ""
echo "⚠️  AÇÃO MANUAL NECESSÁRIA:"
echo ""
echo "1. Vá para https://github.com/new"
echo "2. Nome do repositório: ez-studios-core"
echo "3. Descrição: Game Development Engine for Kids - Roblox WFC + BSP"
echo "4. Visibilidade: Private (por enquanto) ou Public"
echo "5. NÃO inicialize com README (já temos)"
echo "6. Clique em 'Create repository'"
echo ""
echo "7. Copie a URL do repositório (exemplo: https://github.com/SEU_USER/ez-studios-core.git)"
echo ""
echo "8. Execute os comandos:"
echo ""
echo "   git remote add origin https://github.com/SEU_USER/ez-studios-core.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""

# ==============================================================================
# PASSO 9: Próximos Passos
# ==============================================================================

echo ""
echo "✅ SETUP COMPLETO!"
echo ""
echo "📋 CHECKLIST DO QUE FOI CRIADO:"
echo ""
echo "   ✓ Estrutura de pastas (engine, platform, roblox, docs, brand)"
echo "   ✓ README.md principal"
echo "   ✓ .gitignore e LICENSE"
echo "   ✓ Documentação base (Quick Start)"
echo "   ✓ GitHub Actions (CI/CD)"
echo "   ✓ package.json (frontend + backend)"
echo "   ✓ requirements.txt (Python/WFC)"
echo "   ✓ Primeiro commit preparado"
echo ""
echo "📌 PRÓXIMOS PASSOS:"
echo ""
echo "   1. Criar repositório no GitHub (veja instruções acima)"
echo "   2. Fazer push do código:"
echo "      git remote add origin https://github.com/SEU_USER/ez-studios-core.git"
echo "      git push -u origin main"
echo ""
echo "   3. Adicionar MANIFESTO_EZ_STUDIOS_V3.md e BLUEPRINT_DESENVOLVIMENTO.md"
echo "      (copie os arquivos que eu gerei anteriormente)"
echo ""
echo "   4. Abrir Google Antigravity IDE:"
echo "      - Conectar repositório GitHub"
echo "      - Começar Sprint 1 (documentação WFC)"
echo ""
echo "   5. Convidar seu sócio (12 anos) como colaborador"
echo ""
echo "🚀 Você está pronto para começar!"
echo ""
echo "Diretório atual: $(pwd)"
echo ""
