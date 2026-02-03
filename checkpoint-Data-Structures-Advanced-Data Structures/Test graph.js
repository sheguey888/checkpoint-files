import Graph from "./Graph.js";

console.log("=".repeat(50));
console.log("GRAPH TRAVERSAL DEMONSTRATION");
console.log("=".repeat(50));

// ============================================
// Test 1: UNDIRECTED GRAPH
// ============================================
console.log("\n" + "=".repeat(50));
console.log("TEST 1: UNDIRECTED GRAPH");
console.log("=".repeat(50));

const undirectedGraph = new Graph(false); // false = undirected

// Add edges (at least 3 vertices as required)
undirectedGraph.addEdge("A", "B");
undirectedGraph.addEdge("A", "C");
undirectedGraph.addEdge("B", "D");
undirectedGraph.addEdge("C", "E");
undirectedGraph.addEdge("D", "E");
undirectedGraph.addEdge("D", "F");

// Print the graph
undirectedGraph.printGraph();

// Check for edges
console.log("--- Edge Checks ---");
console.log(`Has edge A-B: ${undirectedGraph.hasEdge("A", "B")}`);
console.log(`Has edge B-A: ${undirectedGraph.hasEdge("B", "A")}`); // Should be true for undirected
console.log(`Has edge A-F: ${undirectedGraph.hasEdge("A", "F")}`); // Should be false
console.log();

// DFS Traversal
console.log("--- DFS Traversal (starting from A) ---");
const dfsResult1 = undirectedGraph.dfs("A");
console.log(`Order: ${dfsResult1.join(" -> ")}`);
console.log();

// BFS Traversal
console.log("--- BFS Traversal (starting from A) ---");
const bfsResult1 = undirectedGraph.bfs("A");
console.log(`Order: ${bfsResult1.join(" -> ")}`);
console.log();

// Remove an edge and test again
console.log("--- Removing edge D-E ---");
undirectedGraph.removeEdge("D", "E");
undirectedGraph.printGraph();

console.log("--- DFS after removing D-E (starting from A) ---");
const dfsResult1Updated = undirectedGraph.dfs("A");
console.log(`Order: ${dfsResult1Updated.join(" -> ")}`);
console.log();

// ============================================
// Test 2: DIRECTED GRAPH
// ============================================
console.log("\n" + "=".repeat(50));
console.log("TEST 2: DIRECTED GRAPH");
console.log("=".repeat(50));

const directedGraph = new Graph(true); // true = directed

// Add edges
directedGraph.addEdge("1", "2");
directedGraph.addEdge("1", "3");
directedGraph.addEdge("2", "4");
directedGraph.addEdge("3", "4");
directedGraph.addEdge("4", "5");
directedGraph.addEdge("5", "6");
directedGraph.addEdge("3", "6");

// Print the graph
directedGraph.printGraph();

// Check for edges
console.log("--- Edge Checks ---");
console.log(`Has edge 1->2: ${directedGraph.hasEdge("1", "2")}`);
console.log(`Has edge 2->1: ${directedGraph.hasEdge("2", "1")}`); // Should be false for directed
console.log(`Has edge 3->6: ${directedGraph.hasEdge("3", "6")}`);
console.log();

// DFS Traversal
console.log("--- DFS Traversal (starting from 1) ---");
const dfsResult2 = directedGraph.dfs("1");
console.log(`Order: ${dfsResult2.join(" -> ")}`);
console.log();

// BFS Traversal
console.log("--- BFS Traversal (starting from 1) ---");
const bfsResult2 = directedGraph.bfs("1");
console.log(`Order: ${bfsResult2.join(" -> ")}`);
console.log();

// ============================================
// Test 3: SIMPLE GRAPH (Minimum 3 vertices)
// ============================================
console.log("\n" + "=".repeat(50));
console.log("TEST 3: SIMPLE UNDIRECTED GRAPH (3 VERTICES)");
console.log("=".repeat(50));

const simpleGraph = new Graph(false);

// Create a simple triangle graph
simpleGraph.addEdge("X", "Y");
simpleGraph.addEdge("Y", "Z");
simpleGraph.addEdge("Z", "X");

// Print the graph
simpleGraph.printGraph();

// DFS Traversal
console.log("--- DFS Traversal (starting from X) ---");
const dfsResult3 = simpleGraph.dfs("X");
console.log(`Order: ${dfsResult3.join(" -> ")}`);
console.log();

// BFS Traversal
console.log("--- BFS Traversal (starting from X) ---");
const bfsResult3 = simpleGraph.bfs("X");
console.log(`Order: ${bfsResult3.join(" -> ")}`);
console.log();

console.log("=".repeat(50));
console.log("ALL TESTS COMPLETED");
console.log("=".repeat(50));
