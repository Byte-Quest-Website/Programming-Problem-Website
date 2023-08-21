import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { prisma, redis } from "@/core/prisma/connections";

const t = initTRPC.create({
    transformer: superjson,
});

export const appRouter = t.router({
    getAllSolutions: t.procedure.query(async ({ ctx }) => {
        return prisma.solution.findMany();
    }),
    getAllProblems: t.procedure.query(async ({ ctx }) => {
        return prisma.solution.findMany();
    }),
});

export type AppRouter = typeof appRouter;
