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
import { Editor } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IProblem } from "../../../../types/problem.types";
import { cn } from "@/lib/utils";
import useUser from "../../../../store/user.store";
import { toast } from "sonner";
import { Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { AuthPopup } from "@/components/authPopup";
import {
  ProblemHeader,
  LayoutType,
} from "@/components/problem-page/problem-header";
import { PreviewEsbuild } from "@/components/preview-esbuild";
import { motion, AnimatePresence } from "motion/react";
import { SubmissionResultDialog } from "@/components/submission-result-dialog";
import { getProblemData } from "@/api/problems";
import { submitCode } from "@/api/submission";

const Page = () => {
  const { id } = useParams();
  const { resolvedTheme } = useTheme();

  const { token } = useUser();

  // const [mode, setMode] = useState<"normal" | "vim">("normal");
  const [problem, setProblem] = useState<IProblem | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
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
      // getProblemData toasts and returns undefined on failure
      const data: IProblem | undefined = await getProblemData(problemName);
      if (!data) {
        setLoadFailed(true);
        return;
      }
      boilerplateRef.current = data.boilerplate;
      setProblem(data);
      setCode(data.boilerplate);
    } catch (error) {
      console.error("Failed to fetch problem data:", error);
      setLoadFailed(true);
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

    try {
      if (!problem) {
        toast.error("Refresh and try again");
        return;
      }

      // submitCode toasts its own errors and returns undefined on failure
      const data = await submitCode(submissionCode, problem.path, problem.ID);
      if (!data) return;

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

  if (loadFailed) {
    return (
      <div className="px-4 sm:px-10">
        <div className="mt-10 flex flex-col items-center justify-center py-20 text-center border border-dashed rounded-xl">
          <p className="font-medium">Couldn&apos;t load this problem</p>
          <p className="mt-1 text-sm text-muted-foreground">
            It may have moved, or the server is unreachable.
          </p>
          <Button asChild variant="outline" className="mt-4">
            <Link href="/problems">Back to problems</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div
        className="px-2 py-4 sm:h-[calc(100dvh-4rem)] flex flex-col gap-4"
        aria-busy="true"
        aria-label="Loading problem"
      >
        <div className="rounded-lg border bg-card p-4 space-y-3">
          <Skeleton className="h-8 w-2/5" />
          <Skeleton className="h-5 w-1/4" />
        </div>
        <div className="grid flex-1 min-h-0 grid-cols-1 sm:grid-cols-2 gap-4">
          <Skeleton className="h-[70vh] sm:h-full rounded-lg" />
          <Skeleton className="h-[70vh] sm:h-full rounded-lg" />
        </div>
      </div>
    );
  }

  const isBento = layout === "bento";
  const paneHeight = "h-[70vh] sm:h-full";

  const submitButton = (
    <Button
      size="sm"
      onClick={token ? handleSubmit : undefined}
      disabled={loading}
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin" aria-hidden="true" />
          Submitting…
        </>
      ) : token ? (
        <>
          Submit
          <Check aria-hidden="true" />
        </>
      ) : (
        "Log in to submit"
      )}
    </Button>
  );

  return (
    <div className="px-2 py-4 sm:h-[calc(100dvh-4rem)] flex flex-col">
      <ProblemHeader
        type={problem.domain}
        problem={problem}
        layout={layout}
        setLayout={setLayout}
      />

      <div
        className={cn(
          "gap-4 mt-4 sm:flex-1 sm:min-h-0",
          isBento
            ? "flex flex-col"
            : "grid sm:grid-rows-[minmax(0,1fr)]",
          !isBento &&
            (showDescription && showRightPane
              ? "grid-cols-1 sm:grid-cols-2"
              : "grid-cols-1"),
        )}
      >
        <AnimatePresence mode="popLayout">
          {showDescription && (
            <motion.section
              layoutId="description-section"
              aria-label="Problem description"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={cn(
                "border border-border bg-card rounded-lg p-4 sm:p-6 overflow-y-auto",
                isBento ? "h-[25vh] shrink-0" : paneHeight,
              )}
            >
              <h2 className="text-xl font-semibold">Description</h2>
              <div
                dangerouslySetInnerHTML={{
                  __html: problem.description || "",
                }}
                className="prose prose-stone dark:prose-invert max-w-prose mt-3 prose-code:before:content-none prose-code:after:content-none prose-code:rounded prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:font-medium prose-pre:bg-muted prose-pre:text-foreground"
              />
            </motion.section>
          )}
        </AnimatePresence>

        {showRightPane && (
          <div
            className={cn(
              "grid gap-4 min-h-0",
              isBento ? "sm:flex-1" : "sm:h-full",
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
                    "border border-border rounded-lg overflow-hidden flex flex-col",
                    paneHeight,
                  )}
                >
                  <div className="flex-1 min-h-0">
                    <Editor
                      height="100%"
                      defaultLanguage="javascript"
                      theme={resolvedTheme === "dark" ? "vs-dark" : "light"}
                      onMount={handleUserEditorMount}
                      value={code}
                      onChange={handleEditorChange}
                      options={{
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        quickSuggestions: false,
                        suggestOnTriggerCharacters: false,
                        snippetSuggestions: "none",
                        padding: { top: 12 },
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-end gap-2 border-t border-border bg-card px-3 py-2">
                    {token ? (
                      submitButton
                    ) : (
                      <AuthPopup>{submitButton}</AuthPopup>
                    )}
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
                    "border border-border dark:border-0 rounded-lg overflow-hidden",
                    paneHeight,
                  )}
                >
                  <PreviewEsbuild code={code} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

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
