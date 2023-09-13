import React from "react";
import prisma from "@/core/db/orm";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const AllSolutions = async ({ params }: { params: { problem_id: string } }) => {
    const session = await getServerSession(authOptions);
    if (!session) return <>NOT LOGGED IN</>;

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

    const solutions = await prisma.solution.findMany({
        where: { problemId: params.problem_id },
    });

    return (
        <div>
            {solutions.map((solution) => {
                return <div key={solution.id}>{solution.id}</div>;
            })}
        </div>
    );
};

export default AllSolutions;
