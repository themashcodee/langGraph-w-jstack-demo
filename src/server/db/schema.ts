import {
	pgTable,
	serial,
	varchar,
	integer,
	timestamp,
	index,
	numeric,
} from "drizzle-orm/pg-core"

export const employees = pgTable(
	"employees",
	{
		id: serial("id").primaryKey(),
		employee_id: varchar("employee_id").notNull().unique(),
		full_name: varchar("full_name").notNull(),
		job_title: varchar("job_title").notNull(),
		department: varchar("department").notNull(),
		business_unit: varchar("business_unit").notNull(),
		gender: varchar("gender").notNull(),
		ethnicity: varchar("ethnicity").notNull(),
		age: integer("age").notNull(),
		hire_date: timestamp("hire_date").notNull(),
		annual_salary: numeric("annual_salary").notNull(),
		bonus_percentage: numeric("bonus_percentage").notNull(),
		country: varchar("country").notNull(),
		city: varchar("city").notNull(),
		exit_date: timestamp("exit_date"),
		created_at: timestamp("created_at").defaultNow().notNull(),
		updated_at: timestamp("updated_at").defaultNow().notNull(),
	},
	(table) => [
		index("employee_id_idx").on(table.employee_id),
		index("full_name_idx").on(table.full_name),
	]
)
