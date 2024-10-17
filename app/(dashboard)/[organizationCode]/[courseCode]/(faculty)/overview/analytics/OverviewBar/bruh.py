def schedule(codebases: dict, deps:dict) -> list:
    # Parsing input: Create a graph for 
    # dependencies and a dictionary for build times
    build_times = codebases
    graph = defaultdict(list)
    indegree = {codebase: 0 for codebase in build_times}

    # Building the graph and indegree map
    for dependent, dependees in deps.items():
        for dependee in dependees:
            graph[dependee].append(dependent)
            indegree[dependent] += 1

    # Topological sort using a priority queue
    # for minimizing build time
    queue = []
    for codebase, degree in indegree.items():
        if degree == 0:
            # Push codebase with 0 indegree 
            # into the priority queue
            heapq.heappush(queue, (build_times[codebase], codebase))

    schedule = []
    while queue:
        # Pop the codebase with the shortest
        # build time
        build_time, codebase = heapq.heappop(queue)
        schedule.append(f"{build_time},{codebase}")
        for dependent in graph[codebase]:
            indegree[dependent] -= 1
            if indegree[dependent] == 0:
                # Push next codebase with 0 indegree
                heapq.heappush(queue, (build_times[dependent], dependent))
    
    return schedule