import pg from "pg";
const p = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false }, max: 1 });
try {
  const r = await p.query("select * from pg_policy where polrelid = 'storage.objects'::regclass");
  console.log(JSON.stringify(r.rows, null, 2));
} catch(e) { console.log("error:", e.message); }
await p.end();
