import { Link } from "wouter";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useListBlogPosts, useSubscribeNewsletter } from "@workspace/api-client-react";
import { optimizeImage, srcset } from "../lib/image";

const API = import.meta.env.VITE_API_URL ?? "";

function resize(url: string, w: number): string {
  return url.includes("?") ? url.replace(/(width=)\d+/, `$1${w}`) : `${url}?width=${w}`;
}

const DEFAULT_FEATURED_IMGS = [
  "https://framerusercontent.com/images/76MGm4VfTnCkUrk3ct1yk3Rpw.jpg?width=400",
  "https://framerusercontent.com/images/dH9sQMFjHqSouYrD2G1zd5Gl5c.jpg?width=400",
  "https://framerusercontent.com/images/r9EnSsRgp8Z5QUmBOV9sui25trU.png?width=400",
  "https://framerusercontent.com/images/iIFMUvpWvCpMv2Saql4IU2p2K0g.png?width=400",
  "https://framerusercontent.com/images/gBGzj4YUttKCw6dDXphjpyvtSDM.png?width=400",
  "https://framerusercontent.com/images/rwOwbd7jG8w83cROgI7MvdeihA.png?width=400",
  "https://framerusercontent.com/images/6MFK0ePJsGglxyIwBOsKeAVWU.jpg?width=400",
  "https://framerusercontent.com/images/DXWQczEsbDwS0U9pVPEzF4rvM.jpg?width=400",
];
const FALLBACK_POSTS = [
  {
    title: "Ergonomic Essentials: Comfort Meets Productivity",
    slug: "ergonomic-essentials-comfort-meets-productivity",
    imageUrl: "https://framerusercontent.com/images/dVyW0kMnnDotk1u5hwmW8b7Rqo.png?width=800&height=504",
    publishedAt: "2026-02-02T00:00:00.000Z",
  },
  {
    title: "5 Color Palettes for Your Workspace",
    slug: "color-palettes-for-your-workspace",
    imageUrl: "https://framerusercontent.com/images/CjRZ7Bi4Hwr2Tgg9Vyp3aaQQGA.png?width=800&height=504",
    publishedAt: "2026-01-12T00:00:00.000Z",
  },
  {
    title: "Optimizing Wall Space Around Your Desk",
    slug: "optimizing-wall-space-around-your-desk",
    imageUrl: "https://framerusercontent.com/images/hcUrluPToM9nbVrcIY7yVNNFDk.png?width=800&height=504",
    publishedAt: "2026-01-05T00:00:00.000Z",
  },
];

