import { useState } from "react";
import { Link } from "wouter";
import { ChevronDown, Menu, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { label: "Guides", href: "/guides" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const productLinks = [
  { label: "Wallpapers", href: "/wallpapers" },
  { label: "Templates", href: "/templates" },
  { label: "Guides", href: "/guides" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);

  return (
    <>
      <div className="fixed top-[22px] left-1/2 z-50 w-full max-w-[1200px] px-6 sm:px-10"
           style={{ transform: 'translateZ(0) translateX(-50%)' }}>
        <nav className="flex items-center justify-between w-full h-16 border border-[#dedede] rounded-[10px] px-6"
             style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.93), rgba(250,250,250,0.85))' }}>
          <Link href="/" className="text-[18px] font-[600] text-foreground no-underline">
            Wallp.
          </Link>

          <div className="hidden sm:flex items-center gap-1">
            <DropdownMenu open={open} onOpenChange={setOpen}>
              <DropdownMenuTrigger className="flex items-center gap-1 px-3 py-2 text-[15px] font-[500] text-[#444] hover:text-foreground transition-colors outline-none select-none">
                Products
                <ChevronDown
                  className="w-4 h-4 text-[#aaa] transition-transform duration-200"
                  style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44 mt-2 p-1.5 rounded-xl border border-border shadow-lg"
                 style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.98), rgba(252,252,252,0.95))' }}>
                {productLinks.map((link) => (
                  <DropdownMenuItem key={link.href} asChild>
                    <Link
                      href={link.href}
                      className="px-3 py-2 text-[15px] font-[500] text-[#444] hover:text-foreground rounded-lg transition-colors no-underline block w-full"
                    >
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-[15px] font-[500] text-[#444] hover:text-foreground transition-colors no-underline"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <button
            className="sm:hidden flex items-center justify-center w-10 h-10 text-[#444] hover:text-foreground transition-colors"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </nav>
      </div>

      <div
        className="fixed inset-0 bg-black/20 z-40 sm:hidden transition-opacity duration-200"
        style={{ opacity: mobileOpen ? 1 : 0, pointerEvents: mobileOpen ? 'auto' : 'none' }}
        onClick={() => setMobileOpen(false)}
      />

      <div
        className="fixed top-0 right-0 bottom-0 w-[280px] bg-white z-50 sm:hidden flex flex-col border-l border-border transition-transform duration-300 ease-out"
        style={{ transform: mobileOpen ? 'translateX(0)' : 'translateX(100%)' }}
      >
        <div className="flex items-center justify-between px-6 border-b border-border" style={{ height: "64px" }}>
          <span className="text-[18px] font-[600] text-foreground">Menu</span>
          <button
            className="flex items-center justify-center w-10 h-10 text-[#444] hover:text-foreground transition-colors"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-6 flex flex-col gap-1">
          <button
            className="flex items-center justify-between w-full px-3 py-3 text-[15px] font-[500] text-[#444] hover:text-foreground rounded-lg transition-colors"
            onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
          >
            Products
            <ChevronDown
              className="w-4 h-4 text-[#aaa] transition-transform duration-200"
              style={{ transform: mobileProductsOpen ? "rotate(180deg)" : "rotate(0deg)" }}
            />
          </button>
          <div
            className="flex flex-col pl-4 overflow-hidden transition-all duration-200"
            style={{ maxHeight: mobileProductsOpen ? '200px' : '0', opacity: mobileProductsOpen ? 1 : 0 }}
          >
            {productLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2.5 text-[14px] font-[500] text-[#444] hover:text-foreground rounded-lg transition-colors no-underline"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-3 text-[15px] font-[500] text-[#444] hover:text-foreground rounded-lg transition-colors no-underline"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}