import type { Metadata } from "next"
import { Providers } from "./components/providers"

import "./globals.css"

export const metadata: Metadata = {
	title: "Employee Management AI Agent",
	description:
		"A learning project to explore building AI agents with LangGraph, LangChain, and LangSmith. Built as an HR assistant that can manage employee data using natural language.",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body className="antialiased">
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}
