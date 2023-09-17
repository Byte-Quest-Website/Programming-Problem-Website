import React from "react";
import { getServerSession } from "next-auth";

import prisma from "@/core/db/orm";
import ProblemsTable from "@/core/components/problemsTable";
import { authOptions } from "../api/auth/[...nextauth]/route";

const Problems = async () => {
    const session = await getServerSession(authOptions);
    if (!session) {
        return <div className="text-white">Please Log In</div>;
    }

    const problems = await prisma.problem.findMany();
    const problemAuthors = new Map<string, string>();
    await Promise.all(
        problems.map(async (p) => {
            const user = await prisma.user.findUnique({
                where: { id: p.userId },
            });
            problemAuthors.set(p.id, user?.name ?? "");
        })
    );
    const solvedByUser = new Map<string, boolean>();
    await Promise.all(
        problems.map(async (p) => {
            const solved = await prisma.solution.findFirst({
                select: { id: true },
                where: { problemId: p.id, userId: session.user.id },
            });
            solvedByUser.set(p.id, solved !== null);
        })
    );

    return (
        <main className="p-10 h-full">
            <header className="flex items-center justify-center mb-10">
                <h1 className="text-white text-[2.5rem] font-poppinsbold">
                    All Problems
                </h1>
            </header>
            <section>
                <ProblemsTable
                    problems={problems}
                    problemAuthors={problemAuthors}
                    solvedByUser={solvedByUser}
                />
            </section>
        </main>
    );
};

export default Problems;
