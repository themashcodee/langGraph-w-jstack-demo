// agent.ts

import { ChatOpenAI } from "@langchain/openai"
import { MemorySaver } from "@langchain/langgraph"
import { HumanMessage } from "@langchain/core/messages"
import { createReactAgent } from "@langchain/langgraph/prebuilt"
import { DynamicStructuredTool } from "@langchain/core/tools"
import { z } from "zod"
import { employees } from "@/server/db/schema"
import { ilike } from "drizzle-orm"
import { DB } from "./jstack"

const employee_search_tool = (db: DB) => {
	return new DynamicStructuredTool({
		name: "search_employee",
		description: "Search for an employee by their name",
		schema: z.object({
			name: z.string().describe("The name of the employee to search for"),
		}),
		func: async ({ name }) => {
			const results = await db
				.select()
				.from(employees)
				.where(ilike(employees.full_name, `%${name}%`))
				.limit(5)

			if (results.length === 0) {
				return "<strong>No employee found</strong> with that name."
			}

			return JSON.stringify(results, null, 2)
		},
	})
}

const memorySaver = new MemorySaver()

export const processMessage = async (
	message: string,
	threadId: string,
	db: DB
) => {
	const agent = createReactAgent({
		llm: new ChatOpenAI({ temperature: 0, modelName: "gpt-4o-mini" }),
		tools: [employee_search_tool(db)],
		checkpointSaver: memorySaver,
		prompt: `You are an AI assistant specialized in helping with employee management.
Your task is to help manage and provide information about employees.

When asked about an employee:
1. Use the search_employee tool to find their information
2. Present the data directly in HTML format without any code block markers
3. Add relevant context when appropriate

Current request: ${message}

Guidelines for responses:
- Format content directly with HTML tags (<h1>, <h2>, <p>, <ul>, <li>, etc)
- Structure content with appropriate headings and lists
- Maintain a professional and helpful tone
- Provide clear explanations when needed
- Do NOT include any markdown code block markers (like \`\`\`html or \`\`\`)

Please provide a comprehensive and well-structured response using direct HTML formatting.`,
	})

	try {
		const result = await agent.invoke(
			{ messages: [new HumanMessage(message)] },
			{ configurable: { thread_id: threadId } }
		)

		const lastMessage = result.messages[result.messages.length - 1]
		return (
			lastMessage?.content ||
			"<h3>Error</h3><p>I apologize, but I couldn't process that request.</p>"
		)
	} catch (error) {
		console.error("Error processing message:", error)
		return `<h3>Error</h3>
<p>I encountered an error while processing your request.
Please try again or contact support if the issue persists.</p>
<hr/>
<p><em>Error details have been logged for investigation.</em></p>`
	}
}
