import { Router, type IRouter } from "express";
import { db, templatesTable } from "@workspace/db";
import { desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/templates", async (_req, res) => {
  try {
    const templates = await db.select().from(templatesTable).orderBy(desc(templatesTable.createdAt));
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch templates" });
  }
});

export default router;
