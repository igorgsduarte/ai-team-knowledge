"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { updateProfileLocale } from "@/app/actions/profile";
import { locales, type AppLocale } from "@/i18n/locales";

export function ProfileLanguageForm({ currentLocale }: { currentLocale: AppLocale }) {
  const router = useRouter();
  const activeLocale = useLocale() as AppLocale;
  const t = useTranslations("Profile");
  const [locale, setLocale] = useState<AppLocale>(currentLocale || activeLocale);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function save() {
    startTransition(async () => {
      const result = await updateProfileLocale(locale);
      setMessage(result.ok ? t("languageSaved") : t("languageError"));
      if (result.ok) {
        router.refresh();
      }
    });
  }

  return (
    <div className="inline-form">
      <div>
        <label className="text-sm font-medium" htmlFor="profile-locale">{t("languageLabel")}</label>
        <select id="profile-locale" value={locale} onChange={(event) => setLocale(event.target.value as AppLocale)}>
          {locales.map((item) => (
            <option key={item} value={item}>{t(`localeNames.${item}`)}</option>
          ))}
        </select>
      </div>
      <button type="button" onClick={save} disabled={isPending}>{isPending ? t("saveLanguage") : t("saveLanguage")}</button>
      {message ? <p className="text-sm muted">{message}</p> : null}
    </div>
  );
}
