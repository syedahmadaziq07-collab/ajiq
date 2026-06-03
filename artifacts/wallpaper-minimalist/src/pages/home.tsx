import { Link } from "wouter";
import { useState } from "react";
import { useListBlogPosts, useSubscribeNewsletter } from "@workspace/api-client-react";

const WALLPAPERS_IMG = "https://framerusercontent.com/images/edkUWDLREszDiq4vgt975wDDFM.jpg";
const GUIDES_IMG = "https://framerusercontent.com/images/DTNpaBh0Djuey5Ql5HpaJWi3lWg.jpg";
const TEMPLATES_IMG = "https://framerusercontent.com/images/KkKh1T6zK6twdxDPmlYsFJTj6lg.jpg";

const FEATURED_IMGS = [
  "https://framerusercontent.com/images/76MGm4VfTnCkUrk3ct1yk3Rpw.jpg",
  "https://framerusercontent.com/images/dH9sQMFjHqSouYrD2G1zd5Gl5c.jpg",
  "https://framerusercontent.com/images/r9EnSsRgp8Z5QUmBOV9sui25trU.png",
  "https://framerusercontent.com/images/iIFMUvpWvCpMv2Saql4IU2p2K0g.png",
  "https://framerusercontent.com/images/gBGzj4YUttKCw6dDXphjpyvtSDM.png",
  "https://framerusercontent.com/images/rwOwbd7jG8w83cROgI7MvdeihA.png",
  "https://framerusercontent.com/images/6MFK0ePJsGglxyIwBOsKeAVWU.jpg",
  "https://framerusercontent.com/images/DXWQczEsbDwS0U9pVPEzF4rvM.jpg",
];

