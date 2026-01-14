# MAPA DE SESSÕES E ROADMAP DO SISTEMA

**PROJETO**: EZ Studios - Protocolo Entropia Zero  
**OBJETIVO**: Mapear o fluxo de experiência do usuário (UX) e o amadurecimento técnico do sistema.

---

## 🗺️ MAPA MENTAL DO ECOSSISTEMA

```mermaid
graph TD
    A[USUÁRIO: Aluno/Criança] --> B{Ponto de Entrada}
    B -->|Grátis| C[Landing Page / Tutorial WFC Demo]
    B -->|Pago| D[Dashboard Principal]

    D --> E[Trilha 1: Luau Pro - Lógica]
    D --> F[Trilha 2: Mundos - PCG]
    D --> G[Trilha 3: Dados - Memória]
    D --> H[Trilha 4: Business - DevEx]

    F --> I[Editor Visual de Regras]
    I -->|Compilação| J[Compilador de Intenção]
    J -->|Criação| K[Código Luau Otimizado]
    K -->|Build| L[Roblox Studio Workspace]

    L --> M[Marketplace UGC]
    M -->|Venda| N[Receita de Robux]
    N -->|DevEx| O[Dinheiro Real]

    subgraph "Core Engine (Matemática Agnóstica)"
        P[Wave Function Collapse]
        Q[Binary Space Partitioning]
        R[Shannon Entropy]
    end

    subgraph "Adaptadores (Específicos)"
        K1[Adaptador Roblox - Luau]
        K2[Adaptador Unity - C#]
        K3[Adaptador Web - Three.js]
    end

    J --> P
    J --> Q
    P --> R
    
    P --> K1
    P --> K2
    P --> K3
    
    K1 --> L1[Roblox Studio]
    K2 --> L2[Unity Engine]
    K3 --> L3[Browser Preview]
```

---

## 📅 ROADMAP DE SESSÕES (JORNADA DO ALUNO)

### Sessão 0: "O Colapso Inicial" (Minuto 0-10)
- **Ação**: Criança escolhe um tema e vê o mundo gerado em 3 segundos.
- **Hook**: "Como esse mundo foi criado? Quer aprender a controlar essa magia?"

### Sessão 1: "O Arquiteto de Regras" (Minuto 10-60)
- **Foco**: Editor Visual (No-code).
- **Tarefa**: Criar um pequeno vilarejo definindo onde "estrada" e "grama" podem se encontrar.
- **Resultado**: Primeiro mapa exportado para Roblox.

### Sessão 2: "Sintonizando a Entropia" (Semana 1)
- **Foco**: Conceitos de WFC e Pesos.
- **Tarefa**: Ajustar a probabilidade de surgir "lagos" ou "castelos".
- **Aprendizado**: Variáveis e pesos algébricos.

### Sessão 3: "Dungeons e Partições" (Semana 2)
- **Foco**: Algoritmo BSP.
- **Tarefa**: Criar uma arena de combate dividida em salas equilibradas.
- **Aprendizado**: Geometria e divisão recursiva de espaço.

### Sessão 4: "Otimização Hacker" (Semana 3)
- **Foco**: Luau Opcodes.
- **Tarefa**: Usar `GETIMPORT` para fazer o mapa construir 2x mais rápido.
- **Aprendizado**: Performance de baixo nível de forma lúdica.

---

## 📈 ROADMAP TÉCNICO (ENTREGA SISTÊMICA)

| Fase | Título | Milestone Técnico | Foco de Negócio |
|------|--------|-------------------|-----------------|
| **V1** | "Spark" | Motor WFC real ligado ao Editor React | Validação do "Momento Uau" |
| **V2** | "Structure" | BSP Funcional + Sistema de Logs de Aluno | Retenção Educacional |
| **V3** | "Economy" | Marketplace Alpha + Exportação Automática | Ciclo de Monetização |
| **V4** | "Scale" | Suporte a 10.000+ partes via Chunking | Expansão B2B (Escolas) |

---

## ⚡ FLUXO DE "LIGAÇÃO DOS FIOS" (PRÓXIMOS PASSOS)

1. **INPUT**: `Editor.tsx` (Lista de Tiles e Regras)
2. **MIDDLE**: `intentCompiler.ts` (Recebe JSON do Editor e executa cálculos)
3. **CALC**: `wfc.ts` (Gera a matriz de tiles final)
4. **OUTPUT**: `educationalApi.ts` (Retorna o Código Luau para o aluno baixar)
