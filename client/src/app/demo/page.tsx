"use client";
import { DifficultyBadge } from "@/components/difficultyBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VimEditor, VimEditorHandle } from "@/components/vimEditor";
// import { VimEditor } from "@/components/vimEditor";
// import { PROBLEMS } from "@/static_data/problems";
import { Editor } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const page = () => {
  const { id } = useParams();
  const { theme } = useTheme();

  const [mode, setMode] = useState("normal");
  const [problemName, setProblemName] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const vimRef = useRef<VimEditorHandle>(null);
  const editorRef = useRef<any>(null);

  const handleUserEditorMount = (editor: any) => {
    editorRef.current = editor;
    // editor.onDidPaste(() => editor.trigger("keyboard", "undo", null));
    // editor.onContextMenu((e: any) => e.event.preventDefault());
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
          problem_name: problemName,
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

  // const fetchSolutionCode = async (problemName: string) => {
  //   setShowSolution(true);
  //   const response = await fetch(
  //     `http://localhost:8000/solution/${problemName}`,
  //   );
  //   const data = await response.json();

  //   if (!solEditorRef.current) {
  //     alert("Solution ref is null");
  //     return;
  //   }

  //   solEditorRef.current.setValue(data.code);
  // };

  const fetchProblemCode = async (problemName: string) => {
    const response = await fetch(
      `http://localhost:8000/problem/${problemName}`,
    );
    //this should return the entire problem object with topics and stuff
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
      setProblemName(problemName);
      fetchProblemCode(problemName);
      // fetchSolutionCode(problemName);
    }
  }, [id]);

  return (
    <div className="max-w-7xl mx-auto sm:py-4 py-4 px-2">
      <header className="border border-border bg-card rounded-lg p-4 flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold">{problemName}</h1>
          <div className="flex flex-wrap gap-1">
            {/* {problem.topics.map((topic) => ( */}
            {/*   <Badge key={topic} variant={"outline"} className="capitalize"> */}
            {/*     {topic} */}
            {/*   </Badge> */}
            {/* ))} */}
          </div>
        </div>
        {/* <DifficultyBadge difficulty={problem.difficulty} /> */}
      </header>

      <main className="grid grid-cols-1 h-[80vh] gap-4 mt-4 sm:grid-cols-2">
        <div className="border border-border max-h-full overflow-scroll bg-card rounded-lg p-4">
          <h2 className="text-xl font-semibold">Description</h2>
          {/* <p>{problem.description}</p> */}
          <p>problem.description</p>
        </div>

        <div className="border border-border rounded-lg overflow-hidden relative">
          {/* <Editor */}
          {/*     height="100%" */}
          {/*     defaultLanguage="javascript" */}
          {/*     defaultValue={problem.boilerplate} */}
          {/*     theme="vs-dark" */}
          {/* /> */}
          <div className="absolute bottom-0 right-0 p-4 z-10 flex w-full justify-between ">
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
            <Button>Submit</Button>
            <Button>See Solution</Button>
          </div>
          {mode === "normal" && (
            <Editor
              height="100%"
              defaultLanguage="javascript"
              theme={theme === "dark" ? "vs-dark" : "light"}
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
      </main>
    </div>
  );
};

export default page;
