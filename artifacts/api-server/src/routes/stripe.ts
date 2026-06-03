import { Router, type IRouter } from "express";
import { db, ordersTable, wallpapersTable, templatesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

router.post("/create-checkout-session", async (req, res) => {
  try {
    const { itemType, itemId } = req.body;
    if (!itemType || !itemId) {
      res.status(400).json({ error: "itemType and itemId required" });
      return;
    }

    let item;
    if (itemType === "wallpaper") {
      const result = await db.select().from(wallpapersTable).where(eq(wallpapersTable.id, itemId)).limit(1);
      item = result[0];
    } else if (itemType === "template") {
      const result = await db.select().from(templatesTable).where(eq(templatesTable.id, itemId)).limit(1);
      item = result[0];
    } else {
      res.status(400).json({ error: "Invalid item type" });
      return;
    }

    if (!item || !item.price) {
      res.status(400).json({ error: "Item not found or not for sale" });
      return;
    }

    if (!STRIPE_SECRET_KEY) {
      res.status(500).json({ error: "Stripe not configured" });
      return;
    }

    const stripe = await import("stripe");
    const s = new stripe.default(STRIPE_SECRET_KEY);

    const session = await s.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: { name: item.title },
          unit_amount: item.price,
        },
        quantity: 1,
      }],
      metadata: { itemType, itemId: String(itemId) },
      success_url: `${req.headers.origin}/api/download/${itemType}/${itemId}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/${itemType === "wallpaper" ? "wallpapers" : "templates"}`,
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

router.post("/stripe-webhook", async (req, res) => {
  const sig = req.headers["stripe-signature"] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!STRIPE_SECRET_KEY || !webhookSecret) {
    res.status(200).json({ received: true });
    return;
  }

  try {
    const stripe = await import("stripe");
    const s = new stripe.default(STRIPE_SECRET_KEY);
    const event = s.webhooks.constructEvent(req.body, sig, webhookSecret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const { itemType, itemId } = session.metadata || {};
      if (itemType && itemId) {
        const email = session.customer_details?.email || "unknown";
        const name = session.customer_details?.name || undefined;
        await db.insert(ordersTable).values({
          customerEmail: email,
          customerName: name,
          amount: session.amount_total || 0,
          currency: session.currency || "usd",
          itemType,
          itemId: Number(itemId),
          stripeSessionId: session.id,
          stripePaymentIntent: typeof session.payment_intent === "string" ? session.payment_intent : undefined,
          status: "completed",
        });
      }
    }

    res.json({ received: true });
  } catch (err) {
    res.status(400).json({ error: "Webhook error" });
  }
});

export default router;
