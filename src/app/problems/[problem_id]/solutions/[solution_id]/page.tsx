import { z } from "zod";
import React from "react";

import prisma from "@/core/db/orm";

const page = async ({ params }: { params: { solution_id: string } }) => {
    const isUUID = z.string().uuid().safeParse(params.solution_id).success;
    if (!isUUID) {
        return <div>Not valid</div>;
    }

    const solution = await prisma.solution.findUnique({
        where: { id: params.solution_id },
    });
    if (!solution) {
        return <>404</>;
    }

    return <>{solution.id}</>;
};

export default page;
