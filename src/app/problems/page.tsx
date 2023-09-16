import React from "react";
import { getServerSession } from "next-auth";

import prisma from "@/core/db/orm";
import ProblemItem from "@/core/components/problemItem";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { Table } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";

const Problems = async () => {
    const session = await getServerSession(authOptions);
    if (!session) {
        return <div className="text-white">Please Log In</div>;
    }

    const problems = await prisma.problem.findMany();

    return (
        <div>
            <Table.Root variant="surface">
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeaderCell>
                            Full name
                        </Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Group</Table.ColumnHeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    <Table.Row>
                        <Table.RowHeaderCell>Danilo Sousa</Table.RowHeaderCell>
                        <Table.Cell>danilo@example.com</Table.Cell>
                        <Table.Cell>Developer</Table.Cell>
                    </Table.Row>

                    <Table.Row>
                        <Table.RowHeaderCell>Zahra Ambessa</Table.RowHeaderCell>
                        <Table.Cell>zahra@example.com</Table.Cell>
                        <Table.Cell>Admin</Table.Cell>
                    </Table.Row>

                    <Table.Row>
                        <Table.RowHeaderCell>
                            Jasper Eriksson
                        </Table.RowHeaderCell>
                        <Table.Cell>jasper@example.com</Table.Cell>
                        <Table.Cell>Developer</Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table.Root>
            {problems.map((problem) => {
                return <ProblemItem key={problem.id} problem={problem} />;
            })}
        </div>
    );
};

export default Problems;
