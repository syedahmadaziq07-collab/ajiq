import { Link } from "wouter";
import { motion } from "framer-motion";
import { useListGuides } from "@workspace/api-client-react";
import type { Guide } from "@workspace/api-client-react";
import { optimizeImage } from "../lib/image";

const PAGE_SIZE = 12;

function GuideCard({ guide, idx }: { guide: Guide; idx: number }) {
  const price = (guide as any).price as number | null | undefined;
  return (
    <div
      data-idx={idx}
      style={{ contentVisibility: 'auto', containIntrinsicSize: '450px' }}
      className="hover:-translate-y-1 transition-all duration-200"
    >
      <Link href={`/guides/${guide.slug}`} className="group flex flex-col border border-[#eee] rounded-[14px] overflow-hidden bg-white no-underline">
        <div className="aspect-[4/3] overflow-hidden bg-[#f5f5f5]">
          <img src={optimizeImage(guide.imageUrl, 400)} alt={guide.title} width="400" height="300" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" decoding="async" />
        </div>
        <div className="flex flex-col gap-2 p-4">
          <p className="text-[16px] font-[600] text-[#000] leading-snug">{guide.title}</p>
          <p className="text-[14px] text-[#747474] mt-1 leading-relaxed line-clamp-2">{guide.description}</p>
          <div className="flex items-center justify-between mt-2">
            {price ? (
              <span className="text-[16px] font-[700] text-[#000]">${(price / 100).toFixed(2)}</span>
            ) : (
              <span className="text-[14px] text-[#747474]">Free</span>
            )}
            <span className="bg-[#000] text-white rounded-[8px] px-4 py-2 text-[13px] font-[500]">View Guide</span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function Guides() {
  const { data, isLoading, error } = useListGuides();
  const guides = Array.isArray(data) ? data : [];

  if (isLoading) {
    return (
      <div className="w-full min-h-screen pb-20">
        <section className="px-4 sm:px-8 pt-12 pb-8 max-w-[1200px] mx-auto">
          <h1 className="text-[32px] md:text-[48px] font-[700] tracking-[-1.5px] leading-[1.05] text-[#000]">Guides</h1>
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
          <h1 className="text-[32px] md:text-[48px] font-[700] tracking-[-1.5px] leading-[1.05] text-[#000]">Guides</h1>
        </section>
        <section className="px-4 sm:px-8 max-w-[1200px] mx-auto">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-[#747474] text-[16px]">Failed to load guides. Please try again later.</p>
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
        <h1 className="text-[32px] md:text-[48px] font-[700] tracking-[-1.5px] leading-[1.05] text-[#000]">Guides</h1>
      </motion.section>

      <section className="px-4 sm:px-8 max-w-[1200px] mx-auto">
        {guides.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-[#747474] text-[16px]">No guides yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.slice(0, PAGE_SIZE).map((g: Guide, i: number) => (
              <GuideCard key={g.id} guide={g} idx={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
