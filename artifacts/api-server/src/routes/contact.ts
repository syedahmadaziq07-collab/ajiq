import { Router, type IRouter } from "express";
import { db, contactMessagesTable } from "@workspace/db";
import { notifyNewContact } from "../email.js";

const router: IRouter = Router();

router.post("/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      res.status(400).json({ error: "Name, email, subject, and message are required" });
      return;
    }

    await db.insert(contactMessagesTable).values({ name, email, subject, message });
    notifyNewContact(name, email, subject, message);
    res.status(201).json({ message: "Message sent successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to send message" });
  }
});

export default router;
