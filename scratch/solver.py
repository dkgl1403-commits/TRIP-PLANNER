from collections import deque

level = [
    "  ####   ",
    "###  ####",
    "#     $ #",
    "# #  #$ #",
    "# . .#@ #",
    "#########"
]

grid = [list(r) for r in level]
R = len(grid)
C = len(grid[0])

targets = set()
boxes = set()
player = None

for r in range(R):
    for c in range(C):
        if grid[r][c] in ['.', '*', '+']:
            targets.add((r, c))
        if grid[r][c] in ['$', '*']:
            boxes.add((r, c))
        if grid[r][c] in ['@', '+']:
            player = (r, c)
        if grid[r][c] in ['*', '+']:
            grid[r][c] = '.' if grid[r][c] == '+' else ' '

def get_state(p, b):
    return (p, tuple(sorted(list(b))))

start_state = get_state(player, boxes)
queue = deque([(start_state, "")])
visited = set([start_state])

dirs = { 'U': (-1, 0), 'D': (1, 0), 'L': (0, -1), 'R': (0, 1) }

while queue:
    (p, b), path = queue.popleft()
    
    if set(b) == targets:
        print("SOLUTION FOUND:", path)
        break
        
    for dname, (dr, dc) in dirs.items():
        nr, nc = p[0] + dr, p[1] + dc
        if grid[nr][nc] == '#': continue
        
        new_b = set(b)
        if (nr, nc) in new_b:
            br, bc = nr + dr, nc + dc
            if grid[br][bc] == '#' or (br, bc) in new_b:
                continue
            new_b.remove((nr, nc))
            new_b.add((br, bc))
            
        new_state = get_state((nr, nc), new_b)
        if new_state not in visited:
            visited.add(new_state)
            queue.append((new_state, path + dname))
else:
    print("NO SOLUTION!")
