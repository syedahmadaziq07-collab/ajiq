import { useEffect, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useListTemplates } from "@workspace/api-client-react";
import type { Template } from "@workspace/api-client-react";
import { optimizeImage } from "../lib/image";

export default function Templates() {
  const { data, isLoading, error } = useListTemplates();
  const templates = Array.isArray(data) ? data : [];
  const [activeFilter, setActiveFilter] = useState("All");

  const categories = ["All", ...new Set(templates.map((t: Template) => t.category))];
  const filtered = activeFilter === "All" ? templates : templates.filter((t: Template) => t.category === activeFilter);

  useEffect(() => {
    if (filtered.length === 0) return;
    const urls = filtered.map((t: Template) => optimizeImage(t.imageUrl, 400));
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
  }, [filtered.length]);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen pb-20">
        <div className="max-w-[1400px] mx-auto px-12 pt-12">
          <h1 className="text-[clamp(80px,12vw,160px)] font-[900] leading-[0.9] tracking-[-2px] text-[#000] mb-20">Templates</h1>
          <div className="flex flex-col gap-2 mb-12">
            {[1,2,3].map((s) => (
              <div key={s} className="h-6 bg-[#f0f0f0] rounded w-20 animate-pulse" />
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map((s) => (
              <div key={s} className="bg-[#F2F2F2] rounded-[12px] overflow-hidden">
                <div className="h-[300px] bg-[#e8e8e8] animate-pulse" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-[#e0e0e0] rounded w-1/2 animate-pulse" />
                  <div className="h-3 bg-[#e0e0e0] rounded w-3/4 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen pb-20">
        <div className="max-w-[1400px] mx-auto px-12 pt-12">
          <h1 className="text-[clamp(80px,12vw,160px)] font-[900] leading-[0.9] tracking-[-2px] text-[#000] mb-20">Templates</h1>
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-[#747474] text-[16px]">Failed to load templates. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen pb-20">
      <div className="max-w-[1400px] mx-auto px-12 pt-12">
        <motion.h1
          className="text-[clamp(80px,12vw,160px)] font-[900] leading-[0.9] tracking-[-2px] text-[#000] mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          Templates
        </motion.h1>

        {/* Vertical Category Filter */}
        <motion.div
          className="flex flex-col gap-2 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          {categories.map(filter => (
            <button
              key={filter}
              className={`text-left text-[28px] transition-colors ${
                activeFilter === filter
                  ? "text-[#000] font-[600]"
                  : "text-[#999] font-[400] hover:text-[#000]"
              }`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
        >
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-[#747474] text-[16px]">No templates found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((t: Template, i: number) => (
                <motion.div
                  key={t.id}
                  data-idx={i}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
                  }}
                  style={{ contentVisibility: 'auto', containIntrinsicSize: '440px' }}
                >
                  <Link href={`/templates/${t.slug}`} className="group block no-underline">
                    <motion.div
                      className="bg-[#F2F2F2] rounded-[12px] overflow-hidden"
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                      {/* Image area with text overlay */}
                      <div className="relative h-[300px] overflow-hidden">
                        <img
                          src={optimizeImage(t.imageUrl, 400)}
                          alt={t.title}
                          width="400"
                          height="300"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                          decoding="async"
                        />
                        <h3
                          className="absolute bottom-4 left-4 z-[2] text-[clamp(40px,6vw,72px)] font-[800] leading-[0.9] text-[#000]"
                          style={{ textWrap: 'pretty' }}
                        >
                          {t.title}
                        </h3>
                      </div>

                      {/* Card bottom */}
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[16px] font-[500] text-[#000]">{t.title}</span>
                          <span className="text-[16px] font-[400] text-[#000] shrink-0 ml-4">
                            {t.price ? `$${(t.price / 100).toFixed(2)}` : "Free"}
                          </span>
                        </div>
                        {t.description && (
                          <p className="text-[13px] text-[#888] leading-relaxed line-clamp-2">
                            {t.description}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
