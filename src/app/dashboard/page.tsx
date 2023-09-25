import React from "react";
import { getServerSession } from "next-auth/next";
import prisma from "@/core/db/orm";
import { Problem } from "@prisma/client";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Dashboard from "@/core/components/Dashboard";

const Page = async () => {
    const session = await getServerSession(authOptions);
    if (!session) {
        return <div className="text-white">Please Log In</div>;
    }

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
    await Promise.all(
        userProblems.map(async (p) => {
            p.likes = await prisma.user.count({
                where: {
                    likedProblems: {
                        has: p.id,
                    },
                },
            });
            p.dislikes = await prisma.user.count({
                where: {
                    dislikedProblems: {
                        has: p.id,
                    },
                },
            });
            return p;
        })
    );

    const solvedProblemsSolutions = await prisma.solution.findMany({
        where: {
            userId: user.id,
        },
    });

    let solvedProblemsMap: Map<string, Problem> = new Map();
    await Promise.all(
        solvedProblemsSolutions.map(async (solution) => {
            const p = await prisma.problem.findUnique({
                where: { id: solution.problemId },
            });
            if (p) {
                solvedProblemsMap.set(p.id, p);
            }
        })
    );

    const solvedProblems = Array.from(solvedProblemsMap.values());

    if (!userProblems || !solvedProblems || !solvedProblemsSolutions)
        return <>Not Logged In</>;

    const totalEasy = await prisma.problem.count({
        where: { difficulty: "EASY" },
    });
    const totalMedium = await prisma.problem.count({
        where: { difficulty: "MEDIUM" },
    });
    const totalHard = await prisma.problem.count({
        where: { difficulty: "HARD" },
    });

    const problemCount = { EASY: 0, MEDIUM: 0, HARD: 0 };
    solvedProblems.map((p) => {
        if (p) {
            problemCount[p.difficulty] += 1;
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
            if (!p) {
                return;
            }
            p.likes = await prisma.user.count({
                where: {
                    likedProblems: {
                        has: p.id,
                    },
                },
            });
            p.dislikes = await prisma.user.count({
                where: {
                    dislikedProblems: {
                        has: p.id,
                    },
                },
            });
            likedProblems.push(p);
        })
    );

    let dislikedProblems: Problem[] = [];
    await Promise.all(
        user.dislikedProblems.map(async (id) => {
            const p = await prisma.problem.findUnique({ where: { id: id } });
            if (!p) {
                return;
            }
            p.likes = await prisma.user.count({
                where: {
                    likedProblems: {
                        has: p.id,
                    },
                },
            });
            p.dislikes = await prisma.user.count({
                where: {
                    dislikedProblems: {
                        has: p.id,
                    },
                },
            });
            dislikedProblems.push(p);
        })
    );

    const solvedProblemsUsers = new Map<string, string[]>();

    await Promise.all(
        solvedProblems.map(async (problem) => {
            const solutions = new Set(
                (
                    await prisma.solution.findMany({
                        where: { problemId: problem.id },
                        select: { userId: true },
                    })
                ).map((_) => {
                    return _.userId;
                })
            );

            let names: string[] = [];

            await Promise.all(
                Array.from(solutions).map(async (user) => {
                    const name = await prisma.user.findUniqueOrThrow({
                        where: { id: user },
                    });
                    names.push(name.name);
                })
            );

            solvedProblemsUsers.set(problem.id, names);
        })
    );

    return (
        <Dashboard
            user={user}
            problems={userProblems}
            solvedProblems={solvedProblems}
            solutions={solvedProblemsSolutions}
            solvedProblemsUsers={solvedProblemsUsers}
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
