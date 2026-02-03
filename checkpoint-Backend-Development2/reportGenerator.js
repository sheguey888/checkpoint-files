function generateReport(name, scores) {
  // Calculate average
  const sum = scores.reduce((acc, score) => acc + score, 0);
  const average = sum / scores.length;

  // Determine pass/fail status (pass if average ≥ 10)
  const status = average >= 10 ? "PASS" : "FAIL";

  // Return formatted report object
  return {
    studentName: name,
    scores: scores,
    average: parseFloat(average.toFixed(2)),
    status: status,
    totalSubjects: scores.length,
  };
}

module.exports = { generateReport };
