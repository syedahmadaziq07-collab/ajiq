import { useState } from "react";
import { Link } from "wouter";
import { useListWallpapers } from "@workspace/api-client-react";
import type { Wallpaper } from "@workspace/api-client-react";

export default function Wallpapers() {
  const { data } = useListWallpapers();
  const wallpapers = Array.isArray(data) ? data : [];
  const [activeFilter, setActiveFilter] = useState("All");

  const categories = ["All", ...new Set(wallpapers.map((w: Wallpaper) => w.category))];
  const filtered = activeFilter === "All" ? wallpapers : wallpapers.filter((w: Wallpaper) => w.category === activeFilter);

  return (
    <div className="w-full min-h-screen pb-20">
      <section className="px-4 sm:px-8 pt-12 pb-4 max-w-[680px] mx-auto">
        <h1 className="text-[32px] md:text-[48px] font-[700] tracking-[-1.5px] leading-[1.05] text-[#000]">Wallpapers</h1>
      </section>

      <section className="px-4 sm:px-8 pb-4 max-w-[680px] mx-auto flex gap-2">
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

      <section className="px-4 sm:px-8 max-w-[680px] mx-auto">
        {filtered.map((wallpaper: Wallpaper) => (
          <Link key={wallpaper.id} href={`/wallpapers/${wallpaper.slug}`} className="block py-5 border-b border-[#eee] group">
            <span className="text-[15px] font-[600] text-[#000]">{wallpaper.title}</span>
            {wallpaper.price && (
              <span className="text-[15px] text-[#747474] ml-2">${(wallpaper.price / 100).toFixed(2)}</span>
            )}
            <p className="text-[14px] text-[#747474] mt-0.5 leading-relaxed">{wallpaper.description}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
