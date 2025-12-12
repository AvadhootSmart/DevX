"use client";

// import { DifficultyBadge } from "@/components/difficultyBadge";
// import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
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
import {
  ProblemHeader,
  LayoutType,
} from "@/components/problem-page/problem-header";
import { PreviewEsbuild } from "@/components/preview-esbuild";
import { motion, AnimatePresence } from "motion/react";
import { SubmissionResultDialog } from "@/components/submission-result-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getProblemData } from "@/api/problems";
import { submitCode } from "@/api/submission";

const Page = () => {
  const { id } = useParams();
  const { theme } = useTheme();

  const { token } = useUser();

  // const [mode, setMode] = useState<"normal" | "vim">("normal");
  const [problem, setProblem] = useState<IProblem | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [layout, setLayout] = useState<LayoutType>("classic");
  const [code, setCode] = useState<string>("");
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [submittedCode, setSubmittedCode] = useState<string>("");

  const editorRef = useRef<any>(null);
  // const vimRef = useRef<VimEditorHandle>(null);
  const boilerplateRef = useRef<string>("");

  const handleUserEditorMount = (editor: any) => {
    editorRef.current = editor;

    // Disable unwanted actions
    // editor.onDidPaste(() => editor.trigger("keyboard", "undo", null));
    editor.onContextMenu((e: any) => e.event.preventDefault());

    // If the problem is already loaded, set the boilerplate
    if (boilerplateRef.current) {
      editor.setValue(boilerplateRef.current);
      setCode(boilerplateRef.current);
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  };

  // 🧠 Fetch problem data
  const fetchProblemData = async (problemName: string) => {
    try {
      const data = await getProblemData(problemName);
      // console.log(data);
      boilerplateRef.current = data.boilerplate;
      console.log(data);
      setProblem(data);
      setCode(data.boilerplate);
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

    // const submissionCode =
    //   mode === "normal"
    //     ? editorRef.current?.getValue()
    //     : vimRef.current?.getValue();

    const submissionCode = editorRef.current?.getValue();

    // Save the submitted code
    setSubmittedCode(submissionCode);

    // Create an AbortController with a 20-second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    try {
      if (!problem) {
        toast.error("Refresh and try again");
        return;
      }

      const data = await submitCode(submissionCode, problem.path, problem.ID);

      // Format the result to match the dialog's expected structure
      const formattedResult = {
        message: data.message || "Submission created successfully",
        results: {
          numTotalTests: data.results?.numTotalTests || 0,
          numPassedTests: data.results?.numPassedTests || 0,
          numFailedTests: data.results?.numFailedTests || 0,
        },
      };

      setResult(formattedResult);
      setShowResultDialog(true);
    } catch (error) {
      console.error("Error submitting code from client", error);
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

    // if (vimRef.current) {
    //   vimRef.current.setValue(boilerplate);
    // }
    setCode(boilerplate);
  }, [problem]); // runs when problem loads

  // Reset layout when problem domain changes
  useEffect(() => {
    if (problem) {
      setLayout("classic");
    }
  }, [problem?.domain]);

  const showDescription = ["classic", "bento", "full-description"].includes(
    layout,
  );
  const showRightPane = [
    "classic",
    "focus",
    "bento",
    "full-preview",
    "full-editor",
  ].includes(layout);

  const showEditor = ["classic", "focus", "bento", "full-editor"].includes(
    layout,
  );
  const showPreview = ["focus", "bento", "full-preview"].includes(layout);

  const isSplitRightPane = ["focus", "bento"].includes(layout);

  return (
    <div className="max-w-7xl mx-auto sm:py-4 py-4 px-2">
      {problem && (
        <ProblemHeader
          type={problem.domain}
          problem={problem}
          layout={layout}
          setLayout={setLayout}
        />
      )}

      <main
        className={cn(
          "gap-4 mt-4 transition-all duration-300 ease-in-out",
          layout === "bento" ? "flex flex-col" : "grid h-[80vh]",
          layout !== "bento" &&
          (showDescription && showRightPane
            ? "grid-cols-1 sm:grid-cols-2"
            : "grid-cols-1"),
        )}
      >
        <AnimatePresence mode="popLayout">
          {showDescription && (
            <motion.div
              layoutId="description-section"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={cn(
                "border border-border bg-card rounded-lg p-4",
                layout === "bento" ? "h-[20vh] overflow-y-scroll" : "h-full",
              )}
            >
              <ScrollArea>
                <h2 className="text-xl font-semibold">Description</h2>
                {/* <p>{problem?.description}</p> */}
                <div
                  dangerouslySetInnerHTML={{
                    __html: problem?.description || "",
                  }}
                  className="prose prose-stone dark:prose-invert max-w-none"
                />
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>

        {showRightPane && (
          <div
            className={cn(
              "grid gap-4 transition-all duration-300 ease-in-out h-[80vh]",
              layout === "bento" ? "h-[60vh]" : "h-full",
              isSplitRightPane ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1",
            )}
          >
            {/* Editor Section */}
            <AnimatePresence mode="popLayout">
              {showEditor && (
                <motion.div
                  layoutId="editor-section"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className={cn(
                    "border border-border rounded-lg overflow-hidden relative flex flex-col",
                    layout === "bento" ? "h-[60vh]" : "h-[80vh]",
                  )}
                >
                  <div className="absolute bottom-0 right-0 p-4 z-10 flex w-full justify-between pointer-events-none">
                    <div className="pointer-events-auto"></div>
                    <div className="flex gap-2 pointer-events-auto">
                      {/* <Select
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
                      </Select> */}

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
                  </div>

                  <div className="relative w-full h-full">
                    <div
                      // className={mode === "normal" ? "block h-full" : "hidden"}
                      className="block h-full"
                    >
                      <Editor
                        height="100%"
                        defaultLanguage="javascript"
                        theme={theme === "dark" ? "vs-dark" : "light"}
                        onMount={handleUserEditorMount}
                        value={code}
                        onChange={handleEditorChange}
                        options={{
                          minimap: { enabled: false },
                          scrollBeyondLastLine: false,
                          quickSuggestions: false,
                          suggestOnTriggerCharacters: false,
                          snippetSuggestions: "none",
                        }}
                      />
                    </div>

                    {/* <VimEditor
                      ref={vimRef}
                      language="javascript"
                      theme={theme === "dark" ? "vs-dark" : "light"}
                      defaultValue="// Write your code here"
                      editorClassName={cn("rounded-2xl h-[80vh] w-full")}
                    /> */}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Preview Section */}
            <AnimatePresence mode="sync">
              {showPreview && (
                <motion.div
                  layoutId="preview-section"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{
                    duration: 0.3,
                    type: "spring",
                    stiffness: 1000,
                    damping: 100,
                  }}
                  className={cn(
                    "border border-border dark:border-0 rounded-lg overflow-scroll",
                    layout === "bento" ? "h-[60vh]" : "h-[80vh]",
                  )}
                >
                  <PreviewEsbuild code={code} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Submission Result Dialog */}
      <SubmissionResultDialog
        open={showResultDialog}
        onOpenChange={setShowResultDialog}
        result={result}
        submittedCode={submittedCode}
        language="javascript"
      />
    </div>
  );
};

export default Page;
