import type { Metadata } from "next";
import { getServerSession } from "next-auth";

import "./globals.css";
import Provider from "@/core/helpers/provider";
import { TrpcProvider } from "@/core/utils/trpc-provider";
import { authOptions } from "./api/auth/[...nextauth]/route";

export const metadata: Metadata = {
    title: "FusionSid",
    description: "A Programming Problem Website",
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    return (
        <html lang="en">
            <body>
                <Provider session={session}>
                    <TrpcProvider>{children}</TrpcProvider>
                </Provider>
            </body>
        </html>
    );
}
