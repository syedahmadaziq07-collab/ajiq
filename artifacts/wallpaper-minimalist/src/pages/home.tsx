import { Link } from "wouter";
import { ProductCard } from "@/components/ProductCard";
import { BlogCard } from "@/components/BlogCard";

export default function Home() {
  return (
    <div className="w-full min-h-screen">
      {/* [A] HERO SECTION */}
      <section className="pt-12 pb-10 px-4 sm:px-8 max-w-[1200px] mx-auto">
        <div className="text-[#747474] text-[14px] italic mb-4">®</div>
        <h1 className="text-[32px] md:text-[48px] lg:text-[100px] font-[800] tracking-[-2px] lg:tracking-[-5px] leading-[0.9] text-[#000] flex flex-col">
          <span>wallpaper</span>
          <span>.minimalist</span>
        </h1>
        <p className="text-[#747474] text-[15px] max-w-[480px] leading-[1.7] mt-6">
          We craft simple essentials that make every workspace inspiring and every device more productive.
        </p>
      </section>

      {/* [B] PRODUCT CATEGORY CARDS */}
      <section className="px-4 sm:px-8 pb-10 max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-3">
        <ProductCard 
          category="Wallpapers" 
          href="/wallpapers"
          image="https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=200&fit=crop" 
        />
        <ProductCard 
          category="Guides" 
          href="/guides"
          image="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=200&fit=crop" 
        />
        <ProductCard 
          category="Templates" 
          href="/templates"
          image="https://images.unsplash.com/photo-1484788984921-03950022c38b?w=400&h=200&fit=crop" 
        />
      </section>

      {/* [C] "REFINING DIGITAL LIFE" SECTION */}
      <section className="px-4 sm:px-8 pt-10 pb-5 max-w-[1200px] mx-auto">
        <h2 className="text-[32px] md:text-[42px] font-[700] tracking-[-1.5px] text-[#000] mb-4">
          Refining digital life.
        </h2>
        <p className="text-[#747474] text-[14px] leading-[1.7] max-w-[500px]">
          Our designs refine workspaces and devices, proving that the simplest details can make the biggest difference in digital life.
        </p>
      </section>

      {/* [D] IMAGE GRID */}
      <section className="px-4 sm:px-8 pb-10 max-w-[1200px] mx-auto flex flex-col md:grid md:grid-cols-[1.2fr_0.9fr] gap-[10px]">
        <div className="h-[220px] rounded-[10px] overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&h=500&fit=crop" 
            alt="Refined workspace"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="grid grid-cols-2 grid-rows-2 gap-[10px]">
          <img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop" className="w-full h-[105px] rounded-[10px] object-cover" alt="Detail 1" />
          <img src="https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop" className="w-full h-[105px] rounded-[10px] object-cover" alt="Detail 2" />
          <img src="https://images.unsplash.com/photo-1585399000684-d2f72d71a359?w=400&h=300&fit=crop" className="w-full h-[105px] rounded-[10px] object-cover" alt="Detail 3" />
          <img src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop" className="w-full h-[105px] rounded-[10px] object-cover" alt="Detail 4" />
        </div>
      </section>

      {/* [E] BLOG PREVIEW SECTION */}
      <section className="px-4 sm:px-8 py-10 border-t border-[#EEEEEE] max-w-[1200px] mx-auto">
        <h2 className="text-[32px] md:text-[54px] font-[700] tracking-[-2px] text-[#000] mb-2">
          Insights from our blog.
        </h2>
        <p className="text-[#747474] text-[14px] leading-[1.7] mb-8 max-w-[600px]">
          Insights and practical tips to create a clean, functional environment and digital life across devices and workspaces.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4">
          <BlogCard 
            date="Feb 2, 2026"
            title="Ergonomic Essentials: Comfort Meets Productivity"
            image="https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=200&fit=crop"
          />
          <BlogCard 
            date="Jan 12, 2026"
            title="5 Color Palettes for Your Workspace"
            image="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=200&fit=crop"
          />
          <BlogCard 
            date="Jan 5, 2026"
            title="Optimizing Wall Space Around Your Desk"
            image="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400&h=200&fit=crop"
          />
        </div>
      </section>

      {/* [F] NEWSLETTER SECTION */}
      <section className="px-4 sm:px-8 py-10 border-t border-[#EEEEEE] max-w-[1200px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
        <p className="text-[#747474] text-[14px] leading-[1.7] max-w-[400px]">
          Join for thoughtful insights, exclusive offers, and ideas to create more balanced and functional setups.
        </p>
        <form 
          className="flex flex-row items-center gap-2"
          onSubmit={(e) => { e.preventDefault(); alert("Subscribed!"); }}
        >
          <input 
            type="email" 
            placeholder="name@wallpaper.minimalist" 
            className="border border-[#EEEEEE] rounded-[8px] h-[44px] px-4 text-[13px] focus:outline-none focus:border-[#0000EE] w-full md:w-[240px] bg-transparent text-[#000]"
            required
            data-testid="input-newsletter-email"
          />
          <button 
            type="submit"
            className="bg-[#000] text-white rounded-[8px] h-[44px] px-5 text-[13px] font-[500] hover:bg-[#222] transition-colors whitespace-nowrap"
            data-testid="btn-newsletter-submit"
          >
            Subscribe
          </button>
        </form>
      </section>
    </div>
  );
}
