export function getSafeRedirect(returnTo: string | null | undefined, fallback = "/knowledge"): string {
  if (!returnTo || !returnTo.startsWith("/") || returnTo.startsWith("//")) {
    return fallback;
  }

  return returnTo;
}
