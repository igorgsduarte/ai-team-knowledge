---
name: "Épico 3: Auth Firebase completo e proteção de rotas"
todos:
  - id: T3.1
    content: "Implementar forms reais de sign-in e sign-up"
    status: completed
  - id: T3.2
    content: "Integrar sessão, cookies e guardas de rota"
    status: completed
decisions: D-02, D-03, D-04
goal: "Login/cadastro Firebase operam de ponta a ponta com proteção correta de rotas privadas."
---

# Épico 3: Auth Firebase completo e proteção de rotas

> **Goal observável:** Login/cadastro Firebase operam de ponta a ponta com proteção correta de rotas privadas.
>
> **Covers decisions:** D-02, D-03, D-04

- [x] **T3.1** — Implementar forms reais de sign-in e sign-up

  ```yaml
  id: T3.1
  title: "Substituir placeholders de auth por fluxo Firebase funcional"
  action: |
    Implementar componentes de formulário para cadastro e login com Firebase Auth client.
    Persistir sessão em cookies esperados pelo servidor e tratar mensagens de erro/estado de carregamento.
    Remover textos estáticos sem integração real nas páginas de autenticação.
  files:
    - src/app/(auth)/sign-in/page.tsx
    - src/app/(auth)/sign-in/sign-in-form.tsx
    - src/app/(auth)/sign-up/page.tsx
    - src/app/(auth)/sign-up/sign-up-form.tsx
    - src/lib/firebase/client.ts
  depends_on: T2.2
  refs:
    - D-02
    - D-03
  verify: "Usuário consegue cadastrar e autenticar com Firebase em fluxo completo nas telas de autenticação."
  done: "Páginas sign-in/sign-up estão conectadas ao Firebase Auth real."
  ```

- [x] **T3.2** — Integrar sessão, cookies e guardas de rota

  ```yaml
  id: T3.2
  title: "Alinhar autenticação servidor/middleware com sessão real"
  action: |
    Ajustar helpers de autenticação para validar sessão de forma consistente entre server components e middleware.
    Garantir redirecionamento correto em acesso anônimo a rotas privadas e em acesso autenticado às rotas de auth.
    Cobrir vínculo mínimo de workspace na leitura de contexto autenticado.
  files:
    - src/lib/firebase/auth.ts
    - src/middleware.ts
    - src/app/(app)/dashboard/page.tsx
    - src/tests/integration/firebase-auth.test.ts
  depends_on: T3.1
  refs:
    - D-02
    - D-03
    - D-04
  verify: "Testes de integração de auth cobrem login, proteção de rota privada e redirecionamentos esperados."
  done: "Sessão autenticada é reconhecida nas camadas de servidor e borda sem inconsistências."
  ```
