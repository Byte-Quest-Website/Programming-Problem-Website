import prisma from "./orm";
import { Problem } from "@prisma/client";
import * as jsonData from "./testProblems.json";

async function main() {
    await Promise.all(
        jsonData.map(async (problem) => {
            console.log(problem);
            const p = await prisma.problem.create({
                // @ts-ignore
                data: {
                    ...problem,
                    userId: "d808df87-883b-4df2-aca3-a41e412fe723",
                },
            });
            console.log(p.id);
        })
    );
}
main();
