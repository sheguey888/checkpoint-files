/**
 * Simulating a Print Queue
 * Using Queue Data Structure (FIFO - First-In-First-Out)
 */

class Queue {
  /**
   * Queue data structure implementation
   */
  constructor() {
    this.items = [];
  }

  /**
   * Add an element to the end of the queue
   * @param {*} element - Element to add
   */
  enqueue(element) {
    this.items.push(element);
  }

  /**
   * Remove and return the first element from the queue
   * @returns {*} - The first element, or undefined if queue is empty
   */
  dequeue() {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.items.shift();
  }

  /**
   * View the first element without removing it
   * @returns {*} - The first element, or undefined if queue is empty
   */
  peek() {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.items[0];
  }

  /**
   * Check if the queue is empty
   * @returns {boolean} - True if empty, false otherwise
   */
  isEmpty() {
    return this.items.length === 0;
  }

  /**
   * Get the size of the queue
   * @returns {number} - Number of elements in the queue
   */
  size() {
    return this.items.length;
  }

  /**
   * Clear all elements from the queue
   */
  clear() {
    this.items = [];
  }
}

class PrintJob {
  /**
   * Represents a print job
   * @param {string} name - Name/description of the print job
   * @param {number} pages - Number of pages to print
   */
  constructor(name, pages) {
    this.name = name;
    this.pages = pages;
    this.timestamp = new Date();
  }

  /**
   * String representation of the print job
   * @returns {string}
   */
  toString() {
    return `"${this.name}" (${this.pages} pages)`;
  }
}

class PrinterQueue {
  /**
   * Manages print jobs using a queue
   */
  constructor() {
    this.queue = new Queue();
    this.processedJobs = [];
  }

  /**
   * Add a print job to the queue
   * @param {string} name - Name of the print job
   * @param {number} pages - Number of pages
   */
  addJob(name, pages) {
    const job = new PrintJob(name, pages);
    this.queue.enqueue(job);
    console.log(`✓ Added to queue: ${job.toString()}`);
  }

  /**
   * Process the next print job in the queue
   * @returns {PrintJob|null} - The processed job, or null if queue is empty
   */
  processJob() {
    if (this.queue.isEmpty()) {
      console.log("✗ No jobs in the queue to process.");
      return null;
    }

    const job = this.queue.dequeue();
    this.processedJobs.push(job);
    console.log(`🖨️  Processing: ${job.toString()}`);
    return job;
  }

  /**
   * Process all jobs in the queue
   */
  processAllJobs() {
    console.log("\n" + "=".repeat(50));
    console.log("PROCESSING ALL JOBS");
    console.log("=".repeat(50));

    if (this.queue.isEmpty()) {
      console.log("✗ Queue is empty. No jobs to process.");
      return;
    }

    let jobCount = 0;
    while (!this.queue.isEmpty()) {
      this.processJob();
      jobCount++;
    }

    console.log("=".repeat(50));
    console.log(`✓ Completed ${jobCount} job(s)`);
    console.log("=".repeat(50) + "\n");
  }

  /**
   * View the next job without processing it
   * @returns {PrintJob|null}
   */
  viewNextJob() {
    if (this.queue.isEmpty()) {
      console.log("✗ No jobs in the queue.");
      return null;
    }

    const job = this.queue.peek();
    console.log(`👁️  Next job: ${job.toString()}`);
    return job;
  }

  /**
   * Print the current queue status
   */
  printQueue() {
    console.log("\n" + "=".repeat(50));
    console.log("CURRENT PRINT QUEUE");
    console.log("=".repeat(50));

    if (this.queue.isEmpty()) {
      console.log("Queue is empty.");
    } else {
      console.log(`Jobs in queue: ${this.queue.size()}\n`);
      this.queue.items.forEach((job, index) => {
        console.log(`${index + 1}. ${job.toString()}`);
      });
    }

    console.log("=".repeat(50) + "\n");
  }

