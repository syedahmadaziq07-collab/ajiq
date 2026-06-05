import { useState } from "react";
import { useParams, Link } from "wouter";
import { useGetWallpaper } from "@workspace/api-client-react";
import { CheckCircle } from "lucide-react";

const API = import.meta.env.VITE_API_URL ?? "";

export default function WallpaperPost() {
  const { slug } = useParams<{ slug: string }>();
  const { data: item, isLoading } = useGetWallpaper(slug);
  const [buyLoading, setBuyLoading] = useState(false);

  const handleBuy = async () => {
    if (!item) return;
    setBuyLoading(true);
    try {
      const res = await fetch(`${API}/api/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemType: "wallpaper", itemId: item.id }),
      });
      if (!res.ok) throw new Error("Checkout failed");
      const { url } = await res.json();
      window.location.href = url;
    } catch {
      alert("Checkout failed. Please try again.");
    } finally {
      setBuyLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p className="text-[#747474]">Loading...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-[#747474]">Wallpaper not found</p>
        <Link href="/wallpapers" className="text-[#000] underline underline-offset-2">Back to Wallpapers</Link>
      </div>
    );
  }

  const features = (item.content || "").split("\n").filter(Boolean);
  const hasContent = features.length > 0;

  return (
    <div className="w-full min-h-screen pb-20">
      <section className="px-4 sm:px-8 pt-12 pb-4 max-w-[1100px] mx-auto">
        <Link href="/wallpapers" className="text-[#747474] text-[13px] hover:underline underline-offset-2">&larr; Back to Wallpapers</Link>
      </section>

      <section className="px-4 sm:px-8 max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="rounded-[16px] overflow-hidden bg-[#f5f5f5]">
          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
        </div>

        <div className="flex flex-col justify-center">
          <h1 className="text-[32px] md:text-[48px] font-[700] tracking-[-1.5px] leading-[1.05] text-[#000]">
            {item.title}
          </h1>

          {item.description && (
            <p className="text-[#747474] text-[15px] mt-4 leading-relaxed">{item.description}</p>
          )}

          <div className="flex items-center gap-2 mt-6">
            <span className="text-[13px] text-[#747474] capitalize bg-[#f5f5f5] px-3 py-1 rounded-full">{item.category}</span>
          </div>

          {hasContent && (
            <div className="mt-8">
              <ul className="flex flex-col gap-3">
                {features.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-[15px] text-[#000]">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {item.price && (
            <div className="mt-10">
              <div className="flex items-center gap-4">
                <span className="text-[32px] font-[700] text-[#000]">${(item.price / 100).toFixed(2)}</span>
                <button
                  onClick={handleBuy}
                  disabled={buyLoading}
                  className="bg-[#0066cc] text-white rounded-[10px] h-[52px] px-8 text-[15px] font-[600] hover:bg-[#0052a3] transition-colors disabled:opacity-50"
                >
                  {buyLoading ? "Redirecting..." : "Buy Now"}
                </button>
              </div>
            </div>
          )}

          {!item.price && (
            <div className="mt-10">
              <a
                href={`${API}/api/download/wallpaper/${item.id}`}
                className="inline-flex items-center justify-center bg-[#000] text-white rounded-[10px] h-[52px] px-8 text-[15px] font-[600] hover:bg-[#222] transition-colors"
              >
                Download Free
              </a>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
