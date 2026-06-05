import pg from "pg";
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
try {
  const r = await pool.query("INSERT INTO storage.buckets (id, name, public) VALUES ('wallpapers', 'wallpapers', true) ON CONFLICT (id) DO NOTHING;");
  console.log("bucket ok", JSON.stringify(r));
} catch (e) { console.log("bucket error:", e.constructor.name, e.message, e.stack?.slice(0,200)); }
try {
  await pool.query(`DROP POLICY IF EXISTS "Public Upload" ON storage.objects`);
  await pool.query(`CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'wallpapers')`);
  console.log("upload policy ok");
} catch (e) { console.log("upload policy error:", e.constructor.name, e.message); }
try {
  await pool.query(`DROP POLICY IF EXISTS "Public Read" ON storage.objects`);
  await pool.query(`CREATE POLICY "Public Read" ON storage.objects FOR SELECT USING (bucket_id = 'wallpapers')`);
  console.log("read policy ok");
} catch (e) { console.log("read policy error:", e.constructor.name, e.message); }
await pool.end();
