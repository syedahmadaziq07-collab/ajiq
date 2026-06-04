const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 1,
  idleTimeoutMillis: 0
});
(async () => {
  const { rows } = await pool.query("SELECT id, image_url, download_url FROM wallpapers WHERE id IN (4,5)");
  for (const r of rows) {
    console.log("Before:", r.id, r.download_url);
    await pool.query("UPDATE wallpapers SET download_url = $1 WHERE id = $2", [r.image_url, r.id]);
    console.log("Updated:", r.id, "->", r.image_url);
  }
  await pool.end();
})().catch(e => { console.error(e); process.exit(1); });
