import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useListTemplates } from "@workspace/api-client-react";
import type { Template } from "@workspace/api-client-react";
import { optimizeImage } from "../lib/image";

const PAGE_SIZE = 12;

function TemplateCard({ template, idx }: { template: Template; idx: number }) {
  return (
    <div
      data-idx={idx}
      style={{ contentVisibility: 'auto', containIntrinsicSize: '440px' }}
    >
      <Link href={`/templates/${template.slug}`} className="group block no-underline">
        <div className="bg-[#F2F2F2] rounded-[12px] overflow-hidden hover:-translate-y-1 transition-all duration-200">
          <div className="relative h-[300px] overflow-hidden">
            <img
              src={optimizeImage(template.imageUrl, 400)}
              alt={template.title}
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
              {template.title}
            </h3>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[16px] font-[500] text-[#000]">{template.title}</span>
              <span className="text-[16px] font-[400] text-[#000] shrink-0 ml-4">
                {template.price ? `$${(template.price / 100).toFixed(2)}` : "Free"}
              </span>
            </div>
            {template.description && (
              <p className="text-[13px] text-[#888] leading-relaxed line-clamp-2">
                {template.description}
              </p>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function Templates() {
  const { data, isLoading, error } = useListTemplates();
  const templates = Array.isArray(data) ? data : [];
  const [activeFilter, setActiveFilter] = useState("All");
  const [showCount, setShowCount] = useState(PAGE_SIZE);

  const categories = ["All", ...new Set(templates.map((t: Template) => t.category))];
  const filtered = activeFilter === "All" ? templates : templates.filter((t: Template) => t.category === activeFilter);
  const visible = filtered.slice(0, showCount);

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

        <div className="flex flex-col gap-2 mb-12">
          {categories.map(filter => (
            <button
              key={filter}
              className={`text-left text-[28px] transition-colors ${
                activeFilter === filter
                  ? "text-[#000] font-[600]"
                  : "text-[#999] font-[400] hover:text-[#000]"
              }`}
              onClick={() => { setActiveFilter(filter); setShowCount(PAGE_SIZE); }}
            >
              {filter}
            </button>
          ))}
        </div>

        <div>
          {visible.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-[#747474] text-[16px]">No templates found in this category.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {visible.map((t: Template, i: number) => (
                  <TemplateCard key={t.id} template={t} idx={i} />
                ))}
              </div>
              {showCount < filtered.length && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={() => setShowCount(filtered.length)}
                    className="bg-[#000] text-white rounded-[8px] h-[44px] px-8 text-[14px] font-[500] hover:bg-[#222] transition-colors"
                  >
                    Show all {filtered.length} templates
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
