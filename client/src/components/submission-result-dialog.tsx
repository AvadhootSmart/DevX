"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, Code2, Trophy } from "lucide-react";
import CodeBlock from "@/components/code-block";

interface SubmissionResult {
    message?: string;
    results: {
        numTotalTests: number;
        numPassedTests: number;
        numFailedTests: number;
    };
}

interface SubmissionResultDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    result: SubmissionResult | null;
    submittedCode: string;
    language?: "javascript" | "typescript" | "jsx" | "tsx";
}

export const SubmissionResultDialog: React.FC<SubmissionResultDialogProps> = ({
    open,
    onOpenChange,
    result,
    submittedCode,
    language = "javascript",
}) => {
    if (!result) return null;

    const { numTotalTests, numPassedTests, numFailedTests } = result.results;
    const allTestsPassed = numTotalTests > 0 && numPassedTests === numTotalTests;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto overflow-x-hidden">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-2xl">
                        {allTestsPassed ? (
                            <>
                                <Trophy className="size-6 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                                All tests passed
                            </>
                        ) : (
                            <>
                                <Code2 className="size-6 text-muted-foreground" aria-hidden="true" />
                                Submission results
                            </>
                        )}
                    </DialogTitle>
                    <DialogDescription>
                        {result.message || "Here are the results of your submission"}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                    <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                        <div className="text-3xl font-bold tabular-nums">{numTotalTests}</div>
                        <div className="text-sm text-muted-foreground mt-1">Total</div>
                    </div>

                    <div className="flex flex-col items-center p-4 bg-emerald-500/10 rounded-lg">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                            <div className="text-3xl font-bold tabular-nums text-emerald-700 dark:text-emerald-400">
                                {numPassedTests}
                            </div>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">Passed</div>
                    </div>

                    <div
                        className={cn(
                            "flex flex-col items-center p-4 rounded-lg",
                            numFailedTests > 0 ? "bg-red-500/10" : "bg-muted",
                        )}
                    >
                        <div className="flex items-center gap-2">
                            <XCircle
                                className={cn(
                                    "size-5",
                                    numFailedTests > 0 ? "text-red-600 dark:text-red-400" : "text-muted-foreground",
                                )}
                                aria-hidden="true"
                            />
                            <div
                                className={cn(
                                    "text-3xl font-bold tabular-nums",
                                    numFailedTests > 0 && "text-red-700 dark:text-red-400",
                                )}
                            >
                                {numFailedTests}
                            </div>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">Failed</div>
                    </div>
                </div>

                <section className="space-y-3">
                    <h3 className="text-sm font-medium text-muted-foreground">Submitted code</h3>
                    <div className="rounded-lg overflow-hidden border border-border">
                        <CodeBlock
                            code={submittedCode}
                            language={language}
                            className="max-h-[400px]"
                        />
                    </div>
                </section>
            </DialogContent>
        </Dialog>
    );
};
