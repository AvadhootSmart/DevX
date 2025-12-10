"use client";
import { DifficultyBadge } from "@/components/difficultyBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { PROBLEMS } from "@/static_data/problems";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IProblem } from "../../../types/problem.types";
import { Badge } from "@/components/ui/badge";
import { getProblems } from "@/api/problems";

const page = () => {
  const [problems, setProblems] = useState<IProblem[] | null>();

  const fetchProblems = async () => {
    const response = await getProblems();
    console.log("problems", response);
    setProblems(response);
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
              <Card className="cursor-pointer hover:bg-accent/50 transition-colors p-0 group">
                <CardContent className="flex justify-between items-center p-4 group-hover:px-6 transition-all">
                  <div>
                    <CardHeader className="p-0">
                      <CardTitle className="text-lg">
                        {problem.problem_name}
                      </CardTitle>
                    </CardHeader>
                    <div className="flex flex-wrap gap-1">
                      {problem.domain && (
                        <Badge variant="outline">{problem.domain}</Badge>
                      )}
                      {problem.topics.map((topic) => (
                        <Badge key={topic} variant="secondary">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
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
