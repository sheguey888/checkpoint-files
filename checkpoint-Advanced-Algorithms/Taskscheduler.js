/**
 * Create a task object
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 */
function createTask(name, startTime, endTime, priority) {
  return {
    name,
    startTime,
    endTime,
    priority, // "High", "Medium", "Low"
  };
}

/**
 * Convert task to string format
 * Time Complexity: O(1)
 */
function taskToString(task) {
  return `${task.name} [${task.startTime} - ${task.endTime}] (${task.priority})`;
}

/**
 * Sort tasks by start time using efficient merge sort (via Array.sort)
 * Time Complexity: O(n log n) - JavaScript's sort uses optimized TimSort
 * Space Complexity: O(n) - Due to the sorting algorithm
 */
function sortByStartTime(tasks) {
  console.log("\n--- Sorting Tasks by Start Time ---");
  console.log("Time Complexity: O(n log n)");
  console.log("Space Complexity: O(n)");

  const startTime = performance.now();

  const sorted = [...tasks].sort((a, b) => {
    // Compare time strings directly (works for "HH:MM" format)
    if (a.startTime < b.startTime) return -1;
    if (a.startTime > b.startTime) return 1;
    return 0;
  });

  const endTime = performance.now();
  console.log(`Execution time: ${(endTime - startTime).toFixed(4)} ms`);

  return sorted;
}

/**
 * Group tasks by priority using a hash map
 * Time Complexity: O(n) - Single pass through all tasks
 * Space Complexity: O(n) - Storage for all tasks in grouped structure
 */
function groupByPriority(tasks) {
  console.log("\n--- Grouping Tasks by Priority ---");
  console.log("Time Complexity: O(n)");
  console.log("Space Complexity: O(n)");

  const startTime = performance.now();

  const grouped = {
    High: [],
    Medium: [],
    Low: [],
  };

  // Single pass through tasks - O(n)
  for (const task of tasks) {
    grouped[task.priority].push(task);
  }

  const endTime = performance.now();
  console.log(`Execution time: ${(endTime - startTime).toFixed(4)} ms`);

  return grouped;
}

/**
 * Helper function to check if two tasks overlap
 * Time Complexity: O(1)
 */
function tasksOverlap(task1, task2) {
  // Tasks overlap if one starts before the other ends
  return task1.startTime < task2.endTime && task2.startTime < task1.endTime;
}

/**
 * Detect overlapping tasks
 * Time Complexity: O(n log n) - Due to sorting, then O(n) for comparison
 * Space Complexity: O(n) - Storage for overlapping pairs
 */
function detectOverlappingTasks(tasks) {
  console.log("\n--- Detecting Overlapping Tasks ---");
  console.log("Time Complexity: O(n log n)");
  console.log("Space Complexity: O(n)");

  const startTime = performance.now();

  const overlaps = [];

  // First, sort by start time - O(n log n)
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.startTime < b.startTime) return -1;
    if (a.startTime > b.startTime) return 1;
    return 0;
  });

  // Compare adjacent and nearby tasks - O(n)
  for (let i = 0; i < sortedTasks.length; i++) {
    for (let j = i + 1; j < sortedTasks.length; j++) {
      const task1 = sortedTasks[i];
      const task2 = sortedTasks[j];

      // If task2 starts after task1 ends, no more overlaps possible
      if (task2.startTime >= task1.endTime) {
        break;
      }

      // Check if tasks overlap
      if (tasksOverlap(task1, task2)) {
        overlaps.push([task1, task2]);
      }
    }
  }

  const endTime = performance.now();
  console.log(`Execution time: ${(endTime - startTime).toFixed(4)} ms`);

  return overlaps;
}

/**
 * Estimate memory usage
 * Time Complexity: O(n) - Iterating through tasks
 * Space Complexity: O(1) - Only tracking numbers
 */
function estimateMemoryUsage(tasks) {
  console.log("\n--- Estimating Memory Usage ---");
  console.log("Time Complexity: O(n)");
  console.log("Space Complexity: O(1)");

  const startTime = performance.now();

  let totalBytes = 0;

  // Base object overhead (approximate)
  const objectOverhead = 40; // bytes per object

  for (const task of tasks) {
    // Object overhead
    totalBytes += objectOverhead;

    // String properties (approximate 2 bytes per character for UTF-16)
    totalBytes += task.name.length * 2;
    totalBytes += task.startTime.length * 2;
    totalBytes += task.endTime.length * 2;
    totalBytes += task.priority.length * 2;
  }

  // Array overhead
  totalBytes += 40 + tasks.length * 8; // Array overhead + pointer size

  const endTime = performance.now();
  console.log(`Execution time: ${(endTime - startTime).toFixed(4)} ms`);

  return {
    bytes: totalBytes,
    kilobytes: (totalBytes / 1024).toFixed(2),
    megabytes: (totalBytes / (1024 * 1024)).toFixed(4),
  };
}

/**
 * Display all tasks
 * Time Complexity: O(n)
 */
function displayTasks(tasks) {
  console.log("\n--- All Tasks ---");
  tasks.forEach((task, index) => {
    console.log(`${index + 1}. ${taskToString(task)}`);
  });
  console.log();
}

export {
  createTask,
  taskToString,
  sortByStartTime,
  groupByPriority,
  detectOverlappingTasks,
  estimateMemoryUsage,
  displayTasks,
};
