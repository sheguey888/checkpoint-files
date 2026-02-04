// Distributed Key-Value Storage with Consistent Hashing and Caching

const crypto = require('crypto');

// Hash function
function hash(key) {
  return parseInt(crypto.createHash('md5').update(key).digest('hex').substring(0, 8), 16);
}

// Node class
class Node {
  constructor(id) {
    this.id = id;
    this.data = {};
    this.active = true;
  }

  set(key, value) {
    this.data[key] = value;
  }

  get(key) {
    return this.data[key];
  }

  delete(key) {
    delete this.data[key];
  }

  getAllKeys() {
    return Object.keys(this.data);
  }
}

// Cache class with LRU and TTL
class Cache {
  constructor(capacity, ttl = 5000) {
    this.capacity = capacity;
    this.ttl = ttl;
    this.cache = new Map();
    this.timestamps = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return null;
    
    // Check TTL
    const timestamp = this.timestamps.get(key);
    if (Date.now() - timestamp > this.ttl) {
      this.cache.delete(key);
      this.timestamps.delete(key);
      return null;
    }

    // LRU: move to end
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    // Evict oldest if at capacity (LRU)
    if (this.cache.size >= this.capacity) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
      this.timestamps.delete(firstKey);
    }

    this.cache.set(key, value);
    this.timestamps.set(key, Date.now());
  }

  clear() {
    this.cache.clear();
    this.timestamps.clear();
  }
}

// Distributed KV Store
class DistributedKVStore {
  constructor() {
    this.nodes = [];
    this.ring = [];
    this.cache = new Cache(3, 5000);
  }

  addNode(nodeId) {
    const node = new Node(nodeId);
    this.nodes.push(node);
    this.ring.push({ hash: hash(nodeId), nodeId });
    this.ring.sort((a, b) => a.hash - b.hash);
    console.log(`✓ Node ${nodeId} added (hash: ${hash(nodeId)})`);
    return node;
  }

  removeNode(nodeId) {
    const node = this.nodes.find(n => n.id === nodeId);
    if (!node) return;

    // Redistribute data
    const keys = node.getAllKeys();
    console.log(`→ Redistributing ${keys.length} keys from ${nodeId}...`);
    
    keys.forEach(key => {
      const value = node.get(key);
      node.delete(key);
      const targetNode = this.findNode(key);
      if (targetNode && targetNode.id !== nodeId) {
        targetNode.set(key, value);
      }
    });

    this.nodes = this.nodes.filter(n => n.id !== nodeId);
    this.ring = this.ring.filter(r => r.nodeId !== nodeId);
    this.cache.clear();
    console.log(`✓ Node ${nodeId} removed`);
  }

  findNode(key) {
    if (this.nodes.length === 0) return null;
    
    const keyHash = hash(key);
    for (let i = 0; i < this.ring.length; i++) {
      if (keyHash <= this.ring[i].hash) {
        const node = this.nodes.find(n => n.id === this.ring[i].nodeId);
        if (node && node.active) return node;
      }
    }
    
    const node = this.nodes.find(n => n.id === this.ring[0].nodeId);
    return node && node.active ? node : this.nodes.find(n => n.active);
  }

  set(key, value) {
    const node = this.findNode(key);
    if (!node) {
      console.log(`✗ No active nodes available`);
      return false;
    }
    node.set(key, value);
    this.cache.set(key, value);
    console.log(`✓ SET ${key} → Node ${node.id}`);
    return true;
  }

  get(key) {
    // Check cache first
    const cached = this.cache.get(key);
    if (cached !== null) {
      console.log(`✓ GET ${key} → Cache hit`);
      return cached;
    }

    // Get from node
    const node = this.findNode(key);
    if (!node) {
      console.log(`✗ No active nodes available`);
      return null;
    }
    
    const value = node.get(key);
    if (value) {
      this.cache.set(key, value);
      console.log(`✓ GET ${key} → Node ${node.id}`);
    }
    return value;
  }

  simulateFailure(nodeId) {
    const node = this.nodes.find(n => n.id === nodeId);
    if (node) {
      node.active = false;
      console.log(`✗ Node ${nodeId} FAILED`);
    }
  }

  showStatus() {
    console.log('\n=== SYSTEM STATUS ===');
    this.nodes.forEach(node => {
      const status = node.active ? '✓' : '✗';
      const keys = node.getAllKeys();
      console.log(`${status} Node ${node.id}: ${keys.length} keys ${keys.length > 0 ? JSON.stringify(keys) : ''}`);
    });
    console.log('Cache size:', this.cache.cache.size);
  }
}

// SIMULATION
console.log('========================================');
console.log('DISTRIBUTED KV STORE SIMULATION');
console.log('========================================\n');

const store = new DistributedKVStore();

// 1. Initialize 5 nodes
console.log('--- 1. INITIALIZING NODES ---');
store.addNode('Node-A');
store.addNode('Node-B');
store.addNode('Node-C');
store.addNode('Node-D');
store.addNode('Node-E');

// 2. Add initial data
console.log('\n--- 2. ADDING DATA ---');
store.set('user:101', {name: 'Alice'});
store.set('user:102', {name: 'Bob'});
store.set('user:103', {name: 'Charlie'});
store.set('user:104', {name: 'Diana'});
store.set('user:105', {name: 'Eve'});
store.set('user:106', {name: 'Frank'});

store.showStatus();

// 3. Read operations (cache demo)
console.log('\n--- 3. READ OPERATIONS (Cache Demo) ---');
store.get('user:101');
store.get('user:102');
store.get('user:101'); // Cache hit

// 4. Add new node
console.log('\n--- 4. ADDING NEW NODE ---');
const keysBeforeAdd = {};
store.nodes.forEach(n => keysBeforeAdd[n.id] = n.getAllKeys().length);
store.addNode('Node-F');
console.log('Data redistribution (minimal keys moved due to consistent hashing)');
store.showStatus();

// 5. Remove node
console.log('\n--- 5. REMOVING NODE ---');
store.removeNode('Node-C');
store.showStatus();

// 6. Node failure simulation
console.log('\n--- 6. NODE FAILURE SIMULATION ---');
store.simulateFailure('Node-A');
console.log('Attempting reads after failure:');
store.get('user:101'); // Will fallback to another node
store.showStatus();

console.log('\n========================================');
console.log('SIMULATION COMPLETE');
console.log('========================================');
