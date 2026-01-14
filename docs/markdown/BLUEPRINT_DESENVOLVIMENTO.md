# BLUEPRINT_DESENVOLVIMENTO_EZ_STUDIOS.md
## Guia Completo de Implementação (Você + Seu Sócio de 12 anos)

**Status:** Pronto para Antigravity  
**Data:** Janeiro 10, 2026  
**Versão:** 1.0 - Executável  

---

## 📋 ÍNDICE RÁPIDO

- **BLOCO 1:** Fundação (Semanas 1-2)
- **BLOCO 2:** Motor WFC (Semanas 3-4)
- **BLOCO 3:** Compilador de Intenção (Semanas 5-6)
- **BLOCO 4:** Roblox Integration (Semanas 7-8)
- **BLOCO 5-8:** Expansão (Meses 2-3)

---

## ⚙️ BLOCO 1: FUNDAÇÃO (Semanas 1-2)

### O Que Fazer Esta Semana
Transformar pesquisa em código e infraestrutura viva.

### Tarefa 1.1: GitHub Setup
```bash
# No terminal (Antigravity ou local)
mkdir ez-studios && cd ez-studios
git init
git config user.name "Your Name"
git config user.email "your@email.com"

# Criar estrutura de pastas
mkdir -p docs engine platform roblox brand
touch README.md MANIFESTO.md LICENSE

# Primeiro commit
git add .
git commit -m "Initial commit: EZ STUDIOS foundation"
git remote add origin https://github.com/YOUR_ORG/ez-studios-core
git push -u origin main
```

**Status de Conclusão:**
- [ ] Repositório criado no GitHub
- [ ] Pastas base estruturadas
- [ ] Arquivo README preenchido com visão geral
- [ ] Primeiro commit feito

### Tarefa 1.2: Documentação Base
**Arquivo:** `docs/PROTOCOLO_ENTROPIA_ZERO.md`

Copiar o conteúdo do Protocolo v2.0 (já criado anteriormente) para o repo:
```
docs/PROTOCOLO_ENTROPIA_ZERO.md (versão completa)
docs/QUICK_START.md (1 página com essencial)
docs/ARQUITETURA_MOTOR.md (diagramas + pseudocódigo)
docs/PEDAGOGIA.md (trilhas + níveis)
```

**Status de Conclusão:**
- [ ] Protocolo v2.0 no GitHub
- [ ] Quick Start escrito
- [ ] Arquitetura documentada
- [ ] Pedagogia formalizada

### Tarefa 1.3: Design System
**Arquivo:** `brand/DESIGN_SYSTEM.md`

```markdown
# EZ STUDIOS Design System

## Paleta de Cores
- Azul Elétrico: #00D9FF (energia, criatividade)
- Preto Profundo: #0A0E27 (fundo, vazio)
- Verde Neon: #39FF14 (sucesso, ativação)
- Roxo: #9D4EDD (magia, algoritmos)

## Tipografia
- Headings: Inter Bold, 24px+
- Body: Inter Regular, 16px
- Code: Fira Code, 14px

## Componentes Base
- Button (primary, secondary, danger)
- Card (exploração, progresso)
- Modal (confirmação, entrada)
- Badge (recompensa, status)
- Graph (métricas, evolução)

## Logo Variações
- Logo horizontal (site)
- Logo símbolo (favicon)
- Logo vertical (docs)
```

**Status de Conclusão:**
- [ ] Paleta formalizada
- [ ] Tipografia definida
- [ ] Componentes listados
- [ ] Logo assets organizados em `brand/logo/`

### Tarefa 1.4: Roadmap Backlog
**Arquivo:** GitHub Issues (50+ tarefas)

Criar issues com labels:
```
[PRIORIDADE] Muito Alta, Alta, Média, Baixa
[CATEGORIA] Engine, Platform, Roblox, Pedagogy, Business
[SPRINT] Sprint-1, Sprint-2, ... Sprint-16
```

**Primeiras 10 issues:**
1. [ ] WFC: Implementar algoritmo básico 2D
2. [ ] WFC: Testes com 5 tiles diferentes
3. [ ] WFC: Documentação API
4. [ ] Compilador: Especificação formal
5. [ ] Compilador: Frontend drag-and-drop
6. [ ] DataStore: Design Chunking Strategy
7. [ ] Roblox: Plugin scaffold básico
8. [ ] Tests: Setup framework (Jest/Vitest)
9. [ ] Docs: API reference template
10. [ ] CI/CD: GitHub Actions workflow

