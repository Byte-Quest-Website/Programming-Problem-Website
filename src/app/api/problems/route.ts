import { z } from "zod";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";

import { prisma } from "@/core/prisma/connections";
import { authOptions } from "../auth/[...nextauth]/route";

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
        return NextResponse.json({
            success: false,
            detail: "Invalid id provided. Must be a UUID",
        }, {status: 400});
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
