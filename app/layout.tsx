import "./globals.css";
import type { Metadata } from "next";
import { TrpcProvider } from "@/core/utils/trpc-provider";

export const metadata: Metadata = {
	title: "FusionSid",
	description: "A Programming Problem Website",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>
				<TrpcProvider>{children}</TrpcProvider>
			</body>
		</html>
	);
}
