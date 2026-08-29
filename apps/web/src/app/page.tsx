const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export default function Home() {
  return (
    <main>
      <section className="hero">
        <p className="eyebrow">Sports Value Platform</p>
        <h1>Probabilidades transparentes para decisões esportivas melhores.</h1>
        <p className="lead">
          O produto está em desenvolvimento. O primeiro marco combina dados auditáveis,
          modelos de futebol e histórico completo dos sinais publicados.
        </p>
        <div className="status">
          <span className="dot" />
          Frontend conectado ao ambiente local. API esperada em {apiUrl}.
        </div>
      </section>
      <section className="grid" aria-label="Pilares do produto">
        <article><strong>Dados rastreáveis</strong><p>Fonte, horário e odd observada acompanham cada análise.</p></article>
        <article><strong>Modelos versionados</strong><p>Cada previsão referencia modelo, janela de treino e avaliação.</p></article>
        <article><strong>Histórico completo</strong><p>Sinais publicados não desaparecem quando o resultado é negativo.</p></article>
      </section>
      <p className="notice">Conteúdo analítico. Não há garantia de resultado ou retorno financeiro.</p>
    </main>
  );
}
