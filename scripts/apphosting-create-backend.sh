#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID="${FIREBASE_PROJECT_ID:-team-ai-knowledge-app}"

echo "App Hosting backend bootstrap for $PROJECT_ID"
echo ""
echo "Prerequisites:"
echo "  1. Blaze plan: https://console.firebase.google.com/project/$PROJECT_ID/usage/details"
echo "  2. GitHub repo connected (origin main → igorgsduarte/ai-team-knowledge)"
echo "  3. apphosting.yaml + pnpm-lock.yaml committed on main"
echo "  4. Secrets configured: ./scripts/setup-apphosting-secrets.sh"
echo ""

firebase use "$PROJECT_ID"

echo "Creating App Hosting backend (interactive)..."
firebase apphosting:backends:create --project "$PROJECT_ID"

echo ""
echo "After backend is created:"
echo "  1. Set INVITE_BASE_URL and NEXT_PUBLIC_APP_URL to https://{backend-id}--$PROJECT_ID.{region}.hosted.app"
echo "  2. Add *.hosted.app to Authentication → Authorized domains"
echo "  3. Push to main to trigger automatic rollout"
