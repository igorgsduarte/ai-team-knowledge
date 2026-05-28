import { Router, type IRouter } from "express";
import { createClerkClient } from "@clerk/backend";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const DEMO_EMAILS = new Set([
  "demo@teamknowledge.dev",
  "alice@teamknowledge.dev",
  "bob@teamknowledge.dev",
]);

const clerkAdmin = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

router.post("/demo/sign-in", async (req, res): Promise<void> => {
  const { email } = req.body as { email?: string };

  if (!email || !DEMO_EMAILS.has(email.toLowerCase())) {
    res.status(400).json({ error: "Not a demo account" });
    return;
  }

  const { data } = await clerkAdmin.users.getUserList({
    emailAddress: [email.toLowerCase()],
  });

  const user = data[0];
  if (!user) {
    res.status(404).json({ error: "Demo user not found" });
    return;
  }

  const token = await clerkAdmin.signInTokens.createSignInToken({
    userId: user.id,
    expiresInSeconds: 300,
  });

  res.json({ token: token.token });
});

export default router;
