import { useEffect } from "react";
import { Link } from "wouter";
import { useListWallpapers } from "@workspace/api-client-react";
import type { Wallpaper } from "@workspace/api-client-react";
import { optimizeImage } from "../lib/image";

export default function Wallpapers() {
  const { data, isLoading, error } = useListWallpapers();
  const wallpapers = Array.isArray(data) ? data : [];

  useEffect(() => {
    if (wallpapers.length === 0) return;
    const urls = wallpapers.map((w: Wallpaper) => optimizeImage(w.imageUrl, 400));
    let last = -1;
    const preload = () => {
      const cols = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1;
      const visible = Math.ceil((window.scrollY + window.innerHeight) / 380) * cols;
      const target = Math.min(visible + 4, urls.length);
      for (let i = last + 1; i < target; i++) {
        if (urls[i]) { const img = new Image(); img.src = urls[i]; }
      }
      last = target - 1;
    };
    preload();
    window.addEventListener("scroll", preload, { passive: true });
    return () => window.removeEventListener("scroll", preload);
  }, [wallpapers.length]);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen pb-20">
        <section className="px-4 sm:px-8 pt-12 pb-8 max-w-[1200px] mx-auto">
          <h1 className="text-[32px] md:text-[48px] font-[700] tracking-[-1.5px] leading-[1.05] text-[#000]">Wallpapers</h1>
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
          <h1 className="text-[32px] md:text-[48px] font-[700] tracking-[-1.5px] leading-[1.05] text-[#000]">Wallpapers</h1>
        </section>
        <section className="px-4 sm:px-8 max-w-[1200px] mx-auto">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-[#747474] text-[16px]">Failed to load wallpapers. Please try again later.</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen pb-20">
      <section className="px-4 sm:px-8 pt-12 pb-8 max-w-[1200px] mx-auto">
        <h1 className="text-[32px] md:text-[48px] font-[700] tracking-[-1.5px] leading-[1.05] text-[#000]">Wallpapers</h1>
      </section>

      <section className="px-4 sm:px-8 max-w-[1200px] mx-auto">
        {wallpapers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-[#747474] text-[16px]">No wallpapers yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wallpapers.map((w: Wallpaper) => (
              <div key={w.id}>
                <Link href={`/wallpapers/${w.slug}`} className="group flex flex-col border border-[#eee] rounded-[14px] overflow-hidden bg-white hover:shadow-sm transition-shadow no-underline">
                  <div className="aspect-[4/3] overflow-hidden bg-[#f5f5f5]">
                    <img src={optimizeImage(w.imageUrl, 400)} alt={w.title} width="400" height="300" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" decoding="async" />
                  </div>
                  <div className="flex flex-col gap-2 p-4">
                    <p className="text-[16px] font-[600] text-[#000] leading-snug">{w.title}</p>
                    <p className="text-[14px] text-[#747474] mt-1 leading-relaxed line-clamp-2">{w.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      {w.price ? (
                        <span className="text-[16px] font-[700] text-[#000]">${(w.price / 100).toFixed(2)}</span>
                      ) : (
                        <span className="text-[14px] text-[#747474]">Free</span>
                      )}
                      <span className="bg-[#000] text-white rounded-[8px] px-4 py-2 text-[13px] font-[500]">View Wallpaper</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
