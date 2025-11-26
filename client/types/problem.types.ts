export type Test = {
  input: any;
  output: any;
  explanation?: string;
};

export type Difficulty = "easy" | "medium" | "hard";

export interface IProblem {
  id: string;
  problem_name: string;
  description: string;
  difficulty: Difficulty;
  boilerplate: string;
  tests: Test[];
  topics: string[];
}
