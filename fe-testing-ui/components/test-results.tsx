export const TestResults = ({ results }: any) => {
  if (!results) return <div>No test results yet</div>;

  return (
    <div>
      <h2>Test Results</h2>
      <h3>Total: {results.summary.total}</h3>
      <h3>Passed: {results.summary.passed}</h3>
      <h3>Failed: {results.summary.failed}</h3>
    </div>
  );
};
