import { describe, expect, it } from "vitest";
import { defaultLocale, negotiateLocale, normalizeLocale, resolveLocalePreference } from "@/i18n/locales";

describe("i18n locale resolution", () => {
  it("normalizes supported locale aliases", () => {
    expect(normalizeLocale("pt")).toBe("pt-BR");
    expect(normalizeLocale("pt-BR")).toBe("pt-BR");
    expect(normalizeLocale("en-US")).toBe("en");
    expect(normalizeLocale("es-ES")).toBe("es");
  });

  it("negotiates locale from Accept-Language by quality", () => {
    expect(negotiateLocale("fr-CA,es;q=0.9,en;q=0.8")).toBe("es");
    expect(negotiateLocale("en-US,en;q=0.9,pt;q=0.8")).toBe("en");
  });

  it("prioritizes cookie over user profile and browser locale", () => {
    expect(resolveLocalePreference({ cookieLocale: "es", userLocale: "en", acceptLanguage: "pt-BR,pt;q=0.9" })).toBe("es");
    expect(resolveLocalePreference({ cookieLocale: null, userLocale: "en", acceptLanguage: "es;q=0.9" })).toBe("en");
  });

  it("falls back to the default locale", () => {
    expect(negotiateLocale("fr-CA,fr;q=0.9")).toBe(defaultLocale);
    expect(normalizeLocale("fr")).toBeNull();
  });
});
