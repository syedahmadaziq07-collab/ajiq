import { Link } from "wouter";
import { useListBlogPosts } from "@workspace/api-client-react";

export default function Blog() {
  const { data: posts } = useListBlogPosts();

  const top = posts?.[0];
  const rest = posts?.slice(1) ?? [];

  function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  return (
    <div className="w-full min-h-screen pb-12">
      <section className="px-4 sm:px-8 pt-12 pb-4 max-w-[1200px] mx-auto">
        <h1 className="text-[32px] md:text-[64px] font-[800] tracking-[-2px] md:tracking-[-5px] leading-[0.9] text-[#000]">
          Blog
        </h1>
        <p className="text-[#747474] text-[15px] mt-4">
          Insights and practical tips for a cleaner digital life.
        </p>
      </section>

      {top && (
        <section className="px-4 sm:px-8 mt-8 mb-8 max-w-[1200px] mx-auto border-b border-[#EEEEEE] pb-8">
          <Link href={`/blog/${top.slug}`} className="block group" data-testid="featured-post">
            <div className="w-full h-[240px] rounded-[10px] overflow-hidden">
              <img
                src={top.imageUrl}
                alt={top.title}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
            <h2 className="font-[700] text-[24px] mt-4 text-[#000] group-hover:underline underline-offset-2">
              {top.title}
            </h2>
            <p className="text-[#747474] text-[14px] mt-2 leading-[1.6]">{top.excerpt}</p>
            <p className="text-[#747474] text-[12px] mt-2">{formatDate(top.publishedAt)}</p>
          </Link>
        </section>
      )}

      <section className="px-4 sm:px-8 max-w-[1200px] mx-auto">
        {rest.map((post, i) => (
          <div key={post.id} className="flex justify-between items-center border-b border-[#EEEEEE] py-4">
            <span className="text-[#747474] text-[12px] shrink-0 mr-4">{formatDate(post.publishedAt)}</span>
            <Link href={`/blog/${post.slug}`} className="font-[700] text-[14px] text-[#000] hover:underline underline-offset-2 text-right" data-testid={`post-${post.id}`}>
              {post.title}
            </Link>
          </div>
        ))}
      </section>
    </div>
  );
}
