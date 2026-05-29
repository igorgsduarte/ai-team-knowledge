import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { AcceptInviteForm } from "@/components/workspace/accept-invite-form";
import { getAuthContext } from "@/lib/firebase/auth";

export default async function AcceptInvitePage({ params }: { params: Promise<{ token: string }> }) {
  const t = await getTranslations("WorkspaceSettings");
  const auth = await getAuthContext();
  const { token } = await params;

  if (!auth) {
    redirect(`/sign-in?next=/invite/${token}`);
  }

  return (
    <main className="auth-layout">
      <div className="auth-card space-y-4">
        <h1>{t("acceptInviteTitle")}</h1>
        <AcceptInviteForm token={token} />
      </div>
    </main>
  );
}
