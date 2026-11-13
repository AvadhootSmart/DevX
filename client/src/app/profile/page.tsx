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
import { Skeleton } from "@/components/ui/skeleton";
import { AuthPopup } from "@/components/authPopup";

type SubmissionsState =
  | { status: "loading" }
  | { status: "signed-out" }
  | { status: "error" }
  | { status: "ready"; submissions: ISubmission[] };

const SKELETON_ROWS = 3;

const page = () => {
  const { user, token, setUser } = useUser();
  const [state, setState] = useState<SubmissionsState>({ status: "loading" });
  const [selectedSubmission, setSelectedSubmission] = useState<ISubmission | null>(
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchUserData = async () => {
    const email = await getUserData();
    if (!email) return;
    const profile = await getUserFromEmail(email);
    if (!profile) return;

    setUser({
      username: profile.username,
      email: profile.email,
    });
  };

  const fetchUsersSubmissions = async () => {
    setState({ status: "loading" });
    // getUserSubmissions returns undefined on failure
    const response: ISubmission[] | undefined = await getUserSubmissions();
    setState(
      response
        ? { status: "ready", submissions: response }
        : { status: "error" },
    );
  };

  useEffect(() => {
    if (!token) {
      setState({ status: "signed-out" });
      return;
    }
    fetchUserData();
    fetchUsersSubmissions();
  }, [token]);

  const handleCardClick = (submission: ISubmission) => {
    setSelectedSubmission(submission);
    setIsDialogOpen(true);
  };

  if (state.status === "signed-out") {
    return (
      <div className="sm:px-10 px-4">
        <div className="mt-10 flex flex-col items-center justify-center py-20 text-center border border-dashed rounded-xl">
          <p className="font-medium">Log in to see your submissions</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Your solved problems and test results live here.
          </p>
          <AuthPopup>
            <Button className="mt-4">Log in</Button>
          </AuthPopup>
        </div>
      </div>
    );
  }

  return (
    <div className="sm:px-10 px-4 pb-16">
      <h1 className="mt-10 text-3xl font-semibold">
        Hi, {user ? user.username : "there"}
      </h1>
      <p className="mt-2 text-muted-foreground">
        View all your problem submissions
      </p>

      <Separator orientation="horizontal" className="my-8" />
      <h2 className="text-xl font-semibold">Your Submissions</h2>

      <div className="space-y-2 mt-4">
        {state.status === "loading" &&
          Array.from({ length: SKELETON_ROWS }, (_, i) => (
            <div
              key={i}
              className="rounded-xl border bg-card p-4 space-y-3"
              aria-hidden="true"
            >
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          ))}

        {state.status === "error" && (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed rounded-xl">
            <p className="font-medium">Couldn&apos;t load your submissions</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Check your connection and try again.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={fetchUsersSubmissions}
            >
              Retry
            </Button>
          </div>
        )}

        {state.status === "ready" &&
          (state.submissions.length > 0 ? (
            state.submissions.map((submission) => (
              <SubmissionCard
                key={submission.ID}
                submission={submission}
                onClick={() => handleCardClick(submission)}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed rounded-xl">
              <p className="text-muted-foreground">
                You haven&apos;t submitted any problems yet.
              </p>
              <Button asChild variant="outline" className="mt-4">
                <Link href="/problems">Explore Problems</Link>
              </Button>
            </div>
          ))}
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
    </div>
  );
};

export default page;
