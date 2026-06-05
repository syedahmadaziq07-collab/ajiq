import { Link } from "wouter";
import { useListWallpapers } from "@workspace/api-client-react";
import type { Wallpaper } from "@workspace/api-client-react";
import { optimizeImage } from "../lib/image";

export default function Wallpapers() {
  const { data } = useListWallpapers();
  const wallpapers = Array.isArray(data) ? data : [];

  return (
    <div className="w-full min-h-screen pb-20">
      <section className="px-4 sm:px-8 pt-12 pb-8 max-w-[1200px] mx-auto">
        <h1 className="text-[32px] md:text-[48px] font-[700] tracking-[-1.5px] leading-[1.05] text-[#000]">Wallpapers</h1>
      </section>

      <section className="px-4 sm:px-8 max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {wallpapers.map((w: Wallpaper) => (
            <Link key={w.id} href={`/wallpapers/${w.slug}`} className="group block">
              <div className="aspect-[4/3] rounded-[12px] overflow-hidden bg-[#f5f5f5]">
                <img src={optimizeImage(w.imageUrl, 400)} alt={w.title} className="w-full h-full object-cover" loading="lazy" decoding="async" />
              </div>
              <p className="text-[15px] font-[600] text-[#000] mt-3">{w.title}</p>
              {w.price && (
                <p className="text-[15px] text-[#000] mt-0.5">${(w.price / 100).toFixed(2)}</p>
              )}
              <p className="text-[14px] text-[#747474] mt-1 leading-relaxed">{w.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
