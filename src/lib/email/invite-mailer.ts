export async function sendWorkspaceInviteEmail(input: {
  email: string;
  inviteUrl: string;
  workspaceName: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("INVITE_EMAIL_NOT_CONFIGURED");
  }

  const from = process.env.INVITE_EMAIL_FROM ?? "TeamKnowledge <onboarding@resend.dev>";
  const response = await fetch("https://api.resend.com/emails", {
    body: JSON.stringify({
      from,
      html: `<p>You were invited to join workspace <strong>${input.workspaceName}</strong>.</p><p><a href="${input.inviteUrl}">Accept invite</a></p>`,
      subject: `Invite to ${input.workspaceName}`,
      to: [input.email],
    }),
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("INVITE_EMAIL_SEND_FAILED");
  }
}
