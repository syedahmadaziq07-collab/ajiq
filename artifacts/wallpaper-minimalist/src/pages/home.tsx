import { Link } from "wouter";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useListBlogPosts, useSubscribeNewsletter } from "@workspace/api-client-react";
import { useScrollReveal } from "../lib/use-scroll-reveal";

const API = import.meta.env.VITE_API_URL ?? "";

const DEFAULT_WALLPAPERS_IMG = "https://framerusercontent.com/images/edkUWDLREszDiq4vgt975wDDFM.jpg";
const DEFAULT_GUIDES_IMG = "https://framerusercontent.com/images/DTNpaBh0Djuey5Ql5HpaJWi3lWg.jpg";
const DEFAULT_TEMPLATES_IMG = "https://framerusercontent.com/images/KkKh1T6zK6twdxDPmlYsFJTj6lg.jpg";
const DEFAULT_FEATURED_IMGS = [
  "https://framerusercontent.com/images/76MGm4VfTnCkUrk3ct1yk3Rpw.jpg",
  "https://framerusercontent.com/images/dH9sQMFjHqSouYrD2G1zd5Gl5c.jpg",
  "https://framerusercontent.com/images/r9EnSsRgp8Z5QUmBOV9sui25trU.png",
  "https://framerusercontent.com/images/iIFMUvpWvCpMv2Saql4IU2p2K0g.png",
  "https://framerusercontent.com/images/gBGzj4YUttKCw6dDXphjpyvtSDM.png",
  "https://framerusercontent.com/images/rwOwbd7jG8w83cROgI7MvdeihA.png",
  "https://framerusercontent.com/images/6MFK0ePJsGglxyIwBOsKeAVWU.jpg",
  "https://framerusercontent.com/images/DXWQczEsbDwS0U9pVPEzF4rvM.jpg",
];

const FALLBACK_POSTS = [
  {
    title: "Ergonomic Essentials: Comfort Meets Productivity",
    slug: "ergonomic-essentials-comfort-meets-productivity",
    imageUrl: "https://framerusercontent.com/images/dVyW0kMnnDotk1u5hwmW8b7Rqo.png?width=3000&height=1890",
    publishedAt: "2026-02-02T00:00:00.000Z",
  },
  {
    title: "5 Color Palettes for Your Workspace",
    slug: "color-palettes-for-your-workspace",
    imageUrl: "https://framerusercontent.com/images/CjRZ7Bi4Hwr2Tgg9Vyp3aaQQGA.png?width=3000&height=1890",
    publishedAt: "2026-01-12T00:00:00.000Z",
  },
  {
    title: "Optimizing Wall Space Around Your Desk",
    slug: "optimizing-wall-space-around-your-desk",
    imageUrl: "https://framerusercontent.com/images/hcUrluPToM9nbVrcIY7yVNNFDk.png?width=3000&height=1890",
    publishedAt: "2026-01-05T00:00:00.000Z",
  },
];

function parseFeatured(raw: string | undefined): string[] {
  if (!raw) return DEFAULT_FEATURED_IMGS;
  try { const arr = JSON.parse(raw); return Array.isArray(arr) && arr.length === 8 ? arr : DEFAULT_FEATURED_IMGS; } catch { return DEFAULT_FEATURED_IMGS; }
}

