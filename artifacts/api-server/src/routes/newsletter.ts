import { Router, type IRouter } from "express";
import { db, newsletterSubscribersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { notifyNewSubscriber } from "../email.js";

const router: IRouter = Router();

router.post("/newsletter", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== "string") {
      res.status(400).json({ error: "Email is required" });
      return;
    }

    const existing = await db.select().from(newsletterSubscribersTable).where(eq(newsletterSubscribersTable.email, email)).limit(1);
    if (existing.length > 0) {
      res.json({ message: "Already subscribed" });
      return;
    }

    await db.insert(newsletterSubscribersTable).values({ email });
    notifyNewSubscriber(email);
    res.status(201).json({ message: "Subscribed successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to subscribe" });
  }
});

export default router;
