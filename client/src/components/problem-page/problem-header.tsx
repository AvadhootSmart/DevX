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
      className="border relative border-border overflow-hidden bg-card rounded-lg p-4 flex justify-between items-center mb-4">
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold">{problem?.problem_name}</h1>
        <div className="flex flex-wrap gap-1">
          {problem?.topics.map((topic) => (
            <Badge key={topic} variant="outline" className="capitalize">
              {topic}
            </Badge>
          ))}
        </div>
      </div>
      <div
        className={cn(
          "h-full w-[20%] right-0 bg-white absolute",
          problem.difficulty === "easy" &&
          "bg-gradient-to-l dark:from-green-900 from-green-300 to-transparent",
          problem.difficulty === "medium" &&
          "bg-gradient-to-l from-yellow-900 to-transparent",
          problem.difficulty === "hard" &&
          "bg-gradient-to-l from-red-900 to-transparent",
        )}
      />

      <div className="flex items-center gap-2 z-10 backdrop-blur-lg">
        <TooltipProvider>
          <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg border border-border">
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
