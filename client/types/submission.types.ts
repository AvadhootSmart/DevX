import { IProblem } from "./problem.types";

export interface ISubmission {
    ID: number;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: string | null;
    UserID: number;
    ProblemID: number;
    Problem: IProblem;
    Code: string;
    Result: {
        numTotalTests: number;
        numPassedTests: number;
        numFailedTests: number;
    }
}