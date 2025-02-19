import { employees } from "@/server/db/schema"
import { desc } from "drizzle-orm"
import { z } from "zod"
import { j, publicProcedure } from "../jstack"

export const chat_router = j.router({
	recent: publicProcedure.query(async ({ c, ctx }) => {
		const { db } = ctx

		const [recentEmployee] = await db
			.select()
			.from(employees)
			.orderBy(desc(employees.created_at))
			.limit(1)

		return c.superjson(recentEmployee ?? null)
	}),

	create: publicProcedure
		.input(z.object({ name: z.string().min(1) }))
		.mutation(async ({ ctx, c, input }) => {
			const { name } = input
			const { db } = ctx

			const employee = await db.insert(employees).values({
				employee_id: "E02253",
				full_name: "Leilani Ng",
				job_title: "Systems Analyst",
				department: "IT",
				business_unit: "Corporate",
				gender: "Female",
				ethnicity: "Asian",
				age: 48,
				hire_date: new Date("9/19/2011"),
				annual_salary: "50513",
				bonus_percentage: "1",
				country: "United States",
				city: "Seattle",
				exit_date: new Date("10/30/2019"),
			})

			return c.superjson(employee)
		}),
})
