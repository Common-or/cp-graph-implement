/**
 * Graph Implementation using Adjacency List
 * Supports both directed and undirected graphs
 * Includes DFS and BFS traversals
 */
class Graph {
  /**
   * @param {boolean} directed - false for undirected (default), true for directed
   */
  constructor(directed = false) {
    this.directed = directed;
    this.adjList = new Map(); // vertex -> array of neighbors
  }

  /** Add a vertex if it doesn't exist */
  addVertex(vertex) {
    if (!this.adjList.has(vertex)) {
      this.adjList.set(vertex, []);
    }
  }

  /** Add an edge between u and v */
  addEdge(u, v) {
    this.addVertex(u);
    this.addVertex(v);

    // avoid duplicate edges
    if (!this.adjList.get(u).includes(v)) {
      this.adjList.get(u).push(v);
    }

    if (!this.directed) {
      if (!this.adjList.get(v).includes(u)) {
        this.adjList.get(v).push(u);
      }
    }
  }

  /** Remove an edge between u and v. Returns true if removed. */
  removeEdge(u, v) {
    if (!this.adjList.has(u) || !this.adjList.has(v)) return false;

    const listU = this.adjList.get(u);
    const idxU = listU.indexOf(v);
    if (idxU === -1) return false;
    listU.splice(idxU, 1);

    if (!this.directed) {
      const listV = this.adjList.get(v);
      const idxV = listV.indexOf(u);
      if (idxV !== -1) listV.splice(idxV, 1);
    }
    return true;
  }

  /** Remove a vertex and all its incident edges */
  removeVertex(vertex) {
    if (!this.adjList.has(vertex)) return false;
    this.adjList.delete(vertex);
    for (const [, neighbors] of this.adjList) {
      const i = neighbors.indexOf(vertex);
      if (i !== -1) neighbors.splice(i, 1);
    }
    return true;
  }

  /** Check if edge u -> v exists */
  hasEdge(u, v) {
    return this.adjList.has(u) && this.adjList.get(u).includes(v);
  }

  /** Get all vertices */
  getVertices() {
    return [...this.adjList.keys()];
  }

  /** Get neighbors of a vertex */
  getNeighbors(vertex) {
    return this.adjList.has(vertex) ? [...this.adjList.get(vertex)] : [];
  }

  /** Print the graph as adjacency list */
  printGraph() {
    for (const [vertex, neighbors] of this.adjList) {
      console.log(`${vertex} -> ${neighbors.join(", ")}`);
    }
  }

  /**
   * Depth-First Search traversal (iterative to preserve insertion order
   * deterministically, equivalent to recursive version).
   * Prints and returns order of visited nodes.
   */
  dfs(start) {
    if (!this.adjList.has(start)) {
      console.log(`DFS: start vertex "${start}" not found.`);
      return [];
    }
    const visited = new Set();
    const order = [];

    const dfsRecursive = (vertex) => {
      visited.add(vertex);
      order.push(vertex);
      for (const neighbor of this.adjList.get(vertex)) {
        if (!visited.has(neighbor)) {
          dfsRecursive(neighbor);
        }
      }
    };

    dfsRecursive(start);
    console.log(`DFS starting from ${start}: ${order.join(" -> ")}`);
    return order;
  }

  /**
   * Breadth-First Search traversal.
   * Prints and returns order of visited nodes.
   */
  bfs(start) {
    if (!this.adjList.has(start)) {
      console.log(`BFS: start vertex "${start}" not found.`);
      return [];
    }
    const visited = new Set([start]);
    const queue = [start];
    const order = [];

    while (queue.length > 0) {
      const vertex = queue.shift();
      order.push(vertex);
      for (const neighbor of this.adjList.get(vertex)) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }

    console.log(`BFS starting from ${start}: ${order.join(" -> ")}`);
    return order;
  }
}

/* ================= Testing ================= */

function assertEqual(actual, expected, label) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a === e) {
    console.log(`PASS: ${label}`);
  } else {
    console.error(`FAIL: ${label}\n  expected: ${e}\n  actual:   ${a}`);
    process.exitCode = 1;
  }
}

function runTests() {
  console.log("--- Undirected Graph Test (>= 3 vertices) ---");
  const g = new Graph(false); // undirected
  // vertices: 0..4 implicitly added via edges
  g.addEdge(0, 1);
  g.addEdge(0, 2);
  g.addEdge(1, 3);
  g.addEdge(1, 4);
  g.addEdge(2, 4);

  console.log("Adjacency list:");
  g.printGraph();

  console.log("\nhasEdge checks:");
  console.log("hasEdge(0,1):", g.hasEdge(0, 1)); // true
  console.log("hasEdge(0,3):", g.hasEdge(0, 3)); // false
  assertEqual(g.hasEdge(0, 1), true, "undirected hasEdge(0,1) is true");
  assertEqual(g.hasEdge(1, 0), true, "undirected hasEdge(1,0) symmetric");
  assertEqual(g.hasEdge(0, 3), false, "undirected hasEdge(0,3) is false");

  console.log("\nTraversals from vertex 0:");
  const dfsOrder = g.dfs(0);
  const bfsOrder = g.bfs(0);

  // Expected for adjacency built in insertion order:
  // 0: [1,2], 1: [0,3,4], 2: [0,4], 3: [1], 4: [1,2]
  // DFS(0): 0 -> 1 -> 3 -> 4 -> 2
  // BFS(0): 0 -> 1 -> 2 -> 3 -> 4
  assertEqual(dfsOrder, [0, 1, 3, 4, 2], "undirected DFS from 0");
  assertEqual(bfsOrder, [0, 1, 2, 3, 4], "undirected BFS from 0");

  console.log("\nRemove edge 0-1:");
  g.removeEdge(0, 1);
  g.printGraph();
  assertEqual(g.hasEdge(0, 1), false, "edge 0-1 removed");
  assertEqual(g.hasEdge(1, 0), false, "edge 1-0 removed (undirected)");

  console.log("\n--- Directed Graph Test ---");
  const dg = new Graph(true); // directed
  dg.addEdge("A", "B");
  dg.addEdge("A", "C");
  dg.addEdge("B", "D");
  dg.addEdge("C", "D");
  dg.addEdge("D", "E");

  console.log("Adjacency list:");
  dg.printGraph();

  assertEqual(dg.hasEdge("A", "B"), true, "directed hasEdge A->B");
  assertEqual(dg.hasEdge("B", "A"), false, "directed hasEdge B->A is false");

  const dDfs = dg.dfs("A");
  const dBfs = dg.bfs("A");
  // A: [B,C], B: [D], C: [D], D: [E], E: []
  // DFS(A): A -> B -> D -> E -> C
  // BFS(A): A -> B -> C -> D -> E
  assertEqual(dDfs, ["A", "B", "D", "E", "C"], "directed DFS from A");
  assertEqual(dBfs, ["A", "B", "C", "D", "E"], "directed BFS from A");

  console.log("\nRemove directed edge A->B:");
  dg.removeEdge("A", "B");
  dg.printGraph();
  assertEqual(dg.hasEdge("A", "B"), false, "directed edge A->B removed");

  console.log("\nAll tests completed.");
}

if (require.main === module) {
  runTests();
}

module.exports = Graph;
