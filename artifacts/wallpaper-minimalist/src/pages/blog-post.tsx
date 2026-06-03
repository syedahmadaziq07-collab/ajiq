import { useParams, Link } from "wouter";
import { useGetBlogPost } from "@workspace/api-client-react";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading } = useGetBlogPost(slug);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p className="text-[#747474]">Loading...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-[#747474]">Post not found</p>
        <Link href="/blog" className="text-[#000] underline underline-offset-2">Back to Blog</Link>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen pb-12">
      <section className="px-4 sm:px-8 pt-12 pb-8 max-w-[720px] mx-auto">
        <Link href="/blog" className="text-[#747474] text-[13px] hover:underline underline-offset-2">&larr; Back to Blog</Link>
        <h1 className="text-[32px] md:text-[48px] font-[700] tracking-[-1.5px] leading-[1.05] text-[#000] mt-6">
          {post.title}
        </h1>
        <p className="text-[#747474] text-[14px] mt-3">
          {(() => { const d = new Date(post.publishedAt); return isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }); })()} &middot; By {post.author}
        </p>
      </section>

      {post.imageUrl && (
        <section className="px-4 sm:px-8 pb-8 max-w-[900px] mx-auto">
          <div className="w-full aspect-[16/9] rounded-[12px] overflow-hidden">
            <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
          </div>
        </section>
      )}

      <section className="px-4 sm:px-8 max-w-[720px] mx-auto">
        <div className="text-[16px] leading-[1.8] text-[#000] space-y-4">
          {post.content.split("\n").map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>
    </div>
  );
}
