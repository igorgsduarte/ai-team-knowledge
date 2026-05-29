# 0001 — firebase-migration-recovery-parity-plan

- Status: Accepted
- Date: 2026-05-28

## Context

A migração anterior foi marcada como concluída, porém o estado atual contém regressões objetivas: telas principais em estado mínimo, autenticação Firebase com placeholder e falhas que impedem navegação e validação confiável. O pedido é recuperar paridade com o baseline disponível em `~/Downloads/Knowledge-Hub` e entregar fluxo navegável auditável.

## Decision

Executar um plano corretivo em quatro épicos:
1. Diagnóstico de paridade com baseline e baseline navegável local.
2. Restauração de shell, telas e componentes principais com SSR/Server Actions.
3. Conclusão de autenticação Firebase real e proteção de rotas.
4. Validação comparativa final com evidências e aceite técnico.

As decisões travadas D-01..D-05 governam prioridades, restrições e critérios de validação.

## Consequences

- A equipe passa a ter trilha explícita de correção, evitando novas marcações de conclusão sem evidência funcional.
- A dependência de acesso legível ao baseline em Downloads torna-se risco técnico declarado até destrave.
- Próximo passo operacional: execução linear dos épicos via dev-coder, iniciando por T1.1/T1.2.

