const RESEND_API_KEY = process.env.RESEND_API_KEY;

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
