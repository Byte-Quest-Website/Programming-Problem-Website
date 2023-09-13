import React from "react";
import prisma from "@/core/db/orm";

const AllSolutions = async ({ params }: { params: { problem_id: string } }) => {
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
