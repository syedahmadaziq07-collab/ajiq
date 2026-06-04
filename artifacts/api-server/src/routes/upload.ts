import { Router, type IRouter, type Request, type Response } from "express";

const router: IRouter = Router();

const SUPABASE_URL = "https://dwovtevztmolttpohvym.supabase.co";
const ANON_KEY = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3b3Z0ZXZ6dG1vbHR0cG9odnltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0MTg1NzgsImV4cCI6MjA5NTk5NDU3OH0.NCQBn9eMEP37tX8jSLObchJ85HT28tZaZ8HvRPI9ZKk";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

router.post("/admin/upload", async (req: Request, res: Response) => {
  const auth = req.headers.authorization;
  if (!ADMIN_PASSWORD || !auth || auth !== `Bearer ${ADMIN_PASSWORD}`) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { filename, contentType, base64 } = req.body;
  if (!filename || !contentType || !base64) {
    res.status(400).json({ error: "Missing filename, contentType, or base64" });
    return;
  }

  const buffer = Buffer.from(base64, "base64");
  const ext = filename.split(".").pop() || "png";
  const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  try {
    const uploadRes = await fetch(`${SUPABASE_URL}/storage/v1/object/wallpapers/${uniqueName}`, {
      method: "POST",
      headers: {
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
        "Content-Type": contentType,
      },
      body: new Uint8Array(buffer),
    });
    if (!uploadRes.ok) {
      const err = await uploadRes.text();
      res.status(500).json({ error: `Upload failed: ${uploadRes.status} ${err}` });
      return;
    }
    const url = `${SUPABASE_URL}/storage/v1/object/public/wallpapers/${uniqueName}`;
    res.json({ url });
  } catch (e: unknown) {
    res.status(500).json({ error: e instanceof Error ? e.message : "Upload failed" });
  }
});

export default router;
