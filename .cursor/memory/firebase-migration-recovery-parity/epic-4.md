---
name: "Épico 4: Validação ponta a ponta e aceite"
todos:
  - id: T4.1
    content: "Executar validação comparativa final e registrar evidências"
    status: completed
  - id: T4.2
    content: "Fechar pacote de aceite técnico da correção"
    status: completed
decisions: D-01, D-04, D-05
goal: "Correção comprovada por evidências de paridade, autenticação funcional e navegação íntegra."
---

# Épico 4: Validação ponta a ponta e aceite

> **Goal observável:** Correção comprovada por evidências de paridade, autenticação funcional e navegação íntegra.
>
> **Covers decisions:** D-01, D-04, D-05

- [x] **T4.1** — Executar validação comparativa final e registrar evidências

  ```yaml
  id: T4.1
  title: "Concluir auditoria de paridade após correções"
  action: |
    Revalidar tela a tela e fluxo a fluxo entre entrega corrigida e baseline de referência.
    Atualizar relatório com evidência objetiva do que ficou equivalente, do que mudou por decisão técnica e do que permanece bloqueado.
  files:
    - docs/migration/parity-report.md
    - src/app/(app)/dashboard/page.tsx
    - src/app/(app)/board/page.tsx
    - src/app/(app)/knowledge/page.tsx
    - src/app/(app)/skills/page.tsx
    - src/app/(auth)/sign-in/page.tsx
    - src/app/(auth)/sign-up/page.tsx
  depends_on: T3.2
  refs:
    - D-01
    - D-05
  verify: "Relatório final inclui checklist por fluxo com evidência de resultado e pendências explícitas."
  done: "Paridade final foi auditada com rastreabilidade."
  ```

- [x] **T4.2** — Fechar pacote de aceite técnico da correção

  ```yaml
  id: T4.2
  title: "Consolidar critérios de aceite e cobertura mínima de testes"
  action: |
    Consolidar execução de testes de integração essenciais e validar ausência de regressão crítica em navegação e auth.
    Registrar no relatório os critérios globais atendidos e o status de cada um para liberação.
  files:
    - src/tests/integration/firebase-auth.test.ts
    - src/tests/integration/workspace-data.test.ts
    - docs/migration/parity-report.md
  depends_on: T4.1
  refs:
    - D-01
    - D-04
    - D-05
  verify: "Critérios globais de sucesso estão mapeados para evidências e status final de aceite."
  done: "Existe decisão de aceite técnico suportada por testes e relatório."
  ```
