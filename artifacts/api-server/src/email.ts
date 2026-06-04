import { db, newsletterSubscribersTable } from "@workspace/db";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const SITE_URL = process.env.VERCEL_ENV === "production" ? "https://wallp.store" : "http://localhost:5173";

export async function sendEmail(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY) return;
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: "Wallp. <noreply@wallp.store>", to, subject, html }),
  });
}

export async function notifyNewSubscriber(email: string) {
  await sendEmail("hello@askalm.com", "New Newsletter Subscriber", `<p>New subscriber: <strong>${email}</strong></p>`);
}

export async function notifyNewContact(name: string, email: string, subject: string, message: string) {
  await sendEmail("hello@askalm.com", `Contact: ${subject}`, `<p><strong>From:</strong> ${name} (${email})</p><p><strong>Subject:</strong> ${subject}</p><p>${message}</p>`);
}

type DropType = "wallpaper" | "template" | "guide";

function getDropUrl(type: DropType, slug: string): string {
  const paths: Record<DropType, string> = {
    wallpaper: "/wallpapers",
    template: "/templates",
    guide: "/guides",
  };
  return `${SITE_URL}${paths[type]}/${slug}`;
}

function getDropLabel(type: DropType): string {
  const labels: Record<DropType, string> = { wallpaper: "Wallpaper", template: "Template", guide: "Guide" };
  return labels[type];
}

export async function notifyAllSubscribers(type: DropType, title: string, slug: string) {
  const subscribers = await db.select({ email: newsletterSubscribersTable.email }).from(newsletterSubscribersTable);
  if (subscribers.length === 0) return;

  const url = getDropUrl(type, slug);
  const label = getDropLabel(type);

  const html = `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px">
      <p style="font-size:14px;color:#888;margin:0 0 8px">NEW DROP</p>
      <h1 style="font-size:24px;font-weight:600;margin:0 0 16px">${title}</h1>
      <p style="font-size:15px;color:#555;line-height:1.6;margin:0 0 24px">
        A new ${label.toLowerCase()} has been released. Check it out on Wallp.
      </p>
      <a href="${url}" style="display:inline-block;background:#000;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:500">View ${label}</a>
      <p style="font-size:12px;color:#aaa;margin-top:32px">Wallp. — wallp.store</p>
    </div>
  `;

  await Promise.allSettled(
    subscribers.map((s) => sendEmail(s.email, `New ${label.toLowerCase()}: ${title}`, html))
  );
}
