import { memo, useRef, useState, useEffect, useCallback } from "react";
import { useListTemplates } from "@workspace/api-client-react";
import type { Template } from "@workspace/api-client-react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { optimizeImage } from "../lib/image";

const API = import.meta.env.VITE_API_URL ?? "";

function useCreateCheckoutSession() {
  const [loading, setLoading] = useState(false);
  const buy = useCallback(async (itemType: string, itemId: number) => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemType, itemId }),
      });
      if (!res.ok) throw new Error("Checkout failed");
      const { url } = await res.json();
      window.location.href = url;
    } catch {
      alert("Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);
  return { buy, loading };
}

function PriceBadge({ price }: { price: number | null | undefined }) {
  if (!price) {
    return <span className="bg-[#000] text-white text-[12px] px-2 py-0.5 rounded-[4px]">Free</span>;
  }
  return <span className="bg-[#0066cc] text-white text-[12px] px-2 py-0.5 rounded-[4px]">${(price / 100).toFixed(2)}</span>;
}

const TemplateCard = memo(function TemplateCard({
  template,
  onBuy,
  loading,
}: {
  template: Template;
  onBuy: (id: number) => void;
  loading: boolean;
}) {
  return (
    <div className="border border-[#EEEEEE] rounded-[10px] overflow-hidden group hover:scale-[1.01] transition-transform duration-200 bg-white flex flex-col">
      <div className="aspect-[4/3] overflow-hidden bg-[#f5f5f5]">
        <img
          src={optimizeImage(template.imageUrl, 600)}
          alt={template.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-[12px] flex flex-col gap-3">
        <div>
          <h3 className="text-[14px] font-[700] text-[#000]">{template.title}</h3>
          <div className="mt-2 flex items-center gap-2">
            <PriceBadge price={template.price} />
          </div>
        </div>
        {template.price ? (
          <button
            onClick={() => onBuy(template.id)}
            disabled={loading}
            className="w-full bg-[#0066cc] text-white rounded-[8px] h-[40px] text-[13px] font-[500] hover:bg-[#0052a3] transition-colors disabled:opacity-50"
          >
            {loading ? "Redirecting..." : `Buy - $${(template.price / 100).toFixed(2)}`}
          </button>
        ) : (
          <a
            href={`${API}/api/download/template/${template.id}`}
            className="w-full bg-[#000] text-white rounded-[8px] h-[40px] text-[13px] font-[500] hover:bg-[#222] transition-colors flex items-center justify-center"
          >
            Get Template
          </a>
        )}
      </div>
    </div>
  );
});

function useColumnCount(ref: React.RefObject<HTMLDivElement | null>) {
  const [columns, setColumns] = useState(3);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        if (w < 640) setColumns(1);
        else if (w < 1024) setColumns(2);
        else setColumns(3);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return columns;
}

export default function Templates() {
  const { data } = useListTemplates();
  const templates = Array.isArray(data) ? data : [];
  const [activeFilter, setActiveFilter] = useState("All");
  const { buy, loading } = useCreateCheckoutSession();
  const scrollRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const columns = useColumnCount(gridRef);

  const categories = ["All", ...new Set(templates.map((t: Template) => t.category))];

  const filteredTemplates = activeFilter === "All"
    ? templates
    : templates.filter((t: Template) => t.category === activeFilter);

  const rowCount = Math.ceil(filteredTemplates.length / columns);

  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 420,
    overscan: 3,
  });

  return (
    <div className="w-full min-h-screen flex flex-col">
      <section className="px-4 sm:px-8 pt-12 pb-4 max-w-[1200px] mx-auto w-full">
        <h1 className="text-[32px] md:text-[64px] font-[800] tracking-[-2px] md:tracking-[-5px] leading-[0.9] text-[#000]">
          Templates
        </h1>
        <p className="text-[#747474] text-[15px] mt-4">
          Clean, functional templates for productive workflows.
        </p>
      </section>

      <section className="px-4 sm:px-8 py-4 max-w-[1200px] mx-auto w-full flex gap-2 overflow-x-auto no-scrollbar">
        {categories.map(filter => (
          <button
            key={filter}
            className={`px-4 py-2 text-sm whitespace-nowrap transition-colors ${activeFilter === filter ? 'bg-[#000] text-white rounded-[20px]' : 'bg-white border border-[#EEEEEE] rounded-[20px] text-[#000]'}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </section>

      <section ref={scrollRef} className="px-4 sm:px-8 py-6 max-w-[1200px] mx-auto w-full flex-1 overflow-auto">
        <div ref={gridRef} style={{ height: `${virtualizer.getTotalSize()}px`, position: "relative" }}>
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const rowIndex = virtualRow.index;
            const startIdx = rowIndex * columns;
            const rowItems = filteredTemplates.slice(startIdx, startIdx + columns);
            return (
              <div
                key={virtualRow.key}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <div
                  className="grid gap-4"
                  style={{
                    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                  }}
                >
                  {rowItems.map((template: Template) => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      onBuy={buy}
                      loading={loading}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
