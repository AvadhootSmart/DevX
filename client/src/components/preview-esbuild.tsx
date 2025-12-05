"use client";

import { bundle } from "@/lib/bundle";
import { initEsbuild } from "@/lib/init-esbuild";
import { useEffect, useRef, useState } from "react";

interface PreviewEsbuildProps {
  code: string;
}

export const PreviewEsbuild = ({ code }: PreviewEsbuildProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [esbuildReady, setEsbuildReady] = useState(false);
  const [iframeReady, setIframeReady] = useState(false);

  // 1) Initialize esbuild once
  useEffect(() => {
    (async () => {
      if (esbuildReady) return;
      await initEsbuild();
      setEsbuildReady(true);
    })();
  }, [esbuildReady]);

  // 2) Create the iframe shell once when esbuild is ready
  useEffect(() => {
    if (!esbuildReady || !iframeRef.current) return;

    const html = `
<html>
  <head>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="bg-white dark:bg-zinc-900 border-0 h-screen m-0 p-0">
    <div id="root"></div>

    <script type="module">
      import React from "https://esm.sh/react@19";
      import { createRoot } from "https://esm.sh/react-dom@19/client";

      window.React = React;

      const root = createRoot(document.getElementById("root"));

      const renderError = (err) => {
        root.render(
          React.createElement(
            "pre",
            { style: { color: "red", whiteSpace: "pre-wrap" } },
            String(err && err.message ? err.message : err)
          )
        );
      };

      // Listen for bundled code from parent
      window.addEventListener("message", async (event) => {
        if (!event.data || event.data.type !== "bundle") return;

        try {
          const bundled = event.data.code;
          const mod = await import("data:text/javascript;base64," + btoa(bundled));
          const Component =
            mod.default ||
            mod.App ||
            Object.values(mod)[0];

          root.render(React.createElement(Component));
        } catch (err) {
          renderError(err);
        }
      });
    </script>
  </body>
</html>
    `;

    const iframe = iframeRef.current;

    const handleLoad = () => {
      setIframeReady(true);
    };

    iframe.addEventListener("load", handleLoad);
    iframe.srcdoc = html;

    return () => {
      iframe.removeEventListener("load", handleLoad);
    };
  }, [esbuildReady]);

  // 3) On code changes → bundle and send to iframe (no reload, no flash)
  useEffect(() => {
    if (!esbuildReady || !iframeReady || !iframeRef.current) return;

    (async () => {
      const bundledCode = await bundle(code);

      iframeRef.current!.contentWindow!.postMessage(
        {
          type: "bundle",
          code: bundledCode,
        },
        "*"
      );
    })();
  }, [code, esbuildReady, iframeReady]);

  return (
    <iframe
      ref={iframeRef}
      sandbox="allow-scripts allow-same-origin"
      className="w-full h-full"
    />
  );
};