export default function Home() {
  const { data: blogPosts } = useListBlogPosts();
  const newsletter = useSubscribeNewsletter();
  const [email, setEmail] = useState("");

  const posts = blogPosts?.slice(0, 3) ?? [];
  const [first, second, third] = posts.length === 3 ? posts : [];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    newsletter.mutate({ data: { email } }, { onSuccess: () => setEmail("") });
  };

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  return (
    <div className="w-full min-h-screen">
      <section className="pt-14 pb-6 px-6 sm:px-10 max-w-[1200px] mx-auto">
        <h1 className="text-[56px] sm:text-[80px] md:text-[100px] font-[500] tracking-[-3px] sm:tracking-[-5px] leading-[0.85] text-[#000]">
          askalm
        </h1>
        <p className="text-[#747474] text-[15px] sm:text-[16px] leading-[1.7] max-w-[460px] mt-5">
          At askalm, we craft simple essentials that make every workspace inspiring and every device more productive.
        </p>
      </section>

      <section className="px-6 sm:px-10 pb-10 max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/wallpapers" className="group block border border-[#EEEEEE] rounded-[12px] overflow-hidden bg-white hover:scale-[1.01] transition-transform duration-200">
          <div className="aspect-[4/3] overflow-hidden">
            <img src={WALLPAPERS_IMG} alt="Wallpapers" className="w-full h-full object-cover" />
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[#000] text-[15px] font-[500]">Wallpapers</h3>
              <span className="text-[#000] text-[18px] group-hover:translate-x-1 transition-transform duration-200">↗</span>
            </div>
            <p className="text-[#747474] text-[13px] mt-1">Browse all Wallpapers</p>
          </div>
        </Link>
        <Link href="/guides" className="group block border border-[#EEEEEE] rounded-[12px] overflow-hidden bg-white hover:scale-[1.01] transition-transform duration-200">
          <div className="aspect-[4/3] overflow-hidden">
            <img src={GUIDES_IMG} alt="Guides" className="w-full h-full object-cover" />
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[#000] text-[15px] font-[500]">Guides</h3>
              <span className="text-[#000] text-[18px] group-hover:translate-x-1 transition-transform duration-200">↗</span>
            </div>
            <p className="text-[#747474] text-[13px] mt-1">Browse all Guides</p>
          </div>
        </Link>
        <Link href="/templates" className="group block border border-[#EEEEEE] rounded-[12px] overflow-hidden bg-white hover:scale-[1.01] transition-transform duration-200">
          <div className="aspect-[4/3] overflow-hidden">
            <img src={TEMPLATES_IMG} alt="Templates" className="w-full h-full object-cover" />
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[#000] text-[15px] font-[500]">Templates</h3>
              <span className="text-[#000] text-[18px] group-hover:translate-x-1 transition-transform duration-200">↗</span>
            </div>
            <p className="text-[#747474] text-[13px] mt-1">Browse all Templates</p>
          </div>
        </Link>
      </section>

      <section className="px-6 sm:px-10 py-10 max-w-[1200px] mx-auto border-t border-[#EEEEEE]">
        <h2 className="text-[32px] sm:text-[40px] md:text-[48px] font-[500] tracking-[-1.5px] leading-[1.05] text-[#000] mb-4">
          Refining digital life.
        </h2>
        <p className="text-[#747474] text-[15px] sm:text-[16px] leading-[1.7] max-w-[480px] mb-8">
          Our designs refine workspaces and devices, proving that the simplest details can make the biggest difference in digital life.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {FEATURED_IMGS.map((url, i) => (
            <div key={i} className={`rounded-[10px] overflow-hidden ${i === 0 || i === 1 ? 'col-span-2' : ''}`}>
              <img src={url} alt="" className="w-full h-[200px] sm:h-[260px] object-cover" />
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 sm:px-10 py-10 max-w-[1200px] mx-auto border-t border-[#EEEEEE]">
        <h2 className="text-[28px] sm:text-[36px] md:text-[42px] font-[500] tracking-[-1px] leading-[1.05] text-[#000] mb-2">
          Insights from our blog.
        </h2>
        <p className="text-[#747474] text-[15px] sm:text-[16px] leading-[1.7] mb-8 max-w-[560px]">
          Insights and practical tips to create a clean, functional environment and digital life across devices and workspaces.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {first && (
            <Link href={`/blog/${first.slug}`} className="group block">
              <div className="aspect-[16/10] rounded-[10px] overflow-hidden mb-3">
                <img src={first.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300" />
              </div>
              <p className="text-[#747474] text-[13px]">
                On <span className="font-[500] text-[#000]">{formatDate(first.publishedAt)}</span>
              </p>
              <h3 className="text-[#000] text-[15px] font-[500] mt-0.5 group-hover:underline underline-offset-2">{first.title}</h3>
            </Link>
          )}
          {second && (
            <Link href={`/blog/${second.slug}`} className="group block">
              <div className="aspect-[16/10] rounded-[10px] overflow-hidden mb-3">
                <img src={second.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300" />
              </div>
              <p className="text-[#747474] text-[13px]">
                On <span className="font-[500] text-[#000]">{formatDate(second.publishedAt)}</span>
              </p>
              <h3 className="text-[#000] text-[15px] font-[500] mt-0.5 group-hover:underline underline-offset-2">{second.title}</h3>
            </Link>
          )}
          {third && (
            <Link href={`/blog/${third.slug}`} className="group block">
              <div className="aspect-[16/10] rounded-[10px] overflow-hidden mb-3">
                <img src={third.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300" />
              </div>
              <p className="text-[#747474] text-[13px]">
                On <span className="font-[500] text-[#000]">{formatDate(third.publishedAt)}</span>
              </p>
              <h3 className="text-[#000] text-[15px] font-[500] mt-0.5 group-hover:underline underline-offset-2">{third.title}</h3>
            </Link>
          )}
        </div>
      </section>

      <section className="px-6 sm:px-10 pt-10 pb-20 max-w-[1200px] mx-auto border-t border-[#EEEEEE] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <p className="text-[#747474] text-[14px] sm:text-[15px] leading-[1.7] max-w-[420px]">
          Join for thoughtful insights, exclusive offers, and ideas to create more balanced and functional setups.
        </p>
        <form className="flex flex-row items-center gap-2 shrink-0" onSubmit={handleSubscribe}>
          <input
            type="email"
            placeholder="name@askalm.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-[#EEEEEE] rounded-[8px] h-[44px] px-4 text-[13px] focus:outline-none focus:border-[#000] w-full sm:w-[220px] bg-transparent text-[#000]"
            required
          />
          <button
            type="submit"
            disabled={newsletter.isPending}
            className="bg-[#000] text-white rounded-[8px] h-[44px] px-5 text-[13px] font-[500] hover:bg-[#222] transition-colors whitespace-nowrap disabled:opacity-50"
          >
            {newsletter.isPending ? "Sending..." : newsletter.isSuccess ? "Subscribed!" : "Subscribe"}
          </button>
        </form>
      </section>
    </div>
  );
}