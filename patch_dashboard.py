import re

path = r'd:\SaaradhiGO WEB\src\app\screens\RiderDashboard.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# ── 1. Upgrade sidebar user card ─────────────────────────────────────────────
old_sidebar = 'padding: 20, marginBottom: 16, textAlign: "center" }}'
new_sidebar = 'padding: 22, marginBottom: 16, textAlign: "center" }} glow="#D4AF37"'

if old_sidebar in content:
    content = content.replace(old_sidebar, new_sidebar, 1)
    print("SIDEBAR: patch 1 applied")
else:
    print("SIDEBAR: patch 1 NOT FOUND")

# Change font-weight 700 to 800 in Arjun Kumar paragraph (sidebar only)
content = content.replace(
    'fontWeight: 700, fontSize: 15, marginBottom: 2 }}>Arjun Kumar</p>',
    'fontWeight: 800, fontSize: 15, marginBottom: 2 }}>Arjun Kumar</p>',
    1
)
print("SIDEBAR: name font-weight patched")

# Add glow border colour tweak to tier badge
content = content.replace(
    'border: "1px solid rgba(212,175,55,0.25)", borderRadius: 999\n                            }}>',
    'border: "1px solid rgba(212,175,55,0.3)", borderRadius: 999,\n                                boxShadow: "0 0 16px rgba(212,175,55,0.12)"\n                            }}>',
    1
)
print("SIDEBAR: badge glow patched")

# ── 2. Upgrade stat cards ─────────────────────────────────────────────────────
# Replace the stat row glow-less GCard with glow version
old_stat = 'padding: 18, transition: "transform 0.2s" }}\n                                        onMouseEnter={(e: any) => e.currentTarget.style.transform = "translateY(-3px)"}\n                                        onMouseLeave={(e: any) => e.currentTarget.style.transform = "none"}>'
new_stat = 'padding: 20 }} glow={s.glow}>'

if old_stat in content:
    content = content.replace(old_stat, new_stat, 1)
    print("STATS: card glow applied")
else:
    print("STATS: old stat card NOT FOUND — trying alternate")
    # Try shorter match
    m = re.search(r'padding: 18, transition: "transform 0\.2s" \}\}[\s\S]{1,200}onMouseLeave=\{.*?\}>', content)
    if m:
        content = content[:m.start()] + 'padding: 20 }} glow={s.glow}>' + content[m.end():]
        print("STATS: card glow applied via regex")
    else:
        print("STATS: FAILED")

# Update stat colors to premium set
content = content.replace(
    '{ icon: "\\U0001f697", label: "Total Rides", value: "48", color: G, sub: "+3 this week" },',
    '{ icon: "\\U0001f697", label: "Total Rides", value: "48", color: G, sub: "+3 this week", glow: "#D4AF37" },',
    1
)
content = content.replace('"#60D080", sub: "Available"', '"#4ade80", sub: "Available", glow: "#4ade80"', 1)
content = content.replace('"#B9F2FF", sub: "Gold Member"', '"#60A5FA", sub: "Gold Member", glow: "#60A5FA"', 1)
content = content.replace('color: G, sub: "out of 5.0"', 'color: G, sub: "out of 5.0", glow: "#D4AF37"', 1)
print("STATS: colors upgraded")

# Replace stat card inner display
old_inner = '''<div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                                        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, marginBottom: 4 }}>{s.label}</p>
                                        <p style={{ color: s.color, fontSize: 24, fontWeight: 800, marginBottom: 2 }}>{s.value}</p>
                                        <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 11 }}>{s.sub}</p>
                                    </GCard>'''
new_inner = '''<div style={{ fontSize: 26, marginBottom: 10, filter: `drop-shadow(0 0 8px ${s.color}55)` }}>{s.icon}</div>
                                        <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 10, fontWeight: 600, letterSpacing: 0.8, marginBottom: 6, textTransform: "uppercase" }}>{s.label}</p>
                                        <p style={{ color: s.color, fontSize: 26, fontWeight: 900, marginBottom: 3, textShadow: `0 0 16px ${s.color}44` }}>{s.value}</p>
                                        <p style={{ color: "rgba(255,255,255,0.22)", fontSize: 10 }}>{s.sub}</p>
                                        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${s.color}55, transparent)`, borderRadius: "0 0 18px 18px" }} />
                                    </GCard>'''
if old_inner in content:
    content = content.replace(old_inner, new_inner, 1)
    print("STATS: inner card display upgraded")
else:
    print("STATS: inner display NOT FOUND")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("DONE: file written")
