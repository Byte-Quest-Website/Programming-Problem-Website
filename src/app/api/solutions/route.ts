import { z } from "zod";
import { Prisma } from "@prisma/client";
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

interface JobReportPass {
    success: true;
    outcome: "pass";
    average_time: number;
    memory_used: number;
    memory_used_fmt: string;
}

interface JobReportFail {
    success: true;
    outcome: "fail";
    reason: string;
    fail_number: number;
    stderr: string;
    total_cases: number;
}

type JobReport = JobReportPass | JobReportFail;

type RequestData = {
    jobId: string;
    problemId: string;
    userId: string;
    code: string;
};

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !request.body) {
        return NextResponse.json(
            {
                success: false,
                detail: "Not Authenticated",
            },
            { status: 401 }
        );
    }

    const requestData: RequestData = await request.json();
    const { jobId, problemId, userId, code } = requestData;

    if (!jobId || !problemId || !userId) {
        return NextResponse.json(
            {
                success: false,
                detail: "Either didnt provide job, problem or user id",
            },
            { status: 400 }
        );
    }

    if (
        !z.string().uuid().safeParse(jobId).success ||
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

    const job = await prisma.job.findUnique({
        where: { id: jobId },
    });
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });
    const problem = await prisma.problem.findUnique({
        where: { id: problemId },
    });
    if (!job || !problem || !user) {
        return NextResponse.json(
            {
                success: false,
                detail: "Either job, problem or user Not Found",
            },
            { status: 400 }
        );
    }

    const report: JobReport = JSON.parse(
        JSON.stringify(job.report as Prisma.JsonObject)
    );
    if (report.outcome === "fail") {
        return NextResponse.json(
            {
                success: false,
                detail: "YOU LIED TO ME, THIS WAS NOT A REACT",
            },
            { status: 400 }
        );
    }

    const alreadySolved =
        (
            await prisma.solution.findMany({
                where: { userId: userId, problemId: problemId },
            })
        ).length !== 0;

    if (!alreadySolved) {
        const scoreIncrease =
            ["EASY", "MEDIUM", "HARD"].indexOf(problem.difficulty.toString()) +
            1;
        await prisma.user.update({
            where: { id: userId },
            data: { score: { increment: scoreIncrease } },
        });
    }

    const alreadyExistingSolution = await prisma.solution.findFirst({
        where: { jobId: jobId },
    });

    if (alreadyExistingSolution) {
        return NextResponse.json(
            {
                success: true,
                detail: "already created solution",
                solutionId: alreadyExistingSolution.id,
            },
            { status: 200 }
        );
    }

    if (!problem.verified) {
        if (userId !== problem.userId) {
            return NextResponse.json(
                {
                    success: true,
                    detail: "you canot solve an unverified problem",
                },
                { status: 403 }
            );
        }
        await prisma.problem.update({
            where: { id: problem.id },
            data: {
                verified: true,
            },
        });
    }

    const solution = await prisma.solution.create({
        data: {
            code: code,
            memoryUsed: report.memory_used,
            timeTook: report.average_time,
            jobId: jobId,
            problemId: problemId,
            userId: userId,
        },
    });

    return NextResponse.json(
        {
            success: true,
            detail: "success creating solution",
            solutionId: solution.id,
        },
        { status: 200 }
    );
}
