const SUPABASE_CDN = "dwovtevztmolttpohvym.supabase.co";

export function optimizeImage(url: string, width = 400): string {
  if (url.includes(SUPABASE_CDN)) {
    const hasQuery = url.includes("?");
    return `${url}${hasQuery ? "&" : "?"}width=${width}&resize=cover`;
  }
  return url.includes("?") ? url : `${url}?width=${width}`;
}
