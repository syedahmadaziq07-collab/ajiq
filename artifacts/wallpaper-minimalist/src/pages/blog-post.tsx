import { useParams, Link } from "wouter";

import { useGetBlogPost } from "@workspace/api-client-react";
import { optimizeImage } from "../lib/image";
const FALLBACK: Record<string, { title: string; imageUrl: string; publishedAt: string; author: string; content: string }> = {
  "ergonomic-essentials-comfort-meets-productivity": {
    title: "Ergonomic Essentials: Comfort Meets Productivity",
    imageUrl: "https://framerusercontent.com/images/dVyW0kMnnDotk1u5hwmW8b7Rqo.png?width=3000&height=1890",
    publishedAt: "2026-02-02T00:00:00.000Z",
    author: "Wallp.",
    content: "Your workspace should work for you — not the other way around. Yet so many of us spend hours at desks that leave us with aching necks, tired eyes, and sore wrists.\n\nThe good news? You don't need a complete office overhaul. A few strategic swaps can turn your setup into an ergonomic haven that boosts both comfort and productivity.\n\nStart with your chair. Look for one with lumbar support, adjustable height, and armrests that let your shoulders relax. Your feet should rest flat on the floor with knees at a 90-degree angle.\n\nNext, position your monitor at arm's length, with the top of the screen at or just below eye level. This prevents that forward-head posture that leads to neck strain.\n\nYour keyboard and mouse should sit at a height that keeps your elbows at a 90-degree angle and your wrists straight. Consider a keyboard tray if your desk is too high.\n\nDon't forget lighting. Position your screen perpendicular to windows to reduce glare, and use a desk lamp that illuminates your work without casting shadows.\n\nFinally, move. No chair is good enough to sit in for eight hours straight. Set a timer to stand, stretch, or walk for five minutes every hour.\n\nSmall changes lead to big results. Your body — and your output — will thank you.",
  },
  "color-palettes-for-your-workspace": {
    title: "5 Color Palettes for Your Workspace",
    imageUrl: "https://framerusercontent.com/images/CjRZ7Bi4Hwr2Tgg9Vyp3aaQQGA.png?width=3000&height=1890",
    publishedAt: "2026-01-12T00:00:00.000Z",
    author: "Wallp.",
    content: "Color has a powerful effect on our mood, focus, and creativity. The right palette can transform a bland desk into a space that energizes you every time you sit down.\n\nHere are five color palettes that work beautifully in a workspace:\n\n1. Monochrome Minimal — Charcoal, warm grey, and white. Clean, calm, and timeless. Perfect for deep focus work.\n\n2. Earthy Tones — Terracotta, olive green, sand, and cream. Grounding and warm, these colors bring a natural feel to any room.\n\n3. Navy & Brass — Deep navy walls or accessories paired with warm brass accents. Sophisticated and confidence-inspiring.\n\n4. Soft Pastels — Blush pink, powder blue, and mint. Gentle on the eyes and surprisingly effective at keeping your mood light.\n\n5. Bold Accent Wall — A single vibrant wall (think deep teal or rich burgundy) with neutral furniture. Maximum impact with minimal commitment.\n\nStick to 2-3 main colors and use the 60-30-10 rule: 60% dominant color, 30% secondary, 10% accent. This creates visual balance without overwhelming the space.\n\nYour workspace should reflect your personality. Experiment, take risks, and find the palette that makes you feel most productive.",
  },
  "optimizing-wall-space-around-your-desk": {
    title: "Optimizing Wall Space Around Your Desk",
    imageUrl: "https://framerusercontent.com/images/hcUrluPToM9nbVrcIY7yVNNFDk.png?width=3000&height=1890",
    publishedAt: "2026-01-05T00:00:00.000Z",
    author: "Wallp.",
    content: "When floor space is limited, your walls become your most valuable real estate. A well-organized wall setup can reduce clutter, improve workflow, and make your desk area feel twice as large.\n\nStart with a pegboard. It's versatile, affordable, and lets you rearrange tools and accessories in seconds. Use hooks for headphones, small shelves for plants or books, and cups for pens and scissors.\n\nFloating shelves are another game-changer. Install one or two above your monitor to hold reference books, speakers, or decorative pieces. Keep frequently used items within arm's reach.\n\nA monitor arm frees up desk space by lifting your screen off the surface. It also lets you adjust your screen height and angle effortlessly.\n\nMagnetic strips are perfect for small metal items like scissors, rulers, and cable clips. Stick one on the wall beside your desk for instant access.\n\nDon't forget cable management. Use adhesive cable clips along the wall or under your desk to keep cords organized and out of sight.\n\nFinally, add personal touches. A small framed print, a plant, or a postcard pinned to the wall makes the space feel yours.\n\nYour walls can do more than hold paint. Use them wisely, and your desk will feel lighter, cleaner, and more focused.",
  },
};

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading } = useGetBlogPost(slug);
  const fallback = slug ? FALLBACK[slug] : undefined;

  const display = post || fallback;

  if (isLoading && !fallback) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p className="text-[#747474]">Loading...</p>
      </div>
    );
  }

  if (!display) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-[#747474]">Post not found</p>
        <Link href="/blog" className="text-[#000] underline underline-offset-2">Back to Blog</Link>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen pb-12">
      <section className="px-4 sm:px-8 pt-12 pb-8 max-w-[720px] mx-auto">
        <Link href="/blog" className="text-[#747474] text-[13px] hover:underline underline-offset-2">&larr; Back to Blog</Link>
        <h1 className="text-[32px] md:text-[48px] font-[700] tracking-[-1.5px] leading-[1.05] text-[#000] mt-6">
          {display.title}
        </h1>
        <p className="text-[#747474] text-[14px] mt-3">
          {(() => { const d = new Date(display.publishedAt); return isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }); })()} &middot; By {display.author}
        </p>
      </section>

      {display.imageUrl && (
        <section className="px-4 sm:px-8 pb-8 max-w-[900px] mx-auto">
          <div className="w-full aspect-[16/9] rounded-[12px] overflow-hidden bg-gradient-to-b from-[#e0e0e0] to-[#b0b0b0]">
            <img src={optimizeImage(display.imageUrl, 900)} alt={display.title} width="16" height="9" loading="lazy" decoding="async" className="w-full h-full object-cover" />
          </div>
        </section>
      )}

      <section className="px-4 sm:px-8 max-w-[720px] mx-auto">
        <div className="text-[16px] leading-[1.8] text-[#000] space-y-4">
          {(display.content || "").split("\n").map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>
    </div>
  );
}
