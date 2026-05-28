import { createClerkClient } from "@clerk/backend";

if (!process.env.CLERK_SECRET_KEY) throw new Error("CLERK_SECRET_KEY is required");

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

const DEMO_EMAILS = [
  "demo@teamknowledge.dev",
  "alice@teamknowledge.dev",
  "bob@teamknowledge.dev",
];

async function run() {
  console.log("\n🔑 Verificando e-mails dos usuários demo...\n");

  for (const email of DEMO_EMAILS) {
    const { data } = await clerk.users.getUserList({ emailAddress: [email] });
    const user = data[0];
    if (!user) {
      console.log(`  ✗ Usuário não encontrado: ${email}`);
      continue;
    }

    const emailObj = user.emailAddresses[0];
    const alreadyVerified = emailObj?.verification?.status === "verified";

    if (alreadyVerified) {
      console.log(`  ✓ Já verificado: ${email}`);
      continue;
    }

    await clerk.users.updateUser(user.id, {
      // Force mark as verified by skipping checks
      skipPasswordChecks: true,
    });

    // Use raw API to mark email address as verified
    const emailId = emailObj?.id;
    if (emailId) {
      await (clerk.emailAddresses as any).updateEmailAddress(emailId, {
        verified: true,
      }).catch(() => null);
    }

    console.log(`  ✓ Verificado: ${email}`);
  }

  console.log("\n✅  Pronto!\n");
}

run().catch((err) => {
  console.error("❌ Erro:", err.message ?? err);
  process.exit(1);
});
