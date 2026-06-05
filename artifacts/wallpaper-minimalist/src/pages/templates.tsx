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

      <section className="px-4 sm:px-8 pb-4 max-w-[1200px] mx-auto flex gap-2">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((t: Template) => (
            <Link key={t.id} href={`/templates/${t.slug}`} className="group block">
              <div className="aspect-[4/3] rounded-[12px] overflow-hidden bg-[#f5f5f5]">
                <img src={optimizeImage(t.imageUrl, 400)} alt={t.title} className="w-full h-full object-cover" loading="lazy" decoding="async" />
              </div>
              <p className="text-[15px] font-[600] text-[#000] mt-3">{t.title}</p>
              {t.price && (
                <p className="text-[15px] text-[#000] mt-0.5">${(t.price / 100).toFixed(2)}</p>
              )}
              <p className="text-[14px] text-[#747474] mt-1 leading-relaxed">{t.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
