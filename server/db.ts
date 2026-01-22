import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

// Log to verify the module is loading and env var is present (masked)
console.log("Initializing DB connection...");
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is missing!");
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
} else {
  console.log("DATABASE_URL is set (starts with " + process.env.DATABASE_URL.substring(0, 10) + "...)");
}

export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
  max: 1, // Limit connections in serverless to prevent exhaustion
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000, // Fail fast if can't connect
});

// Add an error handler to the pool to prevent uncaught exceptions crashing the process
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  // Don't exit the process, just log it. Serverless functions are ephemeral anyway.
});

export const db = drizzle(pool, { schema });
