---
name: "Épico 1: Diagnóstico de paridade e baseline navegável"
todos:
  - id: T1.1
    content: "Inventariar gaps entre entrega atual e baseline"
    status: completed
  - id: T1.2
    content: "Corrigir baseline de execução local para permitir navegação"
    status: completed
decisions: D-01, D-05
goal: "Mapa objetivo de lacunas e ambiente local apto para inspeção navegável."
---

# Épico 1: Diagnóstico de paridade e baseline navegável

> **Goal observável:** Mapa objetivo de lacunas e ambiente local apto para inspeção navegável.
>
> **Covers decisions:** D-01, D-05

- [x] **T1.1** — Inventariar gaps entre entrega atual e baseline

  ```yaml
  id: T1.1
  title: "Consolidar relatório inicial de diferenças"
  action: |
    Comparar estrutura de rotas, componentes e fluxo de autenticação do app atual com o baseline de referência.
    Registrar em relatório os itens preservados, os itens divergentes e os itens ausentes, incluindo impacto na navegação.
    Se o baseline em Downloads permanecer ilegível, registrar bloqueio técnico com evidências e critério para destravar.
  files:
    - docs/migration/parity-report.md
    - src/app/page.tsx
    - src/components/app-shell.tsx
    - src/app/(auth)/sign-in/page.tsx
    - src/app/(auth)/sign-up/page.tsx
  depends_on: nenhum
  refs:
    - D-01
    - D-05
  verify: "Relatório contém tabela de gaps por tela/fluxo com status preservado/divergente/ausente e impacto descrito."
  done: "Existe baseline de diagnóstico aprovado para guiar correções sem ambiguidade."
  ```

- [x] **T1.2** — Corrigir baseline de execução local para permitir navegação

  ```yaml
  id: T1.2
  title: "Eliminar falhas de build/runtime que impedem validar navegação"
  action: |
    Ajustar configuração e uso de variáveis Firebase para permitir boot da aplicação em desenvolvimento com rotas públicas e privadas acessíveis.
    Garantir que páginas dinâmicas não forcem falha global quando credenciais obrigatórias não estiverem disponíveis em contexto inadequado.
  files:
    - src/lib/firebase/admin.ts
    - src/lib/firebase/auth.ts
    - src/app/(app)/knowledge/[id]/page.tsx
    - src/app/(app)/skills/[id]/page.tsx
    - .env.example
  depends_on: T1.1
  refs:
    - D-01
    - D-05
  verify: "Aplicação inicializa sem erro bloqueante e permite abrir home, auth e ao menos uma rota privada autenticada."
  done: "Ambiente local está navegável para validar visual e comportamento da migração."
  ```
