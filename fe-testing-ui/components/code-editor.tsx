import Editor from "@monaco-editor/react";

type CodeEditorProps = {
  code: string;
  onChange: (val: string) => void;
};

export const CodeEditor = ({ code, onChange }: CodeEditorProps) => {
  return (
    <Editor
      height="100%"
      language="javascript"
      theme="vs-dark"
      value={code}
      onChange={(value) => onChange(value ?? "")}
    />
  );
};
