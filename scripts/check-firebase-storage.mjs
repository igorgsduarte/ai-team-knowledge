#!/usr/bin/env bun
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import {
  formatStorageBucketNotFoundError,
  listStorageBucketCandidates,
} from "../src/lib/firebase/storage-bucket.ts";

const projectId =
  process.env.FIREBASE_PROJECT_ID?.trim() || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim();

if (!projectId) {
  console.error("Missing FIREBASE_PROJECT_ID or NEXT_PUBLIC_FIREBASE_PROJECT_ID");
  process.exit(1);
}

if (!getApps().length) {
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!clientEmail || !privateKey) {
    console.error("Missing FIREBASE_CLIENT_EMAIL or FIREBASE_PRIVATE_KEY in environment");
    process.exit(1);
  }

  initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
    projectId,
  });
}

const candidates = listStorageBucketCandidates(projectId);
const storage = getStorage();
let found = false;

console.log(`Project: ${projectId}`);
console.log("Checking buckets:");

for (const name of candidates) {
  try {
    const [exists] = await storage.bucket(name).exists();
    console.log(`  ${exists ? "OK" : "missing"}  ${name}`);
    if (exists) {
      found = true;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(`  error   ${name} (${message})`);
  }
}

if (!found) {
  console.error("");
  console.error(formatStorageBucketNotFoundError(projectId, candidates));
  process.exit(1);
}

console.log("\nStorage bucket is reachable. Update .env.local if the OK bucket name differs from your config.");
