import { startVitest } from "vitest/node";

export async function runTests() {
  const vitest = await startVitest(
    "test",
    [],
    {
      watch: false,
      environment: "happy-dom",
      setupFiles: ["./src/tests/setup.ts"],
      include: ["src/tests/problem-1.test.tsx"],
      reporters: "verbose", // explicit reporter helps ensure data collection
    },
    {
      esbuild: { jsx: "automatic" },
    },
  );

  // 1. Get the raw file/suite results
  const testModules = vitest.state.getTestModules();

  // 2. Prepare the summary containers
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;
  const testResults: any[] = [];

  // 3. Helper to recursively extract tests from suites
  const collectTests = (tasks: any[]) => {
    for (const task of tasks) {
      // If it's a suite (like a 'describe' block), recurse
      if (task.type === "suite") {
        if (task.tasks) {
          collectTests(task.tasks);
        }
      }
      // If it's an actual test
      else if (task.type === "test") {
        totalTests++;

        const status = task.result?.state || "pending"; // 'pass', 'fail', 'skip'

        if (status === "pass") passedTests++;
        if (status === "fail") failedTests++;

        // Extract error message if failed
        let failureDetails = null;
        if (status === "fail" && task.result?.errors) {
          // Get the first error message
          const rawError = task.result.errors[0]?.message || "Unknown error";
          // Strip ANSI color codes (e.g. \u001b[31m) to keep JSON clean
          failureDetails = rawError.replace(/\u001b\[\d+m/g, "");
        }

        testResults.push({
          name: task.name,
          status: status,
          error: failureDetails,
        });
      }
    }
  };

  // 4. Iterate over all modules and collect data
  for (const module of testModules) {
    // console.log("outer module tasks", module.task.tasks);
    collectTests(module.task.tasks);
  }

  await vitest.close();

  // 5. Return the structured response
  return {
    summary: {
      total: totalTests,
      passed: passedTests,
      failed: failedTests,
    },
    results: testResults,
  };
}
