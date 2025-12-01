"use client";

import { useState } from "react";
import { CodeEditor } from "@/components/code-editor";
// import { Preview } from "@/components/preview";
import { ProblemDescription } from "@/components/problem-description";
import { TestResults } from "@/components/test-results";
import { PreviewEsbuild } from "@/components/preview-esbuild";
import { HERO } from "@/static/component";
import { COUNTER, COUNTER_2 } from "@/static/counter";
import { bundle } from "@/lib/bundle";
import { runTests } from "@/lib/test-runner";
import { counterTests } from "@/static/tests/counter.test";

const Page = () => {
  //   const [code, setCode] = useState(`
  // export function Card() {
  //   return (
  //     <div data-testid="card" style={{
  //       width: "300px",
  //       height: "200px",
  //       borderRadius: "12px",
  //       background: "lightgray"
  //     }}>
  //     </div>
  //   );
  // }
  //   `);

  const [reactCode, setReactCode] = useState(COUNTER_2);

  const [results, setResults] = useState<any>([]);

  async function runAllTests() {
    const bundledCode = await bundle(reactCode);
    const testResults = await runTests(bundledCode);

    console.log(testResults);
    setResults(testResults);
  }

  return (
    <div style={{ height: "100vh", display: "flex" }}>
      {/* LEFT: Problem Description */}
      <div
        style={{
          width: "30%",
          borderRight: "1px solid #ddd",
          overflowY: "auto",
        }}
      >
        <ProblemDescription />
      </div>

      {/* RIGHT: Editor + Preview + Tests */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        {/* Editor Section */}
        <div style={{ flex: 1, borderBottom: "1px solid #ddd" }}>
          <CodeEditor code={reactCode} onChange={setReactCode} />
        </div>

        <button onClick={runAllTests} className="p-2 bg-green-600 text-white">
          Run Tests
        </button>

        {/* Preview + Tests horizontally */}
        <div style={{ display: "flex", flex: 1 }}>
          <div style={{ flex: 2, borderRight: "1px solid #ddd" }}>
            <PreviewEsbuild code={reactCode} />
          </div>

          <div style={{ flex: 1 }}>
            <TestResults results={results} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
