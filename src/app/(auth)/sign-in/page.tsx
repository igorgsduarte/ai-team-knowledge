import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { SignInForm } from "./sign-in-form";

export default async function SignInPage() {
  const t = await getTranslations("Auth");
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4">
      <div className="w-full space-y-4">
        <SignInForm />
        <p className="text-center text-sm text-gray-600">
          {t("noAccount")} <Link className="underline" href="/sign-up">{t("createAccount")}</Link>
        </p>
      </div>
    </main>
  );
}
