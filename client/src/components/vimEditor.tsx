"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import * as monaco from "monaco-editor";
import { cn } from "@/lib/utils";

interface VimEditorProps {
  defaultValue: string;
  language: string;
  theme?: string;
  minimap?: {
    enabled: boolean;
  };
  editorClassName?: string;
  statusBarClassName?: string;
  onChange?: (value: string) => void;
}

export interface VimEditorHandle {
  getValue: () => string | undefined;
  setValue: (value: string) => void;
}

export const VimEditor = forwardRef<VimEditorHandle, VimEditorProps>(
  (
    {
      defaultValue,
      language,
      theme = "vs-dark",
      minimap = { enabled: false },
      editorClassName,
      statusBarClassName,
      onChange,
    },
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const statusRef = useRef<HTMLDivElement | null>(null);
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const vimRef = useRef<any>(null);

    // Expose getValue and setValue to parent via ref
    useImperativeHandle(ref, () => ({
      getValue: () => editorRef.current?.getValue(),
      setValue: (val: string) => editorRef.current?.setValue(val),
    }));

    // useEffect(() => {
    //   if (!containerRef.current) return;

    //   // Create standalone Monaco editor
    //   const editor = monaco.editor.create(containerRef.current, {
    //     value: defaultValue,
    //     language,
    //     theme,
    //     minimap,
    //     readOnly: false,
    //     scrollBeyondLastLine: false,
    //   });

    //   editorRef.current = editor;

    //   // Listen for changes and trigger onChange callback
    //   const model = editor.getModel();
    //   const changeDisposable = model?.onDidChangeContent(() => {
    //     onChange?.(editor.getValue());
    //   });

    //   containerRef.current.focus();

    //   // Dynamically import monaco-vim (client-only)
    //   import("monaco-vim").then((mod) => {
    //     if (!editor || !statusRef.current) return;
    //     vimRef.current = mod.initVimMode(editor, statusRef.current);
    //   });

    //   return () => {
    //     vimRef.current?.dispose();
    //     changeDisposable?.dispose();
    //     editor.dispose();
    //   };
    // }, []);
    //
    useEffect(() => {
      if (typeof window === "undefined") return;

      // Setup Monaco workers
      (window as any).MonacoEnvironment = {
        getWorker(_: any, label: string) {
          switch (label) {
            case "typescript":
            case "javascript":
              return new Worker(
                new URL(
                  "monaco-editor/esm/vs/language/typescript/ts.worker",
                  import.meta.url,
                ),
                { type: "module" },
              );
            default:
              return new Worker(
                new URL(
                  "monaco-editor/esm/vs/editor/editor.worker",
                  import.meta.url,
                ),
                { type: "module" },
              );
          }
        },
      };

    }, []);

    useEffect(() => {
      let cancelled = false;

      if (!containerRef.current) return;

      const editor = monaco.editor.create(containerRef.current, {
        value: defaultValue,
        language,
        theme,
        minimap,
      });
      editorRef.current = editor;

      const model = editor.getModel();
      const changeDisposable = model?.onDidChangeContent(() => {
        onChange?.(editor.getValue());
      });

      import("monaco-vim").then((mod) => {
        if (cancelled || !editorRef.current || !statusRef.current) return;
        vimRef.current = mod.initVimMode(editor, statusRef.current);
      });

      return () => {
        cancelled = true; // prevent vim init after unmount
        vimRef.current?.dispose();
        changeDisposable?.dispose();
        editor.dispose();
      };
    }, []);
    return (
      <div>
        <div
          ref={statusRef}
          className={cn(
            "text-background p-1 font-mono bg-foreground",
            statusBarClassName,
          )}
        >
          -- NORMAL --
        </div>
        <div
          ref={containerRef}
          className={cn("h-[400px] w-full", editorClassName)}
        />
      </div>
    );
  },
);

VimEditor.displayName = "VimEditor";
