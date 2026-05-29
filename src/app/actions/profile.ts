"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { localeCookieName, normalizeLocale, type AppLocale } from "@/i18n/locales";
import { requireAuthContext } from "@/lib/firebase/auth";
import { usersRepository } from "@/lib/repositories/users-repository";

export async function updateProfileLocale(locale: string): Promise<{ ok: boolean; locale?: AppLocale }> {
  const nextLocale = normalizeLocale(locale);
  if (!nextLocale) {
    return { ok: false };
  }

  const auth = await requireAuthContext();
  await usersRepository.updateUserLocale(auth.userId, nextLocale);

  const jar = await cookies();
  jar.set(localeCookieName, nextLocale, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  revalidatePath("/profile");
  revalidatePath("/knowledge");
  return { ok: true, locale: nextLocale };
}

export async function updateProfile(formData: FormData): Promise<void> {
  const auth = await requireAuthContext();
  await usersRepository.updateProfile(auth.userId, {
    name: String(formData.get("name") || ""),
    area: String(formData.get("area") || ""),
    bio: String(formData.get("bio") || ""),
  });

  revalidatePath("/profile");
  revalidatePath("/team");
}
