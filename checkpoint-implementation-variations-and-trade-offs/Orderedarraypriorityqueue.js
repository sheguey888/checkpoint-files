/**
 * ORDERED ARRAY BASED PRIORITY QUEUE
 *
 * Implementation: Sorted array (ascending order by priority)
 * Time Complexity:
 *   - insert: O(n) - need to maintain sorted order
 *   - extractMin: O(1) - min is always at index 0
 *   - peekMin: O(1)
 *   - isEmpty: O(1)
 * Space Complexity: O(n) where n is the number of elements
 */
class OrderedArrayPriorityQueue {
  constructor() {
    this.queue = [];
  }

  /**
   * Insert an element maintaining sorted order by priority
   * Time: O(n) - linear search + shift
   */
  insert(element) {
    // Element should be {value, priority}

    if (this.isEmpty()) {
      this.queue.push(element);
      return;
    }

    // Find the correct position to insert (binary search could optimize to O(log n) for search)
    // But insertion still requires O(n) due to shifting elements
    let insertIndex = 0;

    for (let i = 0; i < this.queue.length; i++) {
      if (element.priority < this.queue[i].priority) {
        insertIndex = i;
        break;
      }
      insertIndex = i + 1;
    }

    // Insert at the correct position
    this.queue.splice(insertIndex, 0, element);
  }

  /**
   * Remove and return the element with minimum priority
   * Time: O(1) - always at index 0
   */
  extractMin() {
    if (this.isEmpty()) {
      throw new Error("Priority queue is empty");
    }

    // The minimum is always at index 0 (array is sorted)
    return this.queue.shift();
  }

  /**
   * Return the element with minimum priority without removing it
   * Time: O(1)
   */
  peekMin() {
    if (this.isEmpty()) {
      throw new Error("Priority queue is empty");
    }

    return this.queue[0];
  }

  /**
   * Check if the priority queue is empty
   * Time: O(1)
   */
  isEmpty() {
    return this.queue.length === 0;
  }

  /**
   * Get the current size
   */
  getSize() {
    return this.queue.length;
  }

  /**
   * Display queue contents (for debugging)
   */
  display() {
    if (this.isEmpty()) {
      return "[]";
    }

    return `[${this.queue.map((e) => `{${e.value}:${e.priority}}`).join(", ")}]`;
  }
}

export default OrderedArrayPriorityQueue;
