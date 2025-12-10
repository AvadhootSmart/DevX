import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DifficultyBadge } from "./difficultyBadge";
import { ISubmission } from "../../types/submission.types";
import CodeBlock from "./code-block";

export const SubmissionPopup = ({
  submission,
  children,
}: {
  submission: ISubmission;
  children: React.ReactNode;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-4">
            {submission.Problem.problem_name}
            <DifficultyBadge difficulty={submission.Problem.difficulty} />
          </DialogTitle>
        </DialogHeader>
        {/* <code lang="javascript" className="flex-1 overflow-y-auto p-4 bg-muted rounded-md font-mono text-sm whitespace-pre-wrap"> */}
        {/*   {submission.Code} */}
        {/* </code> */}
        <CodeBlock
          className="flex-1 overflow-y-auto p-4 bg-muted rounded-md font-mono text-sm whitespace-pre-wrap"
          code={submission.Code}
        />
      </DialogContent>
    </Dialog>
  );
};

export const SubmissionCard = ({ submission }: { submission: ISubmission }) => {
  return (
    <SubmissionPopup submission={submission}>
      <Card className="cursor-pointer hover:bg-accent/50 transition-colors p-0 group">
        <CardContent className="flex justify-between items-center p-4 group-hover:px-6 transition-all">
          <div>
            <CardHeader className="p-0">
              <CardTitle className="text-lg">
                {submission.Problem.problem_name}
              </CardTitle>
            </CardHeader>
            <div className="flex flex-wrap gap-1">
              {submission.Problem.domain && (
                <Badge variant="outline">{submission.Problem.domain}</Badge>
              )}
              {submission.Problem.topics.map((topic) => (
                <Badge key={topic} variant="secondary">
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
          <DifficultyBadge difficulty={submission.Problem.difficulty} />
        </CardContent>
      </Card>
    </SubmissionPopup>
  );
};
