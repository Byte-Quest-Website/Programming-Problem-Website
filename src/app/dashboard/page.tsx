import React from "react";
import { getServerSession } from "next-auth/next";
import prisma from "@/core/db/orm";
import { Problem } from "@prisma/client";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Dashboard from "@/core/components/Dashboard";

const Page = async () => {
    const session = await getServerSession(authOptions);
    if (!session) return <>NOT LOGGED IN</>;

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user) {
        return <>Not Logged In</>;
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
    let solvedProblems: Problem[] = [];
    await Promise.all(
        solvedProblemsSolutions.map(async (problem) => {
            const p = await prisma.problem.findUnique({
                where: { id: problem.id },
            });
            if (p) {
                solvedProblems.push(p);
            }
        })
    );

    if (!userProblems || !solvedProblems || !solvedProblemsSolutions)
        return <>Not Logged In</>;

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
        if (p) {
            problemCount[p.difficulty] = p.difficulty + 1;
        }
    });

    const allUsers = await prisma.user.findMany({
        select: { id: true, score: true },
        orderBy: { score: "desc" },
    });
    const rank = allUsers.findIndex((item) => item.id == user.id);

    let likedProblems: Problem[] = [];
    await Promise.all(
        user.likedProblems.map(async (id) => {
            const p = await prisma.problem.findUnique({ where: { id: id } });
            if (p) {
                likedProblems.push(p);
            }
        })
    );

    let dislikedProblems: Problem[] = [];
    await Promise.all(
        user.dislikedProblems.map(async (id) => {
            const p = await prisma.problem.findUnique({ where: { id: id } });
            if (p) {
                dislikedProblems.push(p);
            }
        })
    );

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
            likedProblems={likedProblems}
            dislikedProblems={dislikedProblems}
            rank={rank + 1}
        />
    );
};

export default Page;
