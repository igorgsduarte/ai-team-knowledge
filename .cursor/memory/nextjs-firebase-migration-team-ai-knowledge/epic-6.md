---
name: "Épico 6: API_KEY MCP por workspace"
todos:
  - id: T6.1
    content: "Definir política de ciclo de vida e segurança das API keys"
    status: completed
  - id: T6.2
    content: "Implementar geração, hash, rotação e revogação de API keys"
    status: completed
  - id: T6.3
    content: "Entregar painel de gestão de API keys por workspace"
    status: completed
decisions: D-07
goal: "Cada workspace gera e gerencia API keys MCP com armazenamento seguro e auditoria."
---

# Épico 6: API_KEY MCP por workspace

> **Goal observável:** Cada workspace gera e gerencia API keys MCP com armazenamento seguro e auditoria.
>
> **Covers decisions:** D-07

- [x] **T6.1** — Definir política de ciclo de vida e segurança das API keys

  ```yaml
  id: T6.1
  title: "Modelar regras de API key e metadados de auditoria"
  action: |
    Definir formato da chave, política de expiração, escopo por workspace e regras de revogação.
    Definir quais metadados ficam em Firestore (hash, prefixo, status, criação, rotação, revogação e ator responsável).
  files:
    - lib/types/mcp.ts
    - lib/repositories/mcp-repository.ts
  depends_on: T5.3
  refs:
    - D-07
  verify: "Política de API key cobre criação, uso, rotação, revogação e trilha de auditoria."
  done: "Contrato de segurança de API key está definido para implementação consistente."
  ```

- [x] **T6.2** — Implementar geração, hash, rotação e revogação de API keys

  ```yaml
  id: T6.2
  title: "Criar backend seguro para ciclo de vida de API keys"
  action: |
    Implementar geração de segredo aleatório, hash forte para armazenamento e comparação segura de segredo apresentado.
    Criar Server Actions para criar, rotacionar e revogar keys por workspace com controle de permissões.
  files:
    - lib/mcp/key-hash.ts
    - lib/repositories/mcp-repository.ts
    - app/actions/mcp-keys.ts
  depends_on: T6.1
  refs:
    - D-07
  verify: "Sistema não persiste segredo em texto puro e permite rotação/revogação por workspace."
  done: "Ciclo completo de API keys MCP está funcional e seguro no backend."
  ```

- [x] **T6.3** — Entregar painel de gestão de API keys por workspace

  ```yaml
  id: T6.3
  title: "Expor UX de governança de API keys"
  action: |
    Implementar interface para criar, visualizar metadados, rotacionar e revogar API keys de MCP.
    Exibir status da chave ativa, data de expiração e histórico de operações administrativas.
  files:
    - components/mcp/mcp-key-panel.tsx
    - app/(app)/team/page.tsx
    - app/actions/mcp-keys.ts
  depends_on: T6.2
  refs:
    - D-07
  verify: "Workspace consegue gerenciar API keys via interface e ações refletem estado persistido."
  done: "Governança de API keys MCP está disponível para administradores do workspace."
  ```

