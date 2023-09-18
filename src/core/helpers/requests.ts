import { z } from "zod";
import { Job } from "@prisma/client";

const testCodeResponseObject = z.object({
    success: z.literal(true),
    detail: z.string(),
    jobID: z.string().uuid(),
});

const getJobStatusResponseObject = z.object({
    success: z.literal(true),
    completed: z.boolean(),
});

export async function testCode(
    code: string,
    id: string,
    mode: "run" | "submit"
) {
    let response;
    try {
        response = await new Promise((resolve, reject) => {
            fetch("https://rce.fusionsid.com/testcode", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    code: code,
                    problem_id: id,
                    mode: mode,
                }),
                cache: "no-store",
            })
                .then((response) => response.json())
                .then((json) => resolve(json))
                .catch((err) => {
                    reject(err);
                });
        });
    } catch (err) {
        return console.log("FAILED TO QUEUE JOB", err);
    }
    const parsedResponse = testCodeResponseObject.safeParse(response);
    if (!parsedResponse.success) {
        return console.log("FAILED TO FIND PROBLEM", response);
    }
    return parsedResponse.data.jobID;
}

export async function getJob(id: string) {
    let response;
    try {
        response = await new Promise((resolve, reject) => {
            fetch(`/api/jobs?id=${id}`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                cache: "no-store",
            })
                .then((response) => response.json())
                .then((json) => resolve(json))
                .catch((err) => {
                    reject(err);
                });
        });
    } catch (err) {
        return console.log("FAILED TO MAKE GET JOB REQUEST", err);
    }

    return response;
}

export async function getJobStatus(id: string): Promise<boolean | void> {
    let response;
    try {
        response = await new Promise((resolve, reject) => {
            fetch(`/api/jobs/status?id=${id}`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                cache: "no-store",
            })
                .then((response) => response.json())
                .then((json) => resolve(json))
                .catch((err) => {
                    reject(err);
                });
        });
    } catch (err) {
        return console.log("FAILED TO MAKE FETCH JOB STATUS REQUEST", err);
    }

    const parsedResponse = getJobStatusResponseObject.safeParse(response);
    if (!parsedResponse.success) {
        return console.log("FAILED TO FETCH JOB STATUS", response);
    }
    return parsedResponse.data.completed;
}

export async function createNewSolution(
    userId: string,
    problemId: string,
    jobId: string,
    code: string
): Promise<string | void> {
    let response;
    try {
        response = await new Promise((resolve, reject) => {
            fetch("/api/solutions", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                cache: "no-store",
                body: JSON.stringify({
                    userId,
                    problemId,
                    jobId,
                    code,
                }),
            })
                .then((response) => response.json())
                .then((json) => resolve(json))
                .catch((err) => {
                    reject(err);
                });
        });
    } catch (err) {
        return console.log("FAILED TO MAKE REQUEST POST SOLUTION REQUEST", err);
    }
    if (!response.success || response.solutionId === undefined) {
        return;
    }
    return response.solutionId as string;
}

export async function updateProblemVote(
    state: 0 | 1 | -1,
    userId: string,
    problemId: string
) {
    let response;
    try {
        response = await new Promise((resolve, reject) => {
            fetch("/api/problems", {
                method: "PATCH",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                cache: "no-store",
                body: JSON.stringify({
                    state: state,
                    userId,
                    problemId,
                }),
            })
                .then((response) => response.json())
                .then((json) => resolve(json))
                .catch((err) => {
                    reject(err);
                });
        });
    } catch (err) {
        return console.log("FAILED TO MAKE UPDATE VOTE REQUEST", err);
    }
}
