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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {guides.map((g: Guide) => (
            <Link key={g.id} href={`/guides/${g.slug}`} className="group block">
              <div className="aspect-[4/3] rounded-[12px] overflow-hidden bg-[#f5f5f5]">
                <img src={optimizeImage(g.imageUrl, 400)} alt={g.title} className="w-full h-full object-cover" loading="lazy" decoding="async" />
              </div>
              <p className="text-[15px] font-[600] text-[#000] mt-3">{g.title}</p>
              <p className="text-[14px] text-[#747474] mt-1 leading-relaxed">{g.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
