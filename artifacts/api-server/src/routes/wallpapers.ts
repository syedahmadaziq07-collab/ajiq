import { Router, type IRouter } from "express";
import { db, wallpapersTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/wallpapers", async (_req, res) => {
  try {
    const wallpapers = await db.select().from(wallpapersTable).orderBy(desc(wallpapersTable.createdAt));
    res.json(wallpapers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch wallpapers" });
  }
});

router.get("/wallpapers/:slug", async (req, res) => {
  try {
    const item = await db.select().from(wallpapersTable).where(eq(wallpapersTable.slug, req.params.slug)).limit(1);
    if (item.length === 0) {
      res.status(404).json({ error: "Wallpaper not found" });
      return;
    }
    res.json(item[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch wallpaper" });
  }
});

export default router;
