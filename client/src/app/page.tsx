"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Terminal,
  Zap,
  Cpu,
  ChevronRight,
  Check,
  Activity,
  GitPullRequest,
  Server,
  Database,
  Lock,
  Layout,
  Code2,
  Globe,
  Layers,
} from "lucide-react";
import { easeInOut, motion, AnimatePresence } from "motion/react";

// --- Animation Variants ---
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: easeInOut },
  },
};

const staggerContainer = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { stagger: 0.1, delay: 0.2 },
  },
};

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<"frontend" | "backend">("backend");

  // Auto-switch tabs for the hero visual
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev === "backend" ? "frontend" : "backend"));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full overflow-hidden">
      {/* --- Ambient Background Glow --- */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* --- Hero Section --- */}
      <section className="pt-20 pb-32 px-4 md:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-5xl mx-auto text-center flex flex-col items-center"
        >
          <motion.div variants={fadeInUp}>
            <Badge
              variant="secondary"
              className="mb-8 px-3 py-1 rounded-full text-xs uppercase tracking-widest border border-primary/20 bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-default"
            >
              v2.0 Public Beta
            </Badge>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1] text-foreground"
          >
            Full-stack engineering, <br />
            <span className="text-muted-foreground">
              mastered in flow.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed"
          >
            The complete platform for engineering excellence. From pixel-perfect frontends
            to scalable distributed systems. Practice, debug, and deploy in a
            production-grade environment.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Link href={"/problems"}>
              <Button size="lg" className="rounded-full px-8 h-12 cursor-pointer text-base shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300">
                Start Solving <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
            <Link href={"/about"}>
              <Button variant="outline" size="lg" className="rounded-full px-8 h-12 cursor-pointer text-base bg-background/50 backdrop-blur-sm hover:bg-background/80">
                How it works
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Hero Visual / Interface Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60, rotateX: 10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
          style={{ perspective: "1000px" }}
          className="mt-24 mx-auto max-w-6xl"
        >
          <div className="relative bg-card border border-border rounded-xl shadow-2xl overflow-hidden group">
            {/* Window Controls & Tabs */}
            <div className="h-12 bg-muted/50 border-b border-border flex items-center px-4 justify-between">
              <div className="flex items-center gap-4">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <div className="flex gap-1 bg-background/50 p-1 rounded-lg">
                  <button
                    onClick={() => setActiveTab("frontend")}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${activeTab === "frontend" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    page.tsx
                  </button>
                  <button
                    onClick={() => setActiveTab("backend")}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${activeTab === "backend" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    handler.go
                  </button>
                </div>
              </div>
              <div className="text-xs font-mono text-muted-foreground flex items-center gap-2">
                <Activity size={12} className="text-green-500" />
                Connected
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[400px]">
              {/* Editor Pane */}
              <div className="p-6 font-mono text-sm overflow-hidden bg-background/50 backdrop-blur-sm text-foreground border-r border-border/50">
                <div className="grid grid-cols-[auto_1fr] gap-6">
                  <div className="text-muted-foreground/30 text-right select-none space-y-1">
                    {Array.from({ length: 15 }).map((_, i) => (
                      <div key={i}>{i + 1}</div>
                    ))}
                  </div>
                  <div className="relative">
                    <AnimatePresence mode="wait">
                      {activeTab === "backend" ? (
                        <motion.div
                          key="backend"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-1"
                        >
                          <div className="text-muted-foreground italic">// Challenge: High-throughput Event Logger</div>
                          <div><span className="text-primary">func</span> <span className="text-blue-600 dark:text-blue-400">HandleEvent</span>(w http.ResponseWriter, r *http.Request) {"{"}</div>
                          <div className="pl-4"><span className="text-primary">go</span> <span className="text-primary">func</span>() {"{"}</div>
                          <div className="pl-8"><span className="text-primary">select</span> {"{"}</div>
                          <div className="pl-8"><span className="text-primary">case</span> event := &lt;-eventChan:</div>
                          <div className="pl-12">batch.<span className="text-blue-600 dark:text-blue-400">Append</span>(event)</div>
                          <div className="pl-12"><span className="text-primary">if</span> batch.<span className="text-blue-600 dark:text-blue-400">Len</span>() &gt;= BatchSize {"{"}</div>
                          <div className="pl-16"><span className="text-primary">if</span> err := db.<span className="text-blue-600 dark:text-blue-400">BulkInsert</span>(batch); err != <span className="text-primary">nil</span> {"{"}</div>
                          <div className="pl-20">logger.<span className="text-red-500 dark:text-red-400">Error</span>(<span className="text-green-600 dark:text-green-400">"flush failed"</span>, err)</div>
                          <div className="pl-16">{"}"}</div>
                          <div className="pl-12">{"}"}</div>
                          <div className="pl-8">{"}"}</div>
                          <div className="pl-4">{"}"}()</div>
                          <div className="pl-4">w.<span className="text-blue-600 dark:text-blue-400">WriteHeader</span>(http.StatusAccepted)</div>
                          <div>{"}"}</div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="frontend"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-1"
                        >
                          <div className="text-muted-foreground italic">// Challenge: Virtualized List Component</div>
                          <div><span className="text-primary">export default function</span> <span className="text-yellow-600 dark:text-yellow-400">VirtualList</span>({"{"} items {"}"}) {"{"}</div>
                          <div className="pl-4"><span className="text-primary">const</span> parentRef = useRef(null);</div>
                          <div className="pl-4"><span className="text-primary">const</span> rowVirtualizer = <span className="text-blue-600 dark:text-blue-400">useVirtualizer</span>({"{"}</div>
                          <div className="pl-8">count: items.length,</div>
                          <div className="pl-8">getScrollElement: () =&gt; parentRef.current,</div>
                          <div className="pl-8">estimateSize: () =&gt; <span className="text-orange-500 dark:text-orange-400">35</span>,</div>
                          <div className="pl-4">{"}"});</div>
                          <div className="h-4" />
                          <div className="pl-4"><span className="text-primary">return</span> (</div>
                          <div className="pl-8">&lt;<span className="text-green-600 dark:text-green-400">div</span> ref={"{"}parentRef{"}"} className=<span className="text-green-600 dark:text-green-400">"h-[400px] overflow-auto"</span>&gt;</div>
                          <div className="pl-12">&lt;<span className="text-green-600 dark:text-green-400">div</span> style={"{{"} height: rowVirtualizer.totalSize {"}}"} className=<span className="text-green-600 dark:text-green-400">"relative"</span>&gt;</div>
                          <div className="pl-16">{/* Virtual items rendered here */}</div>
                          <div className="pl-12">&lt;/<span className="text-green-600 dark:text-green-400">div</span>&gt;</div>
                          <div className="pl-8">&lt;/<span className="text-green-600 dark:text-green-400">div</span>&gt;</div>
                          <div className="pl-4">);</div>
                          <div>{"}"}</div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Preview/Output Pane */}
              <div className="bg-muted/10 p-6 flex flex-col">
                <div className="flex-1 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {activeTab === "backend" ? (
                      <motion.div
                        key="backend-preview"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="w-full max-w-sm"
                      >
                        <div className="bg-black/80 rounded-lg p-4 font-mono text-xs text-green-400 shadow-xl border border-green-500/20">
                          <div className="flex justify-between border-b border-green-500/20 pb-2 mb-2">
                            <span>server_logs</span>
                            <span className="animate-pulse">● LIVE</span>
                          </div>
                          <div className="space-y-1">
                            <div>[INFO] Server started on port 8080</div>
                            <div className="text-gray-500">[DEBUG] Batch initialized (size=1000)</div>
                            <div>[INFO] Received 450 events</div>
                            <div>[INFO] Received 890 events</div>
                            <div className="text-yellow-400">[WARN] Batch threshold reached</div>
                            <div className="text-blue-400">[DB] Bulk insert successful (1000 records)</div>
                            <div className="animate-pulse">_</div>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="frontend-preview"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="w-full max-w-sm bg-background border border-border rounded-lg shadow-xl overflow-hidden"
                      >
                        <div className="h-8 bg-muted border-b border-border flex items-center px-3">
                          <div className="w-20 h-2 bg-muted-foreground/20 rounded-full" />
                        </div>
                        <div className="h-[200px] overflow-hidden relative">
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/20 pointer-events-none z-10" />
                          <div className="p-2 space-y-2">
                            {Array.from({ length: 8 }).map((_, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="flex items-center gap-3 p-2 rounded-md bg-muted/30 border border-border/50"
                              >
                                <div className="w-8 h-8 rounded-full bg-primary/10" />
                                <div className="space-y-1 flex-1">
                                  <div className="h-2 w-24 bg-muted-foreground/20 rounded" />
                                  <div className="h-1.5 w-16 bg-muted-foreground/10 rounded" />
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="mt-6 bg-background border border-border text-foreground px-4 py-3 rounded-lg flex items-center gap-3 shadow-sm"
                >
                  <div className="bg-green-500/20 text-green-600 dark:text-green-400 p-1 rounded-full">
                    <Check size={12} />
                  </div>
                  <div className="text-xs font-medium">
                    All tests passed (12/12)
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* --- Social Proof --- */}
      <section className="border-y border-border bg-muted/20">
        <div className="py-10 px-4">
          <p className="text-center text-sm text-muted-foreground mb-8 font-medium">
            ENGINEERS FROM THESE COMPANIES PRACTICE HERE
          </p>
          <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {["Vercel", "Linear", "Stripe", "Shopify", "Airbnb", "Netflix"].map((brand) => (
              <span
                key={brand}
                className="text-lg font-bold font-sans tracking-tight text-foreground cursor-default"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* --- Features Grid --- */}
      <section className="py-32 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="mb-24">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-foreground tracking-tight">
            Built for the <span className="text-muted-foreground">modern stack.</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Everything you need to debug, design, and deploy full-stack applications. <br />
            Packaged in a beautiful, high-performance environment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          {/* Card 1: System Design (Backend focus) */}
          <div className="md:col-span-2 row-span-2 rounded-[2.5rem] border border-border/50 bg-card overflow-hidden relative group transition-all hover:scale-[1.01] duration-500 hover:shadow-2xl hover:shadow-primary/5">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="p-10 relative z-10 flex flex-col h-full">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-6 text-violet-500">
                <Cpu size={24} />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-foreground">
                System Design Canvas
              </h3>
              <p className="text-muted-foreground text-lg max-w-md">
                Drag, drop, and crash. Simulate massive traffic spikes on your
                architecture before writing a single line of code.
              </p>

              {/* Abstract UI visualization */}
              <div className="mt-auto translate-y-12 group-hover:translate-y-8 transition-transform duration-500 ease-out">
                <div className="w-full h-64 rounded-t-2xl border-t border-x border-border/50 bg-background/40 backdrop-blur-xl shadow-2xl p-6 grid grid-cols-3 gap-4">
                  {/* Mock nodes */}
                  <div className="border border-border/50 bg-card/50 rounded-xl p-4 flex flex-col items-center justify-center gap-3 shadow-sm group-hover:border-violet-500/30 transition-colors">
                    <div className="p-2 bg-blue-500/20 rounded-lg text-blue-500">
                      <Server size={20} />
                    </div>
                    <div className="h-1.5 w-12 bg-muted rounded-full" />
                  </div>
                  <div className="border border-border/50 bg-card/50 rounded-xl p-4 flex flex-col items-center justify-center gap-3 shadow-sm group-hover:border-violet-500/30 transition-colors delay-75">
                    <div className="p-2 bg-green-500/20 rounded-lg text-green-500">
                      <Activity size={20} />
                    </div>
                    <div className="h-1.5 w-12 bg-muted rounded-full" />
                  </div>
                  <div className="border border-border/50 bg-card/50 rounded-xl p-4 flex flex-col items-center justify-center gap-3 shadow-sm group-hover:border-violet-500/30 transition-colors delay-150">
                    <div className="p-2 bg-orange-500/20 rounded-lg text-orange-500">
                      <Database size={20} />
                    </div>
                    <div className="h-1.5 w-12 bg-muted rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Frontend Preview */}
          <div className="md:col-span-1 row-span-2 rounded-[2.5rem] border border-border/50 bg-card overflow-hidden relative group p-8 flex flex-col transition-all hover:scale-[1.01] duration-500 hover:shadow-2xl hover:shadow-blue-500/5">
            <div className="absolute inset-0 bg-gradient-to-bl from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 text-blue-500">
                <Layout size={24} />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-foreground">
                Pixel Perfect
              </h3>
              <p className="text-muted-foreground text-lg">
                Instant HMR and isolated component previews. Test responsiveness and accessibility in real-time.
              </p>
            </div>

            <div className="mt-auto relative h-64 w-full">
              <div className="absolute inset-x-0 bottom-0 h-full bg-background/50 border border-border/50 rounded-t-xl p-4 shadow-lg translate-y-8 group-hover:translate-y-4 transition-transform duration-500">
                <div className="flex gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <div className="space-y-3">
                  <div className="h-20 bg-blue-500/10 rounded-lg border border-blue-500/20 w-full animate-pulse" />
                  <div className="flex gap-2">
                    <div className="h-20 bg-muted/50 rounded-lg w-1/2" />
                    <div className="h-20 bg-muted/50 rounded-lg w-1/2" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Instant Boot */}
          <div className="md:col-span-1 row-span-1 rounded-[2.5rem] border border-border/50 bg-card overflow-hidden relative group p-8 flex flex-col justify-between transition-all hover:scale-[1.02] duration-500">
            <div className="absolute inset-0 bg-gradient-to-bl from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4 text-amber-500">
                <Zap size={20} />
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                Instant Boot
              </h3>
            </div>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              Ephemeral containers that start in &lt;200ms. Ready when you are.
            </p>
          </div>

          {/* Card 4: Security/Testing */}
          <div className="md:col-span-1 row-span-1 rounded-[2.5rem] border border-border/50 bg-card overflow-hidden relative group p-8 flex flex-col justify-between transition-all hover:scale-[1.02] duration-500">
            <div className="absolute inset-0 bg-gradient-to-bl from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div>
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center mb-4 text-red-500">
                <Lock size={20} />
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                Security First
              </h3>
            </div>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              Find vulnerabilities in production-grade codebases and fix them.
            </p>
          </div>

          {/* Card 5: Collaboration (Wide bottom) */}
          <div className="md:col-span-1 row-span-1 rounded-[2.5rem] border border-border/50 bg-card overflow-hidden relative group p-8 flex flex-col justify-between transition-all hover:scale-[1.02] duration-500">
            <div className="absolute inset-0 bg-gradient-to-bl from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 text-purple-500">
                <GitPullRequest size={20} />
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                AI Code Reviews
              </h3>
            </div>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              Instant feedback on your PRs. Catch bugs before you merge.
            </p>
          </div>
        </div>
      </section>

      {/* --- CTA Section --- */}
      <section className="py-20 px-4 md:px-8">
        <div className="relative rounded-[2.5rem] overflow-hidden border border-border bg-gradient-to-b from-muted/30 to-background p-12 md:p-24 text-center group">
          <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(to_bottom,transparent,black)] pointer-events-none" />
          <h2 className="relative z-10 text-3xl md:text-5xl font-bold tracking-tight mb-8 text-foreground">
            Ready to ship <br /> better code?
          </h2>
          <div className="relative z-10 flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="rounded-full px-8 h-12 text-base shadow-lg hover:scale-105 transition-transform duration-300">
              Get Started for Free
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-8 h-12 text-base bg-background/50 backdrop-blur-sm hover:bg-background/80"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="py-12 text-sm bg-background/50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-muted-foreground">
          <div>© 2024 DevX Inc. All rights reserved.</div>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Twitter</Link>
            <Link href="#" className="hover:text-foreground transition-colors">GitHub</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
