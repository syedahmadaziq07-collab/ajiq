import { Router, type IRouter } from "express";
import { db, downloadsTable, ordersTable } from "@workspace/db";
import { and, eq } from "drizzle-orm";

const router: IRouter = Router();

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

    if (!item.downloadUrl) {
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

    res.redirect(item.downloadUrl);
  } catch (error) {
    res.status(500).json({ error: "Download failed" });
  }
});

export default router;