**Status de Conclusão:**
- [ ] 50+ issues criadas
- [ ] Labels aplicadas
- [ ] Backlog priorizado
- [ ] Você + seu sócio conseguem entender roadmap

---

## 🧬 BLOCO 2: MOTOR WFC (Semanas 3-4)

### O Que Fazer
Implementar o **coração** do motor: Wave Function Collapse com Entropia de Shannon.

### Tarefa 2.1: Especificação Formal
**Arquivo:** `engine/wfc/SPECIFICATION.md`

```markdown
# WFC Specification v1.0

## Entrada
- **Tileset:** Array de 3-15 tipos de blocos (Grass, Road, Water, etc.)
- **Adjacency Matrix:** Matriz 6D booleana (cada tile com seus vizinhos válidos)
- **Weights:** Vetor de probabilidades para cada tile (suma=1 ou normalizável)
- **Grid Size:** (width, height) - 10-5000 blocos

## Processamento
1. Inicializar grade com entropia máxima (todas as possibilidades abertas)
2. Enquanto houver células incógnitas:
   a. Encontrar célula com MENOR entropia (min_H)
   b. Colapsar: escolher tile com prob. ponderada
   c. Propagar restrições (algoritmo AC-3) para vizinhos
3. Se contradição: backtrack ou falha controlada

## Saída
- **Mapa Gerado:** Grid colapsado (1 tile por célula)
- **Tempo:** <5 segundos para 5000 blocos
- **Validade:** Garante adjacências corretas

## Fórmula Entropia Shannon
```
H(i) = log₂(Σwⱼ) - (Σ(wⱼ × log₂(wⱼ)) / Σwⱼ)
```

Onde:
- H(i) = entropia da célula i
- wⱼ = peso do tile j possível naquela célula
- log₂ = logaritmo base 2

## Validação
- Todos os pares adjacentes devem estar na matriz
- Nenhuma célula sem solução possível
- Geração sempre termina em <10s
```

**Status de Conclusão:**
- [ ] Especificação escrita
- [ ] Fórmulas documentadas
- [ ] Exemplos de entrada/saída
- [ ] Critérios de sucesso claros

### Tarefa 2.2: Implementação WFC
**Arquivo:** `engine/wfc/src/wfc.py`

```python
# engine/wfc/src/wfc.py

import numpy as np
from typing import List, Tuple, Dict
import math

class WFCEngine:
    def __init__(self, tileset: List[str], adjacency: np.ndarray, weights: np.ndarray):
        """
        tileset: ["grass", "road", "water", ...]
        adjacency: matriz 6D booleana (neighbors válidos)
        weights: probabilidades de cada tile
        """
        self.tileset = tileset
        self.num_tiles = len(tileset)
        self.adjacency = adjacency
        self.weights = weights / weights.sum()  # normalizar
        
    def entropy(self, possibilities: np.ndarray) -> float:
        """Calcular entropia de Shannon para uma célula"""
        w = self.weights[possibilities]
        if w.sum() == 0:
            return float('inf')
        
        w = w / w.sum()
        log_sum = np.log2(w.sum())
        weighted_logs = np.sum(w * np.log2(w + 1e-10))
        return log_sum - weighted_logs / w.sum()
    
    def generate(self, width: int, height: int) -> np.ndarray:
        """Gerar mapa WFC"""
        # Inicializar: cada célula tem todas as possibilidades
        grid = np.zeros((height, width), dtype=int)
        possibilities = np.ones((height, width, self.num_tiles), dtype=bool)
        
        while np.any(possibilities.sum(axis=2) > 1):
            # Encontrar célula com MENOR entropia (min-entropy heuristic)
            entropies = np.array([
                [self.entropy(possibilities[i, j]) 
                 if possibilities[i, j].sum() > 1 else float('inf')
                 for j in range(width)]
                for i in range(height)
            ])
            
            min_idx = np.unravel_index(np.argmin(entropies), entropies.shape)
            if entropies[min_idx] == float('inf'):
                break  # Todas as células colapsadas
            
            i, j = min_idx
            # Colapsar: escolher tile ponderado
            valid_tiles = np.where(possibilities[i, j])[0]
            valid_weights = self.weights[valid_tiles]
            valid_weights /= valid_weights.sum()
            
            chosen_tile = np.random.choice(valid_tiles, p=valid_weights)
            grid[i, j] = chosen_tile
            
            # Limpar possibilidades (colapso)
            possibilities[i, j] = False
            possibilities[i, j, chosen_tile] = True
            
            # Propagar restrições (AC-3)
            self._propagate(possibilities, grid, i, j)
        
        return grid
    
    def _propagate(self, possibilities, grid, i, j):
        """Propagar restrições após colapso (algoritmo AC-3 simplificado)"""
        # Para cada vizinho
        for di, dj in [(-1,0), (1,0), (0,-1), (0,1)]:
            ni, nj = i + di, j + dj
            if 0 <= ni < grid.shape[0] and 0 <= nj < grid.shape[1]:
                # Remover tiles incompatíveis
                current_tile = grid[i, j]
                for t in range(self.num_tiles):
                    if not self.adjacency[current_tile, t]:
                        possibilities[ni, nj, t] = False

# Teste
if __name__ == "__main__":
    # Setup simples
    tileset = ["grass", "road", "water"]
    weights = np.array([0.5, 0.3, 0.2])
    adjacency = np.array([
        [[True, True, False], [True, True, False], [False, False, True]],
        [[True, True, False], [True, True, False], [False, False, True]],
        [[False, False, True], [False, False, True], [True, True, True]]
    ])
    
    wfc = WFCEngine(tileset, adjacency, weights)
    mapa = wfc.generate(20, 20)
    
    print(f"Mapa gerado: {mapa.shape}")
    print(mapa[:5, :5])  # Preview
```

