import { Router, type IRouter } from "express";
import { db, ordersTable, downloadsTable, newsletterSubscribersTable, contactMessagesTable, blogPostsTable, wallpapersTable, templatesTable, guidesTable } from "@workspace/db";
import { sql, eq, and } from "drizzle-orm";

const router: IRouter = Router();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

function requireAdmin(req: any, res: any, next: any) {
  const auth = req.headers.authorization;
  if (!ADMIN_PASSWORD || !auth || auth !== `Bearer ${ADMIN_PASSWORD}`) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

router.get("/admin/stats", requireAdmin, async (_req, res) => {
  try {
    const [totalRevenue] = await db.select({ total: sql<number>`COALESCE(SUM(amount), 0)` }).from(ordersTable).where(eq(ordersTable.status, "completed"));
    const [totalOrders] = await db.select({ count: sql<number>`COUNT(*)` }).from(ordersTable);
    const [totalNewsletter] = await db.select({ count: sql<number>`COUNT(*)` }).from(newsletterSubscribersTable);
    const [totalContacts] = await db.select({ count: sql<number>`COUNT(*)` }).from(contactMessagesTable);
    const [totalPosts] = await db.select({ count: sql<number>`COUNT(*)` }).from(blogPostsTable);
    const [totalWallpapers] = await db.select({ count: sql<number>`COUNT(*)` }).from(wallpapersTable);
    const [totalTemplates] = await db.select({ count: sql<number>`COUNT(*)` }).from(templatesTable);
    const [totalGuides] = await db.select({ count: sql<number>`COUNT(*)` }).from(guidesTable);

    const monthlyRevenue = await db.execute(sql`
      SELECT
        DATE_TRUNC('month', created_at) as month,
        COALESCE(SUM(amount), 0) as revenue
      FROM orders
      WHERE created_at >= NOW() - INTERVAL '12 months' AND status = 'completed'
      GROUP BY month
      ORDER BY month ASC
    `);

    const topDownloads = await db.execute(sql`
      SELECT d.item_type, d.item_id, d.count,
        CASE
          WHEN d.item_type = 'wallpaper' THEN w.title
          WHEN d.item_type = 'template' THEN t.title
          WHEN d.item_type = 'guide' THEN g.title
          ELSE NULL
        END as item_name
      FROM downloads d
      LEFT JOIN wallpapers w ON d.item_type = 'wallpaper' AND d.item_id = w.id
      LEFT JOIN templates t ON d.item_type = 'template' AND d.item_id = t.id
      LEFT JOIN guides g ON d.item_type = 'guide' AND d.item_id = g.id
      ORDER BY d.count DESC
      LIMIT 10
    `);

    const rows = topDownloads.rows || topDownloads;

    res.json({
      totalRevenue: totalRevenue.total,
      totalOrders: totalOrders.count,
      totalNewsletter: totalNewsletter.count,
      totalContacts: totalContacts.count,
      totalPosts: totalPosts.count,
      totalWallpapers: totalWallpapers.count,
      totalTemplates: totalTemplates.count,
      totalGuides: totalGuides.count,
      monthlyRevenue: monthlyRevenue.rows || monthlyRevenue,
      topDownloads: rows,
    });
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

export default router;
