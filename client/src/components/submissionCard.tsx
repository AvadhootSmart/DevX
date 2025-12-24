import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DifficultyBadge } from "./difficultyBadge";
import { ISubmission } from "../../types/submission.types";

export const SubmissionCard = ({
  submission,
  onClick
}: {
  submission: ISubmission;
  onClick?: () => void;
}) => {
  return (
    <Card
      className="cursor-pointer hover:bg-accent/50 transition-colors p-0 group"
      onClick={onClick}
    >
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
  );
};
