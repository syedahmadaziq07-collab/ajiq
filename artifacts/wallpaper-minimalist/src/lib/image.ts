const SUPABASE_CDN = "dwovtevztmolttpohvym.supabase.co";

function transformUrl(url: string, width: number): string {
  if (url.includes(SUPABASE_CDN)) {
    const prefix = url.includes("?") ? "&" : "?";
    return `${url}${prefix}width=${width}&quality=60&resize=cover&format=webp`;
  }
  return url;
}

export function optimizeImage(url: string, width = 400): string {
  if (url.includes(SUPABASE_CDN)) {
    const prefix = url.includes("?") ? "&" : "?";
    return `${url}${prefix}width=${width}&quality=60&resize=cover&format=webp`;
  }
  return url.includes("?") ? url : `${url}?width=${width}`;
}

export function srcset(url: string, sizes: number[] = [400, 800, 1200]): string {
  return sizes.map((w) => `${transformUrl(url, w)} ${w}w`).join(", ");
}

export function blurImage(url: string): string {
  if (url.includes(SUPABASE_CDN)) {
    const prefix = url.includes("?") ? "&" : "?";
    return `${url}${prefix}width=20&quality=10&blur=400`;
  }
  return url;
}
