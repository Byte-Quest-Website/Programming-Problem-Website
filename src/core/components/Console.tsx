"use client";

import { Problem } from "@prisma/client";
import SyncLoader from "react-spinners/SyncLoader";
import React, { useCallback, useState } from "react";
import { testCode, getJob, getJobStatus } from "../helpers/requests";

const Console = (props: { problem: Problem; code: string }) => {
    const [currentOutput, setCurrentOutput] = useState("");
    const [showLoader, setShowLoader] = useState(false);

    const makeRequest = useCallback(
        async (code: string, id: string, mode: "run" | "submit") => {
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
                }
                setShowLoader(false);
                clearInterval(checkJobStatusLoop);
            }, 1000);
        },
        []
    );

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
                    <pre className="text-white">{currentOutput}</pre>
                )}
            </div>
        </div>
    );
};

export default Console;