export default function Home() {
  const { data: blogPosts } = useListBlogPosts();
  const newsletter = useSubscribeNewsletter();
  const [email, setEmail] = useState("");
  const [settings, setSettings] = useState<Record<string, string>>({});

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    newsletter.mutate({ data: { email } }, { onSuccess: () => setEmail("") });
  };

  useEffect(() => {
    fetch(`${API}/api/settings`)
      .then((r) => { if (r.ok) return r.json(); throw new Error("failed"); })
      .then(setSettings)
      .catch(() => {});
  }, []);

  const WALLPAPERS_IMG = settings.wallpapers_image || DEFAULT_WALLPAPERS_IMG;
  const GUIDES_IMG = settings.guides_image || DEFAULT_GUIDES_IMG;
  const TEMPLATES_IMG = settings.templates_image || DEFAULT_TEMPLATES_IMG;
  const FEATURED_IMGS = parseFeatured(settings.featured_images);

  const heroReveal = useScrollReveal();
  const catsReveal = useScrollReveal();
  const featuredReveal = useScrollReveal();
  const blogReveal = useScrollReveal();
  const newsletterReveal = useScrollReveal();

  const posts = (Array.isArray(blogPosts) && blogPosts.length ? blogPosts : FALLBACK_POSTS).slice(0, 3);
  const [first, second, third] = posts.length === 3 ? posts : [];

  function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  return (
    <div className="w-full min-h-screen">
      <section className="pt-[79px] pb-[13px] px-6 sm:px-10 md:pt-[128px] md:pb-[51px] max-w-[1200px] mx-auto overflow-hidden">
        <motion.h1
          className="text-[93px] sm:text-[195px] md:text-[335px] font-[600] tracking-[-0.06em] leading-[0.9] text-[#000]"
          initial={{ y: 200, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", damping: 80, stiffness: 400 }}
        >
          Wallp.
        </motion.h1>
        <motion.p
          className="text-[#747474] text-[15px] sm:text-[21px] md:text-[24px] font-[500] leading-[1.2] max-w-[600px] mt-6"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", damping: 60, stiffness: 400, delay: 0.75 }}
        >
          At Wallp., we craft simple essentials that make every workspace inspiring and every device more productive.
        </motion.p>
      </section>

      <section ref={catsReveal.ref} className={`px-6 sm:px-10 pb-10 max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-5 overflow-hidden scroll-reveal ${catsReveal.visible ? "visible" : ""}`}>
        {[
          { href: "/wallpapers", label: "Wallpapers", desc: "Browse all Wallpapers", img: WALLPAPERS_IMG, delay: 0 },
          { href: "/guides", label: "Guides", desc: "Browse all Guides", img: GUIDES_IMG, delay: 0.1 },
          { href: "/templates", label: "Templates", desc: "Browse all Templates", img: TEMPLATES_IMG, delay: 0.2 },
        ].map((cat) => (
          <motion.div
            key={cat.href}
            initial={{ y: 200, opacity: 0 }}
            animate={catsReveal.visible ? { y: 0, opacity: 1 } : {}}
            transition={{ type: "spring", damping: 60, stiffness: 400, delay: cat.delay }}
          >
            <Link href={cat.href} className="group block relative rounded-[16px] overflow-hidden bg-[#fafafa]">
              <div className="pt-[55px] px-[25px] pb-[30px] flex flex-col gap-[27px]">
                <div className="h-[262px] pt-[10px] pb-[10px] px-[15px] flex items-center justify-center overflow-visible">
                  <img src={cat.img} alt={cat.label} width="308" height="247" loading="lazy" decoding="async" className="w-[308px] h-[247px] object-contain" />
                </div>
                <div>
                  <h3 className="text-[#000] text-[15px] font-[600] tracking-[-0.02em]">{cat.label}</h3>
                  <p className="text-[#747474] text-[9px] font-[500] mt-0.5">{cat.desc}</p>
                </div>
              </div>
              <div className="absolute top-[18px] right-[18px] bg-white rounded-[15px] p-[11px] shadow-[0_4px_22.7px_0_rgba(0,0,0,0.07)] flex items-center justify-center" style={{ width: '32px', height: '32px' }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ transform: 'rotate(-90deg)' }}>
                  <path d="M5 0L5 8M5 8L1 4M5 8L9 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </Link>
          </motion.div>
        ))}
      </section>

      <section ref={featuredReveal.ref} className={`px-6 sm:px-10 py-10 max-w-[1200px] mx-auto border-t border-[#EEEEEE] overflow-hidden scroll-reveal ${featuredReveal.visible ? "visible" : ""}`}>
        <h2 className="text-[32px] sm:text-[40px] md:text-[48px] font-[500] tracking-[-1.5px] leading-[1.05] text-[#000] mb-4">
          Refining digital life.
        </h2>
        <p className="text-[#747474] text-[15px] sm:text-[16px] leading-[1.7] max-w-[480px] mb-8">
          Our designs refine workspaces and devices, proving that the simplest details can make the biggest difference in digital life.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridAutoRows: '1fr', gap: '20px', padding: '8px' }}>
          {FEATURED_IMGS.map((url, i) => {
            const colSpan = i === 0 ? 2 : i === 7 ? 2 : 1;
            const rowSpan = i === 0 ? 2 : 1;
            return (
              <div
                key={i}
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  gridColumn: `span ${colSpan}`,
                  gridRow: `span ${rowSpan}`,
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '18px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                  contentVisibility: 'auto',
                }}
                className="group"
              >
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '100%', height: '100%', borderRadius: '16px', overflow: 'hidden' }}>
                    <img
                      src={url}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05] will-change-transform"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section ref={blogReveal.ref} className={`px-6 sm:px-10 pt-[100px] pb-0 max-w-[1240px] mx-auto overflow-hidden scroll-reveal ${blogReveal.visible ? "visible" : ""}`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[35px] sm:gap-10 mb-[50px] sm:mb-[70px]">
          <h2 className="text-[44px] sm:text-[31px] lg:text-[54px] font-[600] tracking-[-0.03em] leading-[1.6] text-[#000]">
            Insights from our blog.
          </h2>
          <p className="text-[#747474] text-[15px] sm:text-[19px] font-[600] tracking-[-0.03em] leading-[1.6] max-w-[620px] shrink-0">
            Insights and practical tips to create a clean, functional environment and digital life across devices and workspaces.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" style={{ gridAutoRows: 'minmax(0, 1fr)' }}>
          {first && (
            <Link href={`/blog/${first.slug}`} className="group block rounded-[18px] overflow-hidden">
              <div className="aspect-[4/3] w-full p-[9px]">
                <div className="w-full h-full border-[3px] border-white/40 rounded-[10px] overflow-hidden">
                  {first.imageUrl ? (
                    <img src={first.imageUrl} alt="" width="800" height="600" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#f0f0f0] to-[#e0e0e0]" />
                  )}
                </div>
              </div>
              <div className="px-[25px] pt-[7px] pb-[25px] flex flex-col gap-5">
                <p className="text-[15px] sm:text-[14px] lg:text-[15px] font-[500] tracking-[-0.03em] leading-[1.2] text-[#545454]">
                  On <span className="text-[#000]">{formatDate(first.publishedAt)}</span>
                </p>
                <h3 className="text-[#000] text-[23px] font-[600] tracking-[-0.02em] leading-[1.4]">{first.title}</h3>
              </div>
            </Link>
          )}
          {second && (
            <Link href={`/blog/${second.slug}`} className="group block rounded-[18px] overflow-hidden">
              <div className="aspect-[4/3] w-full p-[9px]">
                <div className="w-full h-full border-[3px] border-white/40 rounded-[10px] overflow-hidden">
                  {second.imageUrl ? (
                    <img src={second.imageUrl} alt="" width="800" height="600" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#f0f0f0] to-[#e0e0e0]" />
                  )}
                </div>
              </div>
              <div className="px-[25px] pt-[7px] pb-[25px] flex flex-col gap-5">
                <p className="text-[15px] sm:text-[14px] lg:text-[15px] font-[500] tracking-[-0.03em] leading-[1.2] text-[#545454]">
                  On <span className="text-[#000]">{formatDate(second.publishedAt)}</span>
                </p>
                <h3 className="text-[#000] text-[23px] font-[600] tracking-[-0.02em] leading-[1.4]">{second.title}</h3>
              </div>
            </Link>
          )}
          {third && (
            <Link href={`/blog/${third.slug}`} className="group block rounded-[18px] overflow-hidden">
              <div className="aspect-[4/3] w-full p-[9px]">
                <div className="w-full h-full border-[3px] border-white/40 rounded-[10px] overflow-hidden">
                  {third.imageUrl ? (
                    <img src={third.imageUrl} alt="" width="800" height="600" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#f0f0f0] to-[#e0e0e0]" />
                  )}
                </div>
              </div>
              <div className="px-[25px] pt-[7px] pb-[25px] flex flex-col gap-5">
                <p className="text-[15px] sm:text-[14px] lg:text-[15px] font-[500] tracking-[-0.03em] leading-[1.2] text-[#545454]">
                  On <span className="text-[#000]">{formatDate(third.publishedAt)}</span>
                </p>
                <h3 className="text-[#000] text-[23px] font-[600] tracking-[-0.02em] leading-[1.4]">{third.title}</h3>
              </div>
            </Link>
          )}
        </div>
      </section>

      <section ref={newsletterReveal.ref} className={`px-6 sm:px-10 pt-10 pb-20 max-w-[1240px] mx-auto border-t border-[#EEEEEE] flex flex-col sm:flex-row sm:items-center justify-between gap-6 overflow-hidden scroll-reveal ${newsletterReveal.visible ? "visible" : ""}`}>
        <p className="text-[#747474] text-[15px] sm:text-[19px] font-[600] tracking-[-0.03em] leading-[1.6] max-w-[420px]">
          Join for thoughtful insights, exclusive offers, and ideas to create more balanced and functional setups.
        </p>
        <form className="flex flex-row items-center gap-2 shrink-0" onSubmit={handleSubscribe}>
          <input
            type="email"
            placeholder="name@email.com"
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