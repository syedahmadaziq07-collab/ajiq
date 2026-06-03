import { Router, type IRouter } from "express";
import { db, wallpapersTable } from "@workspace/db";
import { desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/wallpapers", async (_req, res) => {
  try {
    const wallpapers = await db.select().from(wallpapersTable).orderBy(desc(wallpapersTable.createdAt));
    res.json(wallpapers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch wallpapers" });
  }
});

export default router;
