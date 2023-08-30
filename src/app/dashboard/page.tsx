import React from "react";
import { getServerSession } from "next-auth/next";
import prisma from "@/core/db/orm";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Dashboard from "@/core/components/Dashboard";

const Page = async () => {
    const session = await getServerSession(authOptions);
    if (!session) return <>NOT LOGGED IN</>;

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user) {
        return <></>;
    }

    const userProblems = await prisma.problem.findMany({
        where: {
            userId: user.id,
        },
    });

    const solvedProblemsSolutions = await prisma.solution.findMany({
        where: {
            userId: user.id,
        },
    });
    const solvedProblems = await Promise.all(
        solvedProblemsSolutions.map((p) =>
            prisma.problem.findUnique({ where: { id: p.id } })
        )
    );

    if (!userProblems || !solvedProblems || !solvedProblemsSolutions)
        return <>End</>;

    const totalEasy = await prisma.problem.count({
        where: { difficulty: "EASY" },
    });
    const totalMedium = await prisma.problem.count({
        where: { difficulty: "MEDUIUM" },
    });
    const totalHard = await prisma.problem.count({
        where: { difficulty: "HARD" },
    });

    const problemCount = { EASY: 0, MEDIUM: 0, HARD: 0 };
    solvedProblems.map((p) => {
        if (p) problemCount[p.difficulty] = p.difficulty + 1;
    });

    return (
        <Dashboard
            user={user}
            problems={userProblems}
            solvedProblems={solvedProblems}
            solutions={solvedProblemsSolutions}
            problemCount={problemCount}
            totalEasy={totalEasy}
            totalMedium={totalMedium}
            totalHard={totalHard}
        />
    );
};

export default Page;
