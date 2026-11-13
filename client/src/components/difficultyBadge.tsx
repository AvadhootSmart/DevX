import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { Difficulty } from "../../types/problem.types";

const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  easy: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  medium: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  hard: "bg-red-500/15 text-red-700 dark:text-red-400",
};

interface DifficultyBadgeProps {
  difficulty?: Difficulty;
}
export const DifficultyBadge = ({ difficulty }: DifficultyBadgeProps) => {
  if (!difficulty) return null;
  return (
    <Badge
      className={cn(
        "border-transparent capitalize",
        DIFFICULTY_STYLES[difficulty],
      )}
    >
      {difficulty}
    </Badge>
  );
};
