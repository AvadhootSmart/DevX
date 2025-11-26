"use client"

import type React from "react"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import {
  Copy,
  Play,
  Send,
  Save,
  MessageSquare,
  Share2,
  AlertTriangle,
  Clock,
  Flame,
  Maximize2,
  Minimize2,
} from "lucide-react"

export default function ChallengePage({ params }: { params: { slug: string } }) {
  const [pane, setPane] = useState<"problem" | "editor">("problem")
  const [full, setFull] = useState(false)

  return (
    <main className="min-h-[100svh]">
      <div className="mx-auto max-w-7xl px-4 py-4 md:py-6">
        <MetaBar onTogglePane={() => setPane(pane === "problem" ? "editor" : "problem")} pane={pane} />
        {/* Layout */}
        <div
          className={cn(
            "mt-4 grid gap-4 transition-[grid-template-columns,height] md:mt-6",
            full ? "grid-cols-1" : "md:grid-cols-[minmax(420px,1fr)_minmax(520px,1.1fr)]",
          )}
        >
          {/* Problem panel (sticky on desktop) */}
          <section
            className={cn(
              "rounded-xl border bg-card shadow-sm",
              "md:sticky md:top-20 md:h-[calc(100svh-140px)] md:overflow-hidden",
              pane !== "problem" && "hidden md:block",
            )}
            aria-label="Problem details"
          >
            <ProblemPanel />
          </section>

          {/* Editor panel */}
          <section
            className={cn(
              "rounded-xl border bg-card shadow-sm",
              "md:h-[calc(100svh-140px)] md:overflow-hidden",
              pane !== "editor" && "hidden md:block",
            )}
            aria-label="Editor"
          >
            <EditorMock onToggleFull={() => setFull((f) => !f)} isFull={full} />
          </section>
        </div>

        {/* Mobile toggle */}
        <div className="sticky bottom-4 mt-4 flex w-full justify-center md:hidden">
          <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-1 py-1 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <Button
              size="sm"
              variant={pane === "problem" ? "default" : "ghost"}
              onClick={() => setPane("problem")}
              className="rounded-full"
            >
              Problem
            </Button>
            <Button
              size="sm"
              variant={pane === "editor" ? "default" : "ghost"}
              onClick={() => setPane("editor")}
              className="rounded-full"
            >
              Editor
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}

/* ---------------------------- Meta / Action Bar --------------------------- */

function MetaBar({ onTogglePane, pane }: { onTogglePane: () => void; pane: "problem" | "editor" }) {
  return (
    <header className="rounded-xl border bg-card/90 p-3 backdrop-blur supports-[backdrop-filter]:bg-card/70 md:p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2">
              <li className="text-muted-foreground/80">Algorithms</li>
              <li aria-hidden="true">/</li>
              <li className="text-muted-foreground/80">Arrays & Hashing</li>
              <li aria-hidden="true">/</li>
              <li className="text-foreground">Two Sum</li>
            </ol>
          </nav>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-pretty text-2xl font-semibold leading-none md:text-3xl">1. Two Sum</h1>
            <DifficultyPill level="Easy" />
            <div className="hidden gap-2 md:flex">
              <Badge variant="secondary">Array</Badge>
              <Badge variant="secondary">Hash Table</Badge>
              <Badge variant="secondary">Two-Pointers</Badge>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <KpiChip icon={<Clock className="h-3.5 w-3.5" />} label="Time" value="~ 15 min" />
          <KpiChip icon={<Flame className="h-3.5 w-3.5" />} label="Streak" value="7 days" />
          <Separator orientation="vertical" className="hidden h-6 md:block" />
          <TooltipProvider>
            <div className="flex items-center gap-1.5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" className="rounded-full bg-transparent">
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Save to My Lists</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" className="rounded-full bg-transparent">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Discuss
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Open community discussion</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" className="rounded-full bg-transparent">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Copy share link</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="rounded-full md:hidden" onClick={onTogglePane}>
                    {pane === "problem" ? "Open Editor" : "View Problem"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-[200px]">Toggle between panes on mobile</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
      </div>
    </header>
  )
}

function DifficultyPill({ level }: { level: "Easy" | "Medium" | "Hard" }) {
  const styles =
    level === "Easy"
      ? "bg-primary/15 text-primary"
      : level === "Medium"
        ? "bg-accent/15 text-accent-foreground"
        : "bg-destructive/15 text-destructive-foreground"
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        styles,
        level === "Easy" && "ring-primary/30",
        level === "Medium" && "ring-accent/30",
        level === "Hard" && "ring-destructive/30",
      )}
      aria-label={`Difficulty ${level}`}
    >
      {level}
    </span>
  )
}

