import { motion } from "framer-motion";
import { Plus, Trash2, Download, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useState } from "react";
import { compilarIntencao } from "../compiler/intentCompiler";
import { RobloxAdapter } from "../adapters/robloxAdapter";
import { ThreeJsAdapter } from "../adapters/threejsAdapter";
import { Tile as EngineTile, Intencao, Regra as EngineRegra } from "../core/models/types";
import { globalLogger } from "../infra/logging/logger";

interface Tile {
  id: string;
  nome: string;
  cor: string;
}

interface Regra {
  id: string;
  tile1: string;
  tile2: string;
  adjacencia: "horizontal" | "vertical" | "ambos";
}

export default function Editor() {
  const [, navigate] = useLocation();
  const [tiles, setTiles] = useState<Tile[]>([
    { id: "chao", nome: "Grama", cor: "#00D9FF" },
    { id: "parede", nome: "Muro", cor: "#4A4A4A" },
    { id: "agua", nome: "Água", cor: "#FF006E" },
  ]);

  const [regras, setRegras] = useState<Regra[]>([
    { id: "r1", tile1: "chao", tile2: "chao", adjacencia: "ambos" },
    { id: "r2", tile1: "chao", tile2: "parede", adjacencia: "ambos" },
  ]);

  const [novoTile, setNovoTile] = useState("");
  const [gerando, setGerando] = useState(false);
  const [mapaPreview, setMapaPreview] = useState<any[]>([]);

  const robloxAdapter = new RobloxAdapter();
  const threeAdapter = new ThreeJsAdapter();

  const adicionarTile = () => {
    if (novoTile.trim()) {
      const id = novoTile.toLowerCase().replace(/\s+/g, "_");
      setTiles([
        ...tiles,
        {
          id,
          nome: novoTile,
          cor: `hsl(${Math.random() * 360}, 100%, 50%)`,
        },
      ]);
      setNovoTile("");
    }
  };

  const removerTile = (id: string) => {
    setTiles(tiles.filter((t) => t.id !== id));
    setRegras(regras.filter((r) => r.tile1 !== id && r.tile2 !== id));
  };

  const gerar = async () => {
    setGerando(true);
    try {
      // 1. Converter estados da UI para formato do Motor
      const engineTiles: EngineTile[] = tiles.map((t: Tile) => {
        const conexoes: any[] = [];

        // Mapear regras de adjacência
        regras.filter((r: Regra) => r.tile1 === t.id || r.tile2 === t.id).forEach((r: Regra) => {
          const compatible = r.tile1 === t.id ? r.tile2 : r.tile1;
          const dirs: ("norte" | "sul" | "leste" | "oeste")[] = [];
          if (r.adjacencia === "horizontal" || r.adjacencia === "ambos") dirs.push("leste", "oeste");
          if (r.adjacencia === "vertical" || r.adjacencia === "ambos") dirs.push("norte", "sul");

          dirs.forEach((d: "norte" | "sul" | "leste" | "oeste") => {
            const existing = conexoes.find((c: any) => c.direcao === d);
            if (existing) {
              if (!existing.tilesCompatíveis.includes(compatible)) {
                existing.tilesCompatíveis.push(compatible);
              }
            } else {
              conexoes.push({ direcao: d, tilesCompatíveis: [compatible] });
            }
          });
        });

        return {
          id: t.id,
          tipo: t.nome.toLowerCase(),
          tags: [],
          conexoesPermitidas: conexoes,
          peso: 1
        };
      });

      const intencao: Intencao = {
        id: "ui_intent_" + Date.now(),
        categoria: "Mapa",
        descricaoNatural: "Mapa gerado via UI Editor",
        parametros: { largura: 8, altura: 8, quantidadeAreas: 1 }
      };

      // 2. Executar Motor com Adaptador de Preview (ThreeJS)
      const startTime = Date.now();
      const resultado = compilarIntencao(intencao, engineTiles, threeAdapter);
      const data = JSON.parse(resultado.codigoGerado);

      setMapaPreview(data.tiles);

      // 3. Registrar Sucesso no Logger
      globalLogger.registrarSucesso(
        intencao.id,
        intencao.categoria,
        "seed_" + Date.now(),
        threeAdapter.engineName,
        { numSetores: 1, numTiles: data.tiles.length },
        Date.now() - startTime
      );
    } catch (error: any) {
      console.error("Erro na geração:", error);
      alert("Contradição de Entropia! Suas regras impedem o colapso do mapa.");

      // Registrar Erro no Logger
      globalLogger.registrarErro(
        "ui_intent_" + Date.now(),
        "Mapa",
        "0",
        threeAdapter.engineName,
        "Contradiction",
        error.message || "Unknown error"
      );
    } finally {
      setGerando(false);
    }
  };

  const exportarRoblox = () => {
    try {
      // Re-gerar usando o adaptador Roblox
      const engineTiles: EngineTile[] = tiles.map((t: Tile) => ({
        id: t.id,
        tipo: t.nome.toLowerCase(),
        tags: [],
        conexoesPermitidas: [],
        peso: 1
      }));

      const intencao: Intencao = {
        id: "export_intent_" + Date.now(),
        categoria: "Mapa",
        descricaoNatural: "Exportação para Roblox",
        parametros: { largura: 16, altura: 16 }
      };

      const resultado = compilarIntencao(intencao, engineTiles, robloxAdapter);

      // Download do arquivo .lua
      const blob = new Blob([resultado.codigoGerado], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `EZ_Map_${Date.now()}.lua`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert("Erro ao exportar: " + e);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-primary/20 backdrop-blur-md bg-background/50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div
            className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent cursor-pointer"
            onClick={() => navigate("/")}
          >
            EZ STUDIOS
          </motion.div>
          <nav className="flex gap-2 md:gap-4 text-sm md:text-base">
            <Button
              variant="ghost"
              onClick={() => navigate("/dashboard")}
              className="text-text-secondary hover:text-primary"
            >
              Dashboard
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate("/editor")}
              className="text-primary"
            >
              Editor
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate("/marketplace")}
              className="text-text-secondary hover:text-primary"
            >
              Marketplace
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-12">Visual Rule Editor</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Panel - Tiles */}
          <motion.div
            className="md:col-span-1 p-8 rounded-2xl bg-surface border border-primary/20 backdrop-blur-xl h-fit"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-xl font-bold mb-6">Tiles</h2>

            {/* Add Tile */}
            <div className="mb-6 flex gap-2">
              <input
                type="text"
                value={novoTile}
                onChange={(e) => setNovoTile(e.target.value)}
                placeholder="Nome do tile..."
                className="flex-1 px-3 py-2 bg-white/10 border border-primary/30 rounded-lg text-foreground placeholder-text-secondary focus:outline-none focus:border-primary"
                onKeyPress={(e) => e.key === "Enter" && adicionarTile()}
              />
              <Button
                onClick={adicionarTile}
                className="bg-primary hover:bg-primary/80 text-background"
              >
                <Plus size={16} />
              </Button>
            </div>

            {/* Tiles List */}
            <div className="space-y-3">
              {tiles.map((tile, i) => (
                <motion.div
                  key={tile.id}
                  className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-primary/50 transition-all group"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-6 h-6 rounded"
                        style={{ backgroundColor: tile.cor }}
                      />
                      <span className="font-medium">{tile.nome}</span>
                    </div>
                    <button
                      onClick={() => removerTile(tile.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Center Panel - Canvas */}
          <motion.div
            className="md:col-span-1 p-8 rounded-2xl bg-surface border border-primary/20 backdrop-blur-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h2 className="text-xl font-bold mb-6">Preview WFC Real</h2>

            {/* Canvas */}
            <div className="w-full aspect-square bg-white/5 border border-primary/30 rounded-lg mb-6 flex items-center justify-center overflow-hidden">
              <div className="grid grid-cols-8 gap-1 p-4">
                {mapaPreview.length > 0 ? (
                  mapaPreview.map((cell, i) => (
                    <motion.div
                      key={i}
                      className="w-8 h-8 rounded-sm"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.005 }}
                      style={{ backgroundColor: cell.color }}
                    />
                  ))
                ) : (
                  <div className="text-text-secondary text-sm text-center">
                    Defina regras e clique em <br /><strong>Gerar Mapa</strong>
                  </div>
                )}
              </div>
            </div>

            {/* Generate Button */}
            <Button
              onClick={gerar}
              disabled={gerando}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-background font-bold py-6 flex items-center justify-center gap-2"
            >
              {gerando ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Play size={20} />
                  </motion.div>
                  Colapsando...
                </>
              ) : (
                <>
                  <Play size={20} />
                  Gerar Mapa Real
                </>
              )}
            </Button>
          </motion.div>

          {/* Right Panel - Regras */}
          <motion.div
            className="md:col-span-1 p-8 rounded-2xl bg-surface border border-primary/20 backdrop-blur-xl h-fit"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-xl font-bold mb-6">Regras de Adjacência</h2>

            <div className="space-y-3 mb-6">
              {regras.map((regra, i) => {
                const tile1 = tiles.find((t) => t.id === regra.tile1);
                const tile2 = tiles.find((t) => t.id === regra.tile2);

                return (
                  <motion.div
                    key={regra.id}
                    className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-primary/50 transition-all group"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {tile1 && (
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: tile1.cor }}
                          />
                        )}
                        <span className="text-sm">{tile1?.nome}</span>
                        <span className="text-xs text-text-secondary">↔</span>
                        {tile2 && (
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: tile2.cor }}
                          />
                        )}
                        <span className="text-sm">{tile2?.nome}</span>
                      </div>
                      <button
                        onClick={() =>
                          setRegras(regras.filter((r) => r.id !== regra.id))
                        }
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded">
                      {regra.adjacencia}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            {/* Export */}
            <Button
              onClick={exportarRoblox}
              className="w-full bg-accent hover:bg-accent/80 text-background font-bold py-4 flex items-center justify-center gap-2"
            >
              <Download size={16} />
              Baixar .LUA (Roblox)
            </Button>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
