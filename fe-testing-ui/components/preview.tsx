import { useEffect, useRef } from "react";
import * as Babel from "@babel/standalone";

type PreviewProps = {
  code: string;
};
export const Preview = ({ code }: PreviewProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    const transpiled = Babel.transform(code, {
      filename: "file.tsx",
      presets: ["typescript", ["react", { runtime: "classic" }]],
    }).code!;

    const html = `
<html>
  <body style="margin:0;padding:0;">
    <div id="root" style="display:flex;align-items:center;justify-content:center;height:100vh;"></div>

    <script type="module">
      import React from "https://esm.sh/react";
      import { createRoot } from "https://esm.sh/react-dom/client";
      import * as JSXRuntime from "https://esm.sh/react/jsx-runtime";

      // expose jsx runtime to transpiled code
      window.__jsxRuntime = JSXRuntime;

      ${transpiled}

      window.Card = Card;

      const root = createRoot(document.getElementById("root"));
      root.render(React.createElement(window.Card));
    </script>
  </body>
</html>
`;

    iframeRef.current!.srcdoc = html;
  }, [code]);

  return (
    <iframe
      ref={iframeRef}
      style={{ width: "100%", height: "100%", background: "white" }}
    />
  );
};
