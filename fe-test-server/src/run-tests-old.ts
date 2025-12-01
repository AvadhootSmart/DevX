import { startVitest } from "vitest/node";

export async function runTestsOld() {
  const vitest = await startVitest(
    "test",
    [], // CLI filters
    {
      watch: false, // IMPT: Disable watch mode for API usage
      environment: "happy-dom", // Fixes "document is not defined"
      setupFiles: ["./src/tests/setup.ts"], // Optional: For cleanup (see step 3)
      include: ["src/tests/problem-1.test.tsx"], // Be specific about which test to run
    },
    {}, // override Vite config
    {}, // custom Vitest options
  );

  const testModules = vitest.state.getTestModules();

  const response = [];
  for (const testModule of testModules) {
    // Basic logging to server console
    // console.log(testModule.moduleId, testModule.ok() ? "passed" : "failed");

    response.push({
      moduleId: testModule.moduleId,
      ok: testModule.ok() ? "passed" : "failed",
      // You might want to capture specific error messages here for the UI
      errors: testModule.ok()
        ? []
        : vitest.state.getReportedEntityById(testModule.moduleId),
    });
  }

  // 3. Close the vitest instance to free resources
  await vitest.close();

  return response;
}
