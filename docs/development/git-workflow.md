# Fluxo de Git, commits e pull requests

## Objetivo

Manter `main` sempre revisada e potencialmente entregável. Cada trabalho nasce
em uma branch, passa pelo CI e recebe revisão antes do merge.

## Fluxo diário

```text
issue ou tarefa
      ↓
branch curta
      ↓
commits pequenos e coerentes
      ↓
push e pull request
      ↓
CI + revisão do colega
      ↓
squash merge em main
```

O GitHub descreve commits como registros identificados por SHA contendo
mudanças e autoria. Pull requests com checks permitem que o revisor saiba se a
alteração compila e passa nos testes. Consulte a documentação oficial sobre
[commits](https://docs.github.com/en/pull-requests/committing-changes-to-your-project/creating-and-editing-commits/about-commits)
e [status checks](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/getting-started/about-status-checks).

## 1. Criar a branch

```bash
git switch main
git pull --ff-only
git switch -c feat/explorador-de-partidas
```

Use um nome curto, sem acentos e que descreva uma entrega. Não desenvolva
diretamente em `main`.

## 2. Revisar antes de preparar

```bash
git status --short
git diff
```

Prepare apenas arquivos da mesma mudança:

```bash
git add apps/web/src docs/product
git diff --staged
```

Evite `git add .` sem revisar, porque isso pode incluir `.env`, artefatos ou
alterações feitas por outra pessoa.

## 3. Criar o commit

```bash
git commit -m "feat(web): adiciona explorador de partidas"
```

Regras adotadas:

- um objetivo lógico por commit;
- mensagem no imperativo e específica;
- testes no mesmo commit da funcionalidade quando fizerem parte dela;
- documentação separada quando for uma entrega independente;
- nunca incluir segredos ou arquivos `.env`.

Commits assinados são opcionais neste estágio, mas aumentam a confiança na
autoria. O GitHub aceita GPG, SSH ou S/MIME e marca commits válidos como
`Verified`; veja [assinatura de commits](https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits).

## 4. Validar e enviar

```bash
npm run lint
npm test
npm run build
git push -u origin feat/explorador-de-partidas
```

## 5. Abrir o PR

```bash
gh pr create --fill
```

O texto deve conter problema, solução, forma de teste, prints para mudanças
visuais, novas variáveis ou migrações e limitações conhecidas.

## 6. Revisar e integrar

O colega deve revisar código, comportamento, segurança e testes. O GitHub
permite proteger `main`, exigir PR, aprovação e checks antes do merge; veja
[protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches).

Para duas pessoas e entregas pequenas, a recomendação é **Squash and merge**:
o PR vira um commit claro em `main`, enquanto a discussão permanece registrada.

Depois do merge:

```bash
git switch main
git pull --ff-only
git branch -d feat/explorador-de-partidas
```

## Proteção recomendada para `main`

- exigir pull request e uma aprovação;
- exigir resolução das conversas;
- exigir o check `application` e os checks Python relevantes;
- bloquear force push e exclusão;
- permitir squash merge como estratégia principal.

Checks obrigatórios precisam passar antes do merge quando a branch está
protegida, conforme a [referência do GitHub](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/getting-started/about-status-checks).

## Quando um check falhar

```bash
gh run list --limit 10
gh run view ID_DA_EXECUCAO --log-failed
```

Corrija a causa na mesma branch, crie um novo commit e faça push. Não use
`[skip ci]` para contornar validações de produto.
