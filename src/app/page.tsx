import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { DemoLoginCard } from "@/components/demo-login-card";

const demoUsers = [
  { labelKey: "aliceLabel", nameKey: "aliceRole", email: "alice@teamknowledge.dev" },
  { labelKey: "bobLabel", nameKey: "bobRole", email: "bob@teamknowledge.dev" },
  { labelKey: "demoLabel", nameKey: "demoRole", email: "demo@teamknowledge.dev" },
] as const;

const features = [
  { titleKey: "featureBoardTitle", descriptionKey: "featureBoardDescription" },
  { titleKey: "featureKnowledgeTitle", descriptionKey: "featureKnowledgeDescription" },
  { titleKey: "featureSkillsTitle", descriptionKey: "featureSkillsDescription" },
] as const;

export default async function HomePage() {
  const t = await getTranslations("Landing");
  const demoPassword = t("demoPassword");

  return (
    <main className="mx-auto max-w-4xl space-y-8 px-6 py-16">
      <section className="space-y-3">
        <h1 className="text-4xl font-bold">{t("heroTitle")}</h1>
        <p className="text-gray-700">{t("heroSubtitle")}</p>
      </section>

      <section className="flex gap-3">
        <Link href="/sign-in" className="rounded bg-black px-4 py-2 text-white">{t("signIn")}</Link>
        <Link href="/sign-up" className="rounded border px-4 py-2">{t("signUp")}</Link>
      </section>

      <section className="rounded-lg border bg-white p-6">
        <div className="mb-3 flex items-center gap-3">
          <span className="rounded border px-3 py-1 text-sm font-semibold">{t("demoBadge")}</span>
          <p className="text-sm text-gray-600">{t("demoDescription")}</p>
        </div>
        <div className="demo-account-grid grid gap-4">
          {demoUsers.map((user) => (
            <DemoLoginCard key={user.email} label={t(user.labelKey)} name={t(user.nameKey)} email={user.email} password={demoPassword} />
          ))}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {features.map((feature) => (
          <article key={feature.titleKey} className="rounded border bg-white p-4">
            <h2 className="font-semibold">{t(feature.titleKey)}</h2>
            <p className="mt-1 text-sm text-gray-600">{t(feature.descriptionKey)}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
