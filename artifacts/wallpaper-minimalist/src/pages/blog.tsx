import { Link } from "wouter";

export default function Blog() {
  const posts = [
    { id: 1, date: "Jan 12, 2026", title: "5 Color Palettes for Your Workspace" },
    { id: 2, date: "Jan 5, 2026", title: "Optimizing Wall Space Around Your Desk" },
    { id: 3, date: "Dec 22, 2025", title: "Stationery That Blends Form & Function" },
  ];

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

      {/* Featured Post */}
      <section className="px-4 sm:px-8 mt-8 mb-8 max-w-[1200px] mx-auto border-b border-[#EEEEEE] pb-8">
        <Link href="#" className="block group" data-testid="featured-post">
          <div className="w-full h-[240px] rounded-[10px] overflow-hidden bg-[#F5F5F5]">
            <img 
              src="https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=400&fit=crop" 
              alt="Ergonomic Essentials" 
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" 
            />
          </div>
          <h2 className="font-[700] text-[24px] mt-4 text-[#000] group-hover:underline underline-offset-2">
            Ergonomic Essentials: Comfort Meets Productivity
          </h2>
          <p className="text-[#747474] text-[14px] mt-2 leading-[1.6]">
            Discover how the right setup can transform your productivity and comfort throughout the day.
          </p>
          <p className="text-[#747474] text-[12px] mt-2">
            Feb 2, 2026
          </p>
        </Link>
      </section>

      {/* Post List */}
      <section className="px-4 sm:px-8 max-w-[1200px] mx-auto">
        {posts.map(post => (
          <div key={post.id} className="flex justify-between items-center border-b border-[#EEEEEE] py-4">
            <span className="text-[#747474] text-[12px] shrink-0 mr-4">{post.date}</span>
            <Link href="#" className="font-[700] text-[14px] text-[#000] hover:underline underline-offset-2 text-right" data-testid={`post-${post.id}`}>
              {post.title}
            </Link>
          </div>
        ))}
      </section>
    </div>
  );
}
