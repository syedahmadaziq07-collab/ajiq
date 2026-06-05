import { useState } from "react";
import { Link } from "wouter";
import { useListGuides } from "@workspace/api-client-react";
import type { Guide } from "@workspace/api-client-react";

export default function Guides() {
  const { data } = useListGuides();
  const guides = Array.isArray(data) ? data : [];

  return (
    <div className="w-full min-h-screen pb-20">
      <section className="px-4 sm:px-8 pt-12 pb-4 max-w-[680px] mx-auto">
        <h1 className="text-[32px] md:text-[48px] font-[700] tracking-[-1.5px] leading-[1.05] text-[#000]">Guides</h1>
      </section>

      <section className="px-4 sm:px-8 max-w-[680px] mx-auto">
        {guides.map((guide: Guide) => (
          <Link key={guide.id} href={`/guides/${guide.slug}`} className="block py-5 border-b border-[#eee] group">
            <span className="text-[15px] font-[600] text-[#000]">{guide.title}</span>
            <p className="text-[14px] text-[#747474] mt-0.5 leading-relaxed">{guide.description}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
