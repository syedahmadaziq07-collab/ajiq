import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
const { Pool } = pkg;
import { sql } from "drizzle-orm";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

async function main() {
  console.log("Adding description and content columns...");

  await db.execute(sql`ALTER TABLE wallpapers ADD COLUMN IF NOT EXISTS description TEXT;`);
  await db.execute(sql`ALTER TABLE wallpapers ADD COLUMN IF NOT EXISTS content TEXT;`);
  console.log("  wallpapers: OK");

  await db.execute(sql`ALTER TABLE templates ADD COLUMN IF NOT EXISTS description TEXT;`);
  await db.execute(sql`ALTER TABLE templates ADD COLUMN IF NOT EXISTS content TEXT;`);
  console.log("  templates: OK");

  console.log("Migration complete!");
  await pool.end();
}

main().catch((e) => { console.error(e); process.exit(1); });
