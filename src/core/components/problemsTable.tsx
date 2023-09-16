"use client";

import Fuse from "fuse.js";
import "@radix-ui/themes/styles.css";
import React, { useState } from "react";
import { Problem } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Table, Badge, TextField, Button } from "@radix-ui/themes";
import { Theme } from "@radix-ui/themes";

const ProblemItem = ({
    problem,
    author,
    solved,
}: {
    problem: Problem;
    author: string;
    solved: boolean;
}) => {
    const router = useRouter();
    const difficultyColors: {
        [key: string]: "green" | "orange" | "red";
    } = {
        EASY: "green",
        MEDIUM: "orange",
        HARD: "red",
    };

    return (
        <Table.Row
            key={problem.id}
            className="hover:bg-one transition-all duration-100 hover:cursor-pointer"
            onClick={() => router.push(`/problems/${problem.id}`)}
        >
            <Table.RowHeaderCell>{problem.title}</Table.RowHeaderCell>
            <Table.Cell>
                {" "}
                <Badge color={difficultyColors[problem.difficulty]}>
                    {problem.difficulty}
                </Badge>
            </Table.Cell>
            <Table.Cell>{problem.likes}</Table.Cell>
            <Table.Cell>{problem.dislikes}</Table.Cell>
            <Table.Cell>{author}</Table.Cell>
            <Table.Cell>{String(solved)}</Table.Cell>
            <Table.Cell>{problem.createdAt.toDateString()}</Table.Cell>
            <Table.Cell>
                {solved ? (
                    problem.solutionLink ? (
                        <a
                            className="hover:underline"
                            href={problem.solutionLink}
                        >
                            Link
                        </a>
                    ) : (
                        "None Provided"
                    )
                ) : (
                    <a href={"https://youtube.com/watch?v=dQw4w9WgXcQ"}>
                        Solve First
                    </a>
                )}
            </Table.Cell>
        </Table.Row>
    );
};

function ProblemsTable({
    problems,
    problemAuthors,
    solvedByUser,
}: {
    problems: Problem[];
    problemAuthors: Map<string, string>;
    solvedByUser: Map<string, boolean>;
}) {
    const [searchResults, setSearchResults] = useState(problems);

    const options = {
        includeScore: true,
        includeMatches: true,
        threshold: 0.2,
        keys: ["title", "difficulty"],
    };
    const fuse = new Fuse(problems, options);

    const handleSearch = (event) => {
        const { value } = event.target;

        if (value.length === 0) {
            setSearchResults(problems);
            return;
        }

        const results = fuse.search(value);
        const items = results.map((result) => result.item);
        setSearchResults(items);
    };

    return (
        <Theme appearance="dark">
            <div>
                <div className="flex items-center gap-2">
                    <TextField.Root className="w-full my-2">
                        <TextField.Slot>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                className="fill-gray-300 w-[0.9rem]"
                                viewBox="0 0 490.4 490.4"
                                xmlSpace="preserve"
                            >
                                <g>
                                    <path d="M484.1,454.796l-110.5-110.6c29.8-36.3,47.6-82.8,47.6-133.4c0-116.3-94.3-210.6-210.6-210.6S0,94.496,0,210.796   s94.3,210.6,210.6,210.6c50.8,0,97.4-18,133.8-48l110.5,110.5c12.9,11.8,25,4.2,29.2,0C492.5,475.596,492.5,463.096,484.1,454.796z    M41.1,210.796c0-93.6,75.9-169.5,169.5-169.5s169.6,75.9,169.6,169.5s-75.9,169.5-169.5,169.5S41.1,304.396,41.1,210.796z" />
                                </g>
                            </svg>
                        </TextField.Slot>
                        <TextField.Input
                            onChange={handleSearch}
                            placeholder="Search/Filter Problems..."
                        />
                    </TextField.Root>
                    <div>
                        <Button>Create</Button>
                    </div>
                </div>
                <Table.Root variant="surface">
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeaderCell>
                                Problem Name
                            </Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>
                                Difficulty
                            </Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>
                                Likes
                            </Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>
                                Dislikes
                            </Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>
                                Author
                            </Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>
                                Solved
                            </Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>
                                Created
                            </Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>
                                Solution Link
                            </Table.ColumnHeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {searchResults.map((problem) => {
                            return (
                                <ProblemItem
                                    key={problem.id}
                                    problem={problem}
                                    author={
                                        problemAuthors.get(problem.id) ?? "idk"
                                    }
                                    solved={
                                        solvedByUser.get(problem.id) ?? false
                                    }
                                />
                            );
                        })}
                    </Table.Body>
                </Table.Root>
            </div>
        </Theme>
    );
}

export default ProblemsTable;
