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
        <section className="px-4 sm:px-8 pt-16 max-w-[1200px] mx-auto">
          <h1 className="text-[72px] sm:text-[96px] font-[800] tracking-[-3px] leading-[0.9] text-[#000]">Templates</h1>
        </section>
        <section className="px-4 sm:px-8 max-w-[1200px] mx-auto mt-8 flex gap-10">
          <div className="hidden sm:flex flex-col gap-2 w-[120px] shrink-0">
            {[1,2,3].map((s) => (
              <div key={s} className="h-5 bg-[#f0f0f0] rounded w-16 animate-pulse" />
            ))}
          </div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map((s) => (
              <div key={s} className="bg-[#f5f5f5] rounded-[16px] overflow-hidden">
                <div className="aspect-[4/3] bg-[#e8e8e8] animate-pulse" />
                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#e0e0e0] animate-pulse shrink-0" />
                    <div className="h-4 bg-[#e0e0e0] rounded w-1/2 animate-pulse" />
                  </div>
                  <div className="h-3 bg-[#e0e0e0] rounded w-3/4 animate-pulse" />
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
        <section className="px-4 sm:px-8 pt-16 max-w-[1200px] mx-auto">
          <h1 className="text-[72px] sm:text-[96px] font-[800] tracking-[-3px] leading-[0.9] text-[#000]">Templates</h1>
        </section>
        <section className="px-4 sm:px-8 max-w-[1200px] mx-auto mt-8">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-[#747474] text-[16px]">Failed to load templates. Please try again later.</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen pb-20">
      <motion.section
        className="px-4 sm:px-8 pt-16 max-w-[1200px] mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="text-[72px] sm:text-[96px] font-[800] tracking-[-3px] leading-[0.9] text-[#000]">Templates</h1>
      </motion.section>

      <div className="px-4 sm:px-8 max-w-[1200px] mx-auto mt-8 flex gap-10">
        {/* Vertical Category Filter */}
        <motion.aside
          className="hidden sm:flex flex-col gap-2 w-[120px] shrink-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          {categories.map(filter => (
            <button
              key={filter}
              className={`text-left text-[15px] transition-colors py-0.5 ${
                activeFilter === filter
                  ? "text-[#000] font-[600]"
                  : "text-[#aaa] hover:text-[#000]"
              }`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </motion.aside>

        {/* Mobile Category Filter (horizontal) */}
        <motion.div
          className="sm:hidden flex gap-3 flex-wrap mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          {categories.map(filter => (
            <button
              key={filter}
              className={`text-[14px] transition-colors ${
                activeFilter === filter ? "text-[#000] font-[600]" : "text-[#aaa] hover:text-[#000]"
              }`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <motion.section
          className="flex-1"
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
                  style={{ contentVisibility: 'auto', containIntrinsicSize: '420px' }}
                >
                  <Link href={`/templates/${t.slug}`} className="group block no-underline">
                    <div className="bg-[#F5F5F5] rounded-[16px] overflow-hidden transition-transform duration-300 ease-out group-hover:scale-[1.02]">
                      {/* Image with text overlay */}
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={optimizeImage(t.imageUrl, 400)}
                          alt={t.title}
                          width="400"
                          height="300"
                          className="w-full h-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                        <h3 className="absolute bottom-4 left-4 text-[22px] sm:text-[26px] font-[700] text-white leading-tight">
                          {t.title}
                        </h3>
                      </div>

                      {/* Thumbnail + Name + Price row */}
                      <div className="flex items-center gap-3 px-4 pt-4 pb-1">
                        <img
                          src={optimizeImage(t.imageUrl, 80)}
                          alt=""
                          width="32"
                          height="32"
                          className="w-8 h-8 rounded-full object-cover shrink-0"
                          loading="lazy"
                          decoding="async"
                        />
                        <span className="text-[15px] font-[600] text-[#000] truncate">{t.title}</span>
                        <span className="ml-auto text-[14px] font-[600] text-[#000] shrink-0">
                          {t.price ? `$${(t.price / 100).toFixed(2)}` : "Free"}
                        </span>
                      </div>

                      {/* Description */}
                      {t.description && (
                        <p className="px-4 pb-4 pt-1 text-[13px] text-[#747474] leading-relaxed line-clamp-2">
                          {t.description}
                        </p>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
}
