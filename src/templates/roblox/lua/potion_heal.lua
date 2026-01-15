local tool = script.Parent
tool.Activated:Connect(function()
    local char = tool.Parent
    local hum = char:FindFirstChild("Humanoid")
    if hum then
        hum.Health = hum.Health + {{healAmount}}
        print("[EZ] Poção consumida. +{{healAmount}} HP")
        tool:Destroy()
    end
end)
