/**
 * Dijkstra's Algorithm Implementation
 * @param {Object} graph - Graph represented as adjacency list
 * @param {string} start - Starting vertex
 * @returns {Object} Object with shortest distances from start to all vertices
 */

function dijkstra(graph, start) {
  // Initialize distances object - all distances are infinity except start
  const distances = {};
  const visited = new Set();

  // Initialize all distances to infinity
  for (let vertex in graph) {
    distances[vertex] = Infinity;
  }

  distances[start] = 0;
  const vertices = Object.keys(graph);

  // Process all vertices
  while (visited.size < vertices.length) {
    let currentVertex = null;
    let minDistance = Infinity;

    for (let vertex of vertices) {
      if (!visited.has(vertex) && distances[vertex] < minDistance) {
        minDistance = distances[vertex];
        currentVertex = vertex;
      }
    }

    // If no reachable unvisited vertex found, break
    if (currentVertex === null) break;

    // Mark current vertex as visited
    visited.add(currentVertex);

    // Update distances to neighbors
    const neighbors = graph[currentVertex];
    for (let neighbor in neighbors) {
      if (!visited.has(neighbor)) {
        const weight = neighbors[neighbor];
        const newDistance = distances[currentVertex] + weight;

        // If we found a shorter path, update it
        if (newDistance < distances[neighbor]) {
          distances[neighbor] = newDistance;
        }
      }
    }
  }

  return distances;
}

const graph = {
  A: { B: 4, C: 2 },
  B: { A: 4, C: 5, D: 10 },
  C: { A: 2, B: 5, D: 3 },
  D: { B: 10, C: 3 },
};

console.log(dijkstra(graph, "A"));
