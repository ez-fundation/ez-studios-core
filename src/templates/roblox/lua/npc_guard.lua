local npc = script.Parent
local hum = npc:WaitForChild("Humanoid")
local root = npc:WaitForChild("HumanoidRootPart")

while true do
    task.wait(math.random(2,5))
    local target = Vector3.new(math.random(-10,10), 0, math.random(-10,10)) + root.Position
    hum:MoveTo(target)
end
