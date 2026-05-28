import { createClerkClient } from "@clerk/backend";

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });

async function run() {
  const emails = ["demo@teamknowledge.dev", "alice@teamknowledge.dev", "bob@teamknowledge.dev"];
  for (const email of emails) {
    const { data } = await clerk.users.getUserList({ emailAddress: [email] });
    const user = data[0];
    if (!user) { console.log(`NOT FOUND: ${email}`); continue; }
    const emailObj = user.emailAddresses[0];
    console.log(email, "→", JSON.stringify({ verified: emailObj?.verification?.status, emailId: emailObj?.id, userId: user.id }));
  }
}
run().catch(console.error);
