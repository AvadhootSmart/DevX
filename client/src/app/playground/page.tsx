"use client";

import { Button } from "@/components/ui/button";
// import { Editor } from "@monaco-editor/react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import {  useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { PreviewEsbuild } from "@/components/preview-esbuild";
// import { VimEditor, VimEditorHandle } from "@/components/vimEditor";
import { Columns, Monitor, Code } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { FETCH_USERS } from "@/static_data/fetch";

const Editor = dynamic(() => import("@monaco-editor/react"), {
    ssr: false,
});

type LayoutMode = "split" | "editor" | "preview";

const Page = () => {
  const { theme } = useTheme();
  const [mode, setMode] = useState<"normal" | "vim">("normal");
  const [layout, setLayout] = useState<LayoutMode>("split");
  const [code, setCode] = useState(FETCH_USERS);

  const editorRef = useRef<any>(null);
  // const vimRef = useRef<VimEditorHandle>(null);

  const handleUserEditorMount = (editor: any) => {
    editorRef.current = editor;
    // Disable unwanted actions
    // editor.onDidPaste(() => editor.trigger("keyboard", "undo", null));
    // editor.onContextMenu((e: any) => e.event.preventDefault());
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  };

  return (
    <div className="max-w-7xl mx-auto sm:py-4 py-4 px-2 h-screen flex flex-col">
      <header className="border border-border bg-card rounded-lg p-4 flex justify-between items-center mb-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold">Frontend Playground</h1>
          <p className="text-sm text-muted-foreground">
            Live React preview with Monaco Editor
          </p>
        </div>
        <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg border border-border">
          <Button
            variant={layout === "split" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setLayout("split")}
            title="Split View"
            className="h-8 w-8"
          >
            <Columns className="h-4 w-4" />
          </Button>
          <Button
            variant={layout === "editor" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setLayout("editor")}
            title="Full Editor"
            className="h-8 w-8"
          >
            <Code className="h-4 w-4" />
          </Button>
          <Button
            variant={layout === "preview" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setLayout("preview")}
            title="Full Preview"
            className="h-8 w-8"
          >
            <Monitor className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <main className="flex-1 min-h-0 relative">
        <div
          className={cn(
            "grid gap-4 h-full transition-all duration-300 ease-in-out",
            layout === "split" ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1",
          )}
        >
          {/* Editor Section */}
          <AnimatePresence mode="popLayout">
            {(layout === "split" || layout === "editor") && (
              <motion.div
                layoutId="editor-section"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="border border-border rounded-lg overflow-hidden relative flex flex-col h-full"
              >
                {/* Toolbar */}
                {/* <div className="absolute bottom-4 right-4 z-10"> */}
                {/*   <Select */}
                {/*     value={mode} */}
                {/*     onValueChange={(value) => */}
                {/*       setMode(value as "normal" | "vim") */}
                {/*     } */}
                {/*   > */}
                {/*     <SelectTrigger className="w-[100px] bg-background"> */}
                {/*       <SelectValue placeholder="Select mode" /> */}
                {/*     </SelectTrigger> */}
                {/*     <SelectContent> */}
                {/*       <SelectItem value="normal">Normal</SelectItem> */}
                {/*       <SelectItem value="vim">Vim</SelectItem> */}
                {/*     </SelectContent> */}
                {/*   </Select> */}
                {/* </div> */}

                <div className="flex-1 h-full relative">
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
                      quickSuggestions: true,
                      suggestOnTriggerCharacters: true,
                    }}
                  />

                  {/* <VimEditor */}
                  {/*   ref={vimRef} */}
                  {/*   language="javascript" */}
                  {/*   theme={theme === "dark" ? "vs-dark" : "light"} */}
                  {/*   defaultValue={code} */}
                  {/*   editorClassName={cn("h-full w-full")} */}
                  {/*   onChange={handleEditorChange} */}
                  {/* /> */}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Preview Section */}
          <AnimatePresence mode="sync">
            {(layout === "split" || layout === "preview") && (
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
                className="border border-border dark:border-0 rounded-lg overflow-hidden"
              >
                <PreviewEsbuild code={code} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Page;
