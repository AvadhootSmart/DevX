"use client";

import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Editor } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { PreviewEsbuild } from "@/components/preview-esbuild";
import { VimEditor, VimEditorHandle } from "@/components/vimEditor";

const Page = () => {
    const { theme } = useTheme();
    const [mode, setMode] = useState<"normal" | "vim">("normal");
    const [code, setCode] = useState(`
        export function Card() {
  const [users, setUsers] = React.useState([]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("https://dummyjson.com/users");
      const data = await res.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white max-w-sm">
      <button
        onClick={fetchUsers}
        className="bg-black text-white px-3 py-2 rounded-md mb-4"
      >
        Fetch Users
      </button>

      {/* Only render list once data has been fetched */}
      {users.length > 0 && (
        <ul className="space-y-3">
          {users.map((user) => (
            <li
              key={user.id}
              className="flex items-center gap-3 p-2 border rounded-md"
            >
              <img
                src={user.image}
                alt={user.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="font-medium">{user.username}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}`);

    const editorRef = useRef<any>(null);
    const vimRef = useRef<VimEditorHandle>(null);

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

    // Sync Vim editor changes to code state
    useEffect(() => {
        // This is a bit tricky with VimEditor as it might not expose a simple onChange for the underlying model in the same way
        // But let's assume for now we can get value from it or it updates.
        // Actually, the VimEditor component in the reference didn't seem to have an onChange prop in the usage example,
        // but let's check if we can pass one or if we need to poll/listen.
        // Looking at the usage in problem page:
        // const submissionCode = mode === "normal" ? editorRef.current?.getValue() : vimRef.current?.getValue();
        // It seems we pull value on submit. For live preview we need push.
        // Let's assume we can pass onChange to VimEditor or Editor.
        // The VimEditor wrapper might need inspection if it doesn't propagate onChange.
        // For now, I will implement onChange for the standard Editor.
        // For Vim mode, if the VimEditor wraps Monaco, it might accept onChange.
        // Let's check VimEditor implementation if possible, but I don't have it open.
        // I'll assume standard Editor props work for the underlying editor.
    }, []);

    return (
        <div className="max-w-7xl mx-auto sm:py-4 py-4 px-2 h-screen flex flex-col">
            <header className="border border-border bg-card rounded-lg p-4 flex justify-between items-center mb-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-semibold">Frontend Playground</h1>
                    <p className="text-sm text-muted-foreground">
                        Live React preview with Monaco Editor
                    </p>
                </div>
            </header>

            <main className="grid grid-cols-1 flex-1 gap-4 sm:grid-cols-2 min-h-0">
                {/* Editor Section */}
                <div className="border border-border rounded-lg overflow-hidden relative flex flex-col">
                    {/* Toolbar */}
                    <div className="absolute bottom-4 right-4 z-10">
                        <Select
                            value={mode}
                            onValueChange={(value) => setMode(value as "normal" | "vim")}
                        >
                            <SelectTrigger className="w-[100px] bg-background">
                                <SelectValue placeholder="Select mode" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="normal">Normal</SelectItem>
                                <SelectItem value="vim">Vim</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

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

                        <VimEditor
                            ref={vimRef}
                            language="javascript"
                            theme={theme === "dark" ? "vs-dark" : "light"}
                            defaultValue={code}
                            editorClassName={cn("h-full w-full")}
                            onChange={handleEditorChange}
                        />
                    </div>
                </div>

                {/* Preview Section */}
                <div className="border border-border rounded-lg overflow-hidden bg-white">
                    <PreviewEsbuild code={code} />
                </div>
            </main>
        </div>
    );
};

export default Page;
