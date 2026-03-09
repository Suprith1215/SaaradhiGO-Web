f = open('src/app/screens/CustomerAuthPage.tsx', encoding='utf-8')
lines = f.readlines()
f.close()

# Find and remove the orphaned </span></div> lines right after the {/* Atmospheric Decor */} comment
# Line 279 is the comment, lines 280-282 are </span></div><h1... 
# We need to replace lines 280-282 with the proper role screen header content

# Find the "Atmospheric Decor" comment line
atmo_idx = -1
for i, l in enumerate(lines):
    if 'Atmospheric Decor' in l:
        atmo_idx = i
        break

print(f'Atmospheric Decor at line {atmo_idx + 1}')
print('Next 5 lines:')
for i in range(atmo_idx, atmo_idx + 6):
    print(f'  {i+1}: {repr(lines[i][:80])}')

# The proper role screen header (decorative elements + heading wrapper that was cut)
role_header_replacement = [
    '                {/* Atmospheric Decor */}\n',
    '                <div style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(212,175,55,0.06), transparent 70%)", pointerEvents: "none" }} />\n',
    '\n',
    '                <div style={{ textAlign: "center", marginBottom: 48 }}>\n',
    '                    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 999, padding: "6px 16px", marginBottom: 24, animation: "sfi 0.6s ease backwards" }}>\n',
    '                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: G, display: "inline-block" }} />\n',
    '                        <span style={{ fontSize: 11, color: G, letterSpacing: 1.5, fontWeight: 700 }}>SELECT YOUR ROLE</span>\n',
    '                    </div>\n',
]

# Find the orphaned </span></div> right after atmo comment and skip them
skip_start = atmo_idx + 1
skip_end = skip_start
while skip_end < len(lines) and lines[skip_end].strip() in ['</span>', '</div>']:
    skip_end += 1
print(f'Skipping orphaned lines {skip_start+1} to {skip_end}')

new_lines = lines[:atmo_idx] + role_header_replacement + lines[skip_end:]

f = open('src/app/screens/CustomerAuthPage.tsx', 'w', encoding='utf-8')
f.writelines(new_lines)
f.close()
print(f'Done! Total lines: {len(new_lines)}')
