/**
 * Node for Linked List Queue
 */
class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

/**
 * LINKED LIST-BASED QUEUE (Dynamic Size)
 *
 * Implementation: Singly linked list with front and rear pointers
 * Time Complexity:
 *   - enqueue: O(1)
 *   - dequeue: O(1)
 *   - peek: O(1)
 *   - isEmpty: O(1)
 * Space Complexity: O(n) where n is the number of elements
 */
class LinkedListQueue {
  constructor() {
    this.front = null;
    this.rear = null;
    this.size = 0;
  }

  /**
   * Add an element to the rear of the queue
   * Time: O(1)
   */
  enqueue(element) {
    const newNode = new Node(element);

    if (this.isEmpty()) {
      this.front = newNode;
      this.rear = newNode;
    } else {
      this.rear.next = newNode;
      this.rear = newNode;
    }

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

    const element = this.front.data;
    this.front = this.front.next;

    if (this.front === null) {
      this.rear = null;
    }

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

    return this.front.data;
  }

  /**
   * Check if the queue is empty
   * Time: O(1)
   */
  isEmpty() {
    return this.front === null;
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
    let current = this.front;

    while (current !== null) {
      elements.push(current.data);
      current = current.next;
    }

    return `[${elements.join(", ")}]`;
  }
}

export default LinkedListQueue;
