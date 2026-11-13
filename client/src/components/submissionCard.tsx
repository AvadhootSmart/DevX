import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle } from "lucide-react";
import { DifficultyBadge } from "./difficultyBadge";
import { ISubmission } from "../../types/submission.types";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

export const SubmissionCard = ({
  submission,
  onClick,
}: {
  submission: ISubmission;
  onClick?: () => void;
}) => {
  const { numPassedTests, numTotalTests } = submission.Result;
  const allPassed = numTotalTests > 0 && numPassedTests === numTotalTests;
  const submittedAt = new Date(submission.CreatedAt);

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center justify-between gap-4 rounded-xl border bg-card p-4 text-left transition-colors hover:border-foreground/20 hover:bg-accent/50 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      <div className="min-w-0 space-y-2">
        <h3 className="text-lg font-semibold leading-snug text-balance">
          {submission.Problem.problem_name}
        </h3>
        <div className="flex flex-wrap items-center gap-1">
          {submission.Problem.domain && (
            <Badge variant="outline" className="capitalize">
              {submission.Problem.domain}
            </Badge>
          )}
          <DifficultyBadge difficulty={submission.Problem.difficulty} />
          {!Number.isNaN(submittedAt.getTime()) && (
            <time
              dateTime={submission.CreatedAt}
              className="ml-1 text-xs text-muted-foreground"
            >
              {dateFormatter.format(submittedAt)}
            </time>
          )}
        </div>
      </div>
      <div
        className={cn(
          "flex shrink-0 items-center gap-1.5 text-sm font-medium tabular-nums",
          allPassed
            ? "text-emerald-700 dark:text-emerald-400"
            : "text-muted-foreground",
        )}
      >
        {allPassed ? (
          <CheckCircle2 className="size-4" aria-hidden="true" />
        ) : (
          <XCircle className="size-4 text-red-600 dark:text-red-400" aria-hidden="true" />
        )}
        {numPassedTests}/{numTotalTests} passed
      </div>
    </button>
  );
};
