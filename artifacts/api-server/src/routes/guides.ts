import { Router, type IRouter } from "express";
import { db, guidesTable } from "@workspace/db";
import { desc, eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/guides", async (_req, res) => {
  try {
    const guides = await db.select().from(guidesTable).orderBy(desc(guidesTable.createdAt));
    res.json(guides);
  } catch {
    res.json([]);
  }
});

router.get("/guides/:slug", async (req, res) => {
  try {
    const guide = await db.select().from(guidesTable).where(eq(guidesTable.slug, req.params.slug)).limit(1);
    if (guide.length === 0) {
      res.status(404).json({ error: "Guide not found" });
      return;
    }
    res.json(guide[0]);
  } catch {
    res.status(404).json({ error: "Guide not found" });
  }
});

export default router;
