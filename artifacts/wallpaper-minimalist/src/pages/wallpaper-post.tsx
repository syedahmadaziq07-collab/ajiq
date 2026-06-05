import { useState } from "react";
import { useParams, Link } from "wouter";
import { useGetWallpaper } from "@workspace/api-client-react";

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

  return (
    <div className="w-full min-h-screen pb-20">
      <section className="px-4 sm:px-8 max-w-[680px] mx-auto pt-12">
        <h4 className="text-[22px] font-[700] text-[#000]">{item.title}</h4>

        <div className="mt-8">
          {item.price ? (
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); handleBuy(); }}
              className="inline-block bg-[#0066cc] text-white rounded-[8px] px-6 py-3 text-[15px] font-[600] hover:bg-[#0052a3] transition-colors"
            >
              {buyLoading ? "Redirecting..." : `Buy Now $${(item.price / 100).toFixed(2)}`}
            </a>
          ) : (
            <a
              href={`${API}/api/download/wallpaper/${item.id}`}
              className="inline-block bg-[#000] text-white rounded-[8px] px-6 py-3 text-[15px] font-[600] hover:bg-[#222] transition-colors"
            >
              Download Free
            </a>
          )}
        </div>

        {features.length > 0 && (
          <div className="mt-10">
            <p className="text-[13px] font-[600] text-[#747474] uppercase tracking-[0.5px]">Content:</p>
            <ul className="mt-3 space-y-1">
              {features.map((f, i) => (
                <li key={i} className="text-[15px] text-[#000]">&bull; {f}</li>
              ))}
            </ul>
          </div>
        )}

        {item.description && (
          <div className="mt-10">
            <p className="text-[13px] font-[600] text-[#747474] uppercase tracking-[0.5px]">Product Description:</p>
            <p className="text-[15px] text-[#000] mt-2 leading-relaxed">{item.description}</p>
          </div>
        )}
      </section>
    </div>
  );
}
