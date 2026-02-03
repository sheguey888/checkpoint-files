/**
 * BRUTE-FORCE ALGORITHM
 * Explores all possible combinations of non-overlapping tasks
 * Time Complexity: O(2^n) - Exponential
 * Space Complexity: O(n) - Recursion stack depth
 */
function bruteForceSolution(tasks) {
  // Sort tasks by start time for easier processing
  const sorted = [...tasks].sort((a, b) => a.start - b.start);

  let maxCount = 0;
  let bestSelection = [];

  // Recursive function to explore all combinations
  function exploreAllCombinations(index, currentSelection) {
    // Base case: we've considered all tasks
    if (index === sorted.length) {
      if (currentSelection.length > maxCount) {
        maxCount = currentSelection.length;
        bestSelection = [...currentSelection];
      }
      return;
    }

    // Check if current task can be added (no overlap with last selected task)
    const canAdd =
      currentSelection.length === 0 ||
      sorted[index].start >= currentSelection[currentSelection.length - 1].end;

    if (canAdd) {
      // Include current task
      currentSelection.push(sorted[index]);
      exploreAllCombinations(index + 1, currentSelection);
      currentSelection.pop();
    }

    // Exclude current task
    exploreAllCombinations(index + 1, currentSelection);
  }

  exploreAllCombinations(0, []);

  return {
    count: maxCount,
    tasks: bestSelection,
  };
}

/**
 * GREEDY ALGORITHM
 * Selects tasks that end earliest (Activity Selection Problem)
 * Time Complexity: O(n log n) - Due to sorting
 * Space Complexity: O(n) - For storing sorted array
 */
function greedySolution(tasks) {
  // Sort tasks by end time (greedy choice: earliest ending first)
  const sorted = [...tasks].sort((a, b) => a.end - b.end);

  const selected = [];
  let lastEndTime = -Infinity;

  for (const task of sorted) {
    // If task starts after or when the last selected task ends
    if (task.start >= lastEndTime) {
      selected.push(task);
      lastEndTime = task.end;
    }
  }

  return {
    count: selected.length,
    tasks: selected,
  };
}

/**
 * Helper function to check if two tasks overlap
 */
function tasksOverlap(task1, task2) {
  return task1.start < task2.end && task2.start < task1.end;
}

/**
 * Validate that selected tasks don't overlap
 */
function validateSelection(tasks) {
  for (let i = 0; i < tasks.length - 1; i++) {
    for (let j = i + 1; j < tasks.length; j++) {
      if (tasksOverlap(tasks[i], tasks[j])) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Generate random tasks for testing
 */
function generateRandomTasks(count, maxTime = 100) {
  const tasks = [];
  for (let i = 0; i < count; i++) {
    const start = Math.floor(Math.random() * maxTime);
    const duration = Math.floor(Math.random() * 10) + 1;
    const end = start + duration;
    tasks.push({ start, end });
  }
  return tasks;
}

/**
 * Generate edge case: All tasks overlapping
 */
function generateAllOverlapping(count) {
  const tasks = [];
  for (let i = 0; i < count; i++) {
    tasks.push({ start: 0, end: 10 });
  }
  return tasks;
}

/**
 * Generate edge case: All tasks non-overlapping
 */
function generateAllNonOverlapping(count) {
  const tasks = [];
  for (let i = 0; i < count; i++) {
    tasks.push({ start: i * 10, end: i * 10 + 5 });
  }
  return tasks;
}

/**
 * Generate edge case: Tasks with same start/end times
 */
function generateSameStartEnd(count) {
  const tasks = [];
  for (let i = 0; i < count; i++) {
    const sameTime = Math.floor(i / 3) * 10;
    tasks.push({ start: sameTime, end: sameTime + 5 });
  }
  return tasks;
}

export {
  bruteForceSolution,
  greedySolution,
  validateSelection,
  generateRandomTasks,
  generateAllOverlapping,
  generateAllNonOverlapping,
  generateSameStartEnd,
};
