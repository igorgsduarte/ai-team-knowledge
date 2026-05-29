"use client";

import { useTranslations } from "next-intl";
import { setMcpEnabled } from "@/app/actions/mcp-connections";

export function McpActivationForm() {
  const t = useTranslations("Team");
  return (
    <div className="flex gap-2">
      <button onClick={() => setMcpEnabled(true)}>{t("activateMcp")}</button>
      <button onClick={() => setMcpEnabled(false)}>{t("deactivateMcp")}</button>
    </div>
  );
}
