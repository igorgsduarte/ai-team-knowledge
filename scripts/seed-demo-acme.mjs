import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { applicationDefault, cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const workspaceId = "acme";
const now = new Date().toISOString();
const password = process.env.DEMO_USER_PASSWORD || "TeamKnowledge@2024";

const demoUsers = [
  {
    uid: "acme-alice",
    email: "alice@teamknowledge.dev",
    displayName: "Alice Ferreira",
    area: "Frontend Engineer",
    role: "owner",
    locale: "pt-BR",
    bio: "Especialista em React e design systems para o workspace Acme.",
  },
  {
    uid: "acme-bob",
    email: "bob@teamknowledge.dev",
    displayName: "Bob Oliveira",
    area: "Data Scientist",
    role: "member",
    locale: "pt-BR",
    bio: "Foco em pipelines de dados e experimentação com modelos.",
  },
  {
    uid: "acme-demo",
    email: "demo@teamknowledge.dev",
    displayName: "Demo User",
    area: "QA / Demonstração",
    role: "member",
    locale: "pt-BR",
    bio: "Conta de demonstração para validar a paridade visual da UI.",
  },
];

function loadEnvFile(fileName) {
  const file = resolve(process.cwd(), fileName);
  if (!existsSync(file)) {
    return;
  }

  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }

    const [key, ...rest] = trimmed.split("=");
    if (process.env[key]) {
      continue;
    }

    let value = rest.join("=").trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

function firstEnv(...names) {
  for (const name of names) {
    const value = process.env[name];
    if (value) {
      return value;
    }
  }
  return "";
}

function requiredEnv(...names) {
  const value = firstEnv(...names);
  if (!value) {
    throw new Error(`Missing required env var: ${names.join(" or ")}`);
  }
  return value;
}

function readServiceAccountJson() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) {
    return null;
  }

  const value = raw.trim();
  const json = existsSync(value) ? readFileSync(value, "utf8") : value;
  return JSON.parse(json);
}

function resolveCredential(projectId) {
  const serviceAccount = readServiceAccountJson();
  if (serviceAccount) {
    return cert({
      projectId: serviceAccount.project_id || serviceAccount.projectId || projectId,
      clientEmail: serviceAccount.client_email || serviceAccount.clientEmail,
      privateKey: String(serviceAccount.private_key || serviceAccount.privateKey || "").replace(/\\n/g, "\n"),
    });
  }

  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  if (clientEmail && privateKey) {
    return cert({
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, "\n"),
    });
  }

  return applicationDefault();
}

