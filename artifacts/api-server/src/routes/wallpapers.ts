import { Router, type IRouter } from "express";
import { db, wallpapersTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const router: IRouter = Router();

router.get("/wallpapers", async (req, res) => {
  try {
    const limit = req.query.limit ? Math.min(Math.max(1, Number(req.query.limit)), 100) : null;
    const offset = req.query.offset ? Math.max(0, Number(req.query.offset)) : 0;

    let query = db.select().from(wallpapersTable).orderBy(desc(wallpapersTable.createdAt));
    if (limit) query = query.limit(limit).offset(offset);

    const wallpapers = await query;

    res.setHeader("Cache-Control", "public, max-age=300, s-maxage=600");
    res.json(wallpapers);
  } catch {
    res.json([]);
  }
});

router.get("/wallpapers/:slug", async (req, res) => {
  try {
    let item = await db.select().from(wallpapersTable).where(eq(wallpapersTable.slug, req.params.slug)).limit(1);
    if (item.length === 0) {
      const id = Number(req.params.slug);
      if (!isNaN(id)) {
        item = await db.select().from(wallpapersTable).where(eq(wallpapersTable.id, id)).limit(1);
      }
    }
    if (item.length === 0) {
      res.status(404).json({ error: "Wallpaper not found" });
      return;
    }
    res.json(item[0]);
  } catch {
    res.status(404).json({ error: "Wallpaper not found" });
  }
});

export default router;
