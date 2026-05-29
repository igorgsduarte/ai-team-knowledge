import type { AppLocale } from "@/i18n/locales";

export async function loadMessages(locale: AppLocale) {
  return (await import(`../../messages/${locale}.json`)).default;
}
