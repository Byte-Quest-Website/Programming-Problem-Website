import { z } from "zod";
import React from "react";

import { prisma } from "@/core/prisma/connections";
import ProblemItem from "@/core/components/problemItem";

const page = async ({ params }: { params: { problem_id: string } }) => {
    const isUUID = z.string().uuid().safeParse(params.problem_id).success;
    console.log(isUUID)
    if (!isUUID) {
        return <div>Not valid</div>;
    }

    const problem = await prisma.problem.findUnique({
        where: { id: params.problem_id },
    });
    if (!problem) {
        return <>404</>;
    }

    return <ProblemItem problem={problem} />;
};

export default page;
