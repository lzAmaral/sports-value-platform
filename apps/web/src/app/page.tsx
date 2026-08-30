import Link from 'next/link';
import { FixturesPanel } from '@/components/fixtures-panel';

export default function Home() {
  return (
    <main className="page-shell">
      <section className="hero-grid">
        <div className="hero-copy">
          <span className="kicker">MVP · dados brasileiros</span>
          <h1>O jogo começa antes do apito.</h1>
          <p className="hero-text">Explore partidas reais do Brasileirão, confira resultados e acompanhe a base que vai alimentar nossos modelos de probabilidade.</p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/partidas">Explorar partidas</Link>
            <Link className="button button-secondary" href="/sobre">Entender o MVP</Link>
          </div>
        </div>
        <div className="hero-score" aria-label="Resumo da cobertura">
          <div className="score-orbit"><span>BR</span></div>
          <p className="score-caption">Cobertura inicial</p><strong>Brasileirão</strong>
          <div className="coverage-row"><span>Série A</span><span>Série B</span><span>Copa do Brasil</span></div>
        </div>
      </section>
      <section className="metrics" aria-label="Estado do MVP">
        <article><span>Fonte atual</span><strong>API-Football</strong><small>adaptador ativo</small></article>
        <article><span>Temporada teste</span><strong>2024</strong><small>plano gratuito</small></article>
        <article><span>Dados disponíveis</span><strong>Partidas</strong><small>placares e estádios</small></article>
        <article><span>Próxima camada</span><strong>Modelos</strong><small>probabilidades próprias</small></article>
      </section>
      <section className="section-heading">
        <div><span className="kicker">Primeira rodada · 2024</span><h2>Partidas para validar a integração</h2></div>
        <Link className="text-link" href="/partidas">Ver todas as opções <span>→</span></Link>
      </section>
      <FixturesPanel compact />
      <section className="principles">
        <article><span className="principle-number">01</span><h3>Dado rastreável</h3><p>Origem e momento da coleta acompanham cada informação usada no produto.</p></article>
        <article><span className="principle-number">02</span><h3>Probabilidade própria</h3><p>O próximo passo é calcular e calibrar modelos, não repetir previsões do fornecedor.</p></article>
        <article><span className="principle-number">03</span><h3>Transparência</h3><p>Resultados e sinais publicados permanecem no histórico, inclusive quando erram.</p></article>
      </section>
    </main>
  );
}
