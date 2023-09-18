import React from "react";
import "@radix-ui/themes/styles.css";
import { Card, Box, Text } from "@radix-ui/themes";

const page = async ({ searchParams }: { searchParams: { data: string } }) => {
    const parsedData = JSON.parse(searchParams.data);

    let response;
    try {
        response = await fetch("https://rce.fusionsid.com/runcode", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: searchParams.data,
            cache: parsedData["use_cache"] ? undefined : "no-store",
        });
    } catch {
        return <h1 className="text-white">FAILED TO GET RESPONSE FROM API</h1>;
    }

    let jsonData: { [key: string]: any };
    try {
        jsonData = await response.json();
    } catch {
        return <h1 className="text-white">FAILED TO GET RESPONSE FROM API</h1>;
    }
    if (jsonData["success"] === false) {
        return <pre className="text-white">{jsonData["detail"]}</pre>;
    }

    return (
        <main className="w-full">
            <header className="flex items-center justify-center m-4">
                <h1 className="font-poppinsbold text-[2.5rem]">Output: </h1>
            </header>
            <div className="flex flex-col gap-3 p-5 w-full">
                <div className="flex gap-4">
                    <div className="w-full">
                        <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2">
                            STDOUT (Standard Output):
                        </label>
                        <textarea
                            readOnly
                            className="max-h-fit font-jetbrains appearance-none block w-full border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none bg-[#232530] text-white"
                        >
                            {jsonData["data"]["stdout"]}
                        </textarea>
                    </div>
                    <div className="w-full">
                        <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2">
                            STDERR (Standard Error):
                        </label>
                        <textarea
                            readOnly
                            className="max-h-fit font-jetbrains appearance-none block w-full border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none bg-[#232530] text-white"
                        >
                            {jsonData["data"]["stderr"]}
                        </textarea>
                    </div>
                </div>
                <Card className="m-5">
                    <div className="flex items-center justify-between px-3">
                        <Box>
                            <Text as="div" size="2" weight="bold">
                                Execution Time
                            </Text>
                            <Text as="div" size="2" color="gray">
                                {jsonData["data"]["executionTime"]}ms
                            </Text>
                        </Box>
                        <Box>
                            <Text as="div" size="2" weight="bold">
                                Exit Code
                            </Text>
                            <Text as="div" size="2" color="gray">
                                {jsonData["data"]["exitCode"]}
                            </Text>
                        </Box>
                        <Box>
                            <Text as="div" size="2" weight="bold">
                                Timed Out
                            </Text>
                            <Text as="div" size="2" color="gray">
                                {String(jsonData["data"]["timedOut"])}
                            </Text>
                        </Box>
                        <Box>
                            <Text as="div" size="2" weight="bold">
                                Killed Due To Memory
                            </Text>
                            <Text as="div" size="2" color="gray">
                                {String(jsonData["data"]["memoryKilled"])}
                            </Text>
                        </Box>
                    </div>
                </Card>
            </div>
        </main>
    );
};

export default page;
