import { redirect } from "next/navigation";
import { SESSION_EXPIRED_PATH } from "@/lib/auth/cookies";
import { verifySessionOptional } from "@/lib/dal/session";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const auth = await verifySessionOptional();

  if (!auth) {
    redirect(SESSION_EXPIRED_PATH);
  }

  return children;
}
