import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";

interface DifficultyBadgeProps {
  difficulty?: "easy" | "medium" | "hard";
}
export const DifficultyBadge = ({ difficulty }: DifficultyBadgeProps) => {
  return (
    <Badge
      className={cn(
        difficulty === "easy" && "bg-green-200 text-green-800",
        difficulty === "medium" && "bg-yellow-200 text-yellow-800",
        difficulty === "hard" && "bg-red-200 text-red-800",
        "capitalize",
      )}
    >
      {difficulty}
    </Badge>
  );
};
