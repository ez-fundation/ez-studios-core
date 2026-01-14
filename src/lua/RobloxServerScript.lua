-- RobloxServerScript.lua
-- Script de servidor para Roblox que constrói mapas gerados
-- Coloque este script em ServerScriptService

local MapaModule = require(game.ServerScriptService:WaitForChild("RobloxMapaModule"))

-- Configuração
local CONFIG = {
  baseFolderName = "GeneratedMaps",
  maxParts = 5000,
  tileSize = 1,
}

-- Função para carregar mapa do JSON (simulando recebimento do motor)
local function carregarMapaDoMotor(mapaJson)
  local mapa = MapaModule.FromJSON(mapaJson)
  return mapa
end

-- Função para construir mapa no workspace
local function construirMapa(mapaJson)
  print("[MapaBuilder] Iniciando construção de mapa...")

  local mapa = carregarMapaDoMotor(mapaJson)
  local stats = MapaModule.GetMapStats(mapa)

  print(string.format(
    "[MapaBuilder] Mapa ID: %s, Seed: %s",
    stats.id,
    stats.seed
  ))

  -- Limpar mapas anteriores
  MapaModule.ClearGeneratedMaps(workspace, CONFIG.baseFolderName)

  -- Construir novo mapa
  local resultado = MapaModule.BuildFromMapa(workspace, mapa, {
    baseFolderName = CONFIG.baseFolderName,
    maxParts = CONFIG.maxParts,
    tileSize = CONFIG.tileSize,
  })

  if resultado.success then
    print(string.format(
      "[MapaBuilder] ✓ %s",
      resultado.message
    ))
  else
    warn("[MapaBuilder] ✗ Erro ao construir mapa")
  end

  return resultado
end

-- Função para testar com mapa de exemplo
local function testarComMapaExemplo()
  print("[MapaBuilder] Testando com mapa de exemplo...")

  -- Exemplo de mapa JSON (simplificado)
  local mapaExemploJson = [[
{
  "id": "mapa_teste_001",
  "seed": "seed_123",
  "dimensoes": {
    "largura": 20,
    "altura": 20
  },
  "setores": [
    {
      "id": "setor_1",
      "bounds": {
        "x": 0,
        "y": 0,
        "largura": 10,
        "altura": 10
      },
      "tipo": "spawn"
    },
    {
      "id": "setor_2",
      "bounds": {
        "x": 10,
        "y": 10,
        "largura": 10,
        "altura": 10
      },
      "tipo": "boss"
    }
  ],
  "tiles": [
    {"tileId": "chao", "x": 0, "y": 0},
    {"tileId": "chao", "x": 1, "y": 0},
    {"tileId": "parede", "x": 2, "y": 0},
    {"tileId": "chao", "x": 0, "y": 1},
    {"tileId": "porta", "x": 5, "y": 5},
    {"tileId": "chao", "x": 10, "y": 10},
    {"tileId": "chao", "x": 11, "y": 10},
    {"tileId": "boss", "x": 15, "y": 15}
  ],
  "metadados": {
    "criadoEm": "2026-01-10T20:10:00Z",
    "stats": {
      "numSetores": 2,
      "numTiles": 8,
      "densidade": 0.2,
      "tempoGeracaoMs": 245
    }
  }
}
  ]]

  local resultado = construirMapa(mapaExemploJson)
  return resultado
end

-- Função para receber mapa via RemoteFunction
local function criarRemoteFunction()
  local remoteFunction = Instance.new("RemoteFunction")
  remoteFunction.Name = "BuildMapaRemote"
  remoteFunction.Parent = game.ServerScriptService

  function remoteFunction.OnServerInvoke(player, mapaJson)
    print(string.format("[MapaBuilder] Recebido pedido de %s", player.Name))
    return construirMapa(mapaJson)
  end

  return remoteFunction
end

-- Inicialização
print("[MapaBuilder] Iniciando servidor de construção de mapas...")

-- Criar RemoteFunction para clientes
criarRemoteFunction()

-- Testar com mapa de exemplo após 2 segundos
task.wait(2)
testarComMapaExemplo()

print("[MapaBuilder] Servidor pronto. Aguardando pedidos...")
