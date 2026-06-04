import { useState } from "react";
import { Link } from "wouter";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const navLinks = [
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

  return (
    <nav className="w-full flex items-center justify-center px-6 sm:px-10 border-b border-border" style={{ height: "64px" }}>
      <div className="flex items-center justify-between w-full max-w-[1200px]">
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
            <DropdownMenuContent align="end" className="w-44 mt-2 p-1.5 rounded-xl border border-border bg-white/95 backdrop-blur-sm shadow-lg">
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
      </div>
    </nav>
  );
}