function KpiChip({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1.5 text-sm">
      <span className="grid h-6 w-6 place-items-center rounded-full bg-muted/60">{icon}</span>
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  )
}

/* -------------------------------- Problem -------------------------------- */

function ProblemPanel() {
  return (
    <div className="flex h-full flex-col">
      <Tabs defaultValue="description" className="flex h-full flex-col">
        <div className="border-b px-4 pt-3 md:px-6 md:pt-4">
          <TabsList className="h-9 gap-1 rounded-lg bg-muted/40 p-1">
            <TabsTrigger value="description" className="rounded-md">
              Description
            </TabsTrigger>
            <TabsTrigger value="examples" className="rounded-md">
              Examples
            </TabsTrigger>
            <TabsTrigger value="constraints" className="rounded-md">
              Constraints
            </TabsTrigger>
            <TabsTrigger value="submissions" className="rounded-md">
              Submissions
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="description" className="m-0 flex-1 overflow-auto px-4 pb-4 pt-3 md:px-6 md:pb-6 md:pt-4">
          <article className="prose prose-invert max-w-none">
            <p>
              Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two
              numbers such that they add up to <code>target</code>.
            </p>
            <ul>
              <li>You may assume that each input would have exactly one solution.</li>
              <li>You may not use the same element twice.</li>
              <li>You can return the answer in any order.</li>
            </ul>
            <h3>Intuition</h3>
            <p>Use a hash map to store complements and lookups in linear time.</p>
            <BentoStats />
            <h3>Follow-ups</h3>
            <p>Can you do it in one pass? What about if the input array is sorted?</p>
            <h3>Tags</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Array</Badge>
              <Badge variant="secondary">Hash Table</Badge>
              <Badge variant="secondary">Two-Pointers</Badge>
            </div>
          </article>
        </TabsContent>

        <TabsContent value="examples" className="m-0 flex-1 overflow-auto px-4 pb-4 pt-3 md:px-6 md:pb-6 md:pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Example 1</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="rounded-lg border bg-muted/30 p-4">
                {`Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].`}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="constraints" className="m-0 flex-1 overflow-auto px-4 pb-4 pt-3 md:px-6 md:pb-6 md:pt-4">
          <ul className="grid gap-3">
            <li className="rounded-lg border bg-muted/20 p-3">1 ≤ nums.length ≤ 10⁴</li>
            <li className="rounded-lg border bg-muted/20 p-3">-10⁹ ≤ nums[i] ≤ 10⁹</li>
            <li className="rounded-lg border bg-muted/20 p-3">One valid answer exists.</li>
          </ul>
        </TabsContent>

        <TabsContent value="submissions" className="m-0 flex-1 overflow-auto px-4 pb-4 pt-3 md:px-6 md:pb-6 md:pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Submissions
                <span className="text-sm text-muted-foreground">You • Today</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <span className="font-mono text-sm">TypeScript • 68 ms • 43.6 MB</span>
                <Badge className="bg-emerald-500/15 text-emerald-400">Accepted</Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <span className="font-mono text-sm">Python • 124 ms • 51.2 MB</span>
                <Badge className="bg-destructive/15 text-destructive-foreground">Wrong Answer</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Separator className="mt-4" />
      <TestsPanel />
    </div>
  )
}

