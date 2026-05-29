export function normalizeStorageBucketName(value: string): string {
  let name = value.trim();
  if (!name) {
    return name;
  }

  if (name.startsWith("gs://")) {
    name = name.slice(5);
  }

  const storageUrlMatch = name.match(
    /^https?:\/\/(?:storage\.googleapis\.com|firebasestorage\.googleapis\.com)\/([^/?#]+)/i
  );
  if (storageUrlMatch?.[1]) {
    name = storageUrlMatch[1];
  }

  return name.replace(/\/+$/, "").split("/")[0] ?? name;
}

export function getConfiguredStorageBucketName(): string | undefined {
  const raw =
    process.env.FIREBASE_STORAGE_BUCKET?.trim() ||
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim();

  return raw ? normalizeStorageBucketName(raw) : undefined;
}

export function listStorageBucketCandidates(projectId: string): string[] {
  const candidates: string[] = [];
  const seen = new Set<string>();

  const add = (value: string) => {
    const name = normalizeStorageBucketName(value);
    if (!name || seen.has(name)) {
      return;
    }
    seen.add(name);
    candidates.push(name);
  };

  const configured = getConfiguredStorageBucketName();
  if (configured) {
    add(configured);
  }

  add(`${projectId}.firebasestorage.app`);
  add(`${projectId}.appspot.com`);

  return candidates;
}

export function storageBucketSetupUrl(projectId: string): string {
  return `https://console.firebase.google.com/project/${projectId}/storage`;
}

export function formatStorageBucketNotFoundError(projectId: string, candidates: string[]): string {
  const configured = getConfiguredStorageBucketName() ?? "(not set)";
  return [
    "FIREBASE_STORAGE_BUCKET_NOT_FOUND:",
    `none of [${candidates.join(", ")}] exist in project "${projectId}".`,
    `Configured bucket: ${configured}.`,
    `Enable Firebase Storage: ${storageBucketSetupUrl(projectId)}`,
  ].join(" ");
}

export class StorageBucketNotFoundError extends Error {
  readonly projectId: string;
  readonly candidates: string[];

  constructor(projectId: string, candidates: string[]) {
    super(formatStorageBucketNotFoundError(projectId, candidates));
    this.name = "StorageBucketNotFoundError";
    this.projectId = projectId;
    this.candidates = candidates;
  }
}

export function isStorageBucketNotFoundError(error: unknown): error is StorageBucketNotFoundError {
  return error instanceof StorageBucketNotFoundError;
}
