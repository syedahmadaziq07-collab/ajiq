import { useState } from "react";
import { Link } from "wouter";
import { useListTemplates } from "@workspace/api-client-react";
import type { Template } from "@workspace/api-client-react";
import { optimizeImage } from "../lib/image";

export default function Templates() {
  const { data } = useListTemplates();
  const templates = Array.isArray(data) ? data : [];
  const [activeFilter, setActiveFilter] = useState("All");

  const categories = ["All", ...new Set(templates.map((t: Template) => t.category))];
  const filtered = activeFilter === "All" ? templates : templates.filter((t: Template) => t.category === activeFilter);

  return (
    <div className="w-full min-h-screen pb-20">
      <section className="px-4 sm:px-8 pt-12 pb-4 max-w-[1200px] mx-auto">
        <h1 className="text-[32px] md:text-[48px] font-[700] tracking-[-1.5px] leading-[1.05] text-[#000]">Templates</h1>
      </section>

      <section className="px-4 sm:px-8 pb-4 max-w-[1200px] mx-auto flex gap-3">
        {categories.map(filter => (
          <button
            key={filter}
            className={`text-[14px] transition-colors ${activeFilter === filter ? 'text-[#000] font-[600]' : 'text-[#747474] hover:text-[#000]'}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </section>

      <section className="px-4 sm:px-8 max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((t: Template) => (
            <div key={t.id} className="group flex flex-col border border-[#eee] rounded-[14px] overflow-hidden bg-white hover:shadow-sm transition-shadow">
              <Link href={`/templates/${t.slug}`} className="block aspect-[4/3] overflow-hidden bg-[#f5f5f5]">
                <img src={optimizeImage(t.imageUrl, 400)} alt={t.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" decoding="async" />
              </Link>
              <div className="flex flex-col gap-2 p-4">
                <Link href={`/templates/${t.slug}`} className="no-underline">
                  <p className="text-[16px] font-[600] text-[#000] leading-snug">{t.title}</p>
                  <p className="text-[14px] text-[#747474] mt-1 leading-relaxed line-clamp-2">{t.description}</p>
                </Link>
                <div className="flex items-center justify-between mt-2">
                  {t.price ? (
                    <span className="text-[16px] font-[700] text-[#000]">${(t.price / 100).toFixed(2)}</span>
                  ) : (
                    <span className="text-[14px] text-[#747474]">Free</span>
                  )}
                  <Link
                    href={`/templates/${t.slug}`}
                    className="bg-[#000] text-white rounded-[8px] px-4 py-2 text-[13px] font-[500] hover:bg-[#222] transition-colors no-underline"
                  >
                    View Template
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
