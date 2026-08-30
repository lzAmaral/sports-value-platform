# Integração contínua

O GitHub Actions executa o CI em cada pull request e em cada push para `main`.

## Aplicação TypeScript

O job `application`:

1. instala Node.js 22;
2. executa `npm ci` com o lockfile;
3. verifica TypeScript estrito;
4. executa os testes do NestJS;
5. compila NestJS e Next.js.

## Núcleo Python

Os jobs herdados verificam qualidade, tipos, vulnerabilidades, segurança,
docstrings, documentação e testes em Python 3.11–3.13 e nos sistemas Linux,
macOS e Windows.

## Documentação

A documentação é compilada e enviada como artefato. A publicação no GitHub
Pages é opcional porque Pages não vem habilitado em todo repositório novo.

Para publicar:

1. configure GitHub Pages para usar GitHub Actions;
2. crie a variável de repositório `DEPLOY_GITHUB_PAGES=true`.

## Diagnóstico de falhas

```bash
gh run list --limit 10
gh run view ID_DA_EXECUCAO --log-failed
```

O histórico anterior tinha falhas no workflow de documentação porque Pages não
estava habilitado. Agora o build de documentação é independente da publicação.

Chaves de APIs não são necessárias no CI: clientes externos são testados com
respostas controladas. Futuros testes ao vivo devem ficar em workflow separado
e usar GitHub Actions Secrets.
