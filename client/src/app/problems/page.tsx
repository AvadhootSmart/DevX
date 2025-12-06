"use client";
import { DifficultyBadge } from "@/components/difficultyBadge";
import { Card, CardContent } from "@/components/ui/card";
// import { PROBLEMS } from "@/static_data/problems";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IProblem } from "../../../types/problem.types";

const page = () => {
  const [problems, setProblems] = useState<IProblem[] | null>();

  const fetchProblems = async () => {
    const response = await fetch("http://localhost:8000/problems");
    const data = await response.json();

    console.log("problems", data);
    setProblems(data);
  };

  useEffect(() => {
    fetchProblems();
  }, []);
  return (
    <div className="sm:px-10 px-2">
      <h1 className="mt-10 text-3xl font-semibold">All Problems</h1>
      <h3 className="mt-2 text-md text-zinc-500">
        Explore problems that test your development skills.{" "}
      </h3>

      <div className="flex flex-col gap-2 my-6">
        {problems &&
          problems.map((problem, idx) => (
            <Link
              href={`/problem/${problem.path}`}
              key={problem.problem_name}
              className="cursor-pointer"
            >
              <Card className="sm:p-3 rounded-md border-border">
                <CardContent className="flex justify-between items-center">
                  <Link
                    className="font-medium text-lg hover:underline"
                    href={`/problem/${problem.path}`}
                  >{`${idx + 1}.${problem.problem_name}`}</Link>
                  <DifficultyBadge difficulty={problem.difficulty} />
                </CardContent>
              </Card>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default page;
