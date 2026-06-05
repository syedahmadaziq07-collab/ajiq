import { useState } from "react";
import { useParams, Link } from "wouter";
import { useGetGuide } from "@workspace/api-client-react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

const API = import.meta.env.VITE_API_URL ?? "";

export default function GuidePost() {
  const { slug } = useParams<{ slug: string }>();
  const { data: guide, isLoading } = useGetGuide(slug);
  const [imgIndex, setImgIndex] = useState(0);
  const [buyLoading, setBuyLoading] = useState(false);

  const images = [guide?.imageUrl || "", ...((guide as any)?.images || [])].filter(Boolean);
  const features = ((guide as any)?.features || []).filter(Boolean);
  const whatsIncluded = ((guide as any)?.whatsIncluded || []).filter(Boolean);
  const price = (guide as any)?.price as number | null | undefined;

  const handleBuy = async () => {
    if (!guide) return;
    setBuyLoading(true);
    try {
      const res = await fetch(`${API}/api/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemType: "guide", itemId: guide.id }),
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

  if (!guide) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-[#747474]">Guide not found</p>
        <Link href="/guides" className="text-[#000] underline underline-offset-2">Back to Guides</Link>
      </div>
    );
  }

  const prevImg = () => setImgIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const nextImg = () => setImgIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="w-full min-h-screen pb-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 pt-8">
        <Link href="/guides" className="text-[13px] text-[#747474] hover:text-[#000] transition-colors no-underline">&larr; Back to Guides</Link>

        <div className="flex flex-col lg:flex-row gap-8 mt-6">
          {/* Left - Image Carousel */}
          <div className="w-full lg:w-[60%]">
            <div className="relative bg-[#f9f9f9] rounded-[16px] overflow-hidden shadow-sm">
              <div className="aspect-[4/3] relative flex items-center justify-center p-4">
                <img
                  src={images[imgIndex] || item.imageUrl}
                  alt={item.title}
                  width="4"
                  height="3"
                  className="w-full h-full object-contain rounded-[8px]"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImg}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-sm transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5 text-[#444]" />
                  </button>
                  <button
                    onClick={nextImg}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-sm transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5 text-[#444]" />
                  </button>

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                    {images.map((_: string, i: number) => (
                      <button
                        key={i}
                        onClick={() => setImgIndex(i)}
                        className={`w-2 h-2 rounded-full transition-all duration-200 ${
                          i === imgIndex ? "bg-[#000] w-6" : "bg-[#ccc] hover:bg-[#999]"
                        }`}
                        aria-label={`Image ${i + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right - Details */}
          <div className="w-full lg:w-[40%] flex flex-col gap-6">
            <div>
              <h1 className="text-[28px] sm:text-[36px] font-[700] text-[#000] leading-tight">{guide.title}</h1>
              <p className="text-[15px] text-[#747474] mt-3 leading-relaxed">{guide.description}</p>
            </div>

            {features.length > 0 && (
              <div className="space-y-3">
                {features.map((f: string, i: number) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#000] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-[15px] text-[#000]">{f}</span>
                  </div>
                ))}
              </div>
            )}

            {price ? (
              <button
                onClick={handleBuy}
                disabled={buyLoading}
                className="w-full bg-[#000] text-white rounded-[10px] h-[52px] text-[16px] font-[600] hover:bg-[#222] transition-colors disabled:opacity-50"
              >
                {buyLoading ? "Redirecting..." : `Buy Now $${(price / 100).toFixed(2)}`}
              </button>
            ) : ((guide as any)?.downloadUrl ? (
              <a
                href={`${API}/api/download/guide/${guide.id}`}
                className="w-full bg-[#000] text-white rounded-[10px] h-[52px] text-[16px] font-[600] flex items-center justify-center hover:bg-[#222] transition-colors no-underline"
              >
                Download Free
              </a>
            ) : null)}

            {whatsIncluded.length > 0 && (
              <div>
                <p className="text-[13px] font-[600] text-[#747474] uppercase tracking-[0.5px] mb-3">You'll get:</p>
                <ul className="space-y-2">
                  {whatsIncluded.map((w: string, i: number) => (
                    <li key={i} className="text-[14px] text-[#000] flex items-start gap-2">
                      <span className="text-[#747474]">&bull;</span>
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <p className="text-[13px] font-[600] text-[#747474] uppercase tracking-[0.5px] mb-3">Product Description:</p>
              <div className="text-[15px] text-[#000] leading-relaxed space-y-3">
                {(guide.content || "").split("\n").filter(Boolean).map((p: string, i: number) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
