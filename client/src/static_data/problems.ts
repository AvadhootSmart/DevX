import { IProblem } from "../../types/problem.types";

export const PROBLEMS: IProblem[] = [
  {
    id: "hello-api",
    name: "Hello API",
    description: "Write a simple API that returns a greeting.",
    difficulty: "easy",
    boilerplate: `import express from "express"`,
    tests: [
      {
        input: "",
        output: "",
      },
    ],
    topics: ["api"],
  },
  {
    id: "pagination",
    name: "Pagination",
    description: `Write a simple API that returns a list of items with pagination.`,
    difficulty: "medium",
    boilerplate: `import express from "express"`,
    tests: [
      {
        input: "",
        output: "",
      },
    ],
    topics: ["API", "pagination", "Node/Express"],
  },
  {
    id: "schema-to-api",
    name: "Schema to API",
    description: "Write a simple API that returns a greeting.",
    difficulty: "hard",
    boilerplate: `import express from "express"`,
    tests: [
      {
        input: "",
        output: "",
      },
    ],
    topics: ["api"],
  },
];
