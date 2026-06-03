import { Router, type IRouter } from "express";
import { db, guidesTable } from "@workspace/db";
import { desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/guides", async (_req, res) => {
  try {
    const guides = await db.select().from(guidesTable).orderBy(desc(guidesTable.createdAt));
    res.json(guides);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch guides" });
  }
});

export default router;
