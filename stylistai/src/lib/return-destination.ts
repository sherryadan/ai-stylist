const appOrigin = "https://stylist.invalid";
const destinations = new Set(["/dashboard", "/saved-outfits", "/styling-history", "/styling-requests"]);

export function returnDestination(value: unknown) {
  if (typeof value !== "string" || !value.startsWith("/") || value.length > 1024) return;
  try {
    const url = new URL(value, appOrigin);
    if (url.origin !== appOrigin) return;
    if (!destinations.has(url.pathname) && !/^\/styling-requests\/[0-9a-f-]{36}$/i.test(url.pathname)) return;
    return url.pathname + url.search;
  } catch {
    return;
  }
}

export function profileHandoff(path: string, next?: string) {
  return next ? `${path}?${new URLSearchParams({ next })}` : path;
}
