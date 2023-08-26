import React from "react";
import prisma from "@/core/db/orm";

const AllSolutions = async () => {
    const solutions = await prisma.problem.findMany();

    return (
        <div>
            {solutions.map((solution) => {
                return <div key={solution.id}>{solution.id}</div>;
            })}
        </div>
    );
};

export default AllSolutions;
