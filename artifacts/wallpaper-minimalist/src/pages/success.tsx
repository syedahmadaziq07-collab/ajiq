import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";

const API = import.meta.env.VITE_API_URL ?? "";

export default function Success() {
  const params = new URLSearchParams(window.location.search);
  const itemType = params.get("itemType");
  const itemId = params.get("itemId");
  const sessionId = params.get("session_id");
  const [item, setItem] = useState<{ title: string; imageUrl: string } | null>(null);

  const downloadUrl = `${API}/api/download/${itemType}/${itemId}?session_id=${sessionId}`;

  useEffect(() => {
    if (!itemType || !itemId) return;
    fetch(`${API}/api/${itemType}s/${itemId}`)
      .then(r => r.json())
      .then(d => setItem(d))
      .catch(() => {});
  }, [itemType, itemId]);

  if (!sessionId) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-white px-4">
        <div className="text-center max-w-[400px]">
          <h1 className="text-[24px] font-[700] text-[#000]">No purchase found</h1>
          <p className="text-[#747474] text-[15px] mt-2">This page requires a valid purchase session.</p>
          <a href="/" className="inline-block mt-6 text-[#0066cc] text-[14px] font-[500] hover:underline">Go home</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white px-4">
      <div className="text-center max-w-[420px]">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
        <h1 className="text-[28px] font-[800] tracking-[-1px] text-[#000] mt-6">Payment successful!</h1>
        <p className="text-[#747474] text-[15px] mt-3 leading-relaxed">
          Thank you for your purchase. Your download is ready.
        </p>

        {item && (
          <div className="mt-6 flex items-center gap-3 border border-[#eee] rounded-[10px] p-3 text-left">
            <img src={item.imageUrl} alt={item.title} className="w-12 h-12 rounded-[6px] object-cover flex-shrink-0" />
            <div>
              <p className="text-[13px] font-[600] text-[#000]">{item.title}</p>
              <p className="text-[12px] text-[#747474] capitalize">{itemType}</p>
            </div>
          </div>
        )}

        <a
          href={downloadUrl}
          className="inline-flex items-center justify-center w-full mt-6 bg-[#000] text-white rounded-[10px] h-[48px] text-[15px] font-[600] hover:bg-[#222] transition-colors"
        >
          Download now
        </a>

        <a href="/" className="inline-block mt-4 text-[#747474] text-[13px] hover:text-[#000] transition-colors">
          Back to home
        </a>
      </div>
    </div>
  );
}
