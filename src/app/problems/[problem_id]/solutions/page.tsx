import React from "react";
import prisma from "@/core/db/orm";
import { getServerSession } from "next-auth/next";
import SolutionsTable from "@/core/components/solutionsTable";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const AllSolutions = async ({ params }: { params: { problem_id: string } }) => {
    const session = await getServerSession(authOptions);
    if (!session) {
        return <div className="text-white">Please Log In</div>;
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
    });
    if (!user) {
        return <>Failed :(</>;
    }

    const solved =
        (
            await prisma.solution.findMany({
                where: { userId: user.id },
            })
        ).length !== 0;

    if (!solved) {
        return (
            <div className="text-white">
                YOU MUST SOLVE THE PROBLEM TO SEE THE SOLTIONS
            </div>
        );
    }

    const problem = await prisma.problem.findUnique({
        where: { id: params.problem_id },
    });
    if (!problem) {
        return <>404</>;
    }

    const solutions = await prisma.solution.findMany({
        where: { problemId: params.problem_id },
    });
    const solutionAuthors = new Map<string, string>();
    await Promise.all(
        solutions.map(async (s) => {
            const user = await prisma.user.findUnique({
                where: { id: s.userId },
                select: { name: true },
            });
            solutionAuthors.set(s.id, user?.name ?? "");
        })
    );

    return (
        <div className="p-10 h-full">
            <div className="flex items-center justify-center mb-10">
                <h1 className="text-white text-[2.5rem] font-poppinsbold">
                    All Solutions
                </h1>
            </div>
            <div>
                <SolutionsTable
                    problemId={problem.id}
                    solutions={solutions}
                    solutionAuthors={solutionAuthors}
                />
            </div>
        </div>
    );
};

export default AllSolutions;
