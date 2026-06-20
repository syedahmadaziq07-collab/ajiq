import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useListWallpapers } from "@workspace/api-client-react";
import type { Wallpaper } from "@workspace/api-client-react";
import { optimizeImage } from "../lib/image";
import { staggerContainer, fadeInUpDelayed } from "../lib/animations";

export default function Wallpapers() {
  const { data, isLoading, error } = useListWallpapers();
  const wallpapers = Array.isArray(data) ? data : [];
  const [, setLocation] = useLocation();
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    if (wallpapers.length > 0) {
    
    }
  }, [wallpapers.length]);

  const categories = ["All", ...new Set(wallpapers.map((w: Wallpaper) => w.category))];
  const filtered = activeFilter === "All" ? wallpapers : wallpapers.filter((w: Wallpaper) => w.category === activeFilter);

  useEffect(() => {
    if (wallpapers.length === 0) return;
    const urls = wallpapers.map((w: Wallpaper) => optimizeImage(w.imageUrl, 400));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const idx = Number(entry.target.getAttribute("data-idx"));
          for (let i = 1; i <= 4; i++) {
            const next = idx + i;
            if (next < urls.length) { const img = new Image(); img.src = urls[next]; }
          }
        });
      },
      { rootMargin: "400px" }
    );
    document.querySelectorAll("[data-idx]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [wallpapers.length]);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen pb-20">
        <section className="px-4 sm:px-8 pt-12 pb-8 max-w-[1200px] mx-auto">
          <h1 className="text-[32px] md:text-[48px] font-[700] tracking-[-1.5px] leading-[1.05] text-[#000]">Wallpapers</h1>
        </section>
        <section className="px-4 sm:px-8 max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map((s) => (
              <div key={s} className="border border-[#eee] rounded-[14px] overflow-hidden bg-white">
                <div className="aspect-[4/3] bg-[#f0f0f0] animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-[#f0f0f0] rounded w-3/4 animate-pulse" />
                  <div className="h-3 bg-[#f0f0f0] rounded w-full animate-pulse" />
                  <div className="h-3 bg-[#f0f0f0] rounded w-1/2 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen pb-20">
        <section className="px-4 sm:px-8 pt-12 pb-8 max-w-[1200px] mx-auto">
          <h1 className="text-[32px] md:text-[48px] font-[700] tracking-[-1.5px] leading-[1.05] text-[#000]">Wallpapers</h1>
        </section>
        <section className="px-4 sm:px-8 max-w-[1200px] mx-auto">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-[#747474] text-[16px]">Failed to load wallpapers. Please try again later.</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen pb-20">
      <motion.section
        className="px-4 sm:px-8 pt-12 pb-8 max-w-[1200px] mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="text-[32px] md:text-[48px] font-[700] tracking-[-1.5px] leading-[1.05] text-[#000]">Wallpapers</h1>
      </motion.section>

      <motion.section
        className="px-4 sm:px-8 pb-4 max-w-[1200px] mx-auto flex gap-3 flex-wrap"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {categories.map(filter => (
          <button
            key={filter}
            className={`text-[14px] transition-colors ${activeFilter === filter ? 'text-[#000] font-[600]' : 'text-[#747474] hover:text-[#000]'}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </motion.section>

      <motion.section
        className="px-4 sm:px-8 max-w-[1200px] mx-auto"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
      >
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-[#747474] text-[16px]">No wallpapers found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((w: Wallpaper, i: number) => (
              <motion.div
                key={w.id}
                variants={fadeInUpDelayed}
                custom={i}
                data-idx={i}
                onClick={() => {
                  const navSlug = w.slug || String(w.id);
                  setLocation(`/wallpapers/${navSlug}`);
                }}
                className="group flex flex-col border border-[#eee] rounded-[14px] overflow-hidden bg-white cursor-pointer"
                style={{ contentVisibility: 'auto', containIntrinsicSize: '450px' }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                role="link"
                tabIndex={0}
                onKeyDown={(e: React.KeyboardEvent) => {
                  const navSlug = w.slug || String(w.id);
                  if (e.key === 'Enter') setLocation(`/wallpapers/${navSlug}`);
                }}
              >
                <div className="aspect-[4/3] overflow-hidden bg-[#f5f5f5]">
                  <img src={optimizeImage(w.imageUrl, 400)} alt={w.title} width="400" height="300" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" decoding="async" />
                </div>
                <div className="flex flex-col gap-2 p-4">
                  <p className="text-[16px] font-[600] text-[#000] leading-snug">{w.title}</p>
                  <p className="text-[14px] text-[#747474] mt-1 leading-relaxed line-clamp-2">{w.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    {w.price ? (
                      <span className="text-[16px] font-[700] text-[#000]">${(w.price / 100).toFixed(2)}</span>
                    ) : (
                      <span className="text-[14px] text-[#747474]">Free</span>
                    )}
                    <span className="bg-[#000] text-white rounded-[8px] px-4 py-2 text-[13px] font-[500]">View Wallpaper</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>
    </div>
  );
}
