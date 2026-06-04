import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="border-t border-[#EEEEEE] px-6 sm:px-10 py-10" data-testid="footer">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-x-10 gap-y-3">
          <Link href="/blog" className="text-[#000] text-[13px] hover:underline underline-offset-2" data-testid="footer-link-blog">Blogs</Link>
          <Link href="/contact" className="text-[#000] text-[13px] hover:underline underline-offset-2" data-testid="footer-link-contact">Contact</Link>
          <Link href="/templates" className="text-[#000] text-[13px] hover:underline underline-offset-2" data-testid="footer-link-templates">Templates</Link>
          <Link href="/wallpapers" className="text-[#000] text-[13px] hover:underline underline-offset-2" data-testid="footer-link-wallpapers">Wallpapers</Link>
          <Link href="/guides" className="text-[#000] text-[13px] hover:underline underline-offset-2" data-testid="footer-link-guides">Guides</Link>
          <a href="https://instagram.com/wallpcom" target="_blank" rel="noopener noreferrer" className="text-[#747474] text-[13px] hover:text-[#000] transition-colors" data-testid="footer-link-instagram">Instagram</a>
          <a href="https://tiktok.com/@wallpcom" target="_blank" rel="noopener noreferrer" className="text-[#747474] text-[13px] hover:text-[#000] transition-colors" data-testid="footer-link-tiktok">TikTok</a>
          <a href="https://threads.com/wallpcom" target="_blank" rel="noopener noreferrer" className="text-[#747474] text-[13px] hover:text-[#000] transition-colors" data-testid="footer-link-threads">Threads</a>
          <a href="https://pinterest.com/wallpcom" target="_blank" rel="noopener noreferrer" className="text-[#747474] text-[13px] hover:text-[#000] transition-colors" data-testid="footer-link-pinterest">Pinterest</a>
        </div>
      </div>
    </footer>
  );
}