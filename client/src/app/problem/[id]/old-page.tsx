"use client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VimEditor, VimEditorHandle } from "@/components/vimEditor";
// import { cn } from "@/lib/utils";
import { Editor } from "@monaco-editor/react";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Result = {
  NumTotalTests: number;
  NumPassedTests: number;
  NumFailedTests: number;
};

export default function Home() {
  const editorRef = useRef<any>(null);
  const solEditorRef = useRef<any>(null);
  const vimRef = useRef<VimEditorHandle>(null);

  const { id } = useParams();

  const [showSolution, setShowSolution] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"normal" | "vim">("normal");
  const [problem, setProblem] = useState<any>();

  const handleUserEditorMount = (editor: any) => {
    editorRef.current = editor;
    // editor.onDidPaste(() => editor.trigger("keyboard", "undo", null));
    // editor.onContextMenu((e: any) => e.event.preventDefault());
  };

  const handleSolutionEditorMount = (editor: any) => {
    solEditorRef.current = editor;

    // editor.onKeyDown((e: any) => {
    //   if ((e.ctrlKey || e.metaKey) && e.keyCode === 52) e.preventDefault(); // safety fallback
    //   if ((e.ctrlKey || e.metaKey) && e.keyCode === monaco.KeyCode.KeyV)
    //     e.preventDefault();
    // });

    editor.onDidPaste(() => editor.trigger("keyboard", "undo", null));

    // Optional: disable context menu paste
    editor.onContextMenu((e: any) => e.event.preventDefault());
  };

  const handleSubmit = async () => {
    setLoading(true);

    let submissionCode: string | undefined;
    if (mode === "normal") {
      submissionCode = editorRef.current.getValue();
    } else {
      submissionCode = vimRef.current?.getValue();
    }

    try {
      const response = await fetch("http://localhost:8000/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // code: mode === "normal" ? normalValue : vimValue,
          code: submissionCode,
          problem_name: problem,
        }),
      });

      const data = await response.json();
      setResult({
        NumTotalTests: data.total,
        NumPassedTests: data.passed,
        NumFailedTests: data.failed,
      });
    } catch (error) {
      console.error("Failed to submit code:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchSolutionCode = async (problemName: string) => {
    setShowSolution(true);
    const response = await fetch(
      `http://localhost:8000/solution/${problemName}`,
    );
    const data = await response.json();

    if (!solEditorRef.current) {
      alert("Solution ref is null");
      return;
    }

    solEditorRef.current.setValue(data.code);
  };

  const fetchProblemCode = async (problemName: string) => {
    const response = await fetch(
      `http://localhost:8000/problem/${problemName}`,
    );
    const data = await response.json();

    // if (!editorRef.current || !vimRef.current) {
    //   alert("Editor ref is null");
    //   return;
    // }
    editorRef.current.setValue(data.code);

    if (vimRef.current && mode === "vim") {
      vimRef.current.setValue(data.code);
    }
  };

  useEffect(() => {
    if (id) {
      const problemName = id as string;
      setProblem(problemName);
      fetchProblemCode(problemName);
      // fetchSolutionCode(problemName);
    }
  }, [id]);

  return (
    <div className="max-w-7xl mx-auto p-4 min-h-screen">
      <div className="flex gap-4 items-center mb-8">
        <Button onClick={handleSubmit} disabled={loading}>
          Submit code
        </Button>
        {/* <Select */}
        {/*   value={problem} */}
        {/*   // onValueChange={(value) => setProblem(value as any)} */}
        {/*   onValueChange={(value) => { */}
        {/*     setProblem(value); */}
        {/*     fetchProblemCode(value); */}
        {/*   }} */}
        {/* > */}
        {/*   <SelectTrigger> */}
        {/*     <SelectValue placeholder="Select problem" /> */}
        {/*   </SelectTrigger> */}
        {/*   <SelectContent> */}
        {/*     {PROBLEMS.map((item, idx) => ( */}
        {/*       <SelectItem key={idx} value={item.value}>{item.label}</SelectItem> */}
        {/*     ))} */}
        {/*   </SelectContent> */}
        {/* </Select> */}
        <Button
          variant="outline"
          onClick={() => {
            if (!showSolution) fetchSolutionCode(problem);
            else setShowSolution(false);
          }}
        >
          {showSolution ? "Hide Solution" : "See Solution"}
        </Button>
        <Select
          value={mode}
          onValueChange={(value) => setMode(value as "normal" | "vim")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="vim">Vim</SelectItem>
          </SelectContent>
        </Select>

        <div className="ml-auto">
          {result && (
            <div className="flex gap-4">
              <p>Total: {result.NumTotalTests}</p>
              <p>Passed: {result.NumPassedTests}</p>
              <p>Failed: {result.NumFailedTests}</p>
            </div>
          )}
        </div>
      </div>

      {showSolution && (
        <Editor
          height="40vh"
          defaultLanguage="javascript"
          theme="vs-dark"
          onMount={handleSolutionEditorMount}
          options={{
            readOnly: true,
            domReadOnly: true, // extra layer
            contextmenu: false,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
          }}
        />
      )}
      <h1>Editor</h1>
      <div className="overflow-hidden rounded-2xl">
        {mode === "normal" && (
          <Editor
            height="80vh"
            defaultLanguage="javascript"
            theme="vs-dark"
            onMount={handleUserEditorMount}
            defaultValue="//Write your code here"
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              quickSuggestions: false,
              suggestOnTriggerCharacters: false,
              snippetSuggestions: "none",
            }}
          />
        )}
        {mode === "vim" && (
          <VimEditor
            ref={vimRef}
            minimap={{ enabled: false }}
            language="javascript"
            theme="vs-dark"
            defaultValue="//Write your code here"
            editorClassName="rounded-2xl h-[80vh]"
          />
        )}
      </div>
    </div>
  );
}
