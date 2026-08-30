# API-Football — guia de integração

Pesquisa revisada em 30 de agosto de 2026. A referência atual identificada no
site é a API V3.9.3. Este documento resume a documentação e os tutoriais; ele
não substitui os termos do provedor nem replica seu conteúdo integralmente.

## Fontes oficiais

- [Documentação V3](https://www.api-football.com/documentation-v3)
- [Guia completo para iniciantes](https://www.api-football.com/news/post/how-to-get-started-with-api-football-the-complete-beginners-guide)
- [Cobertura por competição](https://www.api-football.com/coverage)
- [Tutoriais](https://www.api-football.com/news/category/tutorials)
- [Planos](https://www.api-football.com/pricing)
- [Termos de serviço](https://www.api-football.com/terms)

## Conta e autenticação

Crie a conta no [painel oficial](https://dashboard.api-football.com/register),
confirme o e-mail e copie a chave em **Account → My Access**. Na integração
direta usada pelo projeto, a requisição é:

```http
GET https://v3.football.api-sports.io/fixtures?league=71&season=2026
x-apisports-key: ${API_FOOTBALL_KEY}
```

Alguns tutoriais antigos mostram `x-rapidapi-key`. Esse cabeçalho pertence à
contratação via RapidAPI e não deve ser misturado com a assinatura direta do
dashboard API-Sports. A chave fica apenas no NestJS, nunca no browser, em uma
URL ou em uma variável `NEXT_PUBLIC_*`.

O plano gratuito anunciado oferece 100 chamadas por dia. Em um teste real da
conta gratuita em 30 de agosto de 2026, o Brasileirão Série A aceitou temporadas
de 2022 a 2024 e rejeitou 2026. A cobertura de 2024 incluiu eventos, escalações,
estatísticas de partidas e jogadores, classificação, jogadores, lesões e
previsões, mas informou `odds: false`. Consulte o dashboard para acompanhar a
cota real e configurar alertas.

## Como descobrir o que existe

A API é baseada em identificadores persistentes. Na V3, uma competição mantém
o mesmo ID entre temporadas; o ano é informado separadamente pelo parâmetro
`season`.

Use primeiro `GET /leagues` para obter:

- ID, país, nome e tipo da competição;
- temporadas disponíveis;
- início e fim de cada temporada;
- se a temporada é a atual;
- o objeto `coverage`, que informa a disponibilidade de eventos, escalações,
  estatísticas, jogadores, classificação, lesões, previsões e odds.

Também é possível localizar IDs no dashboard em **APIs → Football → IDs** ou
no Live Tester. Consulte o tutorial [Como encontrar
IDs](https://www.api-football.com/news/post/how-to-find-ids).

IDs adotados inicialmente pelo projeto:

| Competição | ID API-Football | Slug interno |
| --- | ---: | --- |
| Brasileirão Série A | 71 | `brasileirao-serie-a` |
| Brasileirão Série B | 72 | `brasileirao-serie-b` |
| Copa do Brasil | 73 | `copa-do-brasil` |

Esses IDs pertencem ao adaptador. Eles não são as identidades primárias do
nosso domínio e não devem aparecer como parâmetro público da plataforma.

## Famílias de endpoints

Confirme parâmetros, combinações obrigatórias e limites na documentação antes
de implementar cada família.

| Área | Endpoints principais | Uso no produto |
| --- | --- | --- |
| Catálogo | `/timezone`, `/countries`, `/leagues`, `/leagues/seasons` | Descoberta e sincronização de competições |
| Times e estádios | `/teams`, `/teams/statistics`, `/teams/seasons`, `/venues` | Cadastro canônico e features de temporada |
| Classificação | `/standings` | Tabela e posição antes de uma partida |
| Partidas | `/fixtures`, `/fixtures/rounds`, `/fixtures/headtohead` | Agenda, placar e confrontos anteriores |
| Detalhes | `/fixtures/events`, `/fixtures/lineups`, `/fixtures/statistics`, `/fixtures/players` | Gols, cartões, escalações e estatísticas |
| Elencos | `/players`, `/players/profiles`, `/players/squads`, `/players/seasons` | Jogadores e estatísticas por temporada |
| Disponibilidade | `/injuries`, `/sidelined`, `/transfers` | Ausências e mudanças de elenco |
| Pessoas | `/coachs`, `/trophies` | Técnicos e histórico |
| Odds | `/odds`, `/odds/live`, `/odds/bookmakers`, `/odds/bets` | Observações pré-jogo e ao vivo |
| Provedor | `/status` | Cota e estado da assinatura; somente monitoramento interno |

O endpoint `/predictions` pode ser usado como referência exploratória, mas não
como a inteligência do produto. A Sports Value Platform deve calcular,
versionar e avaliar suas próprias probabilidades.

## Fluxo recomendado para o Brasileirão

1. Consultar `/leagues?id=71&season=2024` e guardar a cobertura observada no
   plano gratuito; tornar a temporada configurável para planos futuros.
2. Sincronizar `/teams?league=71&season=2024` uma vez e atualizar raramente.
3. Buscar `/fixtures?league=71&season=2024&from=...&to=...` por janelas curtas.
4. Salvar as partidas canônicas no PostgreSQL e associar IDs externos em uma
   tabela de aliases do provedor.
5. Para partidas finalizadas, buscar somente os detalhes que a cobertura
   declara disponíveis.
6. Para partidas futuras, buscar odds e escalações segundo sua cadência real de
   atualização, sem repetir chamadas quando os dados não mudam.
7. Registrar `provider`, `provider_id`, `observed_at` em UTC e o payload bruto
   isolado do modelo canônico.

O tutorial [Buscar todos os dados de uma
liga](https://www.api-football.com/news/post/how-to-get-all-fixtures-data-from-one-league)
ensina a obter os IDs das partidas finalizadas e consultar até 20 IDs juntos.
Essa estratégia reduz centenas de consultas individuais para poucos lotes.

## Paginação e lotes

Respostas paginadas informam `paging.current` e `paging.total`. O consumidor
deve continuar até a última página e aplicar o limite por minuto entre
chamadas. Não fixe o número de páginas: ele muda por competição e temporada.

O tutorial [Times e jogadores de uma
liga](https://www.api-football.com/news/post/how-to-get-all-teams-and-players-from-a-league-id)
mostra que times podem vir em uma chamada, enquanto jogadores são paginados.
Para partidas, o parâmetro `ids` aceita grupos de até 20 IDs segundo o tutorial
oficial de fixtures.

## Cota, cache e cadência

Dados mudam em ritmos diferentes. A estratégia deve refletir isso:

| Dado | Cadência inicial sugerida |
| --- | --- |
| Países, ligas e temporadas | semanal ou sob demanda |
| Times e estádios | diária durante montagem da temporada; depois semanal |
| Agenda distante | diária |
| Agenda das próximas 48 horas | a cada 30–60 minutos |
| Partida ao vivo | somente quando houver recurso ao vivo; intervalo curto e controlado |
| Resultado recém-finalizado | atualizar até estabilizar; depois tornar imutável |
| Classificação | após partidas finalizadas |
| Odds pré-jogo | snapshots com horário explícito e conforme licença/cota |

O provedor recomenda verificar `coverage`, evitar consultas de dados que ainda
não existem e ajustar a frequência à natureza do recurso. Consulte [Otimização
de chamadas e cota](https://www.api-football.com/news/post/how-to-optimize-api-sports-calls-and-quota-usage),
[Como economizar chamadas](https://www.api-football.com/news/post/how-to-save-calls-to-the-api)
e [Como funciona o rate limit](https://www.api-football.com/news/post/how-ratelimit-works).

No nosso sistema:

- PostgreSQL é a fonte de verdade;
- Redis pode controlar locks, deduplicação, rate limit e cache curto;
- o frontend nunca consulta a API-Football diretamente;
- uma falha do fornecedor não apaga o último snapshot válido;
- respostas vazias legítimas não são tratadas como erro automaticamente;
- HTTP 429 deve causar backoff, não repetição agressiva.

## Odds

Odds pré-jogo e ao vivo são recursos separados. Uma odd deve ser armazenada
como observação temporal, nunca sobrescrita sem histórico:

```text
provider + bookmaker + fixture + market + selection + observed_at + decimal_odds
```

Antes de chamar odds, verifique `coverage.odds`. Nem toda competição, partida,
casa ou mercado possui a mesma cobertura. Odds ao vivo mudam rapidamente e
podem consumir grande parte da cota; veja a descrição oficial de [odds ao
vivo](https://www.api-football.com/news/post/in-play-odds).

Cobertura técnica não concede automaticamente direito de redistribuição. Antes
do lançamento comercial, é obrigatório confirmar por contrato armazenamento,
histórico, exibição ao cliente e uso em análises derivadas.

## Segurança e confiabilidade

- Guardar `API_FOOTBALL_KEY` fora do Git e renovar se houver exposição.
- Restringir IPs no dashboard apenas quando os IPs de saída forem estáveis.
- Aplicar timeout, retry limitado com jitter e circuit breaker.
- Validar todo JSON em runtime antes de convertê-lo para o domínio.
- Não registrar chave, cabeçalhos ou payloads com dados de conta.
- Não expor `/status` ao público; ele pode conter dados da assinatura.
- Monitorar chamadas usadas, erros, 429, latência e atraso de ingestão.
- Usar UTC internamente e converter fuso horário somente na apresentação.

## Tutoriais catalogados e relevantes

- [Guia completo para iniciantes](https://www.api-football.com/news/post/how-to-get-started-with-api-football-the-complete-beginners-guide): cadastro, autenticação, formato da resposta, tester, Postman e endpoints.
- [Como encontrar IDs](https://www.api-football.com/news/post/how-to-find-ids): IDs de ligas, times, partidas e jogadores.
- [Todos os dados de fixtures de uma liga](https://www.api-football.com/news/post/how-to-get-all-fixtures-data-from-one-league): status, lotes de IDs e detalhes.
- [Todos os times e jogadores de uma liga](https://www.api-football.com/news/post/how-to-get-all-teams-and-players-from-a-league-id): times, jogadores e paginação.
- [Todos os times e seus IDs](https://www.api-football.com/news/post/how-to-get-all-teams-and-their-ids): sincronização de equipes.
- [Classificações das temporadas atuais](https://www.api-football.com/news/post/how-to-get-standings-for-all-current-seasons): descoberta de temporadas e standings.
- [API-Football com Python](https://www.api-football.com/news/post/how-to-use-api-football-with-python): chamada básica em Python.
- [API-Football com Postman](https://www.api-football.com/news/post/how-to-start-using-postman-with-api-football): testes manuais antes da implementação.
- [Otimizar chamadas e cota](https://www.api-football.com/news/post/how-to-optimize-api-sports-calls-and-quota-usage): frequência orientada ao tipo de dado.
- [Economizar chamadas](https://www.api-football.com/news/post/how-to-save-calls-to-the-api): cache e redução de consultas redundantes.
- [Rate limit](https://www.api-football.com/news/post/how-ratelimit-works): limites por minuto e respostas 429.
- [Alertas de cota](https://www.api-football.com/news/post/dashboard-quota-alerts): avisos de consumo no dashboard.
- [Odds ao vivo](https://www.api-football.com/news/post/in-play-odds): funcionamento do feed in-play.

Tutoriais de widgets, WordPress, Google Sheets e Firebase foram identificados,
mas não orientam a arquitetura principal. Nosso frontend consome contratos do
NestJS e não incorpora a chave do provedor em widgets públicos.

## Próximas implementações

1. Persistência canônica de competições, times e fixtures com migrations.
2. Job idempotente de sincronização por janela e controle de cota no Redis.
3. Adapter de detalhes de partidas com paginação e lotes.
4. Adapter de odds com snapshots imutáveis e precisão decimal explícita.
5. Teste controlado da cobertura real de Série A e Copa do Brasil com a chave
   gratuita, sem depender de chamadas ao vivo no CI.
