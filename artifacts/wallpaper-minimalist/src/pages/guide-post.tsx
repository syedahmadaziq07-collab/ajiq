import { useParams, Link } from "wouter";
import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL ?? "";

export default function GuidePost() {
  const { slug } = useParams<{ slug: string }>();
  const [guide, setGuide] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/guides/${slug}`)
      .then((r) => { if (!r.ok) throw new Error("Not found"); return r.json(); })
      .then(setGuide)
      .catch(() => setGuide(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
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

  return (
    <div className="w-full min-h-screen pb-12">
      <section className="px-4 sm:px-8 pt-12 pb-8 max-w-[720px] mx-auto">
        <Link href="/guides" className="text-[#747474] text-[13px] hover:underline underline-offset-2">&larr; Back to Guides</Link>
        <h1 className="text-[32px] md:text-[48px] font-[700] tracking-[-1.5px] leading-[1.05] text-[#000] mt-6">
          {guide.title as string}
        </h1>
        <p className="text-[#747474] text-[15px] mt-4 leading-[1.6]">{guide.description as string}</p>
      </section>

      {guide.imageUrl && (
        <section className="px-4 sm:px-8 pb-8 max-w-[900px] mx-auto">
          <div className="w-full aspect-[16/9] rounded-[12px] overflow-hidden bg-gradient-to-b from-[#e0e0e0] to-[#b0b0b0]">
            <img src={guide.imageUrl as string} alt={guide.title as string} className="w-full h-full object-cover" />
          </div>
        </section>
      )}

      <section className="px-4 sm:px-8 max-w-[720px] mx-auto">
        <div className="text-[16px] leading-[1.8] text-[#000] space-y-4">
          {((guide.content as string) || "").split("\n").map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>
    </div>
  );
}
