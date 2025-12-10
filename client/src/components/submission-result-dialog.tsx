"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, Code2, Trophy } from "lucide-react";
import CodeBlock from "@/components/code-block";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

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
    const successRate = (numPassedTests / numTotalTests) * 100;
    const allTestsPassed = numPassedTests === numTotalTests;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-2xl">
                        {allTestsPassed ? (
                            <>
                                <Trophy className="size-6 text-green-500" />
                                Submission Successful!
                            </>
                        ) : (
                            <>
                                <Code2 className="size-6 text-blue-500" />
                                Submission Results
                            </>
                        )}
                    </DialogTitle>
                    <DialogDescription>
                        {result.message || "Here are the results of your submission"}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                    {/* Test Results Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Test Results Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Progress Bar */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">Success Rate</span>
                                    <span className="font-semibold">{successRate.toFixed(0)}%</span>
                                </div>
                                <Progress
                                    value={successRate}
                                    className={cn(
                                        "h-3",
                                        allTestsPassed && "[&>*]:bg-green-500"
                                    )}
                                />
                            </div>

                            {/* Test Stats Grid */}
                            <div className="grid grid-cols-3 gap-4 mt-4">
                                <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                                    <div className="text-3xl font-bold">{numTotalTests}</div>
                                    <div className="text-sm text-muted-foreground mt-1">
                                        Total Tests
                                    </div>
                                </div>

                                <div className="flex flex-col items-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="size-5 text-green-500" />
                                        <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                                            {numPassedTests}
                                        </div>
                                    </div>
                                    <div className="text-sm text-muted-foreground mt-1">
                                        Passed
                                    </div>
                                </div>

                                <div className="flex flex-col items-center p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                                    <div className="flex items-center gap-2">
                                        <XCircle className="size-5 text-red-500" />
                                        <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                                            {numFailedTests}
                                        </div>
                                    </div>
                                    <div className="text-sm text-muted-foreground mt-1">
                                        Failed
                                    </div>
                                </div>
                            </div>

                            {/* Status Badge */}
                            <div className="flex justify-center mt-4">
                                {allTestsPassed ? (
                                    <Badge className="bg-green-500 hover:bg-green-600 text-white px-4 py-2">
                                        All Tests Passed ✓
                                    </Badge>
                                ) : (
                                    <Badge variant="destructive" className="px-4 py-2">
                                        {numFailedTests} Test{numFailedTests !== 1 ? "s" : ""} Failed
                                    </Badge>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Separator />

                    {/* Submitted Code */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Code2 className="size-5" />
                                Your Submitted Code
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-lg overflow-hidden border border-border">
                                <CodeBlock
                                    code={submittedCode}
                                    language={language}
                                    className="max-h-[400px]"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    );
};
