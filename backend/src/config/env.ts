import "dotenv/config";
import { z } from "zod";

// This file is responsible for loading and validating environment variables using the `dotenv` package and the `zod` library. It defines a schema for the expected environment variables, checks if they are valid, and exports the validated environment variables for use in the application.
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(8080),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
