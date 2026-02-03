/**
 * ARRAY-BASED QUEUE (Fixed Size)
 *
 * Implementation: Circular array
 * Time Complexity:
 *   - enqueue: O(1)
 *   - dequeue: O(1)
 *   - peek: O(1)
 *   - isEmpty: O(1)
 * Space Complexity: O(n) where n is the capacity
 */
class ArrayQueue {
  constructor(capacity = 10) {
    this.capacity = capacity;
    this.queue = new Array(capacity);
    this.front = 0;
    this.rear = -1;
    this.size = 0;
  }

  /**
   * Add an element to the rear of the queue
   * Time: O(1)
   */
  enqueue(element) {
    if (this.isFull()) {
      throw new Error("Queue is full");
    }

    this.rear = (this.rear + 1) % this.capacity;
    this.queue[this.rear] = element;
    this.size++;
  }

  /**
   * Remove and return the front element
   * Time: O(1)
   */
  dequeue() {
    if (this.isEmpty()) {
      throw new Error("Queue is empty");
    }

    const element = this.queue[this.front];
    this.queue[this.front] = null; // Clean up
    this.front = (this.front + 1) % this.capacity;
    this.size--;

    return element;
  }

  /**
   * Return the front element without removing it
   * Time: O(1)
   */
  peek() {
    if (this.isEmpty()) {
      throw new Error("Queue is empty");
    }

    return this.queue[this.front];
  }

  /**
   * Check if the queue is empty
   * Time: O(1)
   */
  isEmpty() {
    return this.size === 0;
  }

  /**
   * Check if the queue is full
   * Time: O(1)
   */
  isFull() {
    return this.size === this.capacity;
  }

  /**
   * Get the current size
   */
  getSize() {
    return this.size;
  }

  /**
   * Display queue contents (for debugging)
   */
  display() {
    if (this.isEmpty()) {
      return "[]";
    }

    const elements = [];
    let index = this.front;

    for (let i = 0; i < this.size; i++) {
      elements.push(this.queue[index]);
      index = (index + 1) % this.capacity;
    }

    return `[${elements.join(", ")}]`;
  }
}

export default ArrayQueue;
