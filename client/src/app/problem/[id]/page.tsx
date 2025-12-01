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
import { Editor } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IProblem } from "../../../../types/problem.types";
import { cn } from "@/lib/utils";
import useUser from "../../../../store/user.store";
import { toast } from "sonner";
import { Check } from "lucide-react";

const Page = () => {
  const { id } = useParams();
  const { theme } = useTheme();

  const { token } = useUser();

  const [mode, setMode] = useState<"normal" | "vim">("normal");
  const [problem, setProblem] = useState<IProblem | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const editorRef = useRef<any>(null);
  const vimRef = useRef<VimEditorHandle>(null);
  const boilerplateRef = useRef<string>("");

  const handleUserEditorMount = (editor: any) => {
    editorRef.current = editor;

    // Disable unwanted actions
    editor.onDidPaste(() => editor.trigger("keyboard", "undo", null));
    editor.onContextMenu((e: any) => e.event.preventDefault());

    // If the problem is already loaded, set the boilerplate
    if (boilerplateRef.current) {
      editor.setValue(boilerplateRef.current);
    }
  };

  // 🧠 Fetch problem data
  const fetchProblemData = async (problemName: string) => {
    try {
      const response = await fetch(
        `http://localhost:8000/problem/${problemName}`,
      );
      const data = await response.json();

      console.log(data);
      boilerplateRef.current = data.boilerplate;
      setProblem(data);
    } catch (error) {
      console.error("Failed to fetch problem data:", error);
    }
  };

  // 🧩 Submit handler
  const handleSubmit = async () => {
    if (!token) {
      toast.message("You must be logged in to submit a solution");
      return;
    }
    setLoading(true);

    const submissionCode =
      mode === "normal"
        ? editorRef.current?.getValue()
        : vimRef.current?.getValue();

    try {
      const response = await fetch("http://localhost:8000/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: submissionCode,
          problem_path: problem?.path,
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProblemData(id as string);
    }
  }, [id]);

  useEffect(() => {
    const boilerplate = boilerplateRef.current;
    if (!boilerplate) return;

    if (editorRef.current) {
      editorRef.current.setValue(boilerplate);
    }

    if (vimRef.current) {
      vimRef.current.setValue(boilerplate);
    }
  }, [problem]); // runs when problem loads

  return (
    <div className="max-w-7xl mx-auto sm:py-4 py-4 px-2">
      <header className="border border-border bg-card rounded-lg p-4 flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold">{problem?.problem_name}</h1>
          <div className="flex flex-wrap gap-1">
            {problem?.topics.map((topic) => (
              <Badge key={topic} variant="outline" className="capitalize">
                {topic}
              </Badge>
            ))}
          </div>
        </div>
        <DifficultyBadge difficulty={problem?.difficulty} />
      </header>

      <main className="grid grid-cols-1 h-[80vh] gap-4 mt-4 sm:grid-cols-2">
        <div className="border border-border max-h-full overflow-scroll bg-card rounded-lg p-4">
          <h2 className="text-xl font-semibold">Description</h2>
          <p>{problem?.description}</p>
        </div>

        <div className="border border-border rounded-lg overflow-hidden relative">
          {/* Toolbar */}
          <div className="absolute bottom-0 right-0 p-4 z-10 flex w-full justify-between">
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

            <Button
              onClick={handleSubmit}
              disabled={loading || !token}
              className="cursor-pointer"
            >
              {!token ? (
                "Login to submit"
              ) : loading ? (
                "Submitting..."
              ) : (
                <span className="flex items-center">
                  Submit <Check className="size-4 ml-2" />
                </span>
              )}
            </Button>
          </div>

          <div className="relative w-full h-full">
            <div className={mode === "normal" ? "block h-full" : "hidden"}>
              <Editor
                height="100%"
                defaultLanguage="javascript"
                theme={theme === "dark" ? "vs-dark" : "light"}
                onMount={handleUserEditorMount}
                defaultValue="// Write your code here"
                options={{
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  quickSuggestions: false,
                  suggestOnTriggerCharacters: false,
                  snippetSuggestions: "none",
                }}
              />
            </div>

            <VimEditor
              ref={vimRef}
              language="javascript"
              theme={theme === "dark" ? "vs-dark" : "light"}
              defaultValue="// Write your code here"
              editorClassName={cn("rounded-2xl h-[80vh] w-full")}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Page;
