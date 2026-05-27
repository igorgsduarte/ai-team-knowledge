import { createClerkClient } from "@clerk/backend";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { eq, sql } from "drizzle-orm";
import {
  usersTable,
  skillsTable,
  userSkillsTable,
  knowledgeTable,
  boardsTable,
  commentsTable,
} from "../../lib/db/src/schema/index.js";

const { Pool } = pg;

if (!process.env.CLERK_SECRET_KEY) throw new Error("CLERK_SECRET_KEY is required");
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

const DEMO_EMAIL = "demo@teamknowledge.dev";
const DEMO_PASSWORD = "TeamKnowledge@2024";

async function getOrCreateClerkUser(email: string, password: string, firstName: string, lastName: string) {
  const existing = await clerk.users.getUserList({ emailAddress: [email] });
  if (existing.data.length > 0) {
    console.log(`  ✓ Clerk user already exists: ${email}`);
    return existing.data[0];
  }
  const user = await clerk.users.createUser({
    emailAddress: [email],
    password,
    firstName,
    lastName,
    skipPasswordChecks: false,
  });
  console.log(`  ✓ Created Clerk user: ${email} (id: ${user.id})`);
  return user;
}

async function seedUser(clerkId: string, name: string, email: string, bio: string, area: string) {
  const existing = await db.select().from(usersTable).where(eq(usersTable.clerkId, clerkId)).limit(1);
  if (existing.length > 0) {
    console.log(`  ✓ DB user already exists: ${name}`);
    return existing[0];
  }
  const [user] = await db.insert(usersTable).values({ clerkId, name, email, bio, area }).returning();
  console.log(`  ✓ Created DB user: ${name}`);
  return user;
}

