import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="border-t border-[#EEEEEE] px-4 sm:px-8 pt-8 pb-6" data-testid="footer">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Left Column */}
          <div>
            <p className="text-[#747474] text-[12px] max-w-[280px] leading-[1.7]">
              We craft simple essentials that make every workspace inspiring and every device more productive.
            </p>
            <p className="font-bold text-[12px] text-[#000] mt-2">
              support@wallpaper.minimalist
            </p>
          </div>

          {/* Right Column */}
          <div className="text-left md:text-right">
            <h2 className="text-[48px] md:text-[72px] font-[800] tracking-[-3px] leading-[1] text-[#000]">
              wallpaper.minimalist
            </h2>
            <p className="text-[#747474] text-[11px] mt-4">
              Designed by wallpaper.minimalist
            </p>
            <p className="text-[#747474] text-[11px]">
              © wallpaper.minimalist 2026. All Rights Reserved.
            </p>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="border-t border-[#EEEEEE] pt-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-1">
            <Link href="/" className="text-[12px] text-[#000] hover:underline underline-offset-2 py-0.5 block w-fit" data-testid="footer-link-home">Home</Link>
            <Link href="/templates" className="text-[12px] text-[#000] hover:underline underline-offset-2 py-0.5 block w-fit" data-testid="footer-link-templates">Templates</Link>
            <Link href="/wallpapers" className="text-[12px] text-[#000] hover:underline underline-offset-2 py-0.5 block w-fit" data-testid="footer-link-wallpapers">Wallpapers</Link>
          </div>
          <div className="flex flex-col gap-1">
            <Link href="/guides" className="text-[12px] text-[#000] hover:underline underline-offset-2 py-0.5 block w-fit" data-testid="footer-link-guides">Guides</Link>
            <Link href="/blog" className="text-[12px] text-[#000] hover:underline underline-offset-2 py-0.5 block w-fit" data-testid="footer-link-blog">Blog</Link>
            <Link href="/contact" className="text-[12px] text-[#000] hover:underline underline-offset-2 py-0.5 block w-fit" data-testid="footer-link-contact">Contact</Link>
          </div>
          <div className="flex flex-col gap-1">
            <a href="#" className="text-[12px] text-[#000] hover:underline underline-offset-2 py-0.5 block w-fit" data-testid="footer-link-instagram">Instagram</a>
            <a href="#" className="text-[12px] text-[#000] hover:underline underline-offset-2 py-0.5 block w-fit" data-testid="footer-link-tiktok">TikTok</a>
          </div>
          <div className="flex flex-col gap-1">
            <a href="#" className="text-[12px] text-[#000] hover:underline underline-offset-2 py-0.5 block w-fit" data-testid="footer-link-threads">Threads</a>
            <a href="#" className="text-[12px] text-[#000] hover:underline underline-offset-2 py-0.5 block w-fit" data-testid="footer-link-pinterest">Pinterest</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
