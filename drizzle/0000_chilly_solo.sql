CREATE TABLE "employees" (
	"id" serial PRIMARY KEY NOT NULL,
	"employee_id" varchar NOT NULL,
	"full_name" varchar NOT NULL,
	"job_title" varchar NOT NULL,
	"department" varchar NOT NULL,
	"business_unit" varchar NOT NULL,
	"gender" varchar NOT NULL,
	"ethnicity" varchar NOT NULL,
	"age" integer NOT NULL,
	"hire_date" timestamp NOT NULL,
	"annual_salary" numeric NOT NULL,
	"bonus_percentage" numeric NOT NULL,
	"country" varchar NOT NULL,
	"city" varchar NOT NULL,
	"exit_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "employees_employee_id_unique" UNIQUE("employee_id")
);
--> statement-breakpoint
CREATE INDEX "employee_id_idx" ON "employees" USING btree ("employee_id");--> statement-breakpoint
CREATE INDEX "full_name_idx" ON "employees" USING btree ("full_name");