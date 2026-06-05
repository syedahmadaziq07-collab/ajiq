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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wallpapers.map((w: Wallpaper) => (
            <div key={w.id} className="group flex flex-col border border-[#eee] rounded-[14px] overflow-hidden bg-white hover:shadow-sm transition-shadow">
              <Link href={`/wallpapers/${w.slug}`} className="block aspect-[4/3] overflow-hidden bg-[#f5f5f5]">
                <img src={optimizeImage(w.imageUrl, 400)} alt={w.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" decoding="async" />
              </Link>
              <div className="flex flex-col gap-2 p-4">
                <Link href={`/wallpapers/${w.slug}`} className="no-underline">
                  <p className="text-[16px] font-[600] text-[#000] leading-snug">{w.title}</p>
                  <p className="text-[14px] text-[#747474] mt-1 leading-relaxed line-clamp-2">{w.description}</p>
                </Link>
                <div className="flex items-center justify-between mt-2">
                  {w.price ? (
                    <span className="text-[16px] font-[700] text-[#000]">${(w.price / 100).toFixed(2)}</span>
                  ) : (
                    <span className="text-[14px] text-[#747474]">Free</span>
                  )}
                  <Link
                    href={`/wallpapers/${w.slug}`}
                    className="bg-[#000] text-white rounded-[8px] px-4 py-2 text-[13px] font-[500] hover:bg-[#222] transition-colors no-underline"
                  >
                    View Wallpaper
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