function initFirebase() {
  loadEnvFile(".env.local");
  loadEnvFile(".env");

  if (getApps().length) {
    return getApps()[0];
  }

  const projectId = requiredEnv(
    "FIREBASE_PROJECT_ID",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    "GOOGLE_CLOUD_PROJECT",
    "GCLOUD_PROJECT"
  );

  return initializeApp({
    credential: resolveCredential(projectId),
    projectId,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

async function upsertAuthUser(auth, user) {
  try {
    const existing = await auth.getUserByEmail(user.email);
    await auth.updateUser(existing.uid, {
      displayName: user.displayName,
      password,
      emailVerified: true,
      disabled: false,
    });
    return existing.uid;
  } catch (error) {
    if (error?.code !== "auth/user-not-found") {
      throw error;
    }

    const created = await auth.createUser({
      uid: user.uid,
      email: user.email,
      password,
      displayName: user.displayName,
      emailVerified: true,
      disabled: false,
    });
    return created.uid;
  }
}

function fallbackUidFor(user) {
  return user.uid;
}

function isAuthConfigurationMissing(error) {
  return error?.code === "auth/configuration-not-found";
}

function isFirestoreApiDisabled(error) {
  return (
    error?.reason === "SERVICE_DISABLED" ||
    /firestore\.googleapis\.com|Cloud Firestore API/.test(String(error?.message || error?.details || ""))
  );
}

async function seedFirestoreUser(db, user, uid) {
  await db.collection("users").doc(uid).set(
    {
      id: uid,
      email: user.email,
      name: user.displayName,
      area: user.area,
      bio: user.bio || `Demo user for ${workspaceId} workspace validations.`,
      avatarUrl: "",
      locale: user.locale || "pt-BR",
      createdAt: now,
      updatedAt: now,
    },
    { merge: true }
  );

  await db.collection("memberships").doc(`${workspaceId}_${uid}`).set(
    {
      id: `${workspaceId}_${uid}`,
      workspaceId,
      userId: uid,
      role: user.role,
      createdAt: now,
      updatedAt: now,
    },
    { merge: true }
  );
}

async function main() {
  initFirebase();

  const auth = getAuth();
  const db = getFirestore();
  const members = [];
  const memberIds = {};
  let authSeeded = true;
  let authConfigurationMissing = false;

  for (const user of demoUsers) {
    let uid = fallbackUidFor(user);
    try {
      uid = await upsertAuthUser(auth, user);
    } catch (error) {
      if (!isAuthConfigurationMissing(error)) {
        throw error;
      }
      authSeeded = false;
      authConfigurationMissing = true;
    }

    memberIds[user.uid] = uid;
    members.push({ userId: uid, role: user.role });
    await seedFirestoreUser(db, user, uid);
  }

  await db.collection("workspaces").doc(workspaceId).set(
    {
      id: workspaceId,
      name: "Acme",
      slug: "acme",
      members,
      createdAt: now,
      updatedAt: now,
    },
    { merge: true }
  );

  const aliceId = memberIds["acme-alice"] || members[0]?.userId;
  const bobId = memberIds["acme-bob"] || members[1]?.userId;
  const demoId = memberIds["acme-demo"] || members[2]?.userId;

  const knowledgeEntries = [
    { id: "k-1", title: "Guia de onboarding Acme", type: "article", tags: ["onboarding"], body: "# Onboarding\nProcesso para novos membros.", createdBy: aliceId },
    { id: "k-2", title: "Next.js App Router", type: "link", url: "https://nextjs.org/docs", tags: ["nextjs"], body: "Documentação oficial.", createdBy: demoId },
    { id: "k-3", title: "Padrões de repositório", type: "article", tags: ["architecture"], body: "Isolamento por workspaceId.", createdBy: bobId },
    { id: "k-4", title: "Playwright best practices", type: "link", url: "https://playwright.dev", tags: ["qa"], body: "Testes visuais e E2E.", createdBy: demoId },
    { id: "k-5", title: "Design tokens em CSS", type: "article", tags: ["ui"], body: "Usar globals.css sem Tailwind.", createdBy: aliceId },
    { id: "k-6", title: "Migrar sidebar para tema claro", type: "article", tags: ["ui", "css"], body: "## Objetivo\nAlinhar shell ao screenshot.", createdBy: aliceId },
    { id: "k-7", title: "Estudar Firestore indexes", type: "article", tags: ["firebase"], body: "Revisar índices compostos para comments.", createdBy: bobId },
    { id: "k-8", title: "Playwright visual parity", type: "article", tags: ["qa", "playwright"], body: "Automatizar comparação das quatro rotas.", createdBy: demoId },
    { id: "k-9", title: "Drawer com markdown editor", type: "article", tags: ["ui", "markdown"], body: "Integrar @uiw/react-md-editor nos formulários.", createdBy: aliceId },
    { id: "k-10", title: "Seed demo acme", type: "article", tags: ["data"], body: "Popular workspace com cards de validação.", createdBy: demoId },
    { id: "k-11", title: "Mapa de skills do time", type: "article", tags: ["skills"], body: "Cards por membro com níveis.", createdBy: bobId },
  ];

  for (const entry of knowledgeEntries) {
    const knowledgeDoc = {
      id: entry.id,
      workspaceId,
      title: entry.title,
      body: entry.body,
      summary: entry.body.slice(0, 180),
      type: entry.type,
      tags: entry.tags,
      createdBy: entry.createdBy,
      createdAt: now,
      updatedAt: now,
    };
    if (entry.url) {
      knowledgeDoc.url = entry.url;
    }
    await db.collection("knowledge").doc(entry.id).set(knowledgeDoc, { merge: true });
  }

  const skillEntries = [
    { id: "skill-1", name: "React", tags: ["frontend"], description: "Componentes, hooks e SSR." },
    { id: "skill-2", name: "TypeScript", tags: ["frontend"], description: "Tipagem estrita em domínio e UI." },
    { id: "skill-3", name: "Firebase", tags: ["backend"], description: "Auth, Firestore e Storage." },
    { id: "skill-4", name: "Playwright", tags: ["qa"], description: "Testes visuais e E2E." },
    { id: "skill-5", name: "Figma", tags: ["design"], description: "Handoff e design systems." },
    { id: "skill-6", name: "Python", tags: ["data"], description: "Scripts e notebooks." },
    { id: "skill-7", name: "SQL", tags: ["data"], description: "Consultas analíticas." },
    { id: "skill-8", name: "Product Discovery", tags: ["product"], description: "Entrevistas e priorização." },
    { id: "skill-9", name: "Next.js", tags: ["frontend"], description: "App Router e Server Actions." },
    { id: "skill-10", name: "Markdown", tags: ["content"], description: "Documentação e drawers." },
  ];

  for (const entry of skillEntries) {
    await db.collection("skills").doc(entry.id).set(
      {
        id: entry.id,
        workspaceId,
        name: entry.name,
        prompt: entry.description,
        description: entry.description,
        tags: entry.tags,
        createdBy: demoId,
        createdAt: now,
        updatedAt: now,
      },
      { merge: true }
    );
  }

  const userSkillEntries = [
    { id: "us-1", userId: aliceId, skillId: "skill-1", level: "advanced" },
    { id: "us-2", userId: aliceId, skillId: "skill-9", level: "advanced" },
    { id: "us-3", userId: bobId, skillId: "skill-6", level: "advanced" },
    { id: "us-4", userId: bobId, skillId: "skill-7", level: "intermediate" },
    { id: "us-5", userId: demoId, skillId: "skill-4", level: "intermediate" },
    { id: "us-6", userId: demoId, skillId: "skill-3", level: "beginner" },
  ];

  for (const entry of userSkillEntries) {
    await db.collection("userSkills").doc(entry.id).set({ workspaceId, ...entry }, { merge: true });
  }

  await db.collection("comments").doc("comment-1").set(
    {
      id: "comment-1",
      workspaceId,
      entityType: "knowledge",
      entityId: "k-6",
      body: "Ótimo progresso no shell.",
      createdBy: bobId,
      createdAt: now,
    },
    { merge: true }
  );

  const agentsMarkdown = `# Agents\n\n## Papel\nAssistente do workspace Acme.\n\n## Stack\nNext.js, Firebase, Playwright.\n\n## Convenções\n- Knowledge como home\n- Drawers com markdown\n- MCP oculto na UI`;
  const agentsPath = `workspaces/${workspaceId}/agents/agents-md/v1.md`;

  try {
    const { getStorage } = await import("firebase-admin/storage");
    const bucket = getStorage().bucket();
    await bucket.file(agentsPath).save(agentsMarkdown, { contentType: "text/markdown" });
    await db.collection("agents").doc("agents-seed-1").set(
      {
        id: "agents-seed-1",
        workspaceId,
        version: 1,
        status: "published",
        authorId: demoId,
        storagePath: agentsPath,
        createdAt: now,
      },
      { merge: true }
    );
    await db.collection("files").doc("agents-seed-file-1").set(
      {
        id: "agents-seed-file-1",
        workspaceId,
        entityType: "agents",
        entityId: "agents-md",
        path: agentsPath,
        version: 1,
        authorId: demoId,
        contentHash: "seed",
        contentType: "text/markdown",
        createdAt: now,
      },
      { merge: true }
    );
  } catch (error) {
    console.warn("Agents.md storage seed skipped:", error?.message || error);
  }

  console.log(`Firestore seed complete for workspace "${workspaceId}".`);
  console.log(`Password: ${password}`);
  for (const user of demoUsers) {
    console.log(`- ${user.email} (${user.role})`);
  }

  if (!authSeeded && authConfigurationMissing) {
    console.log("");
    console.log("Firebase Auth users were not created because this project has no Auth configuration yet.");
    console.log("Open Firebase Console > Authentication > Get started > Sign-in method > enable Email/Password.");
    console.log("Then run `bun run seed:demo` again to create/update the Auth users.");
    process.exitCode = 2;
  }
}

main().catch((error) => {
  if (isFirestoreApiDisabled(error)) {
    console.error("Cloud Firestore is not enabled for project team-ai-knowledge-app.");
    console.error("Enable Firestore API and create the default Firestore database, then run `bun run seed:demo` again.");
    console.error("API link: https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=team-ai-knowledge-app");
    console.error("Firebase Console: https://console.firebase.google.com/project/team-ai-knowledge-app/firestore");
    process.exitCode = 1;
    return;
  }
  console.error(error);
  if (/Could not load the default credentials|Missing required env var/.test(String(error?.message))) {
    console.error("");
    console.error("Configure one of these before running `bun run seed:demo`:");
    console.error("- FIREBASE_SERVICE_ACCOUNT_JSON=/absolute/path/to/service-account.json");
    console.error("- GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/service-account.json plus FIREBASE_PROJECT_ID");
    console.error("- FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY");
  }
  process.exitCode = 1;
});
