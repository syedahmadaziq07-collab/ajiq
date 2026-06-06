import { Router, type IRouter } from "express";
import { db, downloadsTable, ordersTable } from "@workspace/db";
import { and, eq } from "drizzle-orm";

const router: IRouter = Router();

const SUPABASE_URL = "https://dwovtevztmolttpohvym.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3b3Z0ZXZ6dG1vbHR0cG9odnltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0MTg1NzgsImV4cCI6MjA5NTk5NDU3OH0.NCQBn9eMEP37tX8jSLObchJ85HT28tZaZ8HvRPI9ZKk";

async function generateSignedUrl(publicUrl: string, expiresInSec = 3600): Promise<string | null> {
  const prefix = `${SUPABASE_URL}/storage/v1/object/public/`;
  if (!publicUrl.startsWith(prefix)) return null;
  const objectPath = publicUrl.slice(prefix.length);
  try {
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/sign/${objectPath}`, {
      method: "POST",
      headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}`, "Content-Type": "application/json" },
      body: JSON.stringify({ expiresIn: `${expiresInSec}` }),
    });
    if (!res.ok) return null;
    const data = await res.json() as { signedURL: string };
    // signedURL from Supabase is a relative path like '/object/sign/...?token=xxx'
    // Extract the query string (token) and construct the correct absolute URL
    const qsIdx = data.signedURL.indexOf("?");
    const qs = qsIdx >= 0 ? data.signedURL.slice(qsIdx) : "";
    return `${SUPABASE_URL}/storage/v1/object/sign/${objectPath}${qs}`;
  } catch { return null; }
}

router.get("/download/:itemType/:itemId", async (req, res) => {
  try {
    const { itemType, itemId } = req.params;
    const id = Number(itemId);

    // Check if item is premium (has a price) - if so, verify purchase
    const { wallpapersTable, templatesTable, guidesTable } = await import("@workspace/db");
    let item;
    if (itemType === "wallpaper") {
      const result = await db.select().from(wallpapersTable).where(eq(wallpapersTable.id, id)).limit(1);
      item = result[0];
    } else if (itemType === "template") {
      const result = await db.select().from(templatesTable).where(eq(templatesTable.id, id)).limit(1);
      item = result[0];
    } else if (itemType === "guide") {
      const result = await db.select().from(guidesTable).where(eq(guidesTable.id, id)).limit(1);
      item = result[0];
    }

    if (!item) {
      res.status(404).json({ error: "Item not found" });
      return;
    }

    // If premium, check they paid
    if (item.price) {
      const sessionId = req.query.session_id as string;
      const order = await db.select().from(ordersTable).where(eq(ordersTable.stripeSessionId, sessionId)).limit(1);
      if (order.length === 0) {
        res.status(403).json({ error: "Purchase required" });
        return;
      }
    }

    if (!item.downloadUrl || !item.downloadUrl.trim()) {
      console.error(`Download blocked: itemType=${itemType} itemId=${itemId} has no downloadUrl`);
      res.status(404).json({ error: "Download file not available for this item" });
      return;
    }

    // Track download
    const existing = await db.select().from(downloadsTable).where(and(eq(downloadsTable.itemType, itemType), eq(downloadsTable.itemId, id))).limit(1);
    if (existing.length > 0) {
      await db.update(downloadsTable).set({ count: existing[0].count + 1 }).where(eq(downloadsTable.id, existing[0].id));
    } else {
      await db.insert(downloadsTable).values({ itemType, itemId: id, count: 1 });
    }

    // If Supabase URL, generate signed URL (expires in 1 hour) instead of redirecting directly
    const signedUrl = await generateSignedUrl(item.downloadUrl);
    if (signedUrl) {
      console.log(`Download redirect: ${itemType}/${itemId} -> signed URL`);
      res.redirect(signedUrl);
    } else {
      console.log(`Download redirect: ${itemType}/${itemId} -> ${item.downloadUrl}`);
      res.redirect(item.downloadUrl);
    }
  } catch (error) {
    res.status(500).json({ error: "Download failed" });
  }
});

export default router;