**Status de Conclusão:**
- [ ] Arquivo `wfc.py` criado
- [ ] Classe WFCEngine funcional
- [ ] Método `entropy()` testado
- [ ] Método `generate()` produzindo mapas válidos
- [ ] Teste rápido executado com sucesso

### Tarefa 2.3: Testes Unitários
**Arquivo:** `engine/wfc/tests/test_wfc.py`

```python
import pytest
import numpy as np
from wfc import WFCEngine

def test_entropy_calculation():
    """Verificar se entropia é calculada corretamente"""
    wfc = WFCEngine(["A", "B", "C"], np.ones((3, 3, 3)), np.array([0.33, 0.33, 0.34]))
    possibilities = np.array([True, True, False])
    h = wfc.entropy(possibilities)
    assert h > 0, "Entropia deve ser positiva"

def test_wfc_generation_5x5():
    """Gerar mapa 5x5 e verificar validade"""
    tileset = ["grass", "road"]
    adjacency = np.ones((2, 2, 2), dtype=bool)
    weights = np.array([0.6, 0.4])
    
    wfc = WFCEngine(tileset, adjacency, weights)
    mapa = wfc.generate(5, 5)
    
    assert mapa.shape == (5, 5)
    assert np.all(mapa >= 0) and np.all(mapa < len(tileset))

def test_wfc_generation_performance():
    """Verificar se 5000 blocos são gerados em <5 segundos"""
    import time
    
    tileset = ["A", "B", "C", "D", "E"]
    adjacency = np.ones((5, 5, 5), dtype=bool)
    weights = np.ones(5) / 5
    
    wfc = WFCEngine(tileset, adjacency, weights)
    
    start = time.time()
    mapa = wfc.generate(100, 50)  # 5000 blocos
    elapsed = time.time() - start
    
    assert elapsed < 5, f"Geração levou {elapsed}s, limite é 5s"
    assert mapa.shape == (50, 100)

if __name__ == "__main__":
    pytest.main([__file__, "-v"])
```

**Status de Conclusão:**
- [ ] 3+ testes escritos
- [ ] Testes passando localmente
- [ ] Coverage >80%

### Tarefa 2.4: Documentação API
**Arquivo:** `engine/wfc/README.md`

```markdown
# WFC Engine - Wave Function Collapse

## Como Usar

### Instalação
```bash
pip install numpy
cd engine/wfc
python -m pytest tests/  # Rodar testes
```

### Exemplo Rápido
```python
from wfc import WFCEngine
import numpy as np

# Setup
tileset = ["grass", "road", "water"]
adjacency = np.random.randint(0, 2, (3, 3, 3))
weights = np.array([0.5, 0.3, 0.2])

# Gerar
wfc = WFCEngine(tileset, adjacency, weights)
mapa = wfc.generate(width=50, height=50)

# Output
print(f"Mapa gerado: {mapa.shape}")
```

## Performance
- 5000 blocos: <5 segundos
- 10000 blocos: <10 segundos
- Memory: ~50MB para 100x100 grid

## Algoritmos
- Entropia de Shannon
- Propagação AC-3 simplificada
- Min-entropy heuristic
```

