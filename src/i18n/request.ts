import { getRequestConfig } from "next-intl/server";
import { getCurrentLocale } from "@/i18n/server";
import { loadMessages } from "@/i18n/messages";

export default getRequestConfig(async () => {
  const locale = await getCurrentLocale();
  return {
    locale,
    messages: await loadMessages(locale),
  };
});
