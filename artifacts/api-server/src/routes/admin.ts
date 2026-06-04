import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { db, blogPostsTable, newsletterSubscribersTable, contactMessagesTable, wallpapersTable, templatesTable, guidesTable, siteSettingsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router: IRouter = Router();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!ADMIN_PASSWORD || !auth || auth !== `Bearer ${ADMIN_PASSWORD}`) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

router.post("/admin/login", (req, res) => {
  const { password } = req.body;
  if (!ADMIN_PASSWORD || password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Invalid password" });
    return;
  }
  res.json({ token: ADMIN_PASSWORD });
});

router.use("/admin", requireAdmin);

// ---- Blog Posts ----
router.get("/admin/blog-posts", async (_req, res) => {
  const posts = await db.select().from(blogPostsTable).orderBy(desc(blogPostsTable.publishedAt));
  res.json(posts);
});

router.post("/admin/blog-posts", async (req, res) => {
  const post = await db.insert(blogPostsTable).values(req.body).returning();
  res.status(201).json(post[0]);
});

router.put("/admin/blog-posts/:id", async (req, res) => {
  const id = Number(req.params.id);
  const post = await db.update(blogPostsTable).set(req.body).where(eq(blogPostsTable.id, id)).returning();
  res.json(post[0]);
});

router.delete("/admin/blog-posts/:id", async (req, res) => {
  const id = Number(req.params.id);
  await db.delete(blogPostsTable).where(eq(blogPostsTable.id, id));
  res.json({ message: "Deleted" });
});

// ---- Wallpapers ----
router.get("/admin/wallpapers", async (_req, res) => {
  const items = await db.select().from(wallpapersTable).orderBy(desc(wallpapersTable.createdAt));
  res.json(items);
});

router.post("/admin/wallpapers", async (req, res) => {
  const item = await db.insert(wallpapersTable).values(req.body).returning();
  res.status(201).json(item[0]);
});

router.put("/admin/wallpapers/:id", async (req, res) => {
  const id = Number(req.params.id);
  const item = await db.update(wallpapersTable).set(req.body).where(eq(wallpapersTable.id, id)).returning();
  res.json(item[0]);
});

router.delete("/admin/wallpapers/:id", async (req, res) => {
  const id = Number(req.params.id);
  await db.delete(wallpapersTable).where(eq(wallpapersTable.id, id));
  res.json({ message: "Deleted" });
});

// ---- Templates ----
router.get("/admin/templates", async (_req, res) => {
  const items = await db.select().from(templatesTable).orderBy(desc(templatesTable.createdAt));
  res.json(items);
});

router.post("/admin/templates", async (req, res) => {
  const item = await db.insert(templatesTable).values(req.body).returning();
  res.status(201).json(item[0]);
});

router.put("/admin/templates/:id", async (req, res) => {
  const id = Number(req.params.id);
  const item = await db.update(templatesTable).set(req.body).where(eq(templatesTable.id, id)).returning();
  res.json(item[0]);
});

router.delete("/admin/templates/:id", async (req, res) => {
  const id = Number(req.params.id);
  await db.delete(templatesTable).where(eq(templatesTable.id, id));
  res.json({ message: "Deleted" });
});

// ---- Guides ----
router.get("/admin/guides", async (_req, res) => {
  const items = await db.select().from(guidesTable).orderBy(desc(guidesTable.createdAt));
  res.json(items);
});

router.post("/admin/guides", async (req, res) => {
  const item = await db.insert(guidesTable).values(req.body).returning();
  res.status(201).json(item[0]);
});

router.put("/admin/guides/:id", async (req, res) => {
  const id = Number(req.params.id);
  const item = await db.update(guidesTable).set(req.body).where(eq(guidesTable.id, id)).returning();
  res.json(item[0]);
});

router.delete("/admin/guides/:id", async (req, res) => {
  const id = Number(req.params.id);
  await db.delete(guidesTable).where(eq(guidesTable.id, id));
  res.json({ message: "Deleted" });
});

// ---- Contacts (read-only with delete) ----
router.get("/admin/contacts", async (_req, res) => {
  const items = await db.select().from(contactMessagesTable).orderBy(desc(contactMessagesTable.createdAt));
  res.json(items);
});

router.delete("/admin/contacts/:id", async (req, res) => {
  const id = Number(req.params.id);
  await db.delete(contactMessagesTable).where(eq(contactMessagesTable.id, id));
  res.json({ message: "Deleted" });
});

// ---- Newsletter (read-only with delete) ----
router.get("/admin/newsletter", async (_req, res) => {
  const items = await db.select().from(newsletterSubscribersTable).orderBy(desc(newsletterSubscribersTable.subscribedAt));
  res.json(items);
});

router.delete("/admin/newsletter/:id", async (req, res) => {
  const id = Number(req.params.id);
  await db.delete(newsletterSubscribersTable).where(eq(newsletterSubscribersTable.id, id));
  res.json({ message: "Deleted" });
});

// ---- Site Settings ----
router.get("/admin/settings", async (_req, res) => {
  const rows = await db.select().from(siteSettingsTable);
  const settings: Record<string, string> = {};
  for (const row of rows) {
    settings[row.key] = row.value;
  }
  res.json(settings);
});

router.put("/admin/settings", async (req, res) => {
  const entries = req.body as Record<string, string>;
  for (const [key, value] of Object.entries(entries)) {
    await db.insert(siteSettingsTable).values({ key, value }).onConflictDoUpdate({ target: siteSettingsTable.key, set: { value } });
  }
  const rows = await db.select().from(siteSettingsTable);
  const settings: Record<string, string> = {};
  for (const row of rows) {
    settings[row.key] = row.value;
  }
  res.json(settings);
});

export default router;
