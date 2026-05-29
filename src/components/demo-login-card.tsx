"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

type DemoLoginCardProps = {
  label: string;
  name: string;
  email: string;
  password: string;
};

export function DemoLoginCard({ label, name, email, password }: DemoLoginCardProps) {
  const router = useRouter();
  const t = useTranslations("Landing");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signIn() {
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
        throw new Error(payload.error || t("demoError"));
      }

      router.replace("/knowledge");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("demoError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <article className="rounded border bg-white p-4">
      <p className="text-sm font-semibold text-gray-600">{label}</p>
      <h2 className="text-sm font-semibold">{name}</h2>
      <p className="mt-3 rounded border px-3 py-1 text-sm">{email}</p>
      <p className="mt-1 rounded border px-3 py-1 text-sm">{password}</p>
      {error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null}
      <button className="mt-3 demo-login-button" type="button" onClick={signIn} disabled={loading}>
        {loading ? t("demoLoggingIn") : t("demoLogin")}
      </button>
    </article>
  );
}