async function run() {
  console.log("\n🌱 TeamKnowledge Seed Script");
  console.log("─────────────────────────────────\n");

  // ── 1. Clerk users ──
  console.log("1/5  Creating Clerk users...");
  const demoClerkUser = await getOrCreateClerkUser(DEMO_EMAIL, DEMO_PASSWORD, "Demo", "User");
  const aliceClerkUser = await getOrCreateClerkUser("alice@teamknowledge.dev", DEMO_PASSWORD, "Alice", "Ferreira");
  const bobClerkUser = await getOrCreateClerkUser("bob@teamknowledge.dev", DEMO_PASSWORD, "Bob", "Oliveira");

  // ── 2. DB users ──
  console.log("\n2/5  Creating DB users...");
  const demoUser = await seedUser(demoClerkUser.id, "Demo User", DEMO_EMAIL, "Conta de demonstração do TeamKnowledge.", "QA / Demonstração");
  const alice = await seedUser(aliceClerkUser.id, "Alice Ferreira", "alice@teamknowledge.dev", "Frontend engineer apaixonada por design systems e acessibilidade.", "Frontend Engineer");
  const bob = await seedUser(bobClerkUser.id, "Bob Oliveira", "bob@teamknowledge.dev", "Data scientist explorando ML em produção.", "Data Scientist");

  // ── 3. Skills ──
  console.log("\n3/5  Creating skills...");
  const skillDefs = [
    { name: "TypeScript", description: "Linguagem tipada baseada em JavaScript", tags: ["frontend", "backend", "linguagem"] },
    { name: "React", description: "Biblioteca para interfaces declarativas", tags: ["frontend", "ui", "framework"] },
    { name: "Python", description: "Linguagem versátil para ciência de dados e automação", tags: ["backend", "data", "linguagem"] },
    { name: "Figma", description: "Ferramenta de design colaborativo", tags: ["design", "ux", "ferramenta"] },
    { name: "PostgreSQL", description: "Banco de dados relacional open-source", tags: ["backend", "dados", "banco"] },
    { name: "Machine Learning", description: "Modelos preditivos e análise de dados", tags: ["data", "ia", "algoritmos"] },
    { name: "Node.js", description: "Runtime JavaScript no servidor", tags: ["backend", "javascript", "runtime"] },
    { name: "Drizzle ORM", description: "ORM TypeScript type-safe para bancos SQL", tags: ["backend", "banco", "typescript"] },
    { name: "Product Management", description: "Gestão de produto, discovery e roadmap", tags: ["produto", "gestão", "estratégia"] },
    { name: "Acessibilidade Web", description: "Práticas WCAG e desenvolvimento inclusivo", tags: ["frontend", "ux", "inclusão"] },
  ];

  const skillIds: Record<string, number> = {};
  for (const s of skillDefs) {
    const existing = await db.select().from(skillsTable).where(eq(skillsTable.name, s.name)).limit(1);
    if (existing.length > 0) {
      skillIds[s.name] = existing[0].id;
      console.log(`  ✓ Skill already exists: ${s.name}`);
    } else {
      const [skill] = await db.insert(skillsTable).values(s).returning();
      skillIds[s.name] = skill.id;
      console.log(`  ✓ Created skill: ${s.name}`);
    }
  }

  // ── 4. User skills ──
  console.log("\n4/5  Associating skills to users...");
  const userSkillDefs = [
    { userId: demoUser.id, skillName: "TypeScript", level: "intermediate" },
    { userId: demoUser.id, skillName: "React", level: "beginner" },
    { userId: demoUser.id, skillName: "PostgreSQL", level: "beginner" },
    { userId: alice.id, skillName: "TypeScript", level: "advanced" },
    { userId: alice.id, skillName: "React", level: "advanced" },
    { userId: alice.id, skillName: "Figma", level: "intermediate" },
    { userId: alice.id, skillName: "Acessibilidade Web", level: "advanced" },
    { userId: bob.id, skillName: "Python", level: "advanced" },
    { userId: bob.id, skillName: "Machine Learning", level: "intermediate" },
    { userId: bob.id, skillName: "PostgreSQL", level: "intermediate" },
    { userId: bob.id, skillName: "TypeScript", level: "beginner" },
  ];

  for (const us of userSkillDefs) {
    const exists = await db.select().from(userSkillsTable)
      .where(sql`${userSkillsTable.userId} = ${us.userId} AND ${userSkillsTable.skillId} = ${skillIds[us.skillName]}`)
      .limit(1);
    if (exists.length === 0) {
      await db.insert(userSkillsTable).values({ userId: us.userId, skillId: skillIds[us.skillName]!, level: us.level }).returning();
    }
    console.log(`  ✓ ${us.userId === demoUser.id ? "Demo" : us.userId === alice.id ? "Alice" : "Bob"} → ${us.skillName} (${us.level})`);
  }

  // ── 5. Knowledge & Boards ──
  console.log("\n5/5  Creating knowledge entries and board posts...");

  const knowledgeDefs = [
    {
      authorId: alice.id,
      type: "article",
      title: "Por que TypeScript vale o investimento em 2024",
      content: `TypeScript se tornou o padrão de facto para projetos JavaScript de médio e grande porte. Neste artigo, exploro os três benefícios que mais impactaram nossa produtividade:\n\n1. **Refatorações sem medo**: o compilador te avisa antes de quebrar algo em produção.\n2. **Auto-complete preciso**: o editor sabe o que cada função retorna, mesmo sem ler o código fonte.\n3. **Onboarding mais rápido**: novos devs entendem a API de um módulo apenas lendo os tipos.\n\nA curva de aprendizado inicial é real, mas o ROI aparece nas primeiras semanas de uso consistente.`,
      description: null,
      url: null,
      tags: ["typescript", "frontend", "produtividade"],
    },
    {
      authorId: alice.id,
      type: "link",
      title: "React Compiler – documentação oficial",
      content: null,
      description: "O React Compiler automatiza memoização. Leitura obrigatória antes de qualquer refatoração de performance.",
      url: "https://react.dev/learn/react-compiler",
      tags: ["react", "performance", "compilador"],
    },
    {
      authorId: bob.id,
      type: "article",
      title: "Embeddings vetoriais: do conceito ao produto",
      content: `Embeddings transformam texto, imagem ou qualquer dado em vetores numéricos de alta dimensão que capturam semântica. Isso permite:\n\n- **Busca semântica**: encontrar documentos por significado, não por palavras-chave.\n- **Recomendações**: calcular similaridade entre itens em milissegundos.\n- **RAG**: enriquecer prompts de LLMs com contexto relevante recuperado do banco vetorial.\n\nFerramentas que uso em produção: pgvector para armazenar embeddings no Postgres, e a API de embeddings da OpenAI (text-embedding-3-small) para geração.`,
      description: null,
      url: null,
      tags: ["machine-learning", "ia", "embeddings", "python"],
    },
    {
      authorId: bob.id,
      type: "link",
      title: "pgvector – extensão de busca vetorial para Postgres",
      content: null,
      description: "Adicione busca vetorial ao seu Postgres existente sem mudar de banco. Suporta HNSW e IVFFlat.",
      url: "https://github.com/pgvector/pgvector",
      tags: ["postgresql", "machine-learning", "banco"],
    },
    {
      authorId: demoUser.id,
      type: "link",
      title: "Drizzle ORM – guia de início rápido",
      content: null,
      description: "ORM TypeScript com API fluente e suporte a migrations. Ótima alternativa ao Prisma com DX superior.",
      url: "https://orm.drizzle.team/docs/get-started",
      tags: ["typescript", "backend", "banco"],
    },
  ];

  const knowledgeIds: number[] = [];
  for (const k of knowledgeDefs) {
    const existing = await db.select().from(knowledgeTable).where(eq(knowledgeTable.title, k.title)).limit(1);
    if (existing.length > 0) {
      knowledgeIds.push(existing[0].id);
      console.log(`  ✓ Knowledge already exists: ${k.title}`);
    } else {
      const [entry] = await db.insert(knowledgeTable).values({
        authorId: k.authorId,
        type: k.type,
        title: k.title,
        content: k.content ?? null,
        description: k.description ?? null,
        url: k.url ?? null,
        tags: k.tags,
      }).returning();
      knowledgeIds.push(entry.id);
      console.log(`  ✓ Created knowledge: ${k.title}`);
    }
  }

  const boardDefs = [
    {
      authorId: alice.id,
      title: "Migrando nosso design system para Tailwind v4",
      content: "Estou mapeando todos os tokens de cor e espaçamento do sistema atual para avaliar o esforço de migração. A API CSS-first do Tailwind v4 parece muito mais alinhada com nosso uso real de variáveis.",
      status: "doing",
      tags: ["css", "tailwind", "design-system"],
    },
    {
      authorId: alice.id,
      title: "Estudando WCAG 2.2 – novos critérios",
      content: "Focus Appearance e Target Size foram os critérios que mais impactaram nosso componente de botão. Documentando as mudanças necessárias.",
      status: "done",
      tags: ["acessibilidade", "wcag", "frontend"],
    },
    {
      authorId: bob.id,
      title: "Pipeline de fine-tuning com LoRA",
      content: "Explorando LoRA (Low-Rank Adaptation) para ajustar modelos open-source sem custos proibitivos de GPU. Usando a biblioteca PEFT da Hugging Face.",
      status: "learning",
      tags: ["machine-learning", "llm", "python"],
    },
    {
      authorId: bob.id,
      title: "Dashboard de monitoramento de modelos em produção",
      content: "Construindo um dashboard com métricas de drift e latência para os modelos que temos em produção. Stack: Grafana + PostgreSQL + Python.",
      status: "doing",
      tags: ["mlops", "python", "monitoramento"],
    },
    {
      authorId: demoUser.id,
      title: "Aprendendo Drizzle ORM",
      content: "Migrando do Prisma para o Drizzle neste projeto. A DX com TypeScript é notavelmente melhor — os tipos inferidos do schema são precisos.",
      status: "done",
      tags: ["typescript", "drizzle", "backend"],
    },
    {
      authorId: demoUser.id,
      title: "Explorar React Query v5 – novidades",
      content: "A v5 unificou as APIs de mutations e queries. Revisando como o useQueryClient().invalidateQueries funciona com a nova sintaxe de filtros.",
      status: "learning",
      tags: ["react", "react-query", "frontend"],
    },
  ];

  const boardIds: number[] = [];
  for (const b of boardDefs) {
    const existing = await db.select().from(boardsTable).where(eq(boardsTable.title, b.title)).limit(1);
    if (existing.length > 0) {
      boardIds.push(existing[0].id);
      console.log(`  ✓ Board already exists: ${b.title}`);
    } else {
      const [entry] = await db.insert(boardsTable).values({
        authorId: b.authorId,
        title: b.title,
        content: b.content,
        status: b.status,
        tags: b.tags,
      }).returning();
      boardIds.push(entry.id);
      console.log(`  ✓ Created board: ${b.title}`);
    }
  }

  // Comments
  const commentDefs = [
    { authorId: bob.id, boardId: boardIds[0], content: "Faz sentido! Lembra de verificar os utilitários de `@apply` que ainda usamos em alguns lugares — eles mudam na v4." },
    { authorId: demoUser.id, boardId: boardIds[0], content: "Tem algum guia de migração oficial que valha a pena seguir?" },
    { authorId: alice.id, boardId: boardIds[2], content: "LoRA é incrível para isso. Você está usando quantização QLoRA também para reduzir VRAM?" },
    { authorId: alice.id, knowledgeId: knowledgeIds[2], content: "Excelente explicação! Vale adicionar que o custo por token dos embeddings caiu bastante em 2024." },
    { authorId: bob.id, knowledgeId: knowledgeIds[0], content: "100% concordo com o ponto de refatorações seguras. Mudou completamente como trabalhamos em time." },
  ];

  for (const c of commentDefs) {
    const vals: any = { authorId: c.authorId, content: c.content };
    if (c.boardId != null) vals.boardId = c.boardId;
    if ((c as any).knowledgeId != null) vals.knowledgeId = (c as any).knowledgeId;

    await db.insert(commentsTable).values(vals);
    console.log(`  ✓ Comment by user ${c.authorId}`);
  }

  await pool.end();

  console.log("\n─────────────────────────────────");
  console.log("✅  Seed concluído!\n");
  console.log("  Credenciais de acesso:");
  console.log(`  📧 E-mail:  ${DEMO_EMAIL}`);
  console.log(`  🔑 Senha:   ${DEMO_PASSWORD}`);
  console.log("\n  Usuários adicionais (mesma senha):");
  console.log("  📧 alice@teamknowledge.dev");
  console.log("  📧 bob@teamknowledge.dev");
  console.log("─────────────────────────────────\n");
}

run().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
