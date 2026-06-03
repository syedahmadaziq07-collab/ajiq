import { useState } from "react";
import { useSubmitContact } from "@workspace/api-client-react";

export default function Contact() {
  const contact = useSubmitContact();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contact.mutate(
      { data: form },
      { onSuccess: () => setForm({ name: "", email: "", subject: "", message: "" }) },
    );
  };

  return (
    <div className="w-full min-h-screen">
      <section className="px-4 sm:px-8 pt-12 pb-10 text-center max-w-[1200px] mx-auto">
        <h1 className="text-[32px] md:text-[64px] font-[800] tracking-[-2px] md:tracking-[-5px] leading-[0.9] text-[#000]">
          Contact
        </h1>
        <p className="text-[#747474] text-[15px] mt-4">
          We'd love to hear from you.
        </p>
      </section>

      <section className="px-4 sm:px-8 pb-16 max-w-[480px] mx-auto">
        <form className="flex flex-col" onSubmit={handleSubmit} data-testid="contact-form">
          <input
            type="text"
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full bg-transparent border-b border-[#EEEEEE] focus:border-[#0000EE] outline-none text-[15px] pb-3 mb-6 transition-colors text-[#000]"
            data-testid="input-contact-name"
          />
          <input
            type="email"
            placeholder="your@email.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="w-full bg-transparent border-b border-[#EEEEEE] focus:border-[#0000EE] outline-none text-[15px] pb-3 mb-6 transition-colors text-[#000]"
            data-testid="input-contact-email"
          />
          <input
            type="text"
            placeholder="Subject"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            required
            className="w-full bg-transparent border-b border-[#EEEEEE] focus:border-[#0000EE] outline-none text-[15px] pb-3 mb-6 transition-colors text-[#000]"
          />
          <textarea
            placeholder="Your message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
            className="w-full bg-transparent border-b border-[#EEEEEE] focus:border-[#0000EE] outline-none text-[15px] pb-3 mb-6 min-h-[120px] resize-none transition-colors text-[#000]"
            data-testid="input-contact-message"
          ></textarea>

          <button
            type="submit"
            disabled={contact.isPending}
            className="w-full bg-[#000] text-white rounded-[10px] h-[50px] text-[15px] font-[500] hover:bg-[#222] transition-colors mt-2 disabled:opacity-50"
            data-testid="btn-submit-contact"
          >
            {contact.isPending ? "Sending..." : contact.isSuccess ? "Sent!" : "Send Message"}
          </button>
        </form>

        <div className="mt-8 text-center text-[15px]">
          <span className="text-[#747474]">Or email us directly at </span>
          <span className="font-bold text-[#000]">support@askalm.com</span>
        </div>
      </section>
    </div>
  );
}
