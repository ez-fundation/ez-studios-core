# MATRIZ DE OTIMIZAÇÃO POR ENGINE (ADAPTADORES)

**DOCUMENTO**: Guia de Elite para Performance Multi-plataforma  
**VERSÃO**: 1.0  
**CONTEXTO**: Protocolo Entropia Zero

---

## 🎯 Filosofia de Domínio
O motor EZ Studios opera sob o princípio da **Eficiência Nativa**. O Core Agnóstico resolve o problema matemático (Entropia), enquanto cada Adaptador aproveita os "segredos de performance" de sua respectiva engine.

---

## 🛠️ Matriz de Performance

| Recurso | Roblox (Luau) | Unity (C#) | Godot (GDScript) | Portabilidade (Web/Three.js) |
| :--- | :--- | :--- | :--- | :--- |
| **Execução Core** | Injeção de `GETIMPORT` e `DUPCLOSURE` | **Unsafe Code** e **Memory Pointers** | **Typed GDScript** (Static) | WebAssembly (WASM) |
| **Instanciação** | **Batching de 100 tiles** com `task.wait` | **Instancing / GPU Batching** | **MultiMeshInstance** | Instanced Mesh |
| **Memória** | **Chunking BSP** (DS Keys < 4MB) | **Addressables** e **Asset Bundles** | **Resource Preloader** | IndexedDB / LocalStorage |
| **Dicionário** | Tabelas de Hash Luau Otimizadas | **Dictionary<T>** com IEqualityComparer | **Dictionary** com keys tipadas | `Map` nativo do V8 |
| **Threading** | `task.spawn` / Parallel Luau | **C# Jobs System** / Burst | **WorkerThreadPool** | Web Workers |

---

## 🔍 Detalhamento por "Setor de Domínio"

### 1. Setor ROBLOX (Luau Pro)
**Estratégia**: *Zero-Redundancy Execution.*
- **Opcodes Otimizados**: O adaptador remove buscas globais repetitivas usando variáveis locais para todos os métodos do `math`, `Vector3` e `CFrame`.
- **Throttling Inteligente**: Evita o "lag spike" de construção distribuindo a carga de criação no `Heartbeat` da engine.

### 2. Setor UNITY (C# Engineered)
**Estratégia**: *Deterministic Job-Chain.*
- **Burst Compiler**: O adaptador gera código compatível com o Burst para que o WFC rode em velocidade de C++ nativo.
- **ECS (Entity Component System)**: Uso de `Entities` para mundos procedurais de 100.000+ partes sem queda de FPS.

### 3. Setor GODOT (Native Scripting)
**Estratégia**: *Resource-Aware Generation.*
- **C++ Extensions**: No nível 5 (Fundador), o adaptador pode gerar `GDNative` para máxima velocidade.
- **Signals Otimizados**: Uso mínimo de threads para não bloquear a main loop da UI.

---

## 📈 Conclusão do Domínio
Ao centralizar a matemática em TypeScript e delegar a eficiência para Adaptadores dedicados, garantimos que qualquer jogo gerado pela EZ Studios seja, por definição, **o software mais rápido rodando naquela engine**.

Este documento formaliza que temos o conhecimento técnico para dominar o mercado de games através de uma engenharia superior, mantendo o **Core Agnóstico** protegido e valioso.
