---
name: "Épico 7: MCP por workspace com validação de API_KEY e workspace_id"
todos:
  - id: T7.1
    content: "Definir contrato de conexão MCP e regras de validação"
    status: completed
  - id: T7.2
    content: "Implementar endpoint de conexão MCP com validação de chave e workspace"
    status: completed
  - id: T7.3
    content: "Implementar ativação por workspace e testes de isolamento"
    status: completed
decisions: D-07
goal: "MCP conecta apenas quando API_KEY e workspace_id são válidos e compatíveis."
---

# Épico 7: MCP por workspace com validação de API_KEY e workspace_id

> **Goal observável:** MCP conecta apenas quando API_KEY e workspace_id são válidos e compatíveis.
>
> **Covers decisions:** D-07

- [x] **T7.1** — Definir contrato de conexão MCP e regras de validação

  ```yaml
  id: T7.1
  title: "Especificar protocolo de autenticação MCP por workspace"
  action: |
    Definir payload de conexão MCP, códigos de erro, política de rate limiting e regras de ativação/desativação por workspace.
    Especificar validações obrigatórias de API key, workspace_id e status da integração antes de liberar acesso.
  files:
    - lib/types/mcp.ts
    - lib/mcp/validator.ts
  depends_on: T6.3
  refs:
    - D-07
  verify: "Contrato MCP documenta entradas, saídas e erros para todas as condições de validação."
  done: "Regra de conexão MCP por workspace fica fechada e pronta para implementação."
  ```

- [x] **T7.2** — Implementar endpoint de conexão MCP com validação de chave e workspace

  ```yaml
  id: T7.2
  title: "Criar route handler MCP autenticado por API key"
  action: |
    Implementar endpoint de conexão MCP que valide API key recebida contra hash persistido e confirme vínculo com workspace_id informado.
    Bloquear conexões inválidas com respostas explícitas e registrar auditoria de tentativas.
  files:
    - app/api/mcp/connect/route.ts
    - app/api/mcp/status/route.ts
    - lib/mcp/validator.ts
    - lib/repositories/mcp-repository.ts
  depends_on: T7.1
  refs:
    - D-07
  verify: "Endpoint aceita apenas chave válida do workspace correto e rejeita combinações inválidas."
  done: "Conexão MCP está protegida por validação de API key e workspace no backend."
  ```

- [x] **T7.3** — Implementar ativação por workspace e testes de isolamento

  ```yaml
  id: T7.3
  title: "Finalizar fluxo de ativação MCP e validar isolamento entre workspaces"
  action: |
    Implementar ação administrativa para ativar/desativar MCP por workspace e integrar com a interface do produto.
    Criar testes de integração para validar sucesso de conexão no workspace autorizado e bloqueio em cenários cruzados.
  files:
    - app/actions/mcp-connections.ts
    - components/mcp/mcp-activation-form.tsx
    - tests/integration/mcp-connection.test.ts
    - tests/integration/workspace-data.test.ts
  depends_on: T7.2
  refs:
    - D-07
  verify: "Testes de integração cobrem conexão válida, key inválida e workspace_id incompatível."
  done: "MCP por workspace fica operacional com ativação explícita e isolamento verificado por teste."
  ```