**Status de Conclusão:**
- [ ] README escrito
- [ ] Exemplos funcionando
- [ ] Performance documentada

---

## 🔧 BLOCO 3: COMPILADOR DE INTENÇÃO (Semanas 5-6)

### O Que Fazer
Criar a **ponte visual** entre criança e código: drag-and-drop regras → código Luau automático.

### Tarefa 3.1: Especificação Formal
**Arquivo:** `engine/intention-compiler/SPECIFICATION.md`

```markdown
# Compilador de Intenção - Especificação v1.0

## Pipeline
```
Visual Rules (drag-and-drop)
    ↓
JSON Config
    ↓
Validação Algébrica
    ↓
Geração Luau
    ↓
Código Otimizado (pronto para Roblox)
```

## Entrada Visual
```json
{
  "tiles": [
    {"id": 0, "name": "Grass", "icon": "grass.png"},
    {"id": 1, "name": "Road", "icon": "road.png"}
  ],
  "rules": [
    {"from": 0, "to": 1, "direction": "right", "allowed": true},
    {"from": 1, "to": 0, "direction": "down", "allowed": true}
  ],
  "weights": [0.7, 0.3]
}
```

## Saída Luau
```lua
local WFC_CONFIG = {
    tileset = {"Grass", "Road"},
    adjacency = {
        {true, true, false},
        {true, true, false},
        {false, false, true}
    },
    weights = {0.7, 0.3}
}
```

## Validação
- Todas as regras formam um grafo válido
- Não há contradições (tile sem vizinhos possíveis)
- Pesos somam a 1
```

**Status de Conclusão:**
- [ ] Especificação escrita
- [ ] Pipeline explicado
- [ ] Exemplos JSON e Luau claros

### Tarefa 3.2: Gerador de Código
**Arquivo:** `engine/intention-compiler/src/compiler.py`

```python
# engine/intention-compiler/src/compiler.py

import json
from typing import Dict, List

class IntentionCompiler:
    def __init__(self, visual_config: Dict):
        """
        visual_config: dict com tiles, rules, weights
        """
        self.tiles = visual_config.get("tiles", [])
        self.rules = visual_config.get("rules", [])
        self.weights = visual_config.get("weights", [])
        self.num_tiles = len(self.tiles)
    
    def _build_adjacency_matrix(self) -> List[List[List[bool]]]:
        """Construir matriz 6D de adjacências"""
        # Simplificado: 4 direções (cima, baixo, esq, dir)
        adjacency = [
            [[False] * self.num_tiles for _ in range(4)]
            for _ in range(self.num_tiles)
        ]
        
        for rule in self.rules:
            from_tile = rule["from"]
            to_tile = rule["to"]
            direction = rule.get("direction", "right")
            allowed = rule.get("allowed", True)
            
            # Mapear direção para índice
            dir_map = {"up": 0, "down": 1, "left": 2, "right": 3}
            dir_idx = dir_map.get(direction, 3)
            
            if allowed:
                adjacency[from_tile][dir_idx][to_tile] = True
        
        return adjacency
    
    def compile_to_luau(self) -> str:
        """Gerar código Luau otimizado"""
        adjacency = self._build_adjacency_matrix()
        
        # Construir strings
        tileset_str = ", ".join([f'"{tile["name"]}"' for tile in self.tiles])
        weights_str = ", ".join([f"{w:.2f}" for w in self.weights])
        
        # Construir matriz (simplificado)
        adj_str = "{ -- Adjacency 6D\n"
        for i in range(self.num_tiles):
            adj_str += f"    {adjacency[i]},\n"
        adj_str += "}"
        
        # Template Luau
        luau_code = f"""local WFCConfig = {{
    tileset = {{ {tileset_str} }},
    adjacency = {adj_str},
    weights = {{ {weights_str} }},
    description = "Compilado via Intention Compiler em {self._timestamp()}"
}}

return WFCConfig
"""
        
        return luau_code
    
    def _timestamp(self) -> str:
        from datetime import datetime
        return datetime.now().isoformat()
    
    def compile_to_json(self) -> str:
        """Exportar como JSON para backend"""
        data = {
            "tiles": self.tiles,
            "rules": self.rules,
            "weights": self.weights,
            "adjacency": self._build_adjacency_matrix()
        }
        return json.dumps(data, indent=2)

# Teste
if __name__ == "__main__":
    config = {
        "tiles": [
            {"id": 0, "name": "Grass"},
            {"id": 1, "name": "Road"}
        ],
        "rules": [
            {"from": 0, "to": 1, "direction": "right", "allowed": True},
            {"from": 1, "to": 0, "direction": "down", "allowed": True}
        ],
        "weights": [0.7, 0.3]
    }
    
    compiler = IntentionCompiler(config)
    print("=== LUAU OUTPUT ===")
    print(compiler.compile_to_luau())
```

