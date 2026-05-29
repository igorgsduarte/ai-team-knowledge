---
name: "firebase-migration-recovery-parity"
status: completed
overview: "Corrigir a migração incompleta para restaurar paridade visual/funcional com o app de referência e entregar auth Firebase real navegável."
todos:
  - id: epic-1
    content: "Diagnóstico de paridade e baseline navegável"
    status: completed
  - id: epic-2
    content: "Restauração das telas e componentes principais"
    status: completed
  - id: epic-3
    content: "Auth Firebase completo e proteção de rotas"
    status: completed
  - id: epic-4
    content: "Validação ponta a ponta e aceite"
    status: completed
epics:
  - id: epic-1
    file: ./epic-1.md
  - id: epic-2
    file: ./epic-2.md
  - id: epic-3
    file: ./epic-3.md
  - id: epic-4
    file: ./epic-4.md
isProject: false
---

# Plano: firebase-migration-recovery-parity

## Problema / objetivo

A entrega marcada como concluída no plano anterior não preservou telas/componentes esperados, deixou fluxo de autenticação Firebase em placeholder e não fornece navegação confiável para validar o que foi migrado.

## Proposta de solução

Executar correção em quatro épicos: primeiro consolidar diagnóstico de gaps entre entrega atual e baseline de referência; depois restaurar páginas e componentes com SSR/Server Actions e paridade de navegação; em seguida concluir autenticação Firebase de forma funcional; por fim validar de ponta a ponta e registrar aceite com evidências objetivas.

## Critérios globais de sucesso

- O app permite navegação completa entre home, auth e áreas privadas sem bloqueios de build/runtime.
- As telas principais (dashboard, board, knowledge, skills, team, profile) deixam de ser placeholders e exibem estrutura funcional consistente com o baseline.
- Sign-in e sign-up executam fluxo Firebase Auth real, com sessão válida e redirecionamentos corretos.
- Proteção de rotas privadas usa sessão real e impede acesso anônimo sem falsos positivos.
- Existe relatório de paridade com gaps resolvidos e gaps explicitamente pendentes com decisão registrada.

## Decisões travadas (NON-NEGOTIABLE)

- D-01: Priorizar recuperação da paridade funcional e visual antes de novos incrementos de feature. — motivo: corrigir regressão da migração — origem: humano
- D-02: Manter Next.js App Router com SSR e mutações por Server Actions. — motivo: convenção do projeto — origem: humano/AGENTS
- D-03: Implementar autenticação Firebase real; placeholders de auth são proibidos. — motivo: requisito explícito — origem: humano
- D-04: Preservar isolamento por `workspaceId` nas camadas de repositório e MCP. — motivo: regra arquitetural — origem: AGENTS
- D-05: Validação final deve comparar entrega com baseline da pasta de referência e registrar evidência auditável. — motivo: requisito explícito — origem: humano

## Ideias deferidas (NÃO planejar)

- Redesign completo de UI além da paridade com baseline. — razão: fora do objetivo imediato
- Expansão de features MCP além do que já existia. — razão: foco atual é correção da migração

## Restrições técnicas conhecidas

- A pasta `/Users/igor.duarte/Downloads/Knowledge-Hub` está com leitura interna bloqueando no ambiente atual; a comparação direta depende de destravar acesso local.
- O build atual quebra por configuração obrigatória de Firebase Admin ausente em tempo de build para rotas dinâmicas.
- Não reduzir escopo com placeholders ou versões parciais.

## Épicos

- [Épico 1 — Diagnóstico de paridade e baseline navegável](./epic-1.md)
- [Épico 2 — Restauração das telas e componentes principais](./epic-2.md)
- [Épico 3 — Auth Firebase completo e proteção de rotas](./epic-3.md)
- [Épico 4 — Validação ponta a ponta e aceite](./epic-4.md)

## Organização de ficheiros alvo

Referência: `src/` na raiz do repositório.

### Criar (novos)

| Caminho | Tipo | Nota |
| ------- | ---- | ---- |
| docs/migration/parity-report.md | Documento | Relatório de comparação entregue vs baseline |
| src/app/(auth)/sign-in/sign-in-form.tsx | UI/Auth | Formulário cliente para login Firebase |
| src/app/(auth)/sign-up/sign-up-form.tsx | UI/Auth | Formulário cliente para cadastro Firebase |

### Alterar (existentes)

| Caminho | Nota |
| ------- | ---- |
| src/app/page.tsx | Ajustar entrada e caminhos de navegação |
| src/components/app-shell.tsx | Restaurar shell de navegação consistente |
| src/app/(app)/dashboard/page.tsx | Restaurar conteúdo SSR funcional |
| src/app/(app)/board/page.tsx | Restaurar conteúdo SSR funcional |
| src/app/(app)/knowledge/page.tsx | Restaurar listagem e ações de knowledge |
| src/app/(app)/knowledge/[id]/page.tsx | Melhorar detalhe e fallback de item |
| src/app/(app)/skills/page.tsx | Restaurar listagem e ações de skills |
| src/app/(app)/skills/[id]/page.tsx | Melhorar detalhe e fallback de item |
| src/app/(app)/team/page.tsx | Restaurar conteúdo de team sem regressões |
| src/app/(app)/profile/page.tsx | Restaurar conteúdo de profile/agents |
| src/app/(auth)/sign-in/page.tsx | Remover placeholder e integrar fluxo real |
| src/app/(auth)/sign-up/page.tsx | Remover placeholder e integrar fluxo real |
| src/lib/firebase/auth.ts | Endurecer leitura de sessão/cookies |
| src/middleware.ts | Alinhar guardas com sessão real |
| src/tests/integration/firebase-auth.test.ts | Cobrir fluxo real de auth |
| src/tests/integration/workspace-data.test.ts | Cobrir navegação e isolamento mínimo |
| .env.example | Documentar variáveis Firebase obrigatórias para execução local |
