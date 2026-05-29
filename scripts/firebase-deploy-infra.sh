#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID="${FIREBASE_PROJECT_ID:-team-ai-knowledge-app}"

echo "Deploying Firebase infra to $PROJECT_ID"
echo "Prerequisites: Blaze plan, Storage enabled in console"
echo ""

firebase use "$PROJECT_ID"

echo "→ Firestore rules + indexes"
firebase deploy --only firestore:rules,firestore:indexes

echo "→ Storage rules (requires Storage enabled in console)"
firebase deploy --only storage || {
  echo "Storage deploy failed. Enable Storage:"
  echo "https://console.firebase.google.com/project/$PROJECT_ID/storage"
  exit 1
}

echo "→ Cloud Functions (requires Blaze)"
(cd functions && pnpm install --frozen-lockfile 2>/dev/null || npm install)
firebase deploy --only functions

echo "Infra deploy complete."
