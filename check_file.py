f = open('src/app/screens/CustomerAuthPage.tsx', encoding='utf-8')
c = f.read()
f.close()

idx = c.find('ROLE SELECTION')
if idx >= 0:
    print('ROLE at line:', c[:idx].count('\n') + 1)
else:
    print('ROLE not found')

idx2 = c.find('INTRO SPLASH')
if idx2 >= 0:
    print('INTRO at line:', c[:idx2].count('\n') + 1)
else:
    print('INTRO not found')

# show current lines 262-270
lines = c.split('\n')
for i, l in enumerate(lines[260:272], 261):
    print(f'{i}: {l[:100]}')
