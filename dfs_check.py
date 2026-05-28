graph = {
    'a': ['c', 'b', 'f'],
    'b': ['a', 'c', 'f', 'g', 'h'],
    'c': ['a', 'b', 'g'],
    'f': ['a', 'b', 'h', 'g'], # Assuming curved line f-g
    'g': ['c', 'b', 'h', 'f'],
    'h': ['f', 'b', 'g']
}

options = {
    'a': 'abcghf',
    'b': 'abfchg',
    'c': 'abfhgc',
    'd': 'afghbc'
}

def check_dfs(sequence, graph):
    path = []
    visited = set()
    stack = [sequence[0]] 
    # DFS simulation is tricky because we need to perform exactly the moves in sequence.
    # Instead, let's verify if the sequence is a valid topological walk respecting DFS backtracking.
    
    # A cleaner check: can we reproduce this sequence by SOME ordering of neighbors?
    
    # Let's simulate step by step.
    current_idx = 0
    visited.add(sequence[0])
    dfs_stack = [sequence[0]]
    
    # Checking remaining:
    for next_char in sequence[1:]:
        # current node is top of stack
        while dfs_stack:
            curr = dfs_stack[-1]
            if next_char in graph[curr] and next_char not in visited:
                # Found valid move
                visited.add(next_char)
                dfs_stack.append(next_char)
                break
            else:
                # Try backtracking
                 # But wait, if we backtrack, we don't consume 'next_char' yet.
                 # We just pop from stack and try again with new top.
                 dfs_stack.pop()
        
        if not dfs_stack:
             return False # Could not reach next_char
             
    return True

print("Checking sequences with f-g edge:")
for key, seq in options.items():
    print(f"{key}: {seq} -> {check_dfs(seq, graph)}")

# Check without f-g edge
graph_no_fg = {
    'a': ['c', 'b', 'f'],
    'b': ['a', 'c', 'f', 'g', 'h'],
    'c': ['a', 'b', 'g'],
    'f': ['a', 'b', 'h'], 
    'g': ['c', 'b', 'h'],
    'h': ['f', 'b', 'g']
}
print("\nChecking sequences WITHOUT f-g edge:")
for key, seq in options.items():
    print(f"{key}: {seq} -> {check_dfs(seq, graph_no_fg)}")

