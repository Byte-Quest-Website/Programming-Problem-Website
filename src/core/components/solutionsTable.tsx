"use client";

import Fuse from "fuse.js";
import "@radix-ui/themes/styles.css";
import React, { useState } from "react";
import { Solution } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Theme } from "@radix-ui/themes";
import { Table, TextField, Button } from "@radix-ui/themes";

function humanFileSize(bytes, si = false, dp = 1) {
    const thresh = si ? 1000 : 1024;

    if (Math.abs(bytes) < thresh) {
        return bytes + " B";
    }

    const units = si
        ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
        : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
    let u = -1;
    const r = 10 ** dp;

    do {
        bytes /= thresh;
        ++u;
    } while (
        Math.round(Math.abs(bytes) * r) / r >= thresh &&
        u < units.length - 1
    );

    return bytes.toFixed(dp) + " " + units[u];
}

const SolutionItem = ({
    solution,
    author,
    problemId,
}: {
    solution;
    problemId: string;
    author: string;
}) => {
    const router = useRouter();

    return (
        <Table.Row
            key={solution.id}
            className="hover:bg-one transition-all duration-100 hover:cursor-pointer"
            onClick={() =>
                router.push(`/problems/${problemId}/solutions/${solution.id}`)
            }
        >
            <Table.RowHeaderCell>{author}</Table.RowHeaderCell>
            <Table.Cell>
                {(solution.timeTook * 1000).toPrecision(4)}ms
            </Table.Cell>
            <Table.Cell>{humanFileSize(solution.memoryUsed)}</Table.Cell>
            <Table.Cell>{solution.createdAt}</Table.Cell>
        </Table.Row>
    );
};

function SolutionsTable({
    problemId,
    solutions,
    solutionAuthors,
}: {
    problemId: string;
    solutionAuthors: Map<string, string>;
    solutions: Solution[];
}) {
    const solutionsData = solutions.map((s) => {
        return {
            ...s,
            author: solutionAuthors.get(s.id) ?? "idk",
            createdAt: s.createdAt.toDateString(),
        };
    });
    const [searchResults, setSearchResults] = useState(solutionsData);

    const options = {
        includeScore: true,
        includeMatches: true,
        threshold: 0.2,
        keys: ["author", "createdAt"],
    };
    const fuse = new Fuse(solutionsData, options);

    const handleSearch = (event) => {
        const { value } = event.target;

        if (value.length === 0) {
            setSearchResults(solutionsData);
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
                            placeholder="Search/Filter Solutions..."
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
                                Solution By
                            </Table.ColumnHeaderCell>
                            <Table.Cell>Time Took</Table.Cell>
                            <Table.ColumnHeaderCell>
                                Memory Used
                            </Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>
                                Solution Date
                            </Table.ColumnHeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {searchResults.map((solution) => {
                            return (
                                <SolutionItem
                                    key={solution.id}
                                    problemId={problemId}
                                    solution={solution}
                                    author={
                                        solutionAuthors.get(solution.id) ?? ""
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

export default SolutionsTable;
