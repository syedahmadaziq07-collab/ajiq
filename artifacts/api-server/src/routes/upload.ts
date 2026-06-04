import { Router, type IRouter, type Request, type Response } from "express";
import pg from "pg";

const router: IRouter = Router();

const SUPABASE_URL = "https://dwovtevztmolttpohvym.supabase.co";
const ANON_KEY = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3b3Z0ZXZ6dG1vbHR0cG9odnltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0MTg1NzgsImV4cCI6MjA5NTk5NDU3OH0.NCQBn9eMEP37tX8jSLObchJ85HT28tZaZ8HvRPI9ZKk";
const BUCKET = "wallpapers";

let pool: pg.Pool | null = null;
function getPool() {
  if (!pool) {
    pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 1,
      idleTimeoutMillis: 0,
    });
  }
  return pool;
}

let bucketReady = false;
let bucketPromise: Promise<void> | null = null;
async function ensureBucket() {
  if (bucketReady) return;
  if (bucketPromise) return bucketPromise;
  bucketPromise = (async () => {
    try {
      const p = getPool();
      await p.query("INSERT INTO storage.buckets (id, name, public) VALUES ($1, $2, true) ON CONFLICT (id) DO NOTHING", [BUCKET, BUCKET]);
      await p.query(`DROP POLICY IF EXISTS "Public Upload" ON storage.objects`);
      await p.query(`CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = $1)`, [BUCKET]);
      await p.query(`DROP POLICY IF EXISTS "Public Read" ON storage.objects`);
      await p.query(`CREATE POLICY "Public Read" ON storage.objects FOR SELECT USING (bucket_id = $1)`, [BUCKET]);
      bucketReady = true;
    } catch (e: unknown) {
      console.error("bucket setup failed:", e instanceof Error ? e.message : e);
    }
  })();
  return bucketPromise;
}

router.post("/admin/upload", async (req: Request, res: Response) => {
  const auth = req.headers.authorization;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword || !auth || auth !== `Bearer ${adminPassword}`) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  await ensureBucket();

  const { filename, contentType, base64 } = req.body;
  if (!filename || !contentType || !base64) {
    res.status(400).json({ error: "Missing filename, contentType, or base64" });
    return;
  }

  const buffer = Buffer.from(base64, "base64");
  const ext = filename.split(".").pop() || "png";
  const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  try {
    const uploadRes = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${uniqueName}`, {
      method: "POST",
      headers: {
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
        "Content-Type": contentType,
      },
      body: buffer,
    });
    if (!uploadRes.ok) {
      const err = await uploadRes.text();
      res.status(500).json({ error: `Upload failed: ${uploadRes.status} ${err}` });
      return;
    }
    const url = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${uniqueName}`;
    res.json({ url });
  } catch (e: unknown) {
    res.status(500).json({ error: e instanceof Error ? e.message : "Upload failed" });
  }
});

export default router;
