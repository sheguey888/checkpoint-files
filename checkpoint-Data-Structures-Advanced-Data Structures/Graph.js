class Graph {
  /**
   * Graph implementation using adjacency list
   * @param {boolean} isDirected - Whether the graph is directed or undirected
   */
  constructor(isDirected = false) {
    this.adjacencyList = {};
    this.isDirected = isDirected;
  }

  /**
   * Add a vertex to the graph
   * @param {string|number} vertex - The vertex to add
   */
  addVertex(vertex) {
    if (!this.adjacencyList[vertex]) {
      this.adjacencyList[vertex] = [];
    }
  }

  /**
   * Add an edge between two vertices
   * @param {string|number} vertex1 - First vertex
   * @param {string|number} vertex2 - Second vertex
   */
  addEdge(vertex1, vertex2) {
    // Add vertices if they don't exist
    this.addVertex(vertex1);
    this.addVertex(vertex2);

    // Add edge from vertex1 to vertex2
    if (!this.adjacencyList[vertex1].includes(vertex2)) {
      this.adjacencyList[vertex1].push(vertex2);
    }

    // If undirected, add edge from vertex2 to vertex1
    if (!this.isDirected) {
      if (!this.adjacencyList[vertex2].includes(vertex1)) {
        this.adjacencyList[vertex2].push(vertex1);
      }
    }
  }

  /**
   * Remove an edge between two vertices
   * @param {string|number} vertex1 - First vertex
   * @param {string|number} vertex2 - Second vertex
   */
  removeEdge(vertex1, vertex2) {
    if (this.adjacencyList[vertex1]) {
      this.adjacencyList[vertex1] = this.adjacencyList[vertex1].filter(
        (v) => v !== vertex2,
      );
    }

    // If undirected, remove edge from vertex2 to vertex1
    if (!this.isDirected && this.adjacencyList[vertex2]) {
      this.adjacencyList[vertex2] = this.adjacencyList[vertex2].filter(
        (v) => v !== vertex1,
      );
    }
  }

  /**
   * Check if an edge exists between two vertices
   * @param {string|number} vertex1 - First vertex
   * @param {string|number} vertex2 - Second vertex
   * @returns {boolean} - True if edge exists, false otherwise
   */
  hasEdge(vertex1, vertex2) {
    return this.adjacencyList[vertex1]?.includes(vertex2) || false;
  }

  /**
   * Print the graph
   */
  printGraph() {
    console.log(
      `\n--- Graph (${this.isDirected ? "Directed" : "Undirected"}) ---`,
    );
    for (let vertex in this.adjacencyList) {
      const neighbors = this.adjacencyList[vertex].join(", ");
      console.log(`${vertex} -> [${neighbors}]`);
    }
    console.log();
  }

  /**
   * Depth-First Search traversal
   * @param {string|number} startVertex - Starting vertex for traversal
   * @returns {array} - Array of visited vertices in DFS order
   */
  dfs(startVertex) {
    const visited = {};
    const result = [];

    const dfsHelper = (vertex) => {
      if (!vertex) return;

      // Mark current vertex as visited
      visited[vertex] = true;
      result.push(vertex);

      // Visit all neighbors
      this.adjacencyList[vertex].forEach((neighbor) => {
        if (!visited[neighbor]) {
          dfsHelper(neighbor);
        }
      });
    };

    dfsHelper(startVertex);
    return result;
  }

  /**
   * Breadth-First Search traversal
   * @param {string|number} startVertex - Starting vertex for traversal
   * @returns {array} - Array of visited vertices in BFS order
   */
  bfs(startVertex) {
    const visited = {};
    const result = [];
    const queue = [startVertex];

    visited[startVertex] = true;

    while (queue.length > 0) {
      // Dequeue a vertex
      const vertex = queue.shift();
      result.push(vertex);

      // Visit all neighbors
      this.adjacencyList[vertex].forEach((neighbor) => {
        if (!visited[neighbor]) {
          visited[neighbor] = true;
          queue.push(neighbor);
        }
      });
    }

    return result;
  }
}

export default Graph;
