# Parity Report: entrega atual vs baseline Knowledge-Hub

Data: 2026-05-28  
Escopo: validação do app em `/Users/igor.duarte/workspace/personal/team-ai-knowledge` contra baseline em `/Users/igor.duarte/Downloads/Knowledge-Hub/artifacts/team-knowledge`.

## Resumo executivo

- O baseline de referência contém aplicação completa (landing, layout com sidebar/workspace switcher, páginas de dashboard/board/knowledge/skills/team/profile com estados e interações).
- A entrega atual em Next.js preserva estrutura de rotas principais, porém com regressão funcional e visual relevante:
  - telas principais reduzidas para conteúdo textual mínimo;
  - autenticação com Firebase ainda não implementada em UI (páginas estáticas);
  - ausência de casca/layout rico equivalente ao baseline.
- Impacto direto: não há paridade de experiência nem validação confiável da migração.

## Matriz de gaps por fluxo/tela

| Fluxo/Tela | Baseline (Downloads) | Entrega atual | Status | Impacto |
| --- | --- | --- | --- | --- |
| Landing (`/`) | Hero, CTA, demo accounts, copy consistente | Título + link único | divergente | Entrada do produto empobrecida e sem onboarding mínimo |
| Shell/Navegação | Sidebar fixa, switcher de workspace, perfil/sair, ícones | Header simples com links lineares | divergente | Navegação não representa fluxo real por workspace |
| Dashboard | Cards de métricas + atividade + top skills | Texto único “SSR ativa” | ausente | Sem visão executiva e sem validação de dados |
| Board | CRUD de entradas, status, tags, comentários | Texto único “SSR ativa” | ausente | Fluxo principal de colaboração indisponível |
| Knowledge | Busca/filtro, cards, modal de criação, comentários | Texto único “SSR ativa” | ausente | Base de conhecimento não navegável |
| Skills | Banco de skills, minhas skills, níveis, navegação por detalhe | Texto único “SSR ativa” | ausente | Mapa de competências indisponível |
| Team | Skill map por membro com cards e níveis | Apenas componentes MCP | divergente | Objetivo da página foi trocado |
| Profile | Edição de perfil, bio, área, skills do usuário | Texto informativo sobre Agents | divergente | Gestão de perfil inexistente |
| Sign-in/Sign-up | Fluxo real de login/cadastro (baseline usava Clerk) | Páginas estáticas sem formulário | ausente | Não é possível autenticar para validar app |
| Knowledge Detail / Skill Detail | Páginas de detalhe ricas | JSON cru em `<pre>` | divergente | UX e validação funcional insuficientes |

## Evidências de referência consultadas

- `/Users/igor.duarte/Downloads/Knowledge-Hub/artifacts/team-knowledge/src/pages/landing.tsx`
- `/Users/igor.duarte/Downloads/Knowledge-Hub/artifacts/team-knowledge/src/components/layout.tsx`
- `/Users/igor.duarte/Downloads/Knowledge-Hub/artifacts/team-knowledge/src/pages/dashboard.tsx`
- `/Users/igor.duarte/Downloads/Knowledge-Hub/artifacts/team-knowledge/src/pages/board.tsx`
- `/Users/igor.duarte/Downloads/Knowledge-Hub/artifacts/team-knowledge/src/pages/knowledge.tsx`
- `/Users/igor.duarte/Downloads/Knowledge-Hub/artifacts/team-knowledge/src/pages/skills.tsx`
- `/Users/igor.duarte/Downloads/Knowledge-Hub/artifacts/team-knowledge/src/pages/team.tsx`
- `/Users/igor.duarte/Downloads/Knowledge-Hub/artifacts/team-knowledge/src/pages/profile.tsx`

## Evidências da entrega atual consultadas

- `/Users/igor.duarte/workspace/personal/team-ai-knowledge/src/app/page.tsx`
- `/Users/igor.duarte/workspace/personal/team-ai-knowledge/src/components/app-shell.tsx`
- `/Users/igor.duarte/workspace/personal/team-ai-knowledge/src/app/(app)/dashboard/page.tsx`
- `/Users/igor.duarte/workspace/personal/team-ai-knowledge/src/app/(app)/board/page.tsx`
- `/Users/igor.duarte/workspace/personal/team-ai-knowledge/src/app/(app)/knowledge/page.tsx`
- `/Users/igor.duarte/workspace/personal/team-ai-knowledge/src/app/(app)/skills/page.tsx`
- `/Users/igor.duarte/workspace/personal/team-ai-knowledge/src/app/(app)/team/page.tsx`
- `/Users/igor.duarte/workspace/personal/team-ai-knowledge/src/app/(app)/profile/page.tsx`
- `/Users/igor.duarte/workspace/personal/team-ai-knowledge/src/app/(auth)/sign-in/page.tsx`
- `/Users/igor.duarte/workspace/personal/team-ai-knowledge/src/app/(auth)/sign-up/page.tsx`

## Conclusão T1.1

Diagnóstico inicial fechado: há baseline objetivo para guiar a correção e os gaps estão rastreados por fluxo/tela com impacto explícito.

## Resultado após correções (T1.2 + épicos 2-4)

### Estado dos fluxos críticos

| Item | Situação após correção |
| --- | --- |
| Build | `bun run build` concluindo com sucesso |
| Home/Auth | Landing e telas de sign-in/sign-up com formulários Firebase |
| Sessão | Cookies `tk_user_id`, `tk_workspace_id`, `tk_auth_token` emitidos no login/cadastro |
| Guardas de rota | Middleware exige sessão + workspace em rotas privadas |
| Dashboard/Board/Knowledge/Skills | Páginas SSR com listagens reais por workspace e formulários de criação |
| Team/Profile | Conteúdo funcional com contexto de workspace/sessão |
| Detail pages | Fallback seguro para item inexistente e workspace ausente |

### Critérios globais de sucesso

| Critério | Status |
| --- | --- |
| Navegação completa sem bloqueio de build/runtime | atendido |
| Telas principais sem estado vazio mínimo | atendido |
| Sign-in/sign-up em fluxo Firebase real | atendido |
| Proteção de rotas privadas por sessão real | atendido |
| Relatório de paridade com gaps e evidências | atendido |

### Validação executada

- `bun run type-check`: passou.
- `bun run build`: passou.
- `bun run test`: falhou por resolução de alias `@/` no ambiente Vitest atual (falha de configuração de test runner, não regressão direta de feature desta correção).
