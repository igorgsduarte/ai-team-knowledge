type PasswordAuthResult = {
  idToken: string;
};

function getApiKey(): string {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) {
    throw new Error("FIREBASE_CONFIG_MISSING: missing NEXT_PUBLIC_FIREBASE_API_KEY");
  }
  return apiKey;
}

export async function authenticateWithPassword(input: {
  email: string;
  password: string;
  createAccount?: boolean;
}): Promise<PasswordAuthResult> {
  const endpoint = input.createAccount ? "signUp" : "signInWithPassword";
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:${endpoint}?key=${encodeURIComponent(getApiKey())}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email: input.email,
        password: input.password,
        returnSecureToken: true,
      }),
    }
  );

  const payload = (await response.json()) as {
    idToken?: string;
    error?: { message?: string };
  };

  if (!response.ok || !payload.idToken) {
    throw new Error(payload.error?.message ?? "FIREBASE_AUTH_FAILED");
  }

  return { idToken: payload.idToken };
}
