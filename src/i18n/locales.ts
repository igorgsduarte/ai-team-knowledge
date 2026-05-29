export const locales = ["pt-BR", "en", "es"] as const;
export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = "pt-BR";
export const localeCookieName = "tk_locale";

const localeAliases: Record<string, AppLocale> = {
  pt: "pt-BR",
  "pt-br": "pt-BR",
  en: "en",
  "en-us": "en",
  "en-gb": "en",
  es: "es",
  "es-es": "es",
  "es-419": "es",
};

export function normalizeLocale(value?: string | null): AppLocale | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim().toLowerCase().replace("_", "-");
  return localeAliases[normalized] ?? null;
}

export function negotiateLocale(acceptLanguage?: string | null): AppLocale {
  if (!acceptLanguage) {
    return defaultLocale;
  }

  const candidates = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, qValue] = part.trim().split(";q=");
      return { tag, q: qValue ? Number(qValue) : 1 };
    })
    .filter((item) => item.tag)
    .sort((a, b) => b.q - a.q);

  for (const candidate of candidates) {
    const exact = normalizeLocale(candidate.tag);
    if (exact) {
      return exact;
    }

    const language = normalizeLocale(candidate.tag.split("-")[0]);
    if (language) {
      return language;
    }
  }

  return defaultLocale;
}


export function resolveLocalePreference(input: { cookieLocale?: string | null; userLocale?: string | null; acceptLanguage?: string | null }): AppLocale {
  return (
    normalizeLocale(input.cookieLocale) ??
    normalizeLocale(input.userLocale) ??
    negotiateLocale(input.acceptLanguage)
  );
}

export function isAppLocale(value: string): value is AppLocale {
  return locales.includes(value as AppLocale);
}
