import Link from 'next/link';

export default function SobrePage() {
  return (
    <main className="page-shell page-inner">
      <section className="page-title narrow"><span className="kicker">Sobre o produto</span><h1>Um laboratório de inteligência esportiva.</h1><p>Este MVP prova a ingestão e apresentação de dados brasileiros. Ele ainda não publica odds, recomendações ou promessas de resultado.</p></section>
      <section className="roadmap-list">
        <article className="roadmap-card active"><span>Agora</span><div><h2>Dados de partidas</h2><p>Competições, calendário, times, estádio, status e placar em um contrato próprio.</p></div></article>
        <article className="roadmap-card"><span>Depois</span><div><h2>Histórico no PostgreSQL</h2><p>Ingestão idempotente, aliases de times e rastreabilidade do fornecedor.</p></div></article>
        <article className="roadmap-card"><span>Modelo</span><div><h2>Probabilidades calibradas</h2><p>Penaltyblog atrás de um adaptador, avaliação cronológica e modelos versionados.</p></div></article>
        <article className="roadmap-card"><span>Mercado</span><div><h2>Comparação com odds licenciadas</h2><p>Só depois de validar licença comercial, snapshots e cobertura de casas.</p></div></article>
      </section>
      <aside className="disclaimer-card"><strong>Limite responsável</strong><p>A plataforma é analítica. O MVP não recebe apostas, não movimenta dinheiro e não garante lucro.</p></aside>
      <Link className="button button-primary" href="/partidas">Testar partidas</Link>
    </main>
  );
}
