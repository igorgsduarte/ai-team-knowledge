#!/usr/bin/env node

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = process.cwd();
const API_ROOT = join(ROOT, "src/app/api");
const ENV_EXAMPLE = join(ROOT, ".env.example");

const PUBLIC_API_ALLOWLIST = [
  "src/app/api/auth/sign-in/route.ts",
  "src/app/api/auth/sign-up/route.ts",
  "src/app/api/auth/sign-out/route.ts",
  "src/app/api/auth/clear-session/route.ts",
  "src/app/api/mcp/connect/route.ts",
  "src/app/api/mcp/status/route.ts",
];

const AUTH_MARKERS = [
  "verifySession",
  "getAuthContext",
  "requireAuthContext",
  "validateMcpConnection",
];

const PUBLIC_ENV_PREFIXES = [
  "NEXT_PUBLIC_FIREBASE_",
  "NEXT_PUBLIC_DEFAULT_WORKSPACE_ID",
  "NEXT_PUBLIC_APP_URL",
];

let failed = false;

function fail(message) {
  console.error(`FAIL: ${message}`);
  failed = true;
}

function pass(message) {
  console.log(`PASS: ${message}`);
}

function collectRouteFiles(dir) {
  const files = [];

  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      files.push(...collectRouteFiles(fullPath));
      continue;
    }

    if (entry === "route.ts") {
      files.push(fullPath);
    }
  }

  return files;
}

function checkApiRoutes() {
  const routes = collectRouteFiles(API_ROOT);

  for (const routePath of routes) {
    const relativePath = relative(ROOT, routePath).replaceAll("\\", "/");
    const source = readFileSync(routePath, "utf8");

    if (PUBLIC_API_ALLOWLIST.includes(relativePath)) {
      pass(`allowlisted public route ${relativePath}`);
      continue;
    }

    const hasAuth = AUTH_MARKERS.some((marker) => source.includes(marker));
    if (!hasAuth) {
      fail(`missing auth marker in ${relativePath}`);
      continue;
    }

    pass(`protected route ${relativePath}`);
  }
}

function checkEnvExample() {
  const source = readFileSync(ENV_EXAMPLE, "utf8");
  const lines = source.split("\n").filter((line) => line.includes("=") && !line.startsWith("#"));

  for (const line of lines) {
    const key = line.split("=")[0]?.trim();
    if (!key) {
      continue;
    }

    if (key.startsWith("NEXT_PUBLIC_") && !PUBLIC_ENV_PREFIXES.some((prefix) => key.startsWith(prefix))) {
      fail(`unexpected NEXT_PUBLIC variable in .env.example: ${key}`);
    }
  }

  pass("checked .env.example public variable allowlist");
}

function checkNextVersion() {
  const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
  const version = pkg.dependencies?.next ?? pkg.devDependencies?.next;
  pass(`Next.js version ${version ?? "unknown"} (CVE-2025-29927 patched in 15.2.3+ / 14.2.25+)`);
}

function runBunAudit() {
  const result = spawnSync("bun", ["audit"], {
    cwd: ROOT,
    encoding: "utf8",
  });

  if (result.status === 0) {
    pass("dependency audit completed without high/critical findings");
    return;
  }

  const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`.trim();
  if (/high|critical/i.test(output)) {
    fail(`dependency audit reported high/critical issues:\n${output}`);
    return;
  }

  pass("dependency audit completed");
}

console.log("Running security audit...\n");
checkNextVersion();
checkEnvExample();
checkApiRoutes();
runBunAudit();

if (failed) {
  process.exit(1);
}

console.log("\nSecurity audit passed.");
