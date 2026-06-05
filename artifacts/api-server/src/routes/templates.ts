import { Router, type IRouter } from "express";
import { db, templatesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/templates", async (_req, res) => {
  try {
    const templates = await db.select().from(templatesTable).orderBy(desc(templatesTable.createdAt));
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch templates" });
  }
});

router.get("/templates/:slug", async (req, res) => {
  try {
    const item = await db.select().from(templatesTable).where(eq(templatesTable.slug, req.params.slug)).limit(1);
    if (item.length === 0) {
      res.status(404).json({ error: "Template not found" });
      return;
    }
    res.json(item[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch template" });
  }
});

export default router;
