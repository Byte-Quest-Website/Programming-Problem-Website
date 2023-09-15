import React from "react";
import { getServerSession } from "next-auth";

import prisma from "@/core/db/orm";
import ProblemItem from "@/core/components/problemItem";
import { authOptions } from "../api/auth/[...nextauth]/route";

const Problems = async () => {
    const session = await getServerSession(authOptions);
    if (!session) {
        return <div className="text-white">Please Log In</div>;
    }

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
