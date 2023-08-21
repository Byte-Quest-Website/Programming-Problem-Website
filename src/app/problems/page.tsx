import React from "react";

import { prisma } from "@/core/prisma/connections";
import ProblemItem from "@/core/components/problemItem";

const Problems = async () => {
    const problems = await prisma.problem.findMany();

    return (
        <div>
            {problems.map((problem) => {
                return <ProblemItem key={problem.id} problem={problem} />;
            })}
        </div>
    );
};

export default Problems;
