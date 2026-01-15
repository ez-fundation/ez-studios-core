import os
import requests
import random
from datetime import datetime

# ==============================================================================
# 🧬 CONFIGURATION: THE GENETIC CODE
# ==============================================================================
USERNAME = "SH1W4" 
THEME_COLORS = {
    "HEALTHY": "#00ff41",  # High activity
    "MUTATING": "#bd93f9", # Moderate activity
    "DORMANT": "#ff5555",  # Low activity
    "VOID": "#0d1117"      # Background
}

# ==============================================================================
# 🧪 MOCK DATA (In production, this would fetch from GitHub GraphQL API)
# ==============================================================================
# Simulate recent activity for demonstration
# In a real scenario, you'd use os.environ["GITHUB_TOKEN"] to query the API.
activity_level = random.choice(["HIGH", "MEDIUM", "LOW"])
commit_count = random.randint(5, 50)
top_language = random.choice(["Python", "Rust", "TypeScript"])

# Logic to determine organism state
if activity_level == "HIGH":
    status_text = "HYPER-EVOLUTION"
    core_color = THEME_COLORS["HEALTHY"]
    pulse_rate = "0.5s"
elif activity_level == "MEDIUM":
    status_text = "STEADY_GROWTH"
    core_color = THEME_COLORS["MUTATING"]
    pulse_rate = "1.5s"
else:
    status_text = "HIBERNATION"
    core_color = THEME_COLORS["DORMANT"]
    pulse_rate = "4s"

# ==============================================================================
# 🎨 SVG GENERATION ENGINE
# ==============================================================================
def generate_svg():
    svg_content = f"""
    <svg width="400" height="200" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <style>
            /* @import removed for GitHub compatibility */
            .text {{ font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace; fill: #e6e6e6; }}
            .label {{ font-size: 10px; opacity: 0.7; }}
            .value {{ font-size: 14px; font-weight: bold; }}
            
            @keyframes pulse {{
                0% {{ opacity: 0.6; filter: drop-shadow(0 0 2px {core_color}); }}
                50% {{ opacity: 1; filter: drop-shadow(0 0 8px {core_color}); }}
                100% {{ opacity: 0.6; filter: drop-shadow(0 0 2px {core_color}); }}
            }}
            
            @keyframes rotate {{
                from {{ transform: rotate(0deg); transform-origin: center; }}
                to {{ transform: rotate(360deg); transform-origin: center; }}
            }}

            .core {{
                animation: pulse {pulse_rate} infinite ease-in-out;
                fill: {core_color};
            }}
            
            .orbit {{
                animation: rotate 10s linear infinite;
                transform-box: fill-box;
            }}
        </style>

        <!-- BACKGROUND MODULE -->
        <rect width="400" height="200" rx="10" fill="{THEME_COLORS['VOID']}" stroke="#21262d" />
        
        <!-- HEADER -->
        <text x="20" y="30" class="text label">ORGANISM_ID: {USERNAME}</text>
        <rect x="300" y="20" width="80" height="12" rx="2" fill="{core_color}" fill-opacity="0.2"/>
        <text x="340" y="29" class="text" font-size="8" text-anchor="middle" fill="{core_color}">{status_text}</text>

        <!-- CENTRAL BIO-CORE (The "Heart") -->
        <g transform="translate(50, 70)">
            <!-- Outer Ring -->
            <circle cx="40" cy="40" r="35" stroke="#30363d" stroke-width="2" class="orbit" stroke-dasharray="10 5" />
            
            <!-- Inner Glowing Core (Changes color based on activity) -->
            <circle cx="40" cy="40" r="15" class="core" />
            
            <!-- Connecting Data Lines -->
            <path d="M75 40 L120 40" stroke="#30363d" stroke-width="2"/>
            <path d="M120 40 L140 20" stroke="#30363d" stroke-width="2"/>
            <path d="M120 40 L140 60" stroke="#30363d" stroke-width="2"/>
        </g>

        <!-- DATA READOUTS -->
        <g transform="translate(150, 60)">
            <rect x="0" y="0" width="2" height="60" fill="#30363d"/>
            
            <!-- Statistic 1: Recent Commits -->
            <g transform="translate(15, 0)">
                <text y="10" class="text label">RECENT_MUTATIONS (Commits)</text>
                <text y="28" class="text value" fill="{core_color}">{commit_count} sequences</text>
            </g>
            
            <!-- Statistic 2: Top Language -->
            <g transform="translate(15, 50)">
                <text y="10" class="text label">DOMINANT_STRAIN (Lang)</text>
                <text y="28" class="text value" fill="#ffffff">> {top_language}</text>
            </g>
        </g>

        <!-- TIMESTAMP FOOTER -->
        <path d="M0 160 L400 160" stroke="#21262d" stroke-width="1"/>
        <text x="20" y="185" class="text label">LAST_SCAN: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} UTC</text>
        <text x="350" y="185" class="text label" text-anchor="end">SYS_VER: 2.0.4</text>
    </svg>
    """
    return svg_content

# ==============================================================================
# 💾 SAVE OUTPUT
# ==============================================================================
if __name__ == "__main__":
    svg = generate_svg()
    # Save locally to test
    with open("biostats.svg", "w", encoding='utf-8') as f:
        f.write(svg)
    print("✅ Bio-Stats Generated successfully: biostats.svg")
