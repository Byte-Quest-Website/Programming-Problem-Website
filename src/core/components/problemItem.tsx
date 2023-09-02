"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Problem } from "@prisma/client";

const ProblemItem = ({ problem }: { problem: Problem }) => {
    const router = useRouter();

    return (
        <div
            className="text-white"
            onClick={() =>
                router.push(`http://localhost:3000/problems/${problem.id}`)
            }
        >
            <li>{problem.id}</li>
            <li>{problem.title}</li>
            <li>{problem.description}</li>
            <li>{problem.functionName}</li>
            <li>{problem.createdAt.toDateString()}</li>
            <li>{problem.updatedAt.toDateString()}</li>
            <li>{problem.verified}</li>
        </div>
    );
};

export default ProblemItem;
