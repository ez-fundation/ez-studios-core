local tool = script.Parent
local stats = tool:WaitForChild("Attributes")
local damage = stats:FindFirstChild("dano") and stats.dano.Value or {{damage}}

tool.Activated:Connect(function()
    print("[EZ] Espada de Fogo ativada!")
    local anim = Instance.new("Animation")
    anim.AnimationId = "rbxassetid://0" -- Placeholder
    local track = tool.Parent:FindFirstChild("Humanoid"):LoadAnimation(anim)
    track:Play()
    
    -- Partículas de Fogo
    local fire = Instance.new("Fire", tool.Handle)
    task.wait(1)
    fire:Destroy()
end)
