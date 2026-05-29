import { existsSync, readFileSync } from "node:fs";
import { applicationDefault, cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

function getRequiredServerEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`FIREBASE_CONFIG_MISSING: missing ${name}`);
  }
  return value;
}

export function isFirebaseAdminConfigured(): boolean {
  return Boolean(
    (process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) &&
      (process.env.FIREBASE_SERVICE_ACCOUNT_JSON ||
        process.env.GOOGLE_APPLICATION_CREDENTIALS ||
        (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY))
  );
}

function getProjectId(): string {
  return process.env.FIREBASE_PROJECT_ID ?? getRequiredServerEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID");
}

function readServiceAccountJson(): Record<string, string> | null {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) {
    return null;
  }

  const value = raw.trim();
  const json = existsSync(value) ? readFileSync(value, "utf8") : value;
  return JSON.parse(json) as Record<string, string>;
}

function getCredential(projectId: string) {
  const serviceAccount = readServiceAccountJson();
  if (serviceAccount) {
    return cert({
      projectId: serviceAccount.project_id ?? serviceAccount.projectId ?? projectId,
      clientEmail: serviceAccount.client_email ?? serviceAccount.clientEmail,
      privateKey: String(serviceAccount.private_key ?? serviceAccount.privateKey ?? "").replace(/\\n/g, "\n"),
    });
  }

  if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    return cert({
      projectId,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    });
  }

  return applicationDefault();
}

export function getFirebaseAdminApp(): App {
  if (getApps().length) {
    return getApps()[0] as App;
  }

  const projectId = getProjectId();

  return initializeApp({
    credential: getCredential(projectId),
    projectId,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET ?? process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

export function getFirebaseAdminAuth() {
  return getAuth(getFirebaseAdminApp());
}

export function getFirebaseAdminDb() {
  return getFirestore(getFirebaseAdminApp());
}

export function getFirebaseAdminStorage() {
  return getStorage(getFirebaseAdminApp());
}

export const firebaseAdmin = {
  projectId: process.env.FIREBASE_PROJECT_ID ?? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "unknown-project",
  ready: isFirebaseAdminConfigured(),
};
