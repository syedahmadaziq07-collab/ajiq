import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";

export function Navbar() {
  const [location] = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [location]);

  return (
    <>
      <nav
        className="sticky top-0 z-50 w-full flex items-center justify-center px-4 sm:px-8 border-b border-[#EEEEEE]"
        style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)', height: '64px' }}
        data-testid="navbar"
      >
        <div className="flex items-center justify-between w-full max-w-[1200px]">
          {/* Left: Logo */}
          <Link href="/" className="font-bold text-[15px] text-[#000] flex items-center gap-0.5" data-testid="link-home-logo">
            wallpaper.minimalist<sup style={{ fontSize: '60%' }}>®</sup>
          </Link>

          {/* Center: Products Dropdown (Desktop) */}
          <div className="hidden sm:block relative" ref={dropdownRef}>
            <button
              className="text-[#000] text-[12px] font-medium flex items-center gap-1 hover:text-[#747474] transition-colors"
              onMouseEnter={() => setDropdownOpen(true)}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              data-testid="btn-products-dropdown"
            >
              Products ▾
            </button>
            
            {dropdownOpen && (
              <div 
                className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-40 bg-white border border-[#EEEEEE] rounded-[10px] py-2 flex flex-col animate-in fade-in zoom-in-95 duration-200"
                onMouseLeave={() => setDropdownOpen(false)}
                data-testid="dropdown-menu-products"
              >
                <Link href="/templates" className="px-4 py-2 text-[12px] text-[#000] hover:bg-[#F5F5F5] transition-colors" data-testid="link-templates">Templates</Link>
                <Link href="/wallpapers" className="px-4 py-2 text-[12px] text-[#000] hover:bg-[#F5F5F5] transition-colors" data-testid="link-wallpapers">Wallpapers</Link>
                <Link href="/guides" className="px-4 py-2 text-[12px] text-[#000] hover:bg-[#F5F5F5] transition-colors" data-testid="link-guides">Guides</Link>
              </div>
            )}
          </div>

          {/* Right: Links (Desktop) */}
          <div className="hidden sm:flex items-center gap-6">
            <Link href="/blog" className={`text-[12px] hover:underline underline-offset-2 transition-all ${location === '/blog' ? 'font-medium' : 'font-normal'} text-[#0000EE]`} data-testid="link-blog">Blog</Link>
            <Link href="/contact" className={`text-[12px] hover:underline underline-offset-2 transition-all ${location === '/contact' ? 'font-medium' : 'font-normal'} text-[#0000EE]`} data-testid="link-contact">Contact</Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="sm:hidden text-[#000] p-2" 
            onClick={() => setMobileMenuOpen(true)}
            data-testid="btn-mobile-menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-white flex flex-col p-6 animate-in slide-in-from-bottom-2 duration-200" data-testid="mobile-menu-overlay">
          <div className="flex justify-between items-center mb-8">
            <Link href="/" className="font-bold text-[15px] text-[#000] flex items-center gap-0.5" onClick={() => setMobileMenuOpen(false)}>
              wallpaper.minimalist<sup style={{ fontSize: '60%' }}>®</sup>
            </Link>
            <button className="text-[#000] p-2" onClick={() => setMobileMenuOpen(false)} data-testid="btn-close-mobile-menu">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div className="flex flex-col gap-6 text-[18px] font-medium">
            <Link href="/" data-testid="mobile-link-home">Home</Link>
            <Link href="/templates" data-testid="mobile-link-templates">Templates</Link>
            <Link href="/wallpapers" data-testid="mobile-link-wallpapers">Wallpapers</Link>
            <Link href="/guides" data-testid="mobile-link-guides">Guides</Link>
            <Link href="/blog" className="text-[#0000EE]" data-testid="mobile-link-blog">Blog</Link>
            <Link href="/contact" className="text-[#0000EE]" data-testid="mobile-link-contact">Contact</Link>
          </div>
        </div>
      )}
    </>
  );
}
