-- RobloxMapaModule.lua
-- Módulo Roblox para desserializar e construir mapas gerados
-- Uso: local MapaModule = require(path.to.RobloxMapaModule)

local MapaModule = {}

-- Função para desserializar JSON (usa HttpService)
function MapaModule.FromJSON(json)
  local httpService = game:GetService("HttpService")
  local success, result = pcall(function()
    return httpService:JSONDecode(json)
  end)

  if not success then
    error("Erro ao desserializar mapa JSON: " .. tostring(result))
  end

  return result
end

-- Função para construir mapa no Workspace
-- Parâmetros:
--   workspace: Instance do Workspace (ou pasta onde construir)
--   mapa: Tabela desserializada do JSON
--   options: Tabela com configurações opcionais
--     - baseFolderName: Nome da pasta raiz (default: "GeneratedMaps")
--     - maxParts: Limite máximo de partes (default: 5000)
--     - tileSize: Tamanho de cada tile em studs (default: 1)
--     - colorScheme: Esquema de cores por tipo de tile
function MapaModule.BuildFromMapa(workspace, mapa, options)
  options = options or {}
  local baseFolderName = options.baseFolderName or "GeneratedMaps"
  local maxParts = options.maxParts or 5000
  local tileSize = options.tileSize or 1

  -- Esquema de cores padrão
  local colorScheme = options.colorScheme or {
    chao = BrickColor.new("Medium stone grey"),
    parede = BrickColor.new("Dark stone grey"),
    porta = BrickColor.new("Bright orange"),
    spawn = BrickColor.new("Bright green"),
    boss = BrickColor.new("Bright red"),
    loja = BrickColor.new("Bright yellow"),
  }

  -- Validar mapa
  if not mapa or not mapa.tiles or not mapa.setores then
    error("Mapa inválido: faltam campos obrigatórios")
  end

  -- Criar pasta raiz
  local baseFolder = Instance.new("Folder")
  baseFolder.Name = baseFolderName
  baseFolder.Parent = workspace

  local partCount = 0
  local setorCount = 0

  -- Criar setores (pastas organizadas)
  local setoresMap = {}
  for _, setor in ipairs(mapa.setores or {}) do
    local setorFolder = Instance.new("Folder")
    setorFolder.Name = "Setor_" .. (setor.id or tostring(setorCount))
    setorFolder.Parent = baseFolder

    -- Criar visualização de bounds do setor
    local boundsPart = Instance.new("Part")
    boundsPart.Name = "SetorBounds_" .. setor.tipo
    boundsPart.Shape = Enum.PartType.Block
    boundsPart.Size = Vector3.new(
      setor.bounds.largura * tileSize,
      0.1,
      setor.bounds.altura * tileSize
    )
    boundsPart.Position = Vector3.new(
      (setor.bounds.x + setor.bounds.largura / 2) * tileSize,
      0.05,
      (setor.bounds.y + setor.bounds.altura / 2) * tileSize
    )
    boundsPart.CanCollide = false
    boundsPart.Transparency = 0.7
    boundsPart.BrickColor = BrickColor.new("Dark stone grey")
    boundsPart.Parent = setorFolder

    setoresMap[setor.id] = setorFolder
    setorCount = setorCount + 1
  end

  -- Criar tiles
  local tilesFolder = Instance.new("Folder")
  tilesFolder.Name = "Tiles"
  tilesFolder.Parent = baseFolder

  for _, tile in ipairs(mapa.tiles or {}) do
    if partCount >= maxParts then
      warn("Limite de partes atingido: " .. maxParts .. ". Alguns tiles não foram criados.")
      break
    end

    local tilePart = Instance.new("Part")
    tilePart.Name = "Tile_" .. (tile.tileId or "unknown")
    tilePart.Shape = Enum.PartType.Block
    tilePart.Size = Vector3.new(tileSize, tileSize, tileSize)
    tilePart.Position = Vector3.new(
      (tile.x + 0.5) * tileSize,
      tileSize / 2,
      (tile.y + 0.5) * tileSize
    )

    -- Aplicar cor baseado no tipo de tile
    local tileType = tile.tileId or "chao"
    if string.find(tileType, "parede") then
      tilePart.BrickColor = colorScheme.parede or BrickColor.new("Dark stone grey")
    elseif string.find(tileType, "porta") then
      tilePart.BrickColor = colorScheme.porta or BrickColor.new("Bright orange")
    elseif string.find(tileType, "spawn") then
      tilePart.BrickColor = colorScheme.spawn or BrickColor.new("Bright green")
    elseif string.find(tileType, "boss") then
      tilePart.BrickColor = colorScheme.boss or BrickColor.new("Bright red")
    elseif string.find(tileType, "loja") then
      tilePart.BrickColor = colorScheme.loja or BrickColor.new("Bright yellow")
    else
      tilePart.BrickColor = colorScheme.chao or BrickColor.new("Medium stone grey")
    end

    tilePart.TopSurface = Enum.SurfaceType.Smooth
    tilePart.BottomSurface = Enum.SurfaceType.Smooth
    tilePart.Parent = tilesFolder

    partCount = partCount + 1
  end

  -- Retornar estatísticas
  return {
    success = true,
    partCount = partCount,
    setorCount = setorCount,
    mapaId = mapa.id,
    seed = mapa.seed,
    message = string.format(
      "Mapa construído com sucesso: %d setores, %d tiles",
      setorCount,
      partCount
    ),
  }
end

-- Função para limpar mapas gerados
function MapaModule.ClearGeneratedMaps(workspace, baseFolderName)
  baseFolderName = baseFolderName or "GeneratedMaps"
  local baseFolder = workspace:FindFirstChild(baseFolderName)

  if baseFolder then
    baseFolder:Destroy()
    return true
  end

  return false
end

-- Função para obter estatísticas do mapa
function MapaModule.GetMapStats(mapa)
  if not mapa then
    return nil
  end

  return {
    id = mapa.id,
    seed = mapa.seed,
    dimensoes = mapa.dimensoes,
    numSetores = #(mapa.setores or {}),
    numTiles = #(mapa.tiles or {}),
    stats = mapa.metadados and mapa.metadados.stats,
  }
end

return MapaModule
