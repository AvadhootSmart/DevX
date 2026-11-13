"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DifficultyBadge } from "@/components/difficultyBadge";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  Check,
  Activity,
  Columns,
  FlaskConical,
  History,
  Layers,
  Layout,
  Search,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
  MotionConfig,
  useReducedMotion,
} from "motion/react";
import { Difficulty } from "../../types/problem.types";

const GITHUB_URL = "https://github.com/AvadhootSmart/DevX";
const TAB_ROTATE_MS = 5000;
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

// --- Animation Variants ---
const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE_OUT_EXPO },
  },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

// --- Hero mockup content ---
type Tab = "frontend" | "backend";
type CodeLine = { indent: number; content: React.ReactNode };

const Kw = ({ children }: { children: React.ReactNode }) => (
  <span className="text-violet-600 dark:text-violet-400">{children}</span>
);
const Fn = ({ children }: { children: React.ReactNode }) => (
  <span className="text-blue-600 dark:text-blue-400">{children}</span>
);
const Str = ({ children }: { children: React.ReactNode }) => (
  <span className="text-emerald-600 dark:text-emerald-400">{children}</span>
);
const Num = ({ children }: { children: React.ReactNode }) => (
  <span className="text-orange-600 dark:text-orange-400">{children}</span>
);
const Comment = ({ children }: { children: React.ReactNode }) => (
  <span className="text-muted-foreground italic">{children}</span>
);

