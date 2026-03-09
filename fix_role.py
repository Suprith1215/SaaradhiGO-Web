f = open('src/app/screens/CustomerAuthPage.tsx', encoding='utf-8')
lines = f.readlines()
f.close()

# The intro section closes at line 264 (1-indexed) = 263 (0-indexed): "        );"
# We need to insert the role section header right after line 264 (index 264)
# Then the existing content at line 265+ is the inner JSX of the role screen,
# but it's missing the outer wrapper div.

# Find the insertion point: right after "        );\n" that closes the intro
insert_after = -1
for i in range(260, 270):
    if lines[i].strip() == ');':
        insert_after = i
        print(f'Found ); at line {i+1}')
        break

if insert_after == -1:
    print('Could not find insertion point')
    exit(1)

# The role section opener that was lost
role_opener = '''
    /* ══════════════════════════════════════
         2. ROLE SELECTION — Professional Redesign
       ══════════════════════════════════════ */
    if (screen === "role")
        return (
            <div
                style={{
                    ...WRAP,
                    justifyContent: "center",
                    background:
                        "radial-gradient(circle at 50% 50%, #0a1a35 0%, #050D1A 100%)",
                }}
            >
                {/* Atmospheric Decor */}
'''

# Insert after the ");
new_lines = lines[:insert_after + 1] + [role_opener] + lines[insert_after + 1:]

f = open('src/app/screens/CustomerAuthPage.tsx', 'w', encoding='utf-8')
f.writelines(new_lines)
f.close()
print(f'Done! Inserted role opener after line {insert_after + 1}')
print('New total lines:', len(new_lines))
