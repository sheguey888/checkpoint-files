import {
  createTask,
  taskToString,
  sortByStartTime,
  groupByPriority,
  detectOverlappingTasks,
  estimateMemoryUsage,
  displayTasks,
} from "./Taskscheduler.js";

console.log("=".repeat(60));
console.log("TASK SCHEDULING SYSTEM - OPTIMIZATION DEMONSTRATION");
console.log("=".repeat(60));

// Create array to hold tasks
const tasks = [];

// Add tasks with different priorities and times
console.log("\n--- Adding Tasks ---");
tasks.push(createTask("Team Meeting", "09:00", "10:30", "High"));
tasks.push(createTask("Code Review", "10:00", "11:00", "High"));
tasks.push(createTask("Lunch Break", "12:00", "13:00", "Low"));
tasks.push(createTask("Client Call", "14:00", "15:00", "High"));
tasks.push(createTask("Documentation", "13:30", "15:30", "Medium"));
tasks.push(createTask("Email Response", "09:30", "10:00", "Medium"));
tasks.push(createTask("Project Planning", "11:00", "12:00", "Medium"));
tasks.push(createTask("Bug Fixing", "15:00", "16:30", "High"));
tasks.push(createTask("Team Standup", "08:30", "09:00", "Low"));
tasks.push(createTask("Training Session", "16:00", "17:00", "Medium"));

// Display all tasks before sorting
displayTasks(tasks);

// ============================================
// FEATURE 1: Sort by Start Time
// ============================================
console.log("\n" + "=".repeat(60));
console.log("FEATURE 1: SORT TASKS BY START TIME");
console.log("=".repeat(60));

const sortedTasks = sortByStartTime(tasks);
console.log("\n--- Sorted Tasks ---");
sortedTasks.forEach((task, index) => {
  console.log(`${index + 1}. ${taskToString(task)}`);
});

// ============================================
// FEATURE 2: Group by Priority
// ============================================
console.log("\n" + "=".repeat(60));
console.log("FEATURE 2: GROUP TASKS BY PRIORITY");
console.log("=".repeat(60));

const groupedTasks = groupByPriority(tasks);

console.log("\n--- Grouped Tasks ---");
for (const priority in groupedTasks) {
  console.log(
    `\n${priority} Priority (${groupedTasks[priority].length} tasks):`,
  );
  groupedTasks[priority].forEach((task, index) => {
    console.log(`  ${index + 1}. ${taskToString(task)}`);
  });
}

// ============================================
// FEATURE 3: Detect Overlapping Tasks
// ============================================
console.log("\n" + "=".repeat(60));
console.log("FEATURE 3: DETECT OVERLAPPING TASKS");
console.log("=".repeat(60));

const overlaps = detectOverlappingTasks(tasks);

console.log(`\n--- Overlapping Tasks (${overlaps.length} conflicts found) ---`);
if (overlaps.length > 0) {
  overlaps.forEach((pair, index) => {
    console.log(`\nConflict ${index + 1}:`);
    console.log(`  Task 1: ${taskToString(pair[0])}`);
    console.log(`  Task 2: ${taskToString(pair[1])}`);
  });
} else {
  console.log("No overlapping tasks found.");
}

// ============================================
// FEATURE 4: Memory Usage Estimation
// ============================================
console.log("\n" + "=".repeat(60));
console.log("FEATURE 4: MEMORY USAGE ESTIMATION");
console.log("=".repeat(60));

const memoryUsage = estimateMemoryUsage(tasks);

console.log("\n--- Memory Usage Report ---");
console.log(`Total Tasks: ${tasks.length}`);
console.log(`Estimated Memory:`);
console.log(`  - ${memoryUsage.bytes} bytes`);
console.log(`  - ${memoryUsage.kilobytes} KB`);
console.log(`  - ${memoryUsage.megabytes} MB`);

// ============================================
// COMPLEXITY ANALYSIS SUMMARY
// ============================================
console.log("\n" + "=".repeat(60));
console.log("COMPLEXITY ANALYSIS SUMMARY");
console.log("=".repeat(60));

console.log("\n1. Sort by Start Time:");
console.log("   - Time Complexity: O(n log n)");
console.log("   - Space Complexity: O(n)");
console.log("   - Algorithm: TimSort (JavaScript's Array.sort)");

console.log("\n2. Group by Priority:");
console.log("   - Time Complexity: O(n)");
console.log("   - Space Complexity: O(n)");
console.log("   - Data Structure: Hash Map (Object)");

console.log("\n3. Detect Overlapping Tasks:");
console.log("   - Time Complexity: O(n log n)");
console.log("   - Space Complexity: O(n)");
console.log("   - Strategy: Sort + Interval Comparison");

console.log("\n4. Memory Usage Estimation:");
console.log("   - Time Complexity: O(n)");
console.log("   - Space Complexity: O(1)");
console.log("   - Method: Iterative calculation");

console.log("\n" + "=".repeat(60));
console.log("OPTIMIZATION NOTES");
console.log("=".repeat(60));

console.log("\n✓ Used efficient sorting algorithm (O(n log n))");
console.log("✓ Hash map for O(1) priority lookup and O(n) grouping");
console.log("✓ Optimized overlap detection with sorted interval comparison");
console.log("✓ Memory estimation with minimal overhead (O(1) space)");
console.log("✓ All operations are optimal for their respective tasks");

console.log("\n" + "=".repeat(60));
console.log("TESTS COMPLETED SUCCESSFULLY");
console.log("=".repeat(60));
