// export async function runTests(bundledCode: string, tests: Function[]) {
//   try {
//     const mod = await import(`data:text/javascript;base64,${btoa(bundledCode)}`);

//     const results = [];

//     for (const test of tests) {
//       try {
//         await test(mod);
//         results.push({ pass: true, message: test.name });
//       } catch (err: any) {
//         results.push({ pass: false, message: err.message ?? String(err) });
//       }
//     }

//     return results;
//   } catch (err: any) {
//     return [{ pass: false, message: err.message ?? String(err) }];
//   }
// }

export async function runTests(bundledCode: string) {
  try {
    const response = await fetch("http://localhost:4001/run", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: bundledCode,
        problemId: "problem-1",
      }),
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const results = await response.json();
    return results;
  } catch (err: any) {
    return [{ pass: false, message: err.message ?? String(err) }];
  }
}
