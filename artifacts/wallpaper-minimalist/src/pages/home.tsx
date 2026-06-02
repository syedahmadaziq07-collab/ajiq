import { Link } from "wouter";

export default function Home() {
  return (
    <div className="w-full min-h-screen">
      <section className="pt-16 pb-8 px-6 sm:px-10 max-w-[1200px] mx-auto">
        <h1 className="text-[56px] sm:text-[80px] md:text-[100px] font-[500] tracking-[-3px] sm:tracking-[-5px] leading-[0.85] text-[#000]">
          askalm
        </h1>
        <p className="text-[#747474] text-[15px] sm:text-[16px] leading-[1.7] max-w-[460px] mt-5">
          At askalm, we craft simple essentials that make every workspace inspiring and every device more productive.
        </p>
      </section>

      <section className="px-6 sm:px-10 pb-10 max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div>
          <p className="text-[#000] text-[13px] font-[500] mb-1">Wallpapers</p>
          <Link href="/wallpapers" className="text-[#747474] text-[13px] hover:text-[#000] transition-colors inline-flex items-center gap-1">
            Browse all Wallpapers <span className="text-[16px]">↗</span>
          </Link>
        </div>
        <div>
          <p className="text-[#000] text-[13px] font-[500] mb-1">Guides</p>
          <Link href="/guides" className="text-[#747474] text-[13px] hover:text-[#000] transition-colors inline-flex items-center gap-1">
            Browse all Guides <span className="text-[16px]">↗</span>
          </Link>
        </div>
        <div>
          <p className="text-[#000] text-[13px] font-[500] mb-1">Templates</p>
          <Link href="/templates" className="text-[#747474] text-[13px] hover:text-[#000] transition-colors inline-flex items-center gap-1">
            Browse all Templates <span className="text-[16px]">↗</span>
          </Link>
        </div>
      </section>

      <section className="px-6 sm:px-10 py-10 max-w-[1200px] mx-auto border-t border-[#EEEEEE]">
        <h2 className="text-[32px] sm:text-[40px] md:text-[48px] font-[500] tracking-[-1.5px] leading-[1.05] text-[#000] mb-4">
          Refining digital life.
        </h2>
        <p className="text-[#747474] text-[15px] sm:text-[16px] leading-[1.7] max-w-[480px]">
          Our designs refine workspaces and devices, proving that the simplest details can make the biggest difference in digital life.
        </p>
      </section>

      <section className="px-6 sm:px-10 py-10 max-w-[1200px] mx-auto border-t border-[#EEEEEE]">
        <h2 className="text-[28px] sm:text-[36px] md:text-[42px] font-[500] tracking-[-1px] leading-[1.05] text-[#000] mb-2">
          Insights from our blog.
        </h2>
        <p className="text-[#747474] text-[15px] sm:text-[16px] leading-[1.7] mb-8 max-w-[560px]">
          Insights and practical tips to create a clean, functional environment and digital life across devices and workspaces.
        </p>
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-[#747474] text-[13px]">On <span className="font-[500] text-[#000]">Feb 2, 2026</span></p>
            <Link href="/blog" className="text-[#000] text-[15px] font-[500] hover:underline underline-offset-2">
              Ergonomic Essentials: Comfort Meets Productivity
            </Link>
          </div>
          <div>
            <p className="text-[#747474] text-[13px]">On <span className="font-[500] text-[#000]">Jan 12, 2026</span></p>
            <Link href="/blog" className="text-[#000] text-[15px] font-[500] hover:underline underline-offset-2">
              5 Color Palettes for Your Workspace
            </Link>
          </div>
          <div>
            <p className="text-[#747474] text-[13px]">On <span className="font-[500] text-[#000]">Jan 5, 2026</span></p>
            <Link href="/blog" className="text-[#000] text-[15px] font-[500] hover:underline underline-offset-2">
              Optimizing Wall Space Around Your Desk
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 sm:px-10 py-10 max-w-[1200px] mx-auto border-t border-[#EEEEEE] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <p className="text-[#747474] text-[14px] sm:text-[15px] leading-[1.7] max-w-[420px]">
          Join for thoughtful insights, exclusive offers, and ideas to create more balanced and functional setups.
        </p>
        <form
          className="flex flex-row items-center gap-2 shrink-0"
          onSubmit={(e) => { e.preventDefault(); alert("Subscribed!"); }}
        >
          <input
            type="email"
            placeholder="name@askalm.com"
            className="border border-[#EEEEEE] rounded-[8px] h-[44px] px-4 text-[13px] focus:outline-none focus:border-[#000] w-full sm:w-[220px] bg-transparent text-[#000]"
            required
          />
          <button
            type="submit"
            className="bg-[#000] text-white rounded-[8px] h-[44px] px-5 text-[13px] font-[500] hover:bg-[#222] transition-colors whitespace-nowrap"
          >
            Subscribe
          </button>
        </form>
      </section>

    </div>
  );
}