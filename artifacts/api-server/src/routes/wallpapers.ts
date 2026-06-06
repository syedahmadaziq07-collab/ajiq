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

router.get("/wallpapers", async (_req, res) => {
  try {
    const wallpapers = await db.select().from(wallpapersTable).orderBy(desc(wallpapersTable.createdAt));
    let fixed = false;
    for (const wp of wallpapers) {
      if (!wp.slug || !wp.slug.trim()) {
        const newSlug = slugify(wp.title || "untitled") + "-" + wp.id;
        await db.update(wallpapersTable).set({ slug: newSlug }).where(eq(wallpapersTable.id, wp.id));
        wp.slug = newSlug;
        fixed = true;
      }
    }
    if (fixed) console.log("Auto-fixed empty slugs for wallpapers");
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
