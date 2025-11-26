"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// import { Card } from "@/components/ui/card";
import {
  Terminal,
  Zap,
  // Shield,
  Cpu,
  ChevronRight,
  Github,
  Check,
  Activity,
  GitPullRequest,
  Server,
  Database,
  Lock,
} from "lucide-react";
import { delay, easeInOut, motion, stagger } from "motion/react";

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
  return (
    <div className="relative w-full overflow-hidden">
      {/* --- Ambient Background Glow --- */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* --- Hero Section --- */}
      <section className="pt-20 pb-32 px-4 md:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-4xl mx-auto text-center flex flex-col items-center"
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
            Backend engineering, <br />
            <span className="text-muted-foreground">
              reimagined for practice.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed"
          >
            Experience a high-fidelity simulation of real-world backend
            challenges. Build APIs, debug microservices, and optimize databases
            in a production-grade environment.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Link href={"/problems"}>
              <Button size="lg" className="rounded-full px-8 h-12 cursor-pointer text-base">
                Start Solving <ChevronRight className="ml-1 h-4 w-4" />
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
          className="mt-24 mx-auto max-w-5xl"
        >
          <div className="relative bg-card border border-border rounded-xl shadow-2xl overflow-hidden group">
            <div className="h-10 bg-muted/50 border-b border-border flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-destructive/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <div className="mx-auto text-xs font-mono text-muted-foreground">
                middleware_test.ts
              </div>
            </div>

            <div className="p-8 pt-12 font-mono text-sm md:text-base overflow-hidden min-h-[350px] bg-background/50 backdrop-blur-sm text-foreground">
              <div className="grid grid-cols-[auto_1fr] gap-6">
                <div className="text-muted-foreground/30 text-right select-none space-y-1">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground italic">
                    // Challenge: Rate Limit Middleware
                  </div>
                  <div>
                    <span className="text-primary">import</span> {"{"}{" "}
                    NextRequest, NextResponse {"}"}{" "}
                    <span className="text-primary">from</span>{" "}
                    <span className="text-green-600 dark:text-green-400">
                      'next/server'
                    </span>
                    ;
                  </div>
                  <div className="h-4" />
                  <div>
                    <span className="text-primary">export async function</span>{" "}
                    <span className="text-blue-600 dark:text-blue-400">
                      middleware
                    </span>
                    (req: NextRequest) {"{"}
                  </div>
                  <div className="pl-4">
                    <span className="text-primary">const</span> ip = req.ip ??{" "}
                    <span className="text-green-600 dark:text-green-400">
                      '127.0.0.1'
                    </span>
                    ;
                  </div>
                  <div className="pl-4">
                    <span className="text-primary">const</span> limit ={" "}
                    <span className="text-orange-500 dark:text-orange-400">
                      100
                    </span>
                    ;
                  </div>
                  <div className="pl-4">
                    <span className="text-primary">const</span> remaining ={" "}
                    <span className="text-primary">await</span> redis.
                    <span className="text-blue-600 dark:text-blue-400">
                      decr
                    </span>
                    (
                    <span className="text-green-600 dark:text-green-400">
                      `limit:${"{"}ip{"}"}`
                    </span>
                    );
                  </div>
                  <div className="pl-4">
                    <span className="text-primary">if</span> (remaining &lt;{" "}
                    <span className="text-orange-500 dark:text-orange-400">
                      0
                    </span>
                    ) <span className="text-primary">return new</span>{" "}
                    <span className="text-yellow-600 dark:text-yellow-400">
                      Response
                    </span>
                    (
                    <span className="text-green-600 dark:text-green-400">
                      '429'
                    </span>
                    );
                  </div>
                  <div>{"}"}</div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2, duration: 0.5 }}
                className="absolute bottom-6 right-6 bg-background border border-border text-foreground px-4 py-3 rounded-lg flex items-center gap-3 shadow-lg"
              >
                <div className="bg-green-500/20 text-green-600 dark:text-green-400 p-1 rounded-full">
                  <Check size={12} />
                </div>
                <div className="text-xs font-medium">
                  Test Suite Passed (4/4)
                </div>
              </motion.div>
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
            {["Vercel", "Linear", "Stripe", "Shopify"].map((brand) => (
              <span
                key={brand}
                className="text-lg font-bold font-sans tracking-tight text-foreground"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* --- Features Grid (Zen Browser Style) --- */}
      <section className="py-32 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="mb-24">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-foreground tracking-tight">
            Built for the{" "}
            <span className="text-muted-foreground">flow state.</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Everything you need to debug, design, and deploy. <br />
            Packaged in a beautiful, high-performance environment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          {/* Card 1: The "Visual" Heavy Lifter (System Design) */}
          <div className="md:col-span-2 row-span-2 rounded-[2.5rem] border border-border/50 bg-card overflow-hidden relative group transition-all hover:scale-[1.01] duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="p-10 relative z-10 flex flex-col h-full">
              <div className="w-12 h-12 rounded-2xl bg-foreground/5 border border-white/10 flex items-center justify-center mb-6 text-foreground">
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
                  <div className="border border-border/50 bg-card/50 rounded-xl p-4 flex flex-col items-center justify-center gap-3 shadow-sm">
                    <div className="p-2 bg-blue-500/20 rounded-lg text-blue-500">
                      <Server size={20} />
                    </div>
                    <div className="h-1.5 w-12 bg-muted rounded-full" />
                    <div className="h-1 w-8 bg-muted/50 rounded-full" />
                  </div>
                  <div className="border border-border/50 bg-card/50 rounded-xl p-4 flex flex-col items-center justify-center gap-3 shadow-sm">
                    <div className="p-2 bg-green-500/20 rounded-lg text-green-500">
                      <Activity size={20} />
                    </div>
                    <div className="h-1.5 w-12 bg-muted rounded-full" />
                    <div className="h-1 w-8 bg-muted/50 rounded-full" />
                  </div>
                  <div className="border border-border/50 bg-card/50 rounded-xl p-4 flex flex-col items-center justify-center gap-3 shadow-sm">
                    <div className="p-2 bg-orange-500/20 rounded-lg text-orange-500">
                      <Database size={20} />
                    </div>
                    <div className="h-1.5 w-12 bg-muted rounded-full" />
                    <div className="h-1 w-8 bg-muted/50 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Speed (Instant Environments) */}
          <div className="md:col-span-1 row-span-1 rounded-[2.5rem] border border-border/50 bg-card overflow-hidden relative group p-8 flex flex-col justify-between transition-all hover:scale-[1.02] duration-500">
            <div className="absolute inset-0 bg-gradient-to-bl from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 text-blue-500">
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

          {/* Card 3: Security */}
          <div className="md:col-span-1 row-span-1 rounded-[2.5rem] border border-border/50 bg-card overflow-hidden relative group p-8 flex flex-col justify-between transition-all hover:scale-[1.02] duration-500">
            <div className="absolute inset-0 bg-gradient-to-bl from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div>
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center mb-4 text-red-500">
                <Lock size={20} />
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                Live Patching
              </h3>
            </div>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              Find vulnerabilities in production-grade codebases and fix them.
            </p>
          </div>

          {/* Card 4: Collaboration/Code Review (Wide bottom) */}
          <div className="md:col-span-3 row-span-1 rounded-[2.5rem] border border-border/50 bg-card overflow-hidden relative group flex flex-col md:flex-row items-center transition-all hover:scale-[1.01] duration-500">
            <div className="p-10 md:w-1/2 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 text-purple-500">
                <GitPullRequest size={20} />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-foreground">
                AI-Driven Code Reviews
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Get instant feedback on your PRs. Our AI catches race
                conditions, memory leaks, and anti-patterns before you merge.
              </p>
            </div>
            <div className="w-full md:w-1/2 h-full bg-gradient-to-l from-muted/20 to-transparent relative overflow-hidden flex items-center justify-center">
              {/* Simple abstract code visual */}
              <div className="absolute right-0 translate-x-12 md:translate-x-0 rotate-y-12 opacity-40 group-hover:opacity-70 transition-opacity duration-500 p-8">
                <div className="space-y-3 w-72 p-6 rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-full bg-purple-500/20" />
                    <div className="h-2 w-20 bg-muted rounded-full" />
                  </div>
                  <div className="h-2 w-full bg-muted-foreground/10 rounded" />
                  <div className="h-2 w-3/4 bg-muted-foreground/10 rounded" />
                  <div className="h-2 w-5/6 bg-red-500/20 rounded" />
                  <div className="h-2 w-full bg-green-500/20 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA Section --- */}
      <section className="py-20 px-4 md:px-8">
        <div className="relative rounded-[2.5rem] overflow-hidden border border-border bg-gradient-to-b from-muted/30 to-background p-12 md:p-24 text-center">
          <h2 className="relative z-10 text-3xl md:text-5xl font-bold tracking-tight mb-8 text-foreground">
            Ready to ship <br /> better code?
          </h2>
          <div className="relative z-10 flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="rounded-full px-8 h-12 text-base">
              Get Started for Free
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-8 h-12 text-base bg-background/50"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* --- Footer (Minimal) --- */}
      <footer className="border-t border-border py-12 text-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="flex items-center gap-2 font-bold text-foreground">
            <Terminal size={16} /> DevX
          </div>
          <div className="flex gap-6 md:justify-end text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Twitter
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
