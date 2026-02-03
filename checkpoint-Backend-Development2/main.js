const { generateReport } = require("./reportGenerator");

// Example data
const studentName = "Cheikh Gueye";
const scores = [12, 15, 8, 14, 10];

// Call the function
const report = generateReport(studentName, scores);

// Print the report in the terminal
console.log("=== Student Report ===");
console.log(`Name: ${report.studentName}`);
console.log(`Scores: ${report.scores.join(", ")}`);
console.log(`Average: ${report.average}`);
console.log(`Status: ${report.status}`);
console.log(`Total Subjects: ${report.totalSubjects}`);
console.log("======================");
