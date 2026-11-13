import React from "react";
import { Button } from "../ui/button";
import {
  Monitor,
  Columns,
  Code,
  LayoutTemplate,
  Maximize2,
  FileText,
  PanelLeft,
} from "lucide-react";
import { IProblem } from "../../../types/problem.types";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "motion/react";
import { DifficultyBadge } from "../difficultyBadge";
import { Difficulty } from "../../../types/problem.types";

const DIFFICULTY_GLOW: Record<Difficulty, string> = {
  easy: "from-emerald-500/15",
  medium: "from-amber-500/15",
  hard: "from-red-500/15",
};

export type LayoutType =
  | "classic" // Description + Editor
  | "focus" // Editor + Preview
  | "bento" // Description + Editor + Preview
  | "full-preview" // Full Preview
  | "full-editor" // Full Editor
  | "full-description"; // Full Description

interface ProblemHeaderProps {
  type: "frontend" | "backend";
  problem: IProblem;
}

export const ProblemHeader = ({
  type = "backend",
  problem,
  layout,
  setLayout,
}: ProblemHeaderProps & {
  layout: LayoutType;
  setLayout: (mode: LayoutType) => void;
}) => {
  const renderLayoutButton = (
    mode: LayoutType,
    icon: React.ReactNode,
    label: string,
  ) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={layout === mode ? "secondary" : "ghost"}
          size="icon"
          onClick={() => setLayout(mode)}
          className="h-8 w-8"
          aria-label={label}
          aria-pressed={layout === mode}
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );

  return (
    <motion.header
      layoutId="header"
      initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="border relative border-border overflow-hidden bg-card rounded-lg p-4 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l to-transparent",
          DIFFICULTY_GLOW[problem.difficulty],
        )}
      />
      <div className="relative min-w-0 space-y-2">
        <h1 className="text-2xl sm:text-3xl font-semibold text-balance">
          {problem.problem_name}
        </h1>
        <div className="flex flex-wrap gap-1">
          <DifficultyBadge difficulty={problem.difficulty} />
          {problem.topics.map((topic) => (
            <Badge key={topic} variant="outline" className="capitalize">
              {topic}
            </Badge>
          ))}
        </div>
      </div>
      <div className="relative flex items-center gap-2">
        <TooltipProvider>
          <div
            role="group"
            aria-label="Workspace layout"
            className="flex items-center gap-1 bg-background/60 p-1 rounded-lg border border-border"
          >
            {renderLayoutButton(
              "classic",
              <PanelLeft className="h-4 w-4" />,
              "Classic (Desc + Editor)",
            )}

            {renderLayoutButton(
              "full-editor",
              <Code className="h-4 w-4" />,
              "Full Editor",
            )}

            {renderLayoutButton(
              "full-description",
              <FileText className="h-4 w-4" />,
              "Full Description",
            )}

            {type === "frontend" && (
              <>
                <div className="w-px h-4 bg-border mx-1" />
                {renderLayoutButton(
                  "focus",
                  <Columns className="h-4 w-4" />,
                  "Focus (Editor + Preview)",
                )}
                {renderLayoutButton(
                  "bento",
                  <LayoutTemplate className="h-4 w-4" />,
                  "Bento (All)",
                )}
                {renderLayoutButton(
                  "full-preview",
                  <Monitor className="h-4 w-4" />,
                  "Full Preview",
                )}
              </>
            )}
          </div>
        </TooltipProvider>
      </div>
    </motion.header>
  );
};
