#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID="${FIREBASE_PROJECT_ID:-team-ai-knowledge-app}"

echo "Project: $PROJECT_ID"
echo "Run: firebase login --reauth (if needed)"
echo ""

SECRETS=(
  FIREBASE_PRIVATE_KEY
  FIREBASE_CLIENT_EMAIL
  RESEND_API_KEY
  INVITE_BASE_URL
  NEXT_PUBLIC_APP_URL
  NEXT_PUBLIC_FIREBASE_API_KEY
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  NEXT_PUBLIC_FIREBASE_APP_ID
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
)

for secret in "${SECRETS[@]}"; do
  echo "Setting secret: $secret"
  firebase apphosting:secrets:set "$secret" --project "$PROJECT_ID"
done

echo ""
echo "Granting App Hosting access to secrets..."
firebase apphosting:secrets:grantaccess --project "$PROJECT_ID"

echo ""
echo "Done. Update INVITE_BASE_URL and NEXT_PUBLIC_APP_URL after the backend URL is known."
