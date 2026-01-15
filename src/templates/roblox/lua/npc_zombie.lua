local npc = script.Parent
local hum = npc:WaitForChild("Humanoid")

while task.wait(0.5) do
    local players = game.Players:GetPlayers()
    for _, p in pairs(players) do
        if p.Character and (p.Character.PrimaryPart.Position - npc.PrimaryPart.Position).Magnitude < {{detectRange}} then
            hum:MoveTo(p.Character.PrimaryPart.Position)
        end
    end
end
