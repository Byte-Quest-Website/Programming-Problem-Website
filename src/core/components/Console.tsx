"use client";

import { Job } from "@prisma/client";
import { useSession } from "next-auth/react";
import { Problem } from "@prisma/client";
import SyncLoader from "react-spinners/SyncLoader";
import React, { useCallback, useState } from "react";
import {
    testCode,
    getJob,
    getJobStatus,
    createNewSolution,
} from "../helpers/requests";

interface JobResponse {
    success: true;
    job: Job & {
        report: JobReport;
    };
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

const Console = (props: { problem: Problem; code: string }) => {
    const { data: session } = useSession();

    const [currentOutput, setCurrentOutput] = useState("");
    const [apiResponse, setApiResponse] = useState<JobResponse | null>(null);
    const [showLoader, setShowLoader] = useState(false);

    const makeRequest = useCallback(
        async (code: string, id: string, mode: "run" | "submit") => {
            setApiResponse(null);

            const jobID = await testCode(code, id, mode);
            if (jobID === undefined) {
                return setCurrentOutput("failed to queue job");
            }

            setCurrentOutput("job has been added to queue");

            const checkJobStatusLoop = setInterval(async () => {
                setShowLoader(true);

                const jobStatus = await getJobStatus(jobID);
                if (jobStatus === undefined) {
                    setShowLoader(false);
                    setCurrentOutput("failed to get job status");
                    return clearTimeout(checkJobStatusLoop);
                } else if (!jobStatus) {
                    return setCurrentOutput("job is processing");
                }

                const jobResult = await getJob(jobID);
                if (jobResult !== undefined) {
                    setCurrentOutput(JSON.stringify(jobResult, null, 4));
                    setApiResponse(jobResult);
                    if (jobResult.job.report.outcome == "pass" && session) {
                        await createNewSolution(
                            session.user.id,
                            props.problem.id,
                            jobID,
                            code
                        );
                    }
                } else {
                    setApiResponse(null);
                }
                setShowLoader(false);
                clearInterval(checkJobStatusLoop);
            }, 1000);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    if (!session || !session.user) {
        return <>Sign in</>;
    }

    return (
        <div>
            <div className="flex gap-3">
                <button
                    className="text-white"
                    onClick={async () => {
                        await makeRequest(props.code, props.problem.id, "run");
                    }}
                >
                    Run
                </button>
                <button
                    className="text-white"
                    onClick={async () => {
                        await makeRequest(
                            props.code,
                            props.problem.id,
                            "submit"
                        );
                    }}
                >
                    Submit
                </button>
            </div>
            <div>
                {showLoader ? (
                    <div className="flex">
                        <pre className="text-white">{currentOutput}</pre>
                        <SyncLoader
                            className="flex items-center justify-center w-full h-full"
                            color={"#ffffff"}
                            size={15}
                            loading={true}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                        />
                    </div>
                ) : (
                    <>
                        {apiResponse !== null ? (
                            <div>
                                <div className="text-white">
                                    Result:{" "}
                                    <span
                                        className={
                                            apiResponse.job.report.outcome ===
                                            "fail"
                                                ? "text-red-600"
                                                : "text-green-600"
                                        }
                                    >
                                        {apiResponse.job.report.outcome}
                                    </span>
                                </div>
                                {apiResponse.job.report.outcome === "fail" ? (
                                    <div className="text-white">
                                        <h1>
                                            Reason:{" "}
                                            {apiResponse.job.report.reason !==
                                            "idk"
                                                ? apiResponse.job.report.reason
                                                : apiResponse.job.report.stderr}
                                        </h1>
                                        <h1>
                                            Failed Test Case:{" "}
                                            {apiResponse.job.report.fail_number}
                                        </h1>
                                        <h1>
                                            Total Test Cases:{" "}
                                            {apiResponse.job.report.total_cases}
                                        </h1>
                                    </div>
                                ) : (
                                    <div className="text-white">
                                        <h1>
                                            Average Runtime:{" "}
                                            {(
                                                apiResponse.job.report
                                                    .average_time * 1000
                                            ).toPrecision(4)}
                                            ms
                                        </h1>
                                        <h1>
                                            Average Memory Used:{" "}
                                            {
                                                apiResponse.job.report
                                                    .memory_used_fmt
                                            }
                                        </h1>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div>Run or Submit code for output</div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Console;

// TODO:
// likes/dislikes
// submit button creates Solution
// update rank
// list of solutions page
// create problem page
