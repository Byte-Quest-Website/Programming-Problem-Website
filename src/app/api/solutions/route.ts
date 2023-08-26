import { z } from "zod";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";

import prisma from "@/core/db/orm";
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
        return NextResponse.json(
            {
                success: false,
                detail: "Invalid id provided. Must be a UUID",
            },
            { status: 400 }
        );
    }

    if (!id) {
        const solutions = await prisma.solution.findMany();
        return NextResponse.json({
            success: true,
            solutions: solutions,
        });
    }

    if (id) {
        const solution = await prisma.solution.findUnique({
            where: { id: id },
        });
        if (solution) {
            return NextResponse.json({
                success: true,
                solution: solution,
            });
        }
    }

    return NextResponse.json(
        {
            success: false,
            detail: "solution not found",
        },
        { status: 404 }
    );
}
