import { Link } from "wouter";
import { useListGuides } from "@workspace/api-client-react";
import type { Guide } from "@workspace/api-client-react";
import { optimizeImage } from "../lib/image";

export default function Guides() {
  const { data } = useListGuides();
  const guides = Array.isArray(data) ? data : [];

  return (
    <div className="w-full min-h-screen pb-20">
      <section className="px-4 sm:px-8 pt-12 pb-8 max-w-[1200px] mx-auto">
        <h1 className="text-[32px] md:text-[48px] font-[700] tracking-[-1.5px] leading-[1.05] text-[#000]">Guides</h1>
      </section>

      <section className="px-4 sm:px-8 max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((g: Guide) => {
            const price = (g as any).price as number | null | undefined;
            return (
              <div key={g.id} className="group flex flex-col border border-[#eee] rounded-[14px] overflow-hidden bg-white hover:shadow-sm transition-shadow">
                <Link href={`/guides/${g.slug}`} className="block aspect-[4/3] overflow-hidden bg-[#f5f5f5]">
                  <img src={optimizeImage(g.imageUrl, 400)} alt={g.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" decoding="async" />
                </Link>
                <div className="flex flex-col gap-2 p-4">
                  <Link href={`/guides/${g.slug}`} className="no-underline">
                    <p className="text-[16px] font-[600] text-[#000] leading-snug">{g.title}</p>
                    <p className="text-[14px] text-[#747474] mt-1 leading-relaxed line-clamp-2">{g.description}</p>
                  </Link>
                  <div className="flex items-center justify-between mt-2">
                    {price ? (
                      <span className="text-[16px] font-[700] text-[#000]">${(price / 100).toFixed(2)}</span>
                    ) : (
                      <span className="text-[14px] text-[#747474]">Free</span>
                    )}
                    <Link
                      href={`/guides/${g.slug}`}
                      className="bg-[#000] text-white rounded-[8px] px-4 py-2 text-[13px] font-[500] hover:bg-[#222] transition-colors no-underline"
                    >
                      View Guide
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
