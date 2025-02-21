// agent.ts

import { ChatOpenAI } from "@langchain/openai"
import { MemorySaver } from "@langchain/langgraph"
import { HumanMessage } from "@langchain/core/messages"
import { createReactAgent } from "@langchain/langgraph/prebuilt"
import { DynamicStructuredTool } from "@langchain/core/tools"
import { z } from "zod"
import { employees } from "@/server/db/schema"
import { ilike, gt, lt, eq, desc, asc, sql, inArray } from "drizzle-orm"
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

const employee_query_tool = (db: DB) => {
	return new DynamicStructuredTool({
		name: "query_employees",
		description: "Query employees by various fields and conditions",
		schema: z.object({
			field: z.enum([
				"employee_id",
				"job_title",
				"department",
				"business_unit",
				"gender",
				"ethnicity",
				"age",
				"hire_date",
				"annual_salary",
				"bonus_percentage",
				"country",
				"city",
			]),
			value: z.string().describe("The value to search for"),
			operator: z
				.enum(["equals", "contains", "greater_than", "less_than"])
				.optional(),
			sort_by: z
				.enum(["annual_salary", "hire_date", "full_name", "age"])
				.optional(),
			sort_order: z.enum(["asc", "desc"]).optional(),
			limit: z.number().optional(),
		}),
		func: async ({
			field,
			value,
			operator = "equals",
			sort_by,
			sort_order,
			limit = 10,
		}) => {
			let baseQuery = db.select().from(employees)

			// Build where clause based on field type
			let whereClause
			switch (operator) {
				case "contains":
					if (typeof employees[field] === "string") {
						whereClause = ilike(employees[field], `%${value}%`)
					}
					break
				case "greater_than":
					whereClause = gt(employees[field], value)
					break
				case "less_than":
					whereClause = lt(employees[field], value)
					break
				default:
					whereClause = eq(employees[field], value)
			}

			let query: any = whereClause ? baseQuery.where(whereClause) : baseQuery

			// Add sorting if specified
			if (sort_by) {
				const sortField = employees[sort_by]
				const orderBy = sort_order === "desc" ? desc(sortField) : asc(sortField)
				query.orderBy(orderBy)
				query = query.$dynamic().orderBy(orderBy)
			}

			const results = await query.limit(limit)

			if (results.length === 0) {
				return `<strong>No employees found</strong> matching the criteria.`
			}

			return JSON.stringify(results, null, 2)
		},
	})
}

const employee_analytics_tool = (db: DB) => {
	return new DynamicStructuredTool({
		name: "analyze_employees",
		description: "Perform analytics on employee data",
		schema: z.object({
			analysis_type: z.enum([
				"salary_stats",
				"department_stats",
				"demographics",
				"tenure_analysis",
				"compensation_analysis",
			]),
			group_by: z
				.enum(["department", "business_unit", "job_title", "country", "city"])
				.optional(),
		}),
		func: async ({ analysis_type, group_by }) => {
			type AnalyticsResult = Record<string, unknown>[]
			let results: AnalyticsResult = []
			const groupByField = group_by ? employees[group_by] : undefined

			switch (analysis_type) {
				case "salary_stats":
					results = await db
						.select({
							group: groupByField || sql`'Overall'`,
							avg_salary: sql`avg(${employees.annual_salary})`,
							min_salary: sql`min(${employees.annual_salary})`,
							max_salary: sql`max(${employees.annual_salary})`,
							avg_bonus: sql`avg(${employees.bonus_percentage})`,
						})
						.from(employees)
						.groupBy(groupByField || sql`1`)
					break
				case "department_stats":
					results = await db
						.select({
							department: employees.department,
							employee_count: sql`count(*)`,
							avg_salary: sql`avg(${employees.annual_salary})`,
						})
						.from(employees)
						.groupBy(employees.department)
					break
				case "demographics":
					results = await db
						.select({
							group: groupByField || sql`'Overall'`,
							avg_age: sql`avg(${employees.age})`,
							gender_diversity: sql`count(distinct ${employees.gender})`,
							ethnic_diversity: sql`count(distinct ${employees.ethnicity})`,
						})
						.from(employees)
						.groupBy(groupByField || sql`1`)
					break
			}

			return JSON.stringify(results, null, 2)
		},
	})
}

const employee_compare_tool = (db: DB) => {
	return new DynamicStructuredTool({
		name: "compare_employees",
		description: "Compare multiple employees or groups of employees",
		schema: z.object({
			employee_ids: z
				.array(z.string())
				.describe("Array of employee IDs to compare"),
			comparison_aspects: z.array(
				z.enum([
					"annual_salary",
					"bonus_percentage",
					"tenure",
					"age",
					"department",
					"job_title",
				])
			),
		}),
		func: async ({ employee_ids, comparison_aspects }) => {
			const results = await db
				.select()
				.from(employees)
				.where(inArray(employees.employee_id, employee_ids))

			if (results.length === 0) {
				return "<strong>No employees found</strong> for comparison."
			}

			return JSON.stringify(results, null, 2)
		},
	})
}

const memorySaver = new MemorySaver()

export const process_message = async (
	message: string,
	threadId: string,
	db: DB
) => {
	const agent = createReactAgent({
		llm: new ChatOpenAI({ temperature: 0, modelName: "gpt-4o-mini" }),
		tools: [
			employee_search_tool(db),
			employee_query_tool(db),
			employee_analytics_tool(db),
			employee_compare_tool(db),
		],
		checkpointSaver: memorySaver,
		prompt: `You are an AI assistant specialized in helping with employee management.
Your task is to help manage and provide information about employees.

You have access to several tools:
1. search_employee: Search employees by name
2. query_employees: Advanced querying by any field with sorting and filtering
3. analyze_employees: Perform analytical operations on employee data
4. compare_employees: Compare multiple employees or groups

When handling requests:
1. Choose the most appropriate tool for the query
2. Present the data directly in HTML format without any code block markers
3. Add relevant context and insights when appropriate

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
		return "<p>Sorry, I encountered an error processing your request. Please try again.</p>"
	}
}
