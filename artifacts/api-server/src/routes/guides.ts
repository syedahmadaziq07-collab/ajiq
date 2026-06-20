import { Router, type IRouter } from "express";
import { db, guidesTable } from "@workspace/db";
import { desc, eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/guides", async (req, res) => {
  try {
    const limit = req.query.limit ? Math.min(Math.max(1, Number(req.query.limit)), 100) : null;
    const offset = req.query.offset ? Math.max(0, Number(req.query.offset)) : 0;

    let query = db.select().from(guidesTable).orderBy(desc(guidesTable.createdAt));
    if (limit) query = query.limit(limit).offset(offset);

    const guides = await query;
    res.setHeader("Cache-Control", "public, max-age=300, s-maxage=600");
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
