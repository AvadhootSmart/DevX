import React from "react";
import { Highlight, themes, type Language } from "prism-react-renderer";

interface CodeBlockProps {
  code: string;
  language?: Language;
  className?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = "javascript",
  className = "",
}) => {
  return (
    <Highlight
      theme={themes.oneDark}
      code={code}
      language={language}
    >
      {({ className: inheritedClass, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={`${inheritedClass} ${className} p-4 rounded-md text-sm overflow-auto`}
          style={style}
        >
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
};

export default CodeBlock;
