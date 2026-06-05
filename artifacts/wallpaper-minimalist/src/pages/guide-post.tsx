import { useParams, Link } from "wouter";
import { useGetGuide } from "@workspace/api-client-react";

export default function GuidePost() {
  const { slug } = useParams<{ slug: string }>();
  const { data: guide, isLoading } = useGetGuide(slug);

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

  return (
    <div className="w-full min-h-screen pb-12">
      <section className="px-4 sm:px-8 pt-12 pb-8 max-w-[720px] mx-auto">
        <Link href="/guides" className="text-[#747474] text-[13px] hover:underline underline-offset-2">&larr; Back to Guides</Link>
        <h1 className="text-[32px] md:text-[48px] font-[700] tracking-[-1.5px] leading-[1.05] text-[#000] mt-6">
          {guide.title}
        </h1>
        <p className="text-[#747474] text-[15px] mt-4 leading-[1.6]">{guide.description}</p>
      </section>

      {guide.imageUrl && (
        <section className="px-4 sm:px-8 pb-8 max-w-[900px] mx-auto">
          <div className="w-full aspect-[16/9] rounded-[12px] overflow-hidden bg-gradient-to-b from-[#e0e0e0] to-[#b0b0b0]">
            <img src={guide.imageUrl} alt={guide.title} className="w-full h-full object-cover" loading="lazy" decoding="async" />
          </div>
        </section>
      )}

      <section className="px-4 sm:px-8 max-w-[720px] mx-auto">
        <div className="text-[16px] leading-[1.8] text-[#000] space-y-4">
          {guide.content.split("\n").map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>
    </div>
  );
}
