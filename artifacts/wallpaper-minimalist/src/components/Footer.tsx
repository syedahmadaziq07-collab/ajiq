import { Link } from "wouter";
import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL ?? "";

const DEFAULT_LINKS = [
  { labelKey: "footer_blog_label", urlKey: "footer_blog_url", defaultLabel: "Blog", defaultUrl: "/blog", internal: true },
  { labelKey: "footer_contact_label", urlKey: "footer_contact_url", defaultLabel: "Contact", defaultUrl: "/contact", internal: true },
  { labelKey: "footer_templates_label", urlKey: "footer_templates_url", defaultLabel: "Templates", defaultUrl: "/templates", internal: true },
  { labelKey: "footer_wallpapers_label", urlKey: "footer_wallpapers_url", defaultLabel: "Wallpapers", defaultUrl: "/wallpapers", internal: true },
  { labelKey: "footer_guides_label", urlKey: "footer_guides_url", defaultLabel: "Guides", defaultUrl: "/guides", internal: true },
  { labelKey: "footer_instagram_label", urlKey: "footer_instagram_url", defaultLabel: "Instagram", defaultUrl: "https://instagram.com/wallpcom", internal: false },
  { labelKey: "footer_tiktok_label", urlKey: "footer_tiktok_url", defaultLabel: "TikTok", defaultUrl: "https://tiktok.com/@wallpcom", internal: false },
  { labelKey: "footer_threads_label", urlKey: "footer_threads_url", defaultLabel: "Threads", defaultUrl: "https://threads.com/wallpcom", internal: false },
  { labelKey: "footer_pinterest_label", urlKey: "footer_pinterest_url", defaultLabel: "Pinterest", defaultUrl: "https://pinterest.com/wallpcom", internal: false },
];

export function Footer() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  useEffect(() => {
    fetch(`${API}/api/settings`)
      .then((r) => { if (r.ok) return r.json(); throw new Error(""); })
      .then(setSettings)
      .catch(() => {});
  }, []);

  return (
    <footer className="border-t border-[#EEEEEE] px-6 sm:px-10 py-10" data-testid="footer">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-x-10 gap-y-3">
          {DEFAULT_LINKS.map((link) => {
            const label = settings[link.labelKey] || link.defaultLabel;
            const url = settings[link.urlKey] || link.defaultUrl;
            if (!url) return null;
            if (link.internal) {
              return (
                <Link key={link.urlKey} href={url} className="text-[#000] text-[13px] hover:underline underline-offset-2" data-testid={`footer-link-${link.labelKey}`}>{label}</Link>
              );
            }
            return (
              <a key={link.urlKey} href={url} target="_blank" rel="noopener noreferrer" className="text-[#747474] text-[13px] hover:text-[#000] transition-colors" data-testid={`footer-link-${link.labelKey}`}>{label}</a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}