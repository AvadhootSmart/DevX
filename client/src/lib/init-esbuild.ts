import * as esbuild from "esbuild-wasm";

let initialized = false;

export async function initEsbuild() {
    if (initialized) return;

    await esbuild.initialize({
        wasmURL: "/esbuild.wasm",
        worker: true,
    });

    initialized = true;
}
