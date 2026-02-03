/**
 * MIN-HEAP BASED PRIORITY QUEUE
 *
 * Implementation: Binary min-heap (array representation)
 * Time Complexity:
 *   - insert: O(log n)
 *   - extractMin: O(log n)
 *   - peekMin: O(1)
 *   - isEmpty: O(1)
 * Space Complexity: O(n) where n is the number of elements
 */
class MinHeapPriorityQueue {
  constructor() {
    this.heap = [];
  }

  /**
   * Insert an element with priority
   * Time: O(log n)
   */
  insert(element) {
    // Element should be {value, priority}
    this.heap.push(element);
    this._heapifyUp(this.heap.length - 1);
  }

  /**
   * Remove and return the element with minimum priority
   * Time: O(log n)
   */
  extractMin() {
    if (this.isEmpty()) {
      throw new Error("Priority queue is empty");
    }

    if (this.heap.length === 1) {
      return this.heap.pop();
    }

    const min = this.heap[0];
    this.heap[0] = this.heap.pop();
    this._heapifyDown(0);

    return min;
  }

  /**
   * Return the element with minimum priority without removing it
   * Time: O(1)
   */
  peekMin() {
    if (this.isEmpty()) {
      throw new Error("Priority queue is empty");
    }

    return this.heap[0];
  }

  /**
   * Check if the priority queue is empty
   * Time: O(1)
   */
  isEmpty() {
    return this.heap.length === 0;
  }

  /**
   * Get the current size
   */
  getSize() {
    return this.heap.length;
  }

  /**
   * Heapify up (bubble up) - restore heap property after insertion
   * Time: O(log n)
   */
  _heapifyUp(index) {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);

      if (this.heap[index].priority >= this.heap[parentIndex].priority) {
        break;
      }

      // Swap with parent
      [this.heap[index], this.heap[parentIndex]] = [
        this.heap[parentIndex],
        this.heap[index],
      ];

      index = parentIndex;
    }
  }

  /**
   * Heapify down (bubble down) - restore heap property after extraction
   * Time: O(log n)
   */
  _heapifyDown(index) {
    while (true) {
      const leftChild = 2 * index + 1;
      const rightChild = 2 * index + 2;
      let smallest = index;

      if (
        leftChild < this.heap.length &&
        this.heap[leftChild].priority < this.heap[smallest].priority
      ) {
        smallest = leftChild;
      }

      if (
        rightChild < this.heap.length &&
        this.heap[rightChild].priority < this.heap[smallest].priority
      ) {
        smallest = rightChild;
      }

      if (smallest === index) {
        break;
      }

      // Swap with smallest child
      [this.heap[index], this.heap[smallest]] = [
        this.heap[smallest],
        this.heap[index],
      ];

      index = smallest;
    }
  }

  /**
   * Display heap contents (for debugging)
   */
  display() {
    if (this.isEmpty()) {
      return "[]";
    }

    return `[${this.heap.map((e) => `{${e.value}:${e.priority}}`).join(", ")}]`;
  }
}

export default MinHeapPriorityQueue;
