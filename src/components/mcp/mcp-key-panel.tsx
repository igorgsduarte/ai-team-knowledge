"use client";

import { useTranslations } from "next-intl";
import { createMcpKey } from "@/app/actions/mcp-keys";

export function McpKeyPanel() {
  const t = useTranslations("Team");
  return <form action={async () => { await createMcpKey(); }}><button type="submit">{t("generateMcpKey")}</button></form>;
}
