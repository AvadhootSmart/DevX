export type Test = {
  input: any;
  output: any;
  explanation?: string;
};

export type Difficulty = "easy" | "medium" | "hard";

enum Domain {
  FRONTEND = "frontend",
  BACKEND = "backend",
}
export interface IProblem {
  path: string;
  problem_name: string;
  description: string;
  difficulty: Difficulty;
  boilerplate: string;
  tests: Test[];
  topics: string[];
  domain: Domain;
}
