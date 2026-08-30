# Como contribuir

Este documento define o acordo de trabalho entre os colaboradores da Sports
Value Platform. Mudanças devem ser pequenas, revisáveis e protegidas por testes
proporcionais ao risco.

## Preparação

Siga o [guia do ambiente local](docs/development/local-setup.md). Antes de
começar, confirme que `main` está atualizada e crie uma branch curta:

```bash
git switch main
git pull --ff-only
git switch -c feat/nome-curto-da-entrega
```

Prefixos recomendados: `feat/`, `fix/`, `docs/`, `refactor/` e `chore/`.

## Durante o desenvolvimento

- Não commite `.env`, chaves, dados pessoais ou payloads licenciados.
- Não misture correção não relacionada na mesma branch.
- Atualize documentação quando alterar contrato, arquitetura ou configuração.
- Adicione testes para regras e contratos novos.
- Confira `git diff` e `git status` antes de preparar o commit.

Validação mínima da aplicação:

```bash
npm run lint
npm test
npm run build
```

Validação completa do núcleo Python:

```bash
pdm checks
pdm tests
pdm docs build
```

## Commits

Usamos mensagens no formato Conventional Commits:

```text
tipo(escopo): resumo no imperativo
```

Exemplos:

```text
feat(web): adiciona explorador de partidas brasileiras
fix(api): trata temporada indisponível do provedor
docs(git): documenta fluxo de branches e pull requests
test(api): cobre normalização de fixtures
```

Tipos aceitos: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`, `ci`, `build`
e `perf`. O resumo deve ser curto, específico e sem ponto final. Use o corpo
para explicar motivação e decisões, não para repetir o diff.

Um commit deve representar uma unidade lógica que possa ser entendida e
revertida isoladamente. Veja o [guia detalhado de Git e
commits](docs/development/git-workflow.md).

## Pull request

```bash
git push -u origin feat/nome-curto-da-entrega
gh pr create --fill
```

O PR deve explicar problema, solução, forma de teste, imagens quando houver
interface e impactos em dados/configuração. O outro colaborador revisa antes do
merge. Todos os checks obrigatórios precisam passar.

Não use `git push --force` em branches compartilhadas. Quando for realmente
necessário reescrever sua própria branch, prefira `git push --force-with-lease`.

## Coautoria

Quando duas pessoas contribuírem materialmente para o mesmo commit, adicione ao
fim da mensagem:

```text
Co-authored-by: Nome <email-verificado-no-github>
```