**Status de Conclusão:**
- [ ] Classe IntentionCompiler funcional
- [ ] Método `compile_to_luau()` gerando código válido
- [ ] Método `compile_to_json()` exportando dados
- [ ] Teste rápido rodando

### Tarefa 3.3: Frontend Rule Editor (React)
**Arquivo:** `platform/frontend/src/components/RuleEditor.jsx`

```jsx
// platform/frontend/src/components/RuleEditor.jsx

import React, { useState } from 'react';
import './RuleEditor.css';

export function RuleEditor() {
  const [tiles, setTiles] = useState([
    { id: 0, name: 'Grass' },
    { id: 1, name: 'Road' }
  ]);
  
  const [rules, setRules] = useState([]);
  const [selectedFrom, setSelectedFrom] = useState(null);
  const [selectedTo, setSelectedTo] = useState(null);
  
  const addRule = () => {
    if (selectedFrom !== null && selectedTo !== null) {
      setRules([
        ...rules,
        {
          from: selectedFrom,
          to: selectedTo,
          direction: 'right',
          allowed: true
        }
      ]);
      setSelectedFrom(null);
      setSelectedTo(null);
    }
  };
  
  const removeRule = (idx) => {
    setRules(rules.filter((_, i) => i !== idx));
  };
  
  const handleCompile = async () => {
    // Chamar backend para compilar
    const response = await fetch('/api/compile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tiles, rules, weights: [0.7, 0.3] })
    });
    
    const result = await response.json();
    console.log('Luau code:', result.luau_code);
    // Exibir código gerado para usuário
  };
  
  return (
    <div className="rule-editor">
      <h2>Criador de Regras</h2>
      
      <div className="tiles-section">
        <h3>Tiles Disponíveis</h3>
        {tiles.map(tile => (
          <button
            key={tile.id}
            className={selectedFrom === tile.id ? 'selected' : ''}
            onClick={() => setSelectedFrom(tile.id)}
          >
            {tile.name}
          </button>
        ))}
      </div>
      
      <div className="rules-section">
        <h3>Minhas Regras</h3>
        {rules.map((rule, idx) => (
          <div key={idx} className="rule-card">
            <span>
              {tiles[rule.from].name} → {tiles[rule.to].name}
            </span>
            <button onClick={() => removeRule(idx)}>×</button>
          </div>
        ))}
      </div>
      
      <button onClick={addRule} className="btn-primary">
        Adicionar Regra
      </button>
      
      <button onClick={handleCompile} className="btn-success">
        Gerar Código
      </button>
    </div>
  );
}
```

**Status de Conclusão:**
- [ ] Componente React renderizando
- [ ] Drag-and-drop básico funcionando
- [ ] Chamada para backend (mock ou real)
- [ ] Seu sócio consegue criar regras visualmente

---

## 🎮 BLOCO 4: ROBLOX INTEGRATION (Semanas 7-8)

### Tarefa 4.1: Plugin Scaffold
**Arquivo:** `roblox/plugins/WFCGenerator/plugin.lua`

```lua
-- roblox/plugins/WFCGenerator/plugin.lua

local plugin = script.Parent.Parent

local toolbar = plugin:CreateToolbar("EZ STUDIOS")
local generateButton = toolbar:CreateButton(
    "Generate Map",
    "Gera um mapa procedural via WFC",
    "rbxasset://textures/Terrain/Materials/Grass.png"
)

local function onGenerateClicked()
    local selection = game:GetService("Selection"):Get()
    if #selection == 0 then
        warn("Selecione uma pasta ou modelo primeiro")
        return
    end
    
    local parent = selection[1]
    
    -- Chamar API para gerar mapa
    local wfcModule = require(script:WaitForChild("WFCEngine"))
    
    local config = {
        tileset = {"Grass", "Road", "Water"},
        weights = {0.5, 0.3, 0.2},
        width = 50,
        height = 50
    }
    
    local mapa = wfcModule:generate(config)
    
    -- Renderizar no Roblox
    for i, row in ipairs(mapa) do
        for j, tileId in ipairs(row) do
            local part = Instance.new("Part")
            part.Name = config.tileset[tileId]
            part.Size = Vector3.new(1, 1, 1)
            part.Position = Vector3.new(j, 0, i)
            part.Parent = parent
        end
    end
    
    print("Mapa gerado com sucesso!")
end

generateButton.Click:Connect(onGenerateClicked)

-- Cleanup
plugin.Unloading:Connect(function()
    generateButton:Destroy()
    toolbar:Destroy()
end)
```

