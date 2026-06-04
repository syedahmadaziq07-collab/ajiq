import { Pool } from "pg";
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 1,
  idleTimeoutMillis: 0
});
const { rows } = await pool.query("SELECT id, image_url, download_url FROM wallpapers WHERE id IN (4,5)");
for (const row of rows) {
  console.log("Before:", row.id, row.download_url);
  await pool.query("UPDATE wallpapers SET download_url = $1 WHERE id = $2", [row.image_url, row.id]);
  console.log("Updated:", row.id, "->", row.image_url);
}
await pool.end();