function BentoStats() {
  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      <Card className="border-dashed">
        <CardContent className="flex items-center gap-3 p-4">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/15 text-primary">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Expected Time</div>
            <div className="font-medium">O(n)</div>
          </div>
        </CardContent>
      </Card>
      <Card className="border-dashed">
        <CardContent className="flex items-center gap-3 p-4">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-accent/15">
            <Flame className="h-5 w-5 text-accent-foreground" />
          </div>
          <div className="w-full">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Success Rate</span>
              <span>42%</span>
            </div>
            <Progress value={42} className="mt-1" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* --------------------------------- Editor -------------------------------- */

function EditorMock({ onToggleFull, isFull }: { onToggleFull: () => void; isFull: boolean }) {
  return (
    <div className="flex h-full flex-col">
      {/* Editor Top Bar */}
      <div className="flex items-center justify-between border-b px-3 py-2 md:px-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-md border bg-muted/40 p-1">
            <span className="rounded-sm bg-background px-2 py-1 text-xs font-medium">main.ts</span>
            <span className="rounded-sm px-2 py-1 text-xs text-muted-foreground">tests.ts</span>
            <span className="rounded-sm px-2 py-1 text-xs text-muted-foreground">README.md</span>
          </div>

          <Select defaultValue="ts">
            <SelectTrigger className="h-8 w-[120px]">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ts">TypeScript</SelectItem>
              <SelectItem value="py">Python</SelectItem>
              <SelectItem value="cpp">C++</SelectItem>
              <SelectItem value="java">Java</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-full bg-transparent">
            <Copy className="mr-2 h-4 w-4" />
            Copy
          </Button>
          <Button variant="outline" size="sm" className="rounded-full bg-transparent">
            <Play className="mr-2 h-4 w-4" />
            Run
          </Button>
          <Button size="sm" className="rounded-full">
            <Send className="mr-2 h-4 w-4" />
            Submit
          </Button>
          <Button size="icon" variant="ghost" className="ml-1" onClick={onToggleFull} aria-label="Toggle full width">
            {isFull ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Editor Surface */}
      <div className="relative flex-1 overflow-auto bg-[color:var(--color-card)]">
        <div className="grid h-full grid-cols-[auto,1fr]">
          {/* Gutter */}
          <div className="select-none border-r bg-muted/30 px-3 py-3 font-mono text-xs text-muted-foreground/80">
            {Array.from({ length: 38 }).map((_, i) => (
              <div key={i} className="leading-6 tabular-nums">
                {i + 1}
              </div>
            ))}
          </div>
          {/* Code */}
          <pre className="relative h-full overflow-auto p-3 font-mono text-[13px] leading-6">
            {`function twoSum(nums: number[], target: number): [number, number] {
  const seen = new Map<number, number>()
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i]
    if (seen.has(need)) return [seen.get(need)!, i]
    seen.set(nums[i], i)
  }
  return [-1, -1]
}

// Complexity
// Time: O(n)
// Space: O(n)`}
            {/* Faux minimap */}
            <span className="pointer-events-none absolute inset-y-0 right-1 w-1 rounded-full bg-gradient-to-b from-primary/40 via-primary/10 to-transparent"></span>
          </pre>
        </div>
      </div>

      {/* Bottom input row (custom input only visual) */}
      <div className="border-t p-3 md:p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <Input placeholder="Custom input (comma-separated)" className="font-mono" />
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-full bg-transparent">
              Reset
            </Button>
            <Button className="rounded-full">Run with Input</Button>
          </div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Tip: Press <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono">Ctrl</kbd>+
          <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono">Enter</kbd> to run
        </p>
      </div>
    </div>
  )
}

/* ------------------------------- Tests Panel ------------------------------ */

function TestsPanel() {
  return (
    <div className="px-4 pb-4 pt-3 md:px-6 md:pb-6 md:pt-4" aria-label="Tests and Output">
      <Tabs defaultValue="tests" className="w-full">
        <TabsList className="h-9 gap-1 rounded-lg bg-muted/40 p-1">
          <TabsTrigger value="tests" className="rounded-md">
            Testcases
          </TabsTrigger>
          <TabsTrigger value="output" className="rounded-md">
            Output
          </TabsTrigger>
          <TabsTrigger value="notes" className="rounded-md">
            Notes
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tests" className="mt-3 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <Checkbox id={`t${i}`} />
                <label htmlFor={`t${i}`} className="text-sm">
                  Test #{i}
                </label>
              </div>
              <Badge className={i === 1 ? "bg-emerald-500/15 text-emerald-400" : "bg-muted text-muted-foreground"}>
                {i === 1 ? "Passed" : "Not Run"}
              </Badge>
            </div>
          ))}
        </TabsContent>
        <TabsContent value="output" className="mt-3">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base">Execution Output</CardTitle>
              <Badge variant="secondary" className="gap-1">
                <Clock className="h-3.5 w-3.5" /> 68 ms
              </Badge>
            </CardHeader>
            <CardContent>
              <pre className="rounded-lg border bg-muted/20 p-4 font-mono text-sm">
                {`Result: [0, 1]
Status: Accepted
Memory: 43.6 MB`}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notes" className="mt-3">
          <Textarea placeholder="Jot down ideas, invariants, edge cases..." className="min-h-28" />
          <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <AlertTriangle className="h-4 w-4" /> Notes are local and not synced.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  )
}
