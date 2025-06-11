// Supabase is used for postgres DB
import postgres from "postgres";
import { configDotenv } from "dotenv";

configDotenv();

const connectionString = process.env.DATABASE_URL;
const db = postgres(connectionString, {
    ssl: "require"
});
// In not in production, set schema to test so we don't mess up the actual database
export const SCHEMA = db.unsafe(`${process.env.env === "prod" ? "public" : "test"}`);

(async () => {
    try {
        console.log("Testing connection to postgres...");
        await db`SELECT 1`;
        console.log("Connected to postgres!");
    } catch (error) {
        console.log("Connection to postres failed: " + error);
        process.exit(1);
    }
})();

export default db;