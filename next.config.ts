import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";
import { buildSecurityHeaders } from "./src/lib/security/headers";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const isProduction = process.env.NODE_ENV === "production";
const securityHeaders = buildSecurityHeaders(isProduction);

function getAllowedOrigins(): string[] {
  const origins = new Set<string>();

  for (const value of [process.env.INVITE_BASE_URL, process.env.NEXT_PUBLIC_APP_URL]) {
    if (!value) {
      continue;
    }

    try {
      origins.add(new URL(value).host);
    } catch {
      continue;
    }
  }

  return [...origins];
}

const allowedOrigins = getAllowedOrigins();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: process.cwd(),
  },
  async headers() {
    return [
      {
        headers: securityHeaders,
        source: "/(.*)",
      },
    ];
  },
  ...(allowedOrigins.length
    ? {
        experimental: {
          serverActions: {
            allowedOrigins,
          },
        },
      }
    : {}),
};

export default withNextIntl(nextConfig);
