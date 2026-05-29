# Firebase App Hosting - Deploy Guide

## Prerequisites

- Firebase project on **Blaze** plan (`team-ai-knowledge-app`) — required for App Hosting, Cloud Functions, and Storage API enablement  
  Upgrade: https://console.firebase.google.com/project/team-ai-knowledge-app/usage/details
- Enable **Storage** in console before deploying storage rules: https://console.firebase.google.com/project/team-ai-knowledge-app/storage
- Firebase CLI >= 13.15.4: `firebase login --reauth`
- GitHub repo connected with `main` as live branch
- **`pnpm-lock.yaml`** committed (App Hosting buildpacks require npm, yarn, or pnpm lockfile; Bun is not supported)

## Local project link

```bash
firebase use team-ai-knowledge-app
```

Project alias is in [`.firebaserc`](.firebaserc).

## Package manager for production builds

App Hosting uses **pnpm** (via `pnpm-lock.yaml`). Local development may still use Bun.

Validate production build locally:

```bash
pnpm install --frozen-lockfile
pnpm run build
```

## Environment variables

### Dev (`.env.local`)

Do not commit:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`
- `NEXT_PUBLIC_APP_URL` (e.g. `http://localhost:3000`)
- `NEXT_PUBLIC_DEFAULT_WORKSPACE_ID`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `FIREBASE_STORAGE_BUCKET` (optional)
- `INVITE_BASE_URL` (e.g. `http://localhost:3000`)
- `RESEND_API_KEY`
- `INVITE_EMAIL_FROM`

### Production (App Hosting)

Configure via [`apphosting.yaml`](apphosting.yaml) and Cloud Secret Manager. Console values override `apphosting.yaml`.

**Public (BUILD + RUNTIME):** all `NEXT_PUBLIC_*` above.

**Secrets (RUNTIME):**

- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `RESEND_API_KEY`
- `INVITE_BASE_URL` — must be the public URL (`https://{backend-id}--team-ai-knowledge-app.{region}.hosted.app` or custom domain)
- `NEXT_PUBLIC_APP_URL` — same host as `INVITE_BASE_URL` (required for Server Actions `allowedOrigins` in `next.config.ts`)

Create secrets:

```bash
firebase apphosting:secrets:set FIREBASE_PRIVATE_KEY --project team-ai-knowledge-app
firebase apphosting:secrets:set FIREBASE_CLIENT_EMAIL --project team-ai-knowledge-app
firebase apphosting:secrets:set RESEND_API_KEY --project team-ai-knowledge-app
firebase apphosting:secrets:set INVITE_BASE_URL --project team-ai-knowledge-app
firebase apphosting:secrets:set NEXT_PUBLIC_APP_URL --project team-ai-knowledge-app
firebase apphosting:secrets:set NEXT_PUBLIC_FIREBASE_API_KEY --project team-ai-knowledge-app
firebase apphosting:secrets:set NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN --project team-ai-knowledge-app
firebase apphosting:secrets:set NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID --project team-ai-knowledge-app
firebase apphosting:secrets:set NEXT_PUBLIC_FIREBASE_APP_ID --project team-ai-knowledge-app
firebase apphosting:secrets:set NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID --project team-ai-knowledge-app
firebase apphosting:secrets:grantaccess
```

After the first backend is created, set `INVITE_BASE_URL` and `NEXT_PUBLIC_APP_URL` to the live `*.hosted.app` URL (or custom domain).

## Firebase infra (separate from App Hosting)

App Hosting deploys only the Next.js app. Rules, indexes, and Cloud Functions deploy via CLI:

```bash
./scripts/firebase-deploy-infra.sh
# or
bun run firebase:deploy:rules
bun run firebase:deploy:functions
```

**Already deployed:** Firestore rules + composite index on `workspaces` (`status`, `purgeScheduledAt`).

**Pending (requires Blaze + Storage enabled):** Storage rules, Cloud Functions.

## Create App Hosting backend (one-time)

1. Firebase console → **Hosting & Serverless → App Hosting → Create backend**
2. Region: `us-central1` (aligned with scheduled functions)
3. Connect GitHub repo, live branch `main`, root directory `/`
4. Enable **automatic rollouts**
5. Create and link a Firebase Web App
6. Backend name suggestion: `team-ai-knowledge-web`

Or via CLI after `firebase login --reauth` and **Blaze upgrade**:

```bash
./scripts/apphosting-create-backend.sh
# or
firebase apphosting:backends:create --project team-ai-knowledge-app
```

Configure secrets before the first rollout:

```bash
./scripts/setup-apphosting-secrets.sh
```

Live URL format: `https://{backend-id}--team-ai-knowledge-app.{region}.hosted.app`

## Post-deploy checklist

- [ ] Rollout status **SUCCESS** in App Hosting console
- [ ] No `FIREBASE_CONFIG_MISSING` in Cloud Run logs
- [ ] Sign-in / sign-up works; `__session` cookie is `secure` over HTTPS
- [ ] Private routes: `/board`, `/knowledge`, `/skills`, `/team`
- [ ] Workspace invites send email with correct `INVITE_BASE_URL`
- [ ] `POST /api/mcp/connect` accepts valid workspace API key
- [ ] Firestore composite index on `workspaces` (`status`, `purgeScheduledAt`) is **Enabled**
- [ ] Authentication **Authorized domains** includes `*.hosted.app` and custom domain
- [ ] Web API key restricted to production domains
- [ ] `ALLOW_INSECURE_DEV_AUTH` is not set (or `false`) in production

## Notes

- `FIREBASE_PRIVATE_KEY` may use escaped line breaks (`\\n`); runtime converts to real newlines.
- Use separate service accounts for dev and production.
- Do not commit `.env.local` or service account JSON files.
