import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { SignUpForm } from "./sign-up-form";

export default async function SignUpPage() {
  const t = await getTranslations("Auth");
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4">
      <div className="w-full space-y-4">
        <SignUpForm />
        <p className="text-center text-sm text-gray-600">
          {t("hasAccount")} <Link className="underline" href="/sign-in">{t("signInLink")}</Link>
        </p>
      </div>
    </main>
  );
}
