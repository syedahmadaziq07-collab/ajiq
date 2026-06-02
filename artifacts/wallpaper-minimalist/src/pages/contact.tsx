export default function Contact() {
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
        <form 
          className="flex flex-col"
          onSubmit={(e) => { e.preventDefault(); alert("Message sent!"); }}
          data-testid="contact-form"
        >
          <input 
            type="text" 
            placeholder="Your name" 
            required
            className="w-full bg-transparent border-b border-[#EEEEEE] focus:border-[#0000EE] outline-none text-[15px] pb-3 mb-6 transition-colors text-[#000]"
            style={{ borderBottomWidth: '1px', paddingBottom: '12px' }}
            onFocus={(e) => { e.target.style.borderBottomWidth = '2px'; e.target.style.paddingBottom = '11px'; }}
            onBlur={(e) => { e.target.style.borderBottomWidth = '1px'; e.target.style.paddingBottom = '12px'; }}
            data-testid="input-contact-name"
          />
          <input 
            type="email" 
            placeholder="your@email.com" 
            required
            className="w-full bg-transparent border-b border-[#EEEEEE] focus:border-[#0000EE] outline-none text-[15px] pb-3 mb-6 transition-colors text-[#000]"
            style={{ borderBottomWidth: '1px', paddingBottom: '12px' }}
            onFocus={(e) => { e.target.style.borderBottomWidth = '2px'; e.target.style.paddingBottom = '11px'; }}
            onBlur={(e) => { e.target.style.borderBottomWidth = '1px'; e.target.style.paddingBottom = '12px'; }}
            data-testid="input-contact-email"
          />
          <textarea 
            placeholder="Your message" 
            required
            className="w-full bg-transparent border-b border-[#EEEEEE] focus:border-[#0000EE] outline-none text-[15px] pb-3 mb-6 min-h-[120px] resize-none transition-colors text-[#000]"
            style={{ borderBottomWidth: '1px', paddingBottom: '12px' }}
            onFocus={(e) => { e.target.style.borderBottomWidth = '2px'; e.target.style.paddingBottom = '11px'; }}
            onBlur={(e) => { e.target.style.borderBottomWidth = '1px'; e.target.style.paddingBottom = '12px'; }}
            data-testid="input-contact-message"
          ></textarea>
          
          <button 
            type="submit" 
            className="w-full bg-[#000] text-white rounded-[10px] h-[50px] text-[15px] font-[500] hover:bg-[#222] transition-colors mt-2"
            data-testid="btn-submit-contact"
          >
            Send Message
          </button>
        </form>

        <div className="mt-8 text-center text-[15px]">
          <span className="text-[#747474]">Or email us directly at </span>
          <span className="font-bold text-[#000]">support@wallpaper.minimalist</span>
        </div>
      </section>
    </div>
  );
}
