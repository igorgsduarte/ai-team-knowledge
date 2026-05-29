import { cookies, headers } from "next/headers";
import { localeCookieName, resolveLocalePreference, type AppLocale } from "@/i18n/locales";
import { getAuthContext } from "@/lib/firebase/auth";
import { usersRepository } from "@/lib/repositories/users-repository";

export async function getCurrentLocale(): Promise<AppLocale> {
  const jar = await cookies();
  const cookieLocale = jar.get(localeCookieName)?.value;
  let userLocale: string | null | undefined;

  const auth = await getAuthContext();
  if (auth?.userId) {
    try {
      const profile = await usersRepository.getUserProfile(auth.userId);
      userLocale = profile?.locale;
    } catch {
      // Locale should never prevent rendering; fall back to browser negotiation.
    }
  }

  const headerList = await headers();
  return resolveLocalePreference({
    cookieLocale,
    userLocale,
    acceptLanguage: headerList.get("accept-language"),
  });
}
