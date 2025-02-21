import { employees } from "@/server/db/schema"
import { desc } from "drizzle-orm"
import { z } from "zod"
import { j, public_procedure } from "../jstack"
import { process_message } from "../agent"

export const chat_router = j.router({
	message: public_procedure
		.input(z.object({ message: z.string().min(1) }))
		.mutation(async ({ ctx, c, input }) => {
			const { message } = input
			const { db } = ctx

			// Generate a simple thread ID (you might want to store this in the database later)
			const threadId = Math.random().toString(36).substring(7)

			// Process the message using our agent, passing the db instance
			const response = await process_message(message, threadId, db)

			return c.superjson({ response })
		}),
})
