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
        return NextResponse.json(
            {
                success: false,
                detail: "No Job ID Provided",
            },
            { status: 400 }
        );
    }

    const job = await prisma.job.findUnique({
        where: { id: id },
    });
    if (!job) {
        return NextResponse.json(
            {
                success: false,
                detail: "Job Not Found",
            },
            { status: 400 }
        );
    }

    return NextResponse.json(
        {
            success: true,
            job: job,
        },
        { status: 200 }
    );
}
