"use client";

import React from "react";
import "@radix-ui/themes/styles.css";
import { Solution, User } from "@prisma/client";
import humanFileSize from "../utils/formatMemory";
import { CopyBlock, atomOneDark } from "react-code-blocks";
import { Card, Flex, Avatar, Box, Text } from "@radix-ui/themes";

const SolutionData = ({
    solution,
    author,
}: {
    solution: Solution;
    author: User;
}) => {
    return (
        <div className="flex items-center justify-center w-full">
            <div className="flex flex-col items-center justify-center p-10 gap-3">
                <h1 className="font-poppinsbold text-[2.5rem] mb-4">
                    Solution
                </h1>
                <div className="w-[50rem] shadow-2xl">
                    <CopyBlock
                        // @ts-ignore
                        text={solution.code}
                        language="python"
                        theme={atomOneDark}
                        showLineNumbers
                    />
                </div>
                <Card className="w-[50rem]">
                    <Flex gap="9" align="center">
                        <Flex gap="3" align="center">
                            <Avatar
                                size="3"
                                alt={`${author.name}'s avatar`}
                                src={author.image ?? undefined}
                                radius="full"
                                fallback={author.name.charAt(0)}
                            />
                            <Box>
                                <Text as="div" size="2" weight="bold">
                                    {author.name}
                                </Text>
                                <Text as="div" size="2" color="gray">
                                    Submitted Solution:{" "}
                                    {solution.createdAt.toDateString()}
                                </Text>
                            </Box>
                        </Flex>
                    </Flex>
                </Card>
                <div className="w-full flex items-center justify-between">
                    <h3>
                        <span className="font-bold">Time Took:</span>{" "}
                        {(solution.timeTook * 1000).toPrecision(4)}ms
                    </h3>
                    <h3>
                        <span className="font-bold">Memory Used:</span>{" "}
                        {humanFileSize(solution.memoryUsed)}
                    </h3>
                </div>
            </div>
        </div>
    );
};

export default SolutionData;
