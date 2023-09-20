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

    const limit = await redis.get(`${userId}-like-limit`);
    if (limit !== null) {
        return NextResponse.json(
            {
                success: false,
                detail: "chill down my guy, its really not that deep",
            },
            { status: 429 }
        );
    }
    await redis.set(`${userId}-like-limit`, "iloverickastley");
    await redis.expire(`${userId}-like-limit`, 3);

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
        await prisma.problem.update({
            where: { id: problem.id },
            data: {
                likes: { decrement: alreadyLiked ? 1 : 0 },
                dislikes: { increment: 1 },
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
        await prisma.problem.update({
            where: { id: problem.id },
            data: {
                dislikes: { decrement: alreadyDisliked ? 1 : 0 },
                likes: { increment: 1 },
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
        if (alreadyLiked) {
            await prisma.problem.update({
                where: { id: problem.id },
                data: { likes: { decrement: 1 } },
            });
        }
        if (alreadyDisliked) {
            await prisma.problem.update({
                where: { id: problem.id },
                data: { dislikes: { decrement: 1 } },
            });
        }
    }

    return NextResponse.json(
        {
            success: true,
            detail: "success updating vote",
        },
        { status: 200 }
    );
}