**Status de Conclusão:**
- [ ] Plugin aparece no Roblox Studio
- [ ] Botão "Generate Map" funciona
- [ ] Gera blocos no workspace

### Tarefa 4.2: Primeira Coorte (20 Beta-Testadores)

Convidar:
- [ ] Seu sócio de 12 anos (teste completo)
- [ ] 5 amigos dele (idades 10-14)
- [ ] 5 colegas seus que entendem game dev
- [ ] 5-9 pais curiosos

**Teste mínimo:** Cada um deve conseguir:
1. Abrir plugin
2. Gerar um mapa em <2 minutos
3. Responder: "Você gostaria de aprender mais?"

---

## 📊 BLOCO 5-8: EXPANSÃO (Meses 2-3)

### Fase 2: LMS Gamificado (Semanas 9-12)
- [ ] Dashboard de progresso
- [ ] Sistema de badges
- [ ] Primeira trilha (Luau Pro) completa
- [ ] 100 alunos pagos

### Fase 3: Marketplace + Trilhas Completas (Semanas 13-20)
- [ ] Upload de UGC funcional
- [ ] 4 trilhas completadas
- [ ] 500 alunos ativos
- [ ] Primeiros Robux sendo gerados

### Fase 4: Escala (Semanas 21-52)
- [ ] Parcerias (Roblox, escolas)
- [ ] Internacionalização
- [ ] 10k alunos ativos
- [ ] Receita >R$ 500k/mês

---

## ✅ CHECKLIST IMEDIATO (PRÓXIMAS 48H)

### Hoje (Hora 0-6)
- [ ] Ler este arquivo completamente
- [ ] Você + seu sócio discutem "Vocês realmente querem fazer isso?"
- [ ] Escolher 1 tile que vocês gostam (Grass, Road, Water, Mountain?)

### Hoje à Noite (Hora 6-12)
- [ ] Criar repositório GitHub
- [ ] Fazer primeiro commit com documentação
- [ ] Seu sócio escolhe o nome completo do estúdio no Roblox

### Amanhã (Hora 12-24)
- [ ] Implementar `wfc.py` básico
- [ ] Seu sócio testa: consegue gerar um mapa?
- [ ] Registrar vídeo de 30s: "Primeiro mapa gerado!"

### Domingo (Hora 24-48)
- [ ] Documentar primeira iteração
- [ ] Criar issue no GitHub para cada tarefa do Bloco 2
- [ ] Enviar repositório para 1 amigo revisar

---

## 🎯 DEFINIÇÃO DE "PRONTO PARA ANTIGRAVITY"

Você tem tudo pronto quando:

- ✅ Repositório GitHub estruturado
- ✅ Documentação base (Protocolo, Arquitetura, Pedagogia)
- ✅ WFC gerando mapas válidos em <5s
- ✅ Compilador convertendo regras visuais em Luau
- ✅ Plugin Roblox funcional
- ✅ Primeira coorte testando (20 pessoas)
- ✅ Roadmap claro com sprints (16 sprints, 8 semanas)
- ✅ Comunicação pronta (logo, pitch, brand)

**Você está aqui agora? Não. Quantas semanas faltam? 8 semanas até MVP.**

---

## 📞 CONTATOS & PRÓXIMAS AÇÕES

### Seu Papel (Você - Engenheiro)
1. Code architect
2. WFC + BSP implementação
3. Backend API
4. DevOps / Antigravity setup

### Papel do Seu Sócio (12 anos)
1. UX validation (ele é o usuário)
2. Design de tiles e temas
3. Feedback em tempo real
4. Teste todas as features primeiro

### Próximo Milestone
**Semana 1 Completa:** Repositório vivo no GitHub com WFC gerando mapas.

---

**EZ STUDIOS. Começando Agora.**

*Data: Janeiro 10, 2026, 18:30 BRT*  
*Tempo até MVP: 8 semanas*  
*Tempo até 1000 alunos: 6-12 meses*  
*Tempo até unicórnio: talvez, talvez não. Mas a história será épica.*