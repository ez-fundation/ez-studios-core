# Estrutura de Diretórios - EZ Studios

Este documento descreve a organização completa do projeto **EZ Studios**.

---

## 📁 Visão Geral

```
ROBLOX_$$$/
├── docs/                    # Documentação
├── assets/                  # Assets visuais
├── src/                     # Código-fonte
├── config/                  # Configurações
├── scripts/                 # Scripts de setup
├── examples/                # Exemplos de uso
├── archive/                 # Arquivos históricos
├── README.md                # Documentação principal
├── STRUCTURE.md             # Este arquivo
├── .editorconfig            # Configuração de editor
└── RobloxMapaModule.lua     # Módulo Roblox (raiz)
```

---

## 📚 docs/ - Documentação

### docs/markdown/

Documentação em formato Markdown:

- `PROJECT_SUMMARY.md` - Sumário executivo completo do projeto
- `ROBLOX_INTEGRATION.md` - Guia de integração com Roblox
- `CONTRIBUTING.md` - Guia de contribuição
- `BLUEPRINT_DESENVOLVIMENTO.md` - Blueprint de desenvolvimento
- `Entropia-Zero-Completo.md` - Protocolo Entropia Zero

### docs/pdf/

Documentação técnica em PDF (gerada por Manus AI):

- `ARCHITECTURE.pdf` - Arquitetura técnica
- `CONTRIBUTING.pdf` - Guia de contribuição
- `EVOLUTION.pdf` - Evolução do projeto
- `IDEAS.pdf` - Ideias e roadmap
- `IDE_GUIDE.pdf` - Guia de IDE
- `PROJECT_SUMMARY.pdf` - Sumário do projeto
- `README.pdf` - README principal
- `ROBLOX_INTEGRATION.pdf` - Integração Roblox

---

## 🎨 assets/ - Assets Visuais

### assets/infographics/

Infográficos do projeto (4 arquivos):

- `Infográfico_Master_Ecoss_EZ_StudioS_#2.png` - Ecossistema master
- `infográfico_master_ecossistemo_EZ_STUDIOS.png` - Variante
- `Infográfico_MotorProcedural_EZ.png` - Motor procedural
- `INFORGRAFICO_EZ_STUDIOS.png` - Infográfico geral

### assets/diagrams/

Diagramas técnicos (5 arquivos):

- `Diagrama_Compilador_de_Intenção.png` - Compilador de intenção
- `Diagrama_visual_algoritmo-wfc.png` - Algoritmo WFC
- `Setores_BSP.png` - Binary Space Partitioning
- `Cubo_procedural.png` - Cubo procedural
- `Mapa_de_PI(propriedade_intelectual).png` - Propriedade intelectual

### assets/dashboards/

Mockups de dashboards e painéis (5+ arquivos):

- `Dashboard_executivo_EZ_STUDIOS.png` - Dashboard executivo
- `Console_DataStore_ADM_EZ.png` - Console administrativo
- `Painel_Interno_Performance_EZ-STUDIOS.png` - Painel de performance
- `painel_gamificação_EZ_StudioS.png` - Painel de gamificação
- `Tela_Marketplace_EZ_STUDIOS.png` - Marketplace

### assets/concepts/

Conceitos visuais e branding (11+ arquivos):

- `Poster_Conceitual_EZ_STUDIO.png` - Poster conceitual
- `Quantum_Architect.png` - Arquiteto Quântico
- `EZ_StudioS.png` - Logo/branding
- `banner_EZ.png` - Banner
- `Trilha_EZ_StudioS.png` - Trilha de aprendizado
- E mais...

### assets/screenshots/

Screenshots de conceitos (31 arquivos IMG_*.PNG/JPG):

- `IMG_3524.PNG` - `IMG_3526.PNG` - Screenshots de alta resolução
- `IMG_3553.JPG` - `IMG_3591.JPG` - Conceitos visuais numerados

---

## 💻 src/ - Código-Fonte

### src/typescript/ - Implementação Principal (TypeScript)

#### src/typescript/core/

Núcleo do motor procedural:

