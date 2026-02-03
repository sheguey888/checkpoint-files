/**
 * Network Cable Optimization - Minimum Spanning Tree
 * Using Kruskal's Algorithm with Union-Find
 */

class DisjointSet {
  /**
   * Union-Find data structure for cycle detection
   */
  constructor(vertices) {
    this.parent = {};
    this.rank = {};

    vertices.forEach((v) => {
      this.parent[v] = v;
      this.rank[v] = 0;
    });
  }

  /**
   * Find the root of the set containing vertex (with path compression)
   */
  find(vertex) {
    if (this.parent[vertex] !== vertex) {
      this.parent[vertex] = this.find(this.parent[vertex]);
    }
    return this.parent[vertex];
  }

  /**
   * Union two sets by rank
   * Returns false if vertices are already in same set (would create cycle)
   */
  union(vertex1, vertex2) {
    const root1 = this.find(vertex1);
    const root2 = this.find(vertex2);

    if (root1 === root2) {
      return false; // Already in same set (would create cycle)
    }

    // Union by rank
    if (this.rank[root1] < this.rank[root2]) {
      this.parent[root1] = root2;
    } else if (this.rank[root1] > this.rank[root2]) {
      this.parent[root2] = root1;
    } else {
      this.parent[root2] = root1;
      this.rank[root1]++;
    }

    return true;
  }
}

/**
 * Compute Minimum Spanning Tree using Kruskal's Algorithm
 *
 * @param {Array} vertices - List of vertex names (computers)
 * @param {Array} edges - List of edge objects {v1, v2, weight}
 * @returns {Object} - {mstEdges, totalCost}
 */
function kruskalMST(vertices, edges) {
  const sortedEdges = edges.sort((a, b) => a.weight - b.weight);

  // Initialize disjoint set
  const ds = new DisjointSet(vertices);

  const mstEdges = [];
  let totalCost = 0;

  // Process edges in order of increasing weight
  for (const edge of sortedEdges) {
    if (ds.union(edge.v1, edge.v2)) {
      mstEdges.push(edge);
      totalCost += edge.weight;

      // MST is complete when we have V-1 edges
      if (mstEdges.length === vertices.length - 1) {
        break;
      }
    }
  }

  return { mstEdges, totalCost };
}

/**
 * Print the MST results in a formatted way
 */
function printMSTResult(mstEdges, totalCost) {
  mstEdges.forEach((edge, index) => {
    console.log(
      `${index + 1}. ${edge.v1} <---> ${edge.v2} : Cost = ${edge.weight}`,
    );
  });

  console.log(`\nTotal Network Cost: ${totalCost}`);
  console.log("=".repeat(50) + "\n");
}

/**
 * Run a predefined example
 */
function runExample() {
  console.log("\nRunning Example: Office Network with 6 Computers");

  // Example network
  const vertices = ["A", "B", "C", "D", "E", "F"];

  const edges = [
    { v1: "A", v2: "B", weight: 4 },
    { v1: "A", v2: "C", weight: 2 },
    { v1: "B", v2: "C", weight: 1 },
    { v1: "B", v2: "D", weight: 5 },
    { v1: "C", v2: "D", weight: 8 },
    { v1: "C", v2: "E", weight: 10 },
    { v1: "D", v2: "E", weight: 2 },
    { v1: "D", v2: "F", weight: 6 },
    { v1: "E", v2: "F", weight: 3 },
  ];

  console.log("\nNetwork Configuration:");
  console.log(`Computers: ${vertices.join(", ")}`);
  console.log("\nPossible Connections:");
  edges.forEach((edge) => {
    console.log(`  ${edge.v1} - ${edge.v2}: ${edge.weight}`);
  });

  const { mstEdges, totalCost } = kruskalMST(vertices, edges);

  printMSTResult(mstEdges, totalCost);
}

/**
 * Example with custom network (Bonus feature demonstration)
 */
function runCustomExample() {
  console.log("\nRunning Custom Example: Small Office Network");

  const vertices = ["PC1", "PC2", "PC3", "PC4"];

  const edges = [
    { v1: "PC1", v2: "PC2", weight: 10 },
    { v1: "PC1", v2: "PC3", weight: 6 },
    { v1: "PC1", v2: "PC4", weight: 5 },
    { v1: "PC2", v2: "PC3", weight: 15 },
    { v1: "PC2", v2: "PC4", weight: 4 },
    { v1: "PC3", v2: "PC4", weight: 8 },
  ];

  console.log("\nNetwork Configuration:");
  console.log(`Computers: ${vertices.join(", ")}`);
  console.log("\nPossible Connections:");
  edges.forEach((edge) => {
    console.log(`  ${edge.v1} - ${edge.v2}: ${edge.weight}`);
  });

  const { mstEdges, totalCost } = kruskalMST(vertices, edges);

  printMSTResult(mstEdges, totalCost);
}

/**
 * Main function
 */
function main() {
  console.log("\n" + "=".repeat(50));
  console.log("NETWORK CABLE OPTIMIZATION");
  console.log("Minimum Spanning Tree using Kruskal's Algorithm");
  console.log("=".repeat(50));

  // Run example 1
  runExample();

  // Run example 2
  runCustomExample();
}

// For Node.js environment
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    DisjointSet,
    kruskalMST,
    printMSTResult,
  };
}

// Run the program
main();
