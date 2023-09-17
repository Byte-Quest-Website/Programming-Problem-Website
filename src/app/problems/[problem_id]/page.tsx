import { z } from "zod";
import React from "react";
import { getServerSession } from "next-auth/next";

import prisma from "@/core/db/orm";
import ProblemEditor from "@/core/components/ProblemEditor";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const page = async ({ params }: { params: { problem_id: string } }) => {
    const session = await getServerSession(authOptions);
    if (!session) {
        return <div className="text-white">Please Log In</div>;
    }

    const isUUID = z.string().uuid().safeParse(params.problem_id).success;
    if (!isUUID) {
        return <div>Not valid</div>;
    }

    const problem = await prisma.problem.findUnique({
        where: { id: params.problem_id },
    });
    if (!problem) {
        return <>404</>;
    }
    const author = await prisma.user.findUnique({
        where: { id: problem.userId },
    });
    if (!author) {
        return <>404</>;
    }
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
    });
    if (!user) {
        return <>404</>;
    }

    return (
        <main>
            <ProblemEditor problem={problem} author={author} user={user} />
        </main>
    );
};

export default page;