const BACKEND_CODE: CodeLine[] = [
  { indent: 0, content: <Comment>// Challenge: Paginated Products Endpoint</Comment> },
  { indent: 0, content: <>router.<Fn>get</Fn>(<Str>&quot;/api/v1/products&quot;</Str>, (req, res) =&gt; {"{"}</> },
  { indent: 1, content: <><Kw>const</Kw> page = <Fn>Number</Fn>(req.query.page ?? <Num>1</Num>);</> },
  { indent: 1, content: <><Kw>const</Kw> limit = <Fn>Number</Fn>(req.query.limit ?? <Num>10</Num>);</> },
  { indent: 1, content: <><Kw>if</Kw> (page &lt; <Num>1</Num> || limit &lt; <Num>1</Num>) {"{"}</> },
  { indent: 2, content: <><Kw>return</Kw> res.<Fn>status</Fn>(<Num>400</Num>).<Fn>json</Fn>({"{"} error: <Str>&quot;Invalid params&quot;</Str> {"}"});</> },
  { indent: 1, content: "}" },
  { indent: 0, content: "" },
  { indent: 1, content: <><Kw>const</Kw> start = (page - <Num>1</Num>) * limit;</> },
  { indent: 1, content: <><Kw>const</Kw> data = products.<Fn>slice</Fn>(start, start + limit);</> },
  { indent: 1, content: <>res.<Fn>json</Fn>({"{"}</> },
  { indent: 2, content: "data, page, total: products.length," },
  { indent: 2, content: <>totalPages: Math.<Fn>ceil</Fn>(products.length / limit),</> },
  { indent: 1, content: "});" },
  { indent: 0, content: "});" },
];

const FRONTEND_CODE: CodeLine[] = [
  { indent: 0, content: <Comment>// Challenge: Searchable User List</Comment> },
  { indent: 0, content: <><Kw>export default function</Kw> <Fn>App</Fn>() {"{"}</> },
  { indent: 1, content: <><Kw>const</Kw> [query, setQuery] = <Fn>useState</Fn>(<Str>&quot;&quot;</Str>);</> },
  { indent: 1, content: <><Kw>const</Kw> visible = users.<Fn>filter</Fn>((u) =&gt;</> },
  { indent: 2, content: <>u.name.<Fn>toLowerCase</Fn>().<Fn>includes</Fn>(query.<Fn>toLowerCase</Fn>())</> },
  { indent: 1, content: ");" },
  { indent: 0, content: "" },
  { indent: 1, content: <><Kw>return</Kw> (</> },
  { indent: 2, content: <>&lt;<Str>div</Str> className=<Str>&quot;p-4 space-y-2&quot;</Str>&gt;</> },
  { indent: 3, content: <>&lt;<Str>SearchInput</Str> value={"{"}query{"}"} onChange={"{"}setQuery{"}"} /&gt;</> },
  { indent: 3, content: <>{"{"}visible.<Fn>map</Fn>((u) =&gt; (</> },
  { indent: 4, content: <>&lt;<Str>UserRow</Str> key={"{"}u.id{"}"} user={"{"}u{"}"} /&gt;</> },
  { indent: 3, content: "))}" },
  { indent: 2, content: <>&lt;/<Str>div</Str>&gt;</> },
  { indent: 1, content: ");" },
  { indent: 0, content: "}" },
];

const TABS: Record<Tab, { file: string; code: CodeLine[]; tests: string }> = {
  frontend: { file: "App.jsx", code: FRONTEND_CODE, tests: "All tests passed (4/4)" },
  backend: { file: "routes.js", code: BACKEND_CODE, tests: "All tests passed (5/5)" },
};

const BACKEND_TEST_OUTPUT = [
  "returns the first page by default",
  "respects page and limit",
  "returns totalPages",
  "rejects invalid params with 400",
  "handles an out-of-range page",
];

const SAMPLE_PROBLEMS: { name: string; topics: string[]; difficulty: Difficulty }[] = [
  { name: "Hello World API", topics: ["Express", "API"], difficulty: "easy" },
  { name: "Counter Component", topics: ["React", "State"], difficulty: "easy" },
  { name: "Paginated Products Endpoint", topics: ["REST", "Pagination"], difficulty: "medium" },
];

const featureCard =
  "rounded-2xl border border-border/50 bg-card overflow-hidden relative";
const featureIcon =
  "w-10 h-10 shrink-0 rounded-xl flex items-center justify-center mb-5";

export default function LandingPage() {
  const reduceMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState<Tab>("backend");
  const [autoRotate, setAutoRotate] = useState(true);

  // Auto-switch tabs for the hero visual until the visitor picks one
  useEffect(() => {
    if (!autoRotate || reduceMotion) return;
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev === "backend" ? "frontend" : "backend"));
    }, TAB_ROTATE_MS);
    return () => clearInterval(interval);
  }, [autoRotate, reduceMotion]);

  const selectTab = (tab: Tab) => {
    setAutoRotate(false);
    setActiveTab(tab);
  };

  const active = TABS[activeTab];

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative w-full overflow-hidden">
        {/* --- Ambient Background Glow --- */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />

        {/* --- Hero Section --- */}
        <section className="pt-20 md:pt-28 pb-24 md:pb-32 px-4 md:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-5xl mx-auto text-center flex flex-col items-center"
          >
            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-bold tracking-[-0.04em] mb-8 leading-[1.05] text-foreground text-balance"
            >
              Full-stack engineering, <br className="hidden sm:block" />
              <span className="text-muted-foreground">mastered in flow.</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed text-pretty"
            >
              Move past data structures and algorithms. Solve real frontend and
              backend problems in the browser, preview your UI as you type, and
              run your code against automated tests.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center gap-3"
            >
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 h-12 text-base shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow duration-300"
              >
                <Link href="/problems">
                  Start Solving <ChevronRight aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="rounded-full px-6 h-12 text-base"
              >
                <Link href="/playground">Open the Playground</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Hero Visual / Interface Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 48 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: EASE_OUT_EXPO, delay: 0.35 }}
            className="mt-20 md:mt-24 mx-auto max-w-6xl"
          >
            <div className="relative bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
              {/* Window Controls & Tabs */}
              <div className="h-12 bg-muted/50 border-b border-border flex items-center px-4 justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="hidden sm:flex gap-1.5" aria-hidden="true">
                    <div className="w-3 h-3 rounded-full bg-destructive/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  </div>
                  <div
                    role="group"
                    aria-label="Example challenge"
                    className="flex gap-1 bg-background/50 p-1 rounded-lg"
                  >
                    {(["frontend", "backend"] as const).map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        aria-pressed={activeTab === tab}
                        onClick={() => selectTab(tab)}
                        className={cn(
                          "px-3 py-1 text-xs font-medium rounded-md transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                          activeTab === tab
                            ? "bg-background shadow-sm text-foreground"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {TABS[tab].file}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="text-xs font-mono text-muted-foreground flex items-center gap-2 shrink-0">
                  <Activity size={12} className="text-green-500" aria-hidden="true" />
                  Connected
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 lg:min-h-[420px]">
                {/* Editor Pane */}
                <div
                  className="p-4 sm:p-6 font-mono text-xs sm:text-sm overflow-x-auto bg-background/50 text-foreground border-b lg:border-b-0 lg:border-r border-border/50"
                  aria-label={`Example ${activeTab} solution`}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.ol
                      key={activeTab}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
                      className="space-y-1 w-max"
                    >
                      {active.code.map((line, i) => (
                        <li key={i} className="flex whitespace-pre">
                          <span
                            className="w-6 shrink-0 mr-5 text-right text-muted-foreground/40 select-none tabular-nums"
                            aria-hidden="true"
                          >
                            {i + 1}
                          </span>
                          <span style={{ paddingLeft: `${line.indent * 2}ch` }}>
                            {line.content}
                          </span>
                        </li>
                      ))}
                    </motion.ol>
                  </AnimatePresence>
                </div>

                {/* Preview/Output Pane */}
                <div className="bg-muted/10 p-4 sm:p-6 flex flex-col" aria-hidden="true">
                  <div className="flex-1 flex items-center justify-center">
                    <AnimatePresence mode="wait" initial={false}>
                      {activeTab === "backend" ? (
                        <motion.div
                          key="backend-preview"
                          initial={{ opacity: 0, scale: 0.97 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.97 }}
                          transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
                          className="w-full max-w-sm"
                        >
                          <div className="bg-zinc-950 rounded-lg p-4 font-mono text-xs text-zinc-300 shadow-xl border border-zinc-800">
                            <div className="flex justify-between border-b border-zinc-800 pb-2 mb-3">
                              <span className="text-zinc-500">test output</span>
                              <span className="text-emerald-400">PASS</span>
                            </div>
                            <div className="text-zinc-400 mb-1">routes.test.js</div>
                            <ul className="space-y-1">
                              {BACKEND_TEST_OUTPUT.map((name) => (
                                <li key={name} className="flex gap-2">
                                  <Check size={12} className="mt-0.5 shrink-0 text-emerald-400" />
                                  {name}
                                </li>
                              ))}
                            </ul>
                            <div className="mt-3 pt-2 border-t border-zinc-800">
                              Tests: <span className="text-emerald-400">5 passed</span>, 5 total
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="frontend-preview"
                          initial={{ opacity: 0, scale: 0.97 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.97 }}
                          transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
                          className="w-full max-w-sm bg-background border border-border rounded-lg shadow-xl overflow-hidden"
                        >
                          <div className="h-8 bg-muted border-b border-border flex items-center px-3">
                            <div className="w-20 h-2 bg-muted-foreground/20 rounded-full" />
                          </div>
                          <div className="p-3 space-y-2">
                            <div className="flex items-center gap-2 rounded-md border border-border px-2.5 py-2 text-xs text-muted-foreground">
                              <Search size={12} />
                              Search users
                            </div>
                            {Array.from({ length: 5 }).map((_, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05, ease: EASE_OUT_EXPO }}
                                className="flex items-center gap-3 p-2 rounded-md bg-muted/30 border border-border/50"
                              >
                                <div className="w-7 h-7 rounded-full bg-primary/10" />
                                <div className="space-y-1 flex-1">
                                  <div className="h-2 w-24 bg-muted-foreground/20 rounded" />
                                  <div className="h-1.5 w-16 bg-muted-foreground/10 rounded" />
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="mt-6 bg-background border border-border text-foreground px-4 py-3 rounded-lg flex items-center gap-3 shadow-sm">
                    <div className="bg-green-500/20 text-green-600 dark:text-green-400 p-1 rounded-full">
                      <Check size={12} />
                    </div>
                    <div className="text-xs font-medium tabular-nums">{active.tests}</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* --- Features Grid --- */}
        <section className="py-24 md:py-32 px-4 md:px-8 max-w-7xl mx-auto border-t border-border/50">
          <div className="mb-16 md:mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-foreground tracking-[-0.03em] text-balance">
              Built for the <span className="text-muted-foreground">modern stack.</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed text-pretty">
              Practise the work you actually do on the job, right in the browser.
              No local setup, no toy puzzles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 md:auto-rows-[248px]">
            {/* Card 1: Real-world problems */}
            <div className={cn(featureCard, "md:col-span-2 md:row-span-2 group")}>
              <div className="p-8 md:p-10 flex flex-col h-full">
                <div className={cn(featureIcon, "bg-violet-500/10 text-violet-500")}>
                  <Layers size={20} aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-foreground">
                  Real-world problems
                </h3>
                <p className="text-muted-foreground text-lg max-w-md text-pretty">
                  Build endpoints, components and middleware like the ones you
                  ship at work, across frontend and backend, from easy to hard.
                </p>

                <div
                  className="mt-10 md:mt-auto md:translate-y-6 md:group-hover:translate-y-3 transition-transform duration-500 ease-out"
                  aria-hidden="true"
                >
                  <div className="rounded-xl md:rounded-b-none border border-border/60 bg-background/60 p-3 sm:p-4 space-y-2 shadow-2xl">
                    {SAMPLE_PROBLEMS.map((problem) => (
                      <div
                        key={problem.name}
                        className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-card px-4 py-3"
                      >
                        <div className="min-w-0 space-y-1.5">
                          <div className="text-sm font-medium truncate">{problem.name}</div>
                          <div className="flex gap-1">
                            {problem.topics.map((topic) => (
                              <Badge key={topic} variant="secondary" className="text-[11px]">
                                {topic}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <DifficultyBadge difficulty={problem.difficulty} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Live preview */}
            <div className={cn(featureCard, "md:col-span-1 md:row-span-2 p-8 flex flex-col group")}>
              <div>
                <div className={cn(featureIcon, "bg-blue-500/10 text-blue-500")}>
                  <Layout size={20} aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-foreground">
                  Live preview
                </h3>
                <p className="text-muted-foreground text-lg text-pretty">
                  Write React in a full code editor and watch it render as you
                  type.
                </p>
              </div>

              <div className="mt-10 md:mt-auto relative h-56 w-full" aria-hidden="true">
                <div className="absolute inset-x-0 bottom-0 h-full bg-background/50 border border-border/50 rounded-xl md:rounded-b-none p-4 shadow-lg md:translate-y-8 md:group-hover:translate-y-5 transition-transform duration-500 ease-out">
                  <div className="flex gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  </div>
                  <div className="space-y-3">
                    <div className="h-16 bg-blue-500/10 rounded-lg border border-blue-500/20 w-full" />
                    <div className="flex gap-2">
                      <div className="h-16 bg-muted/50 rounded-lg w-1/2" />
                      <div className="h-16 bg-muted/50 rounded-lg w-1/2" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Automated tests */}
            <div className={cn(featureCard, "p-8")}>
              <div className={cn(featureIcon, "bg-emerald-500/10 text-emerald-500")}>
                <FlaskConical size={20} aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Automated tests</h3>
              <p className="text-muted-foreground mt-2 leading-relaxed text-pretty">
                Submit and your code runs against a test suite. See exactly how
                many cases pass.
              </p>
            </div>

            {/* Card 4: Layouts */}
            <div className={cn(featureCard, "p-8")}>
              <div className={cn(featureIcon, "bg-amber-500/10 text-amber-500")}>
                <Columns size={20} aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Layouts that fit the task</h3>
              <p className="text-muted-foreground mt-2 leading-relaxed text-pretty">
                Switch between description, editor and preview layouts in one
                click.
              </p>
            </div>

            {/* Card 5: Progress */}
            <div className={cn(featureCard, "p-8")}>
              <div className={cn(featureIcon, "bg-purple-500/10 text-purple-500")}>
                <History size={20} aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Track your progress</h3>
              <p className="text-muted-foreground mt-2 leading-relaxed text-pretty">
                Every submission is saved on your profile with its code and test
                results.
              </p>
            </div>
          </div>
        </section>

        {/* --- CTA Section --- */}
        <section className="pb-20 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden border border-border bg-gradient-to-b from-muted/30 to-background px-6 py-16 md:p-24 text-center">
            <h2 className="text-3xl md:text-5xl font-bold tracking-[-0.03em] mb-8 text-foreground text-balance">
              Ready to ship <br className="hidden sm:block" /> better code?
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Button asChild size="lg" className="rounded-full px-8 h-12 text-base shadow-lg">
                <Link href="/problems">Start Solving</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full px-8 h-12 text-base"
              >
                <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                  View on GitHub
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* --- Footer --- */}
        <footer className="text-sm">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-muted-foreground">
            <div>© {new Date().getFullYear()} DevX</div>
            <nav aria-label="Footer" className="flex gap-6">
              <Link href="/problems" className="hover:text-foreground transition-colors">
                Problems
              </Link>
              <Link href="/playground" className="hover:text-foreground transition-colors">
                Playground
              </Link>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                GitHub
              </a>
            </nav>
          </div>
        </footer>
      </div>
    </MotionConfig>
  );
}
