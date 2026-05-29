# Visual fixtures

Coloque aqui os PNG de referencia (`board.png`, `knowledge.png`, `skills.png`, `team.png`, `profile.png`) copiados dos screenshots do plano.

Para gerar baselines a partir da UI atual (com `bun run dev` e `bun run seed:demo`):

```sh
bun run test:visual:update
```

Depois compare com:

```sh
bun run test:visual
```
