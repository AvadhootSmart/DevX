import * as esbuild from "esbuild-wasm";

//builds input code using esbuild-wasm
export async function bundle(inputCode: string) {
  const result = await esbuild.build({
    write: false,
    bundle: true,
    format: "esm",
    jsx: "transform", 
    jsxFactory: "React.createElement",
    jsxFragment: "React.Fragment",
    loader: {
      ".tsx": "tsx",
      ".ts": "ts",
      ".js": "jsx",
      ".jsx": "jsx"
    },
    stdin: {
      contents: inputCode,
      resolveDir: "/",
      sourcefile: "index.tsx",
      loader: "tsx",
    },
    external: ["react", "react-dom"], 
  });

  return result.outputFiles[0].text;
}