  /**
   * Print statistics
   */
  printStats() {
    console.log("\n" + "=".repeat(50));
    console.log("PRINTER QUEUE STATISTICS");
    console.log("=".repeat(50));
    console.log(`Jobs in queue: ${this.queue.size()}`);
    console.log(`Jobs processed: ${this.processedJobs.length}`);

    if (this.processedJobs.length > 0) {
      const totalPages = this.processedJobs.reduce(
        (sum, job) => sum + job.pages,
        0,
      );
      console.log(`Total pages printed: ${totalPages}`);
    }

    console.log("=".repeat(50) + "\n");
  }

  /**
   * Get the number of jobs in the queue
   * @returns {number}
   */
  getQueueSize() {
    return this.queue.size();
  }

  /**
   * Check if the queue is empty
   * @returns {boolean}
   */
  isEmpty() {
    return this.queue.isEmpty();
  }
}

/**
 * Test the Print Queue implementation
 */
function testPrintQueue() {
  console.log("\n" + "=".repeat(50));
  console.log("PRINTER QUEUE SIMULATION");
  console.log("=".repeat(50) + "\n");

  // Create a new printer queue
  const printer = new PrinterQueue();

  // Test 1: Add multiple print jobs
  console.log("--- Test 1: Adding Print Jobs ---");
  printer.addJob("Monthly Report", 15);
  printer.addJob("Meeting Agenda", 3);
  printer.addJob("Project Proposal", 25);
  printer.addJob("Invoice #1234", 2);
  printer.addJob("Employee Handbook", 50);

  // Test 2: Print the queue
  printer.printQueue();

  // Test 3: View next job without processing
  console.log("--- Test 2: View Next Job ---");
  printer.viewNextJob();
  console.log();

  // Test 4: Process one job
  console.log("--- Test 3: Process Single Job ---");
  printer.processJob();
  console.log();

  // Test 5: Print queue after processing one job
  printer.printQueue();

  // Test 6: Add more jobs while processing
  console.log("--- Test 4: Add More Jobs ---");
  printer.addJob("Sales Report", 8);
  printer.addJob("Expense Claims", 4);
  console.log();

  // Test 7: Print updated queue
  printer.printQueue();

  // Test 8: Process all remaining jobs
  printer.processAllJobs();

  // Test 9: Check queue after processing all
  printer.printQueue();

  // Test 10: Print statistics
  printer.printStats();

  // Test 11: Try to process from empty queue
  console.log("--- Test 5: Process from Empty Queue ---");
  printer.processJob();
  console.log();
}

/**
 * Interactive demo
 */
function interactiveDemo() {
  console.log("\n" + "=".repeat(50));
  console.log("INTERACTIVE DEMO");
  console.log("=".repeat(50) + "\n");

  const printer = new PrinterQueue();

  // Simulate office scenario
  console.log("📍 Morning: Multiple employees send print jobs\n");

  printer.addJob("Alice - Budget Report", 12);
  printer.addJob("Bob - Team Schedule", 5);
  printer.addJob("Charlie - Client Proposal", 30);

  console.log();
  printer.printQueue();

  console.log("📍 Processing jobs as printer becomes available\n");

  printer.processJob();
  console.log();

  console.log("📍 New job arrives while printing\n");
  printer.addJob("Diana - Contract Draft", 18);
  console.log();

  printer.printQueue();

  console.log("📍 Continue processing remaining jobs\n");
  printer.processAllJobs();

  printer.printStats();
}

// Run tests
console.log("\n" + "█".repeat(50));
console.log("PRINT QUEUE SYSTEM - COMPREHENSIVE TESTING");
console.log("█".repeat(50));

testPrintQueue();
interactiveDemo();

console.log("\n" + "█".repeat(50));
console.log("ALL TESTS COMPLETED");
console.log("█".repeat(50) + "\n");

// Export for Node.js module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    Queue,
    PrintJob,
    PrinterQueue,
  };
}
