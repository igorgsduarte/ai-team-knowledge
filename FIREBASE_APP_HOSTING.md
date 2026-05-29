# Firebase App Hosting - Environment Setup

## Dev (`.env.local`)
Use local-only values (do not commit):

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `FIREBASE_STORAGE_BUCKET` (optional)

## Production (Firebase App Hosting)
Configure in App Hosting environment/secrets:

- Public vars: all `NEXT_PUBLIC_FIREBASE_*`
- Private secrets: `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`
- Optional private var: `FIREBASE_STORAGE_BUCKET`
- Local seed alternative: `FIREBASE_SERVICE_ACCOUNT_JSON` can point to a downloaded service-account JSON file, or `GOOGLE_APPLICATION_CREDENTIALS` can point to that file when `FIREBASE_PROJECT_ID` is set.

## Notes
- `FIREBASE_PRIVATE_KEY` can be stored with escaped line breaks (`\\n`); runtime converts to real new lines.
- Keep Service Account separate between dev and production.
- Restrict Firebase Web API key by allowed domains and APIs.