**src/typescript/core/bsp/**
- `bsp.ts` - Binary Space Partitioning (~180 linhas)

**src/typescript/core/wfc/**
- `wfc.ts` - Wave Function Collapse (~280 linhas)

**src/typescript/core/models/**
- `types.ts` - Definições de tipos (~200 linhas)
- `serialization.ts` - Serialização JSON (~60 linhas)

#### src/typescript/compiler/

- `intentCompiler.ts` - Compilador de intenções (~320 linhas)

#### src/typescript/edu/api/

- `educationalApi.ts` - API educacional (~150 linhas)

#### src/typescript/infra/logging/

- `logger.ts` - Sistema de logging (~120 linhas)

#### src/typescript/ui/

Componentes React da interface web:

- `App.tsx` - Componente principal
- `Dashboard.tsx` - Dashboard executivo (~350 linhas)
- `Editor.tsx` - Editor visual (~320 linhas)
- `Landing.tsx` - Página de landing (~420 linhas)
- `Leaderboard.tsx` - Sistema de ranking (~320 linhas)
- `Marketplace.tsx` - Marketplace de assets (~250 linhas)
- `Profile.tsx` - Perfil de usuário (~260 linhas)

#### src/typescript/tests/

- `core.test.ts` - Testes automatizados (~380 linhas, 14+ testes)

---

### src/lua/ - Módulos Roblox

- `RobloxMapaModule.lua` - Módulo de construção de mapas (~200 linhas)
- `RobloxServerScript.lua` - Script de servidor (~150 linhas)

---

### src/archived/python/ - Implementação Python (Arquivada)

Implementação alternativa em Python (referência):

- `bsp.py` - Binary Space Partitioning (~180 linhas)
- `wfc.py` - Wave Function Collapse (~230 linhas)
- `compiler.py` - Compilador de intenções (~250 linhas)
- `roblox_adapter.py` - Adaptador Roblox (~180 linhas)
- `types.py` - Definições de tipos (~140 linhas)

---

## ⚙️ config/ - Configurações

### Arquivos de Configuração

- `project.json` - Configuração do projeto (10.8 KB)
- `project.yaml` - Configuração alternativa YAML (9 KB)
- `index.html` - Página HTML principal
- `index.css` - Estilos CSS

### config/vscode/

Configurações do VS Code:

- `extensions.json` - Extensões recomendadas
- `launch.json` - Configuração de debug
- `settings.json` - Settings do editor
- `tasks.json` - Tasks automatizadas

---

## 🔧 scripts/ - Scripts de Setup

- `setup_ez_studios.sh` - Script de instalação e configuração (~11.7 KB)

---

## 📖 examples/ - Exemplos de Uso

- `example-dungeon.ts` - Exemplo de geração de dungeon (~80 linhas)
- `validate-integration.ts` - Validação de integração (~200 linhas)

---

## 📦 archive/ - Arquivos Históricos

### archive/Concept_System/

Conceitos visuais originais (31 imagens) preservados para referência histórica.

### archive/old_structure/

Backup da estrutura antiga (se necessário reverter).

---

## 🗂️ Arquivos na Raiz

- `README.md` - Documentação principal do projeto
- `STRUCTURE.md` - Este arquivo
- `.editorconfig` - Configuração de editor
- `RobloxMapaModule.lua` - Módulo Roblox (mantido na raiz para compatibilidade)
- `RobloxServerScript.lua` - Script de servidor (mantido na raiz)

---

## 📊 Estatísticas

| Categoria | Quantidade |
|-----------|------------|
| **Documentação MD** | 5 arquivos |
| **Documentação PDF** | 7 arquivos |
| **Assets Visuais** | 65 imagens |
| **Código TypeScript** | 17 arquivos (~3,500 linhas) |
| **Código Lua** | 2 arquivos (~350 linhas) |
| **Código Python** | 5 arquivos (~980 linhas) |
| **Componentes React** | 7 arquivos (~1,970 linhas) |
| **Testes** | 1 arquivo (~380 linhas) |
| **Configuração** | 9 arquivos |

---

## 🔍 Como Encontrar Arquivos

### Procurando Documentação?
→ `docs/markdown/` ou `docs/pdf/`

### Procurando Assets Visuais?
→ `assets/` (subdividido por tipo: infographics, diagrams, dashboards, concepts, screenshots)

### Procurando Código?
→ `src/typescript/` (implementação principal)  
→ `src/lua/` (módulos Roblox)  
→ `src/archived/python/` (implementação Python)

### Procurando Exemplos?
→ `examples/`

### Procurando Configurações?
→ `config/` ou `config/vscode/`

### Procurando Scripts de Setup?
→ `scripts/`

---

## 📝 Notas

- ✅ **Duplicações removidas**: 4 arquivos (~3.91 MB economizados)
- ✅ **Estrutura organizada**: Arquivos categorizados por tipo e função
- ✅ **Backup preservado**: Estrutura antiga em `archive/`
- ✅ **Implementação principal**: TypeScript (Manus_Dev)
- ✅ **Implementação arquivada**: Python (Perplexity_Dev) em `src/archived/python/`

---

**Última Atualização**: 13 de Janeiro de 2026  
**Versão**: 1.0.0
