import { useState } from "react";
import { useListTemplates } from "@workspace/api-client-react";
import type { Template } from "@workspace/api-client-react";

const API = import.meta.env.VITE_API_URL ?? "";

function useCreateCheckoutSession() {
  const [loading, setLoading] = useState(false);
  const buy = async (itemType: string, itemId: number) => {
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
    } catch (err) {
      alert("Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return { buy, loading };
}

function PriceBadge({ price }: { price: number | null | undefined }) {
  if (!price) {
    return <span className="bg-[#000] text-white text-[12px] px-2 py-0.5 rounded-[4px]">Free</span>;
  }
  return <span className="bg-[#0066cc] text-white text-[12px] px-2 py-0.5 rounded-[4px]">${(price / 100).toFixed(2)}</span>;
}

export default function Templates() {
  const { data: templates = [] } = useListTemplates();
  const [activeFilter, setActiveFilter] = useState("All");
  const { buy, loading } = useCreateCheckoutSession();

  const categories = ["All", ...new Set(templates.map((t: Template) => t.category))];

  const filteredTemplates = activeFilter === "All"
    ? templates
    : templates.filter((t: Template) => t.category === activeFilter);

  return (
    <div className="w-full min-h-screen">
      <section className="px-4 sm:px-8 pt-12 pb-4 max-w-[1200px] mx-auto">
        <h1 className="text-[32px] md:text-[64px] font-[800] tracking-[-2px] md:tracking-[-5px] leading-[0.9] text-[#000]">
          Templates
        </h1>
        <p className="text-[#747474] text-[15px] mt-4">
          Clean, functional templates for productive workflows.
        </p>
      </section>

      <section className="px-4 sm:px-8 py-4 max-w-[1200px] mx-auto flex gap-2 overflow-x-auto no-scrollbar">
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

      <section className="px-4 sm:px-8 py-6 max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template: Template) => (
            <div key={template.id} className="border border-[#EEEEEE] rounded-[10px] overflow-hidden group hover:scale-[1.01] transition-transform duration-200 bg-white flex flex-col">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={template.imageUrl} alt={template.title} className="w-full h-full object-cover" />
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
                    onClick={() => { buy("template", template.id); }}
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
          ))}
        </div>
      </section>
    </div>
  );
}
