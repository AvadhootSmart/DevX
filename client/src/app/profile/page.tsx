"use client";
import React, { useEffect, useState } from "react";
import useUser from "../../../store/user.store";
import {
  getUserData,
  getUserFromEmail,
  getUserSubmissions,
} from "@/api/profile";
import { Separator } from "@/components/ui/separator";
import { ISubmission } from "../../../types/submission.types";
import { SubmissionCard } from "@/components/submissionCard";
import { SubmissionResultDialog } from "@/components/submission-result-dialog";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const page = () => {
  const { user, token, setUser } = useUser();
  const [submissions, setSubmissions] = useState<ISubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<ISubmission | null>(
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchUserData = async () => {
    if (!token) {
      console.error("No token found");
      return;
    }
    const response = await getUserData();
    const user = await getUserFromEmail(response);

    setUser({
      username: user.username,
      email: user.email,
    });
  };

  const fetchUsersSubmissions = async () => {
    const response = await getUserSubmissions();
    setSubmissions(response);
  };

  useEffect(() => {
    fetchUserData();
    fetchUsersSubmissions();
  }, [token]);

  const handleCardClick = (submission: ISubmission) => {
    setSelectedSubmission(submission);
    setIsDialogOpen(true);
  };

  return (
    <div className="sm:px-10 px-2">
      <h1 className="mt-10 text-4xl font-semibold">
        Hi, {user ? user.username : "User"}
      </h1>
      <h3 className="mt-2 text-md text-zinc-500">
        View all your problem submissions
      </h3>

      <Separator orientation="horizontal" className="my-6" />
      <h2 className="mt-6 text-2xl font-semibold">Your Submissions</h2>

      <div className="px-2 space-y-4 my-8">
        {submissions && submissions.length > 0 ? (
          submissions.map((submission: ISubmission, idx: number) => (
            <SubmissionCard
              key={idx}
              submission={submission}
              onClick={() => handleCardClick(submission)}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed rounded-xl bg-accent/5">
            <p className="text-zinc-500 mb-4">You haven't submitted any problems yet.</p>
            <Link href="/problems">
              <Button variant="outline">Explore Problems</Button>
            </Link>
          </div>
        )}
      </div>

      <SubmissionResultDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        result={
          selectedSubmission
            ? {
              results: {
                numTotalTests: selectedSubmission.Result.numTotalTests,
                numPassedTests: selectedSubmission.Result.numPassedTests,
                numFailedTests: selectedSubmission.Result.numFailedTests,
              },
            }
            : null
        }
        submittedCode={selectedSubmission?.Code || ""}
      />

      {/* <div className="space-y-2 my-6">
        {problems &&
          problems.map((problem, idx) => (
            <Card key={problem.problem_name} className="p-3 rounded-md border-border">
              <CardContent className="flex justify-between items-center">
                <Link
                  className="font-medium text-lg hover:underline"
                  href={`/problem/${problem.path}`}
                >{`${idx + 1}.${problem.problem_name}`}</Link>
                <DifficultyBadge difficulty={problem.difficulty} />
              </CardContent>
            </Card>
          ))}
      </div> */}
    </div>
  );
};

export default page;
