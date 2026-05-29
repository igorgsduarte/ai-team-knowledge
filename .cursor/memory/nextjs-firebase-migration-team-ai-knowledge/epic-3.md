---
name: "Épico 3: Migração para Firebase Auth"
todos:
  - id: T3.1
    content: "Definir camada de autenticação e sessão no Next.js"
    status: completed
  - id: T3.2
    content: "Migrar telas de login/cadastro e proteção de rotas"
    status: completed
  - id: T3.3
    content: "Associar identidade Firebase com perfil e membership de workspace"
    status: completed
decisions: D-05
goal: "Usuários autenticam com Firebase Auth e acessam apenas os dados do workspace autorizado."
---

# Épico 3: Migração para Firebase Auth

> **Goal observável:** Usuários autenticam com Firebase Auth e acessam apenas os dados do workspace autorizado.
>
> **Covers decisions:** D-05

- [x] **T3.1** — Definir camada de autenticação e sessão no Next.js

  ```yaml
  id: T3.1
  title: "Implementar helpers de auth client/admin e sessão"
  action: |
    Criar integração Firebase Auth para cliente e servidor com utilitários de sessão reutilizáveis.
    Definir o contrato de usuário autenticado consumido por Server Actions e páginas SSR.
  files:
    - lib/firebase/client.ts
    - lib/firebase/admin.ts
    - lib/firebase/auth.ts
  depends_on: T2.3
  refs:
    - D-05
  verify: "Helpers de autenticação permitem identificar usuário autenticado em ambiente server e client."
  done: "A aplicação possui camada única de autenticação Firebase disponível para SSR e actions."
  ```

- [x] **T3.2** — Migrar telas de login/cadastro e proteção de rotas

  ```yaml
  id: T3.2
  title: "Substituir fluxo Clerk por Firebase Auth"
  action: |
    Implementar telas de sign-in/sign-up com Firebase Auth e middleware de proteção para rotas privadas.
    Garantir redirecionamento consistente entre áreas públicas e autenticadas.
  files:
    - app/(auth)/sign-in/page.tsx
    - app/(auth)/sign-up/page.tsx
    - middleware.ts
    - app/layout.tsx
  depends_on: T3.1
  refs:
    - D-05
  verify: "Usuário não autenticado é barrado nas rotas privadas e usuário autenticado acessa área interna."
  done: "Autenticação por Firebase substitui Clerk no fluxo de entrada e guarda de rotas."
  ```

- [x] **T3.3** — Associar identidade Firebase com perfil e membership de workspace

  ```yaml
  id: T3.3
  title: "Vincular auth à identidade de domínio e workspace"
  action: |
    Sincronizar uid do Firebase com o perfil interno do usuário e resolver workspace ativo.
    Garantir que Server Actions recebam contexto autenticado completo com userId e workspaceId antes de operações de dados.
  files:
    - app/actions/workspaces.ts
    - lib/repositories/boards-repository.ts
    - lib/repositories/knowledge-repository.ts
    - lib/repositories/skills-repository.ts
    - lib/repositories/comments-repository.ts
  depends_on: T3.2
  refs:
    - D-05
  verify: "Operações de dados falham sem sessão válida e funcionam com associação correta de usuário/workspace."
  done: "Identidade autenticada passa a governar autorização em todos os fluxos principais."
  ```

