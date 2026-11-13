"use client";
import { DifficultyBadge } from "@/components/difficultyBadge";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IProblem } from "../../../types/problem.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getProblems } from "@/api/problems";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronRight } from "lucide-react";

type ProblemsState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; problems: IProblem[] };

const SKELETON_ROWS = 4;

const page = () => {
  const [state, setState] = useState<ProblemsState>({ status: "loading" });
  const [filter, setFilter] = useState<string>("all");

  const fetchProblems = async () => {
    setState({ status: "loading" });
    // getProblems toasts and returns undefined on failure
    const response: IProblem[] | undefined = await getProblems();
    setState(
      response ? { status: "ready", problems: response } : { status: "error" },
    );
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const filteredProblems =
    state.status === "ready"
      ? state.problems.filter(
          (problem) => filter === "all" || problem.domain === filter,
        )
      : [];

  return (
    <div className="sm:px-10 px-4 pb-16">
      <div className="mt-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-semibold">All Problems</h1>
          <p className="mt-2 text-muted-foreground">
            Explore problems that test your development skills.
          </p>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]" aria-label="Filter by domain">
            <SelectValue placeholder="Filter by Domain" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All domains</SelectItem>
            <SelectItem value="frontend">Frontend</SelectItem>
            <SelectItem value="backend">Backend</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ul className="flex flex-col gap-2 my-6">
        {state.status === "loading" &&
          Array.from({ length: SKELETON_ROWS }, (_, i) => (
            <li
              key={i}
              className="rounded-xl border bg-card p-4 space-y-3"
              aria-hidden="true"
            >
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
            </li>
          ))}

        {state.status === "ready" &&
          filteredProblems.map((problem) => (
            <li key={problem.path}>
              <Link
                href={`/problem/${problem.path}`}
                className="group flex items-center justify-between gap-4 rounded-xl border bg-card p-4 transition-colors hover:border-foreground/20 hover:bg-accent/50 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                <div className="min-w-0 space-y-2">
                  <h2 className="text-lg font-semibold leading-snug text-balance">
                    {problem.problem_name}
                  </h2>
                  <div className="flex flex-wrap gap-1">
                    {problem.domain && (
                      <Badge variant="outline" className="capitalize">
                        {problem.domain}
                      </Badge>
                    )}
                    {problem.topics.map((topic) => (
                      <Badge key={topic} variant="secondary">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <DifficultyBadge difficulty={problem.difficulty} />
                  <ChevronRight
                    className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            </li>
          ))}
      </ul>

      {state.status === "ready" && filteredProblems.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed rounded-xl">
          <p className="text-muted-foreground">
            No problems found for this domain.
          </p>
          {filter !== "all" && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setFilter("all")}
            >
              Show all domains
            </Button>
          )}
        </div>
      )}

      {state.status === "error" && (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed rounded-xl">
          <p className="font-medium">Couldn&apos;t load problems</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Check your connection and try again.
          </p>
          <Button variant="outline" className="mt-4" onClick={fetchProblems}>
            Retry
          </Button>
        </div>
      )}
    </div>
  );
};

export default page;
