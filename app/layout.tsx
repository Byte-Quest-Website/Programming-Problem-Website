import "./globals.css";
import type { Metadata } from "next";

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
			<body>{children}</body>
		</html>
	);
}
