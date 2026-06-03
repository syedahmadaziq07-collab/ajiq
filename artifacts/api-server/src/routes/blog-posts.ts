import { Router, type IRouter } from "express";
import { db, blogPostsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/blog-posts", async (_req, res) => {
  try {
    const posts = await db.select().from(blogPostsTable).orderBy(desc(blogPostsTable.publishedAt));
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch blog posts" });
  }
});

router.get("/blog-posts/:slug", async (req, res) => {
  try {
    const post = await db.select().from(blogPostsTable).where(eq(blogPostsTable.slug, req.params.slug)).limit(1);
    if (post.length === 0) {
      res.status(404).json({ error: "Blog post not found" });
      return;
    }
    res.json(post[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch blog post" });
  }
});

export default router;
