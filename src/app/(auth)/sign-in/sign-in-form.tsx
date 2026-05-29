"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export function SignInForm() {
  const router = useRouter();
  const t = useTranslations("Auth");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const payload = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || t("signInError"));
      }

      router.replace("/knowledge");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("signInError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border bg-white p-6">
      <h1 className="text-xl font-semibold">{t("signInTitle")}</h1>
      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="email">{t("email")}</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded border px-3 py-2" required />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="password">{t("password")}</label>
        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded border px-3 py-2" required />
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button type="submit" disabled={loading} className="w-full rounded bg-black px-4 py-2 text-white disabled:opacity-70">
        {loading ? t("signInLoading") : t("signInButton")}
      </button>
    </form>
  );
}
