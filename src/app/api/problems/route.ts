import { z } from "zod";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";

import prisma from "@/core/db/orm";
import redis from "@/core/db/redis";
import { authOptions } from "../auth/[...nextauth]/route";

type RequestData = {
    state: 1 | 0 | -1;
    userId: string;
    problemId: string;
};

const NewProblem = z.object({
    title: z.string(),
    description: z.string(),
    memoryLimit: z.number().min(1).max(50).default(25),
    timeLimit: z.number().min(0.1).max(10).default(1),
    difficulty: z.union([
        z.literal("EASY"),
        z.literal("MEDIUM"),
        z.literal("HARD"),
    ]),
    solutionLink: z.string().url(),
    functionName: z.string(),
    parameterNames: z.array(z.string()),
    testsJsonFile: z.string(),
});

export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json(
            {
                success: false,
                detail: "Not Authenticated",
            },
            { status: 401 }
        );
    }

    const parsedURL = new URL(request.url);

    let id = parsedURL.searchParams.get("id");
    if (id && !z.string().uuid().safeParse(id).success) {
        return NextResponse.json(
            {
                success: false,
                detail: "Invalid id provided. Must be a UUID",
            },
            { status: 400 }
        );
    }

    if (!id) {
        const problems = await prisma.problem.findMany();
        return NextResponse.json({
            success: true,
            problems: problems,
        });
    }

    if (id) {
        const problem = await prisma.problem.findUnique({ where: { id: id } });
        if (problem) {
            return NextResponse.json({
                success: true,
                problem: problem,
            });
        }
    }

    return NextResponse.json(
        {
            success: false,
            detail: "problem not found",
        },
        { status: 404 }
    );
}

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json(
            {
                success: false,
                detail: "Not Authenticated",
            },
            { status: 401 }
        );
    }

    const requestData = NewProblem.safeParse(await request.json());
    if (!requestData.success) {
        return NextResponse.json(
            {
                success: false,
                detail: "Invalid problem data",
            },
            { status: 400 }
        );
    }
    const { data } = requestData;
    let jsonData: [any[], any][];
    try {
        jsonData = JSON.parse(data.testsJsonFile);
        if (!Array.isArray(jsonData)) {
            throw Error("Not array");
        }
    } catch {
        return NextResponse.json(
            {
                success: false,
                detail: "Invalid problem data",
            },
            { status: 400 }
        );
    }
    try {
        const parameterCount = data.parameterNames.length;
        const validCases = jsonData.every((t) => t[0].length == parameterCount);
        if (!validCases) {
            throw Error("Not correct lengths");
        }
    } catch {
        return NextResponse.json(
            {
                success: false,
                detail: "Invalid problem data",
            },
            { status: 400 }
        );
    }

    const { testsJsonFile, ...problemData } = data;
    try {
        const problem = await prisma.problem.create({
            data: {
                ...problemData,
                tests: jsonData,
                userId: session.user.id,
            },
        });
        return NextResponse.json(
            {
                success: true,
                detail: "success creating problem",
                problemId: problem.id,
            },
            { status: 200 }
        );
    } catch {
        return NextResponse.json(
            {
                success: false,
                detail: "failed creating problem",
            },
            { status: 500 }
        );
    }
}

export async function PATCH(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json(
            {
                success: false,
                detail: "Not Authenticated",
            },
            { status: 401 }
        );
    }

    const requestData: RequestData = await request.json();
    const { state, problemId, userId } = requestData;

    if (!problemId || !userId) {
        return NextResponse.json(
            {
                success: false,
                detail: "Either didnt provide problem or user id",
            },
            { status: 400 }
        );
    }

    if (
        !z.string().uuid().safeParse(problemId).success ||
        !z.string().uuid().safeParse(userId).success
    ) {
        return NextResponse.json(
            {
                success: false,
                detail: "Invalid id provided. Must be a UUID",
            },
            { status: 400 }
        );
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
    });
    const problem = await prisma.problem.findUnique({
        where: { id: problemId },
    });
    if (!problem || !user) {
        return NextResponse.json(
            {
                success: false,
                detail: "Either problem or user Not Found",
            },
            { status: 400 }
        );
    }
    const alreadyLiked = user.likedProblems.includes(problem.id);
    const alreadyDisliked = user.dislikedProblems.includes(problem.id);

    if (state == -1 && !alreadyDisliked) {
        await prisma.user.update({
            where: { id: user.id },
            data: {
                likedProblems: {
                    set: user.likedProblems.filter((id) => id !== problem.id),
                },
                dislikedProblems: {
                    set: [...user.dislikedProblems, problem.id],
                },
            },
        });
    } else if (state == 1 && !alreadyLiked) {
        await prisma.user.update({
            where: { id: user.id },
            data: {
                dislikedProblems: {
                    set: user.dislikedProblems.filter(
                        (id) => id !== problem.id
                    ),
                },
                likedProblems: {
                    set: [...user.likedProblems, problem.id],
                },
            },
        });
    } else if (alreadyLiked || alreadyDisliked) {
        await prisma.user.update({
            where: { id: user.id },
            data: {
                dislikedProblems: {
                    set: user.dislikedProblems.filter(
                        (id) => id !== problem.id
                    ),
                },
                likedProblems: {
                    set: user.likedProblems.filter((id) => id !== problem.id),
                },
            },
        });
    }

    return NextResponse.json(
        {
            success: true,
            detail: "success updating vote",
        },
        { status: 200 }
    );
}
