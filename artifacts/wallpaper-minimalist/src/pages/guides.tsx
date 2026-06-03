import { Link } from "wouter";
import { useListGuides } from "@workspace/api-client-react";
import type { Guide } from "@workspace/api-client-react";

export default function Guides() {
  const { data: guides = [] } = useListGuides();

  return (
    <div className="w-full min-h-screen pb-10">
      <section className="px-4 sm:px-8 pt-12 pb-4 max-w-[1200px] mx-auto">
        <h1 className="text-[32px] md:text-[64px] font-[800] tracking-[-2px] md:tracking-[-5px] leading-[0.9] text-[#000]">
          Guides
        </h1>
        <p className="text-[#747474] text-[15px] mt-4">
          Step-by-step guides to build a cleaner digital life.
        </p>
      </section>

      <section className="mt-8">
        {guides.map((guide: Guide) => (
          <div key={guide.id} className="border-b border-[#EEEEEE]">
            <div className="flex items-center gap-4 py-5 max-w-[1200px] mx-auto px-4 sm:px-8">
              <div className="w-[80px] h-[80px] shrink-0 rounded-[8px] overflow-hidden bg-[#F5F5F5]">
                <img src={guide.imageUrl} alt={guide.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="font-[700] text-[15px] text-[#000]">{guide.title}</h3>
                <p className="text-[#747474] text-[13px] mt-1 line-clamp-2">{guide.description}</p>
              </div>
              <div className="shrink-0 pl-2">
                <Link href="#" className="text-[#0000EE] text-[13px] hover:underline underline-offset-2">
                  Read Guide →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