function featuredImgs(settings: Record<string, string>): string[] {
  const imgs: string[] = [];
  for (let i = 1; i <= 8; i++) {
    const key = `featured_image_${i}`;
    imgs.push(settings[key] || DEFAULT_FEATURED_IMGS[i - 1]);
  }
  return imgs;
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

  const DEFAULT_WALLPAPERS_IMG = "https://framerusercontent.com/images/edkUWDLREszDiq4vgt975wDDFM.jpg?width=400";
  const DEFAULT_GUIDES_IMG = "https://framerusercontent.com/images/DTNpaBh0Djuey5Ql5HpaJWi3lWg.jpg?width=400";
  const DEFAULT_TEMPLATES_IMG = "https://framerusercontent.com/images/KkKh1T6zK6twdxDPmlYsFJTj6lg.jpg?width=400";
  const WALLPAPERS_IMG = resize(settings.wallpapers_image || DEFAULT_WALLPAPERS_IMG, 400);
  const GUIDES_IMG = resize(settings.guides_image || DEFAULT_GUIDES_IMG, 400);
  const TEMPLATES_IMG = resize(settings.templates_image || DEFAULT_TEMPLATES_IMG, 400);
  const FEATURED_IMGS = featuredImgs(settings).map((u) => resize(u, 400));
  const HERO_HEADING = settings.hero_heading || "Wallp.";
  const HERO_SUBTEXT = settings.hero_subtext || "At Wallp., we craft simple essentials that make every workspace inspiring and every device more productive.";
  const FEATURED_HEADING = settings.featured_heading || "Refining digital life.";
  const FEATURED_DESC = settings.featured_description || "Our designs refine workspaces and devices, proving that the simplest details can make the biggest difference in digital life.";
  const BLOG_HEADING = settings.blog_heading || "Insights from our blog.";
  const BLOG_DESC = settings.blog_description || "Insights and practical tips to create a clean, functional environment and digital life across devices and workspaces.";
  const NEWSLETTER_TEXT = settings.newsletter_text || "Join for thoughtful insights, exclusive offers, and ideas to create more balanced and functional setups.";
  const WALLPAPERS_LABEL = settings.wallpapers_label || "Wallpapers";
  const WALLPAPERS_DESC = settings.wallpapers_desc || "Browse all Wallpapers";
  const GUIDES_LABEL = settings.guides_label || "Guides";
  const GUIDES_DESC = settings.guides_desc || "Browse all Guides";
  const TEMPLATES_LABEL = settings.templates_label || "Templates";
  const TEMPLATES_DESC = settings.templates_desc || "Browse all Templates";


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
          {HERO_HEADING}
        </motion.h1>
        <motion.p
          className="text-[#747474] text-[15px] sm:text-[21px] md:text-[24px] font-[500] leading-[1.2] max-w-[600px] mt-6"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", damping: 60, stiffness: 400, delay: 0.75 }}
        >
          {HERO_SUBTEXT}
        </motion.p>
      </section>

      <section className="px-6 sm:px-10 pb-10 max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-5 overflow-hidden">
        {[
          { href: "/wallpapers", label: WALLPAPERS_LABEL, desc: WALLPAPERS_DESC, img: WALLPAPERS_IMG },
          { href: "/guides", label: GUIDES_LABEL, desc: GUIDES_DESC, img: GUIDES_IMG },
          { href: "/templates", label: TEMPLATES_LABEL, desc: TEMPLATES_DESC, img: TEMPLATES_IMG },
        ].map((cat) => (
          <div key={cat.href}>
            <Link href={cat.href} className="group block relative rounded-[16px] overflow-hidden bg-[#fafafa]">
              <div className="pt-[55px] px-[25px] pb-[30px] flex flex-col gap-[27px]">
                <div className="h-[262px] pt-[10px] pb-[10px] px-[15px] flex items-center justify-center overflow-visible">
                  <img src={optimizeImage(cat.img, 400)} srcSet={srcset(cat.img)} sizes="(max-width: 640px) 100vw, 33vw" alt={cat.label} width="308" height="247" loading="lazy" decoding="async" className="w-[308px] h-[247px] object-contain bg-[#f5f5f5]" />
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
            </div>
          ))}
        </section>

      <section className="px-6 sm:px-10 py-10 max-w-[1200px] mx-auto border-t border-[#EEEEEE] overflow-hidden">
        <h2 className="text-[32px] sm:text-[40px] md:text-[48px] font-[500] tracking-[-1.5px] leading-[1.05] text-[#000] mb-4">
          {FEATURED_HEADING}
        </h2>
        <p className="text-[#747474] text-[15px] sm:text-[16px] leading-[1.7] max-w-[480px] mb-8">
          {FEATURED_DESC}
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
                      src={optimizeImage(url, 400)}
                      srcSet={srcset(url)}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      alt=""
                      width="400"
                      height="400"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05] bg-[#f5f5f5]"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="px-6 sm:px-10 pt-[100px] pb-0 max-w-[1240px] mx-auto overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[35px] sm:gap-10 mb-[50px] sm:mb-[70px]">
          <h2 className="text-[44px] sm:text-[31px] lg:text-[54px] font-[600] tracking-[-0.03em] leading-[1.6] text-[#000]">
            {BLOG_HEADING}
          </h2>
          <p className="text-[#747474] text-[15px] sm:text-[19px] font-[600] tracking-[-0.03em] leading-[1.6] max-w-[620px] shrink-0">
            {BLOG_DESC}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" style={{ gridAutoRows: 'minmax(0, 1fr)' }}>
          {first && (
            <Link href={`/blog/${first.slug}`} className="group block rounded-[18px] overflow-hidden">
              <div className="aspect-[4/3] w-full p-[9px]">
                <div className="w-full h-full border-[3px] border-white/40 rounded-[10px] overflow-hidden">
                  {first.imageUrl ? (
                    <img src={optimizeImage(first.imageUrl, 400)} srcSet={srcset(first.imageUrl)} sizes="(max-width: 640px) 100vw, 50vw" alt="" width="800" height="600" loading="lazy" decoding="async" className="w-full h-full object-cover bg-[#f5f5f5]" />
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
                    <img src={optimizeImage(second.imageUrl, 400)} srcSet={srcset(second.imageUrl)} sizes="(max-width: 640px) 100vw, 50vw" alt="" width="800" height="600" loading="lazy" decoding="async" className="w-full h-full object-cover bg-[#f5f5f5]" />
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
                    <img src={optimizeImage(third.imageUrl, 400)} srcSet={srcset(third.imageUrl)} sizes="(max-width: 640px) 100vw, 50vw" alt="" width="800" height="600" loading="lazy" decoding="async" className="w-full h-full object-cover bg-[#f5f5f5]" />
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

      <section className="px-6 sm:px-10 pt-10 pb-20 max-w-[1240px] mx-auto border-t border-[#EEEEEE] flex flex-col sm:flex-row sm:items-center justify-between gap-6 overflow-hidden">
        <p className="text-[#747474] text-[15px] sm:text-[19px] font-[600] tracking-[-0.03em] leading-[1.6] max-w-[420px]">
          {NEWSLETTER_TEXT}
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