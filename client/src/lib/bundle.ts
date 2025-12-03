import * as esbuild from "esbuild-wasm";

//builds input code using esbuild-wasm
export async function bundle(inputCode: string, fetcher?: (path: string) => Promise<string | null>) {
    const result = await esbuild.build({
        write: false,
        bundle: true,
        format: "esm",
        jsx: "transform",
        jsxFactory: "React.createElement",
        jsxFragment: "React.Fragment",
        plugins: [
            {
                name: "virtual-fs-plugin",
                setup(build) {
                    // Intercept paths starting with @/
                    build.onResolve({ filter: /^@\// }, (args) => {
                        return {
                            path: args.path.substring(2), // remove @/
                            namespace: "virtual-fs",
                        };
                    });

                    // Load content using the fetcher
                    build.onLoad({ filter: /.*/, namespace: "virtual-fs" }, async (args) => {
                        if (!fetcher) {
                            return {
                                errors: [{ text: "Virtual FS fetcher not provided" }],
                            };
                        }

                        const content = await fetcher(args.path);

                        if (!content) {
                            return {
                                errors: [{ text: `File not found: ${args.path}` }],
                            };
                        }

                        return {
                            contents: content,
                            loader: "tsx", // Assume tsx for simplicity, or infer from path if we passed it back
                        };
                    });
                },
            },
            {
                name: "http-import-plugin",
                setup(build) {
                    // Match anything that is NOT a relative path (starts with . or /)
                    // This includes scoped packages like @radix-ui/...
                    // Since virtual-fs-plugin runs first, @/ is already handled.
                    build.onResolve({ filter: /^[^.\/]/ }, (args) => {
                        if (args.path === "react") {
                            return { path: "https://esm.sh/react@19", external: true };
                        }
                        if (args.path === "react-dom") {
                            return { path: "https://esm.sh/react-dom@19", external: true };
                        }
                        return { path: `https://esm.sh/${args.path}`, external: true };
                    });
                },
            },
        ],
        loader: {
            ".tsx": "tsx",
            ".ts": "ts",
            ".js": "jsx",
            ".jsx": "jsx",
        },
        stdin: {
            contents: inputCode,
            resolveDir: "/",
            sourcefile: "index.tsx",
            loader: "tsx",
        },
    });

    return result.outputFiles[0].text;
}
