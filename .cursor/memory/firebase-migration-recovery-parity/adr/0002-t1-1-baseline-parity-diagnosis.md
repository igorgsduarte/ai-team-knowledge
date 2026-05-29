# T1.1: Inventariar gaps entre entrega atual e baseline

## Status

Accepted

## Context

- Task: T1.1 — Inventariar gaps entre entrega atual e baseline
- `done` criterion: "Existe baseline de diagnóstico aprovado para guiar correções sem ambiguidade."
- `verify` criterion: "Relatório contém tabela de gaps por tela/fluxo com status preservado/divergente/ausente e impacto descrito."
- State before this task: plano de correção criado, mas sem inventário objetivo consolidado de diferenças entre entrega atual e app de referência.

## Decision

- Comparação direta foi executada entre a árvore atual do projeto e os arquivos principais do baseline em `artifacts/team-knowledge/src`.
- Foi criado `docs/migration/parity-report.md` com matriz de gaps por fluxo/tela, classificação (divergente/ausente), impacto e lista de evidências consultadas.
- O diagnóstico confirmou regressão de UI e auth na entrega atual e estabeleceu baseline verificável para orientar os próximos tasks.

## Consequences

- O `T1.2` passa a ter entrada objetiva para estabilizar runtime/build e permitir validação navegável contínua.
- Os tasks dos épicos seguintes terão referência concreta de paridade para evitar correções vagas.
- Não há dívida técnica nova introduzida nesta etapa; risco remanescente está na execução correta dos próximos tasks de restauração.
