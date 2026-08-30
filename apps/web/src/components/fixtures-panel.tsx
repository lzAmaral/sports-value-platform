'use client';

import { useCallback, useEffect, useState } from 'react';
import { fetchFixtures, type FootballFixture } from '@/lib/football-api';

const competitions = [
  { value: 'brasileirao-serie-a', label: 'Brasileirão Série A' },
  { value: 'brasileirao-serie-b', label: 'Brasileirão Série B' },
  { value: 'copa-do-brasil', label: 'Copa do Brasil' },
] as const;

export function FixturesPanel({ compact = false }: { compact?: boolean }) {
  const today = dateInSaoPaulo(0);
  const currentSeason = Number(today.slice(0, 4));
  const [competition, setCompetition] = useState('brasileirao-serie-a');
  const [from, setFrom] = useState(today);
  const [to, setTo] = useState(compact ? today : dateInSaoPaulo(7));
  const [fixtures, setFixtures] = useState<FootballFixture[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const load = useCallback(async () => {
    setState('loading');
    try {
      setFixtures(await fetchFixtures({ competition, season: currentSeason, from, to }));
      setState('ready');
    } catch {
      setFixtures([]);
      setState('error');
    }
  }, [competition, currentSeason, from, to]);
  useEffect(() => { void load(); }, [load]);
  const visibleFixtures = compact ? fixtures.slice(0, 4) : fixtures;

  return (
    <section className="fixtures-module" aria-live="polite">
      {!compact && <div className="filters">
        <label><span>Competição</span><select value={competition} onChange={(event) => setCompetition(event.target.value)}>{competitions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
        <label><span>Data inicial</span><input type="date" value={from} onChange={(event) => setFrom(event.target.value)} /></label>
        <label><span>Data final</span><input type="date" value={to} onChange={(event) => setTo(event.target.value)} /></label>
        <button className="filter-button" type="button" onClick={() => void load()}>Atualizar</button>
      </div>}
      <div className="module-meta"><div><i className={`connection-dot ${state}`} /><span>{statusText(state, fixtures.length)}</span></div><span>Dados atuais · temporada {currentSeason}</span></div>
      {state === 'loading' && <FixtureSkeleton count={compact ? 4 : 6} />}
      {state === 'error' && <div className="empty-state"><strong>Não foi possível carregar as partidas.</strong><p>Confirme se a API NestJS está rodando na porta 3001.</p><button type="button" onClick={() => void load()}>Tentar novamente</button></div>}
      {state === 'ready' && visibleFixtures.length === 0 && <div className="empty-state"><strong>Nenhuma partida encontrada.</strong><p>Escolha outro período da temporada atual.</p></div>}
      {state === 'ready' && visibleFixtures.length > 0 && <div className="fixture-grid">{visibleFixtures.map((fixture) => <FixtureCard fixture={fixture} key={fixture.providerId} />)}</div>}
    </section>
  );
}

function dateInSaoPaulo(dayOffset: number): string {
  const date = new Date(Date.now() + dayOffset * 86_400_000);
  return new Intl.DateTimeFormat('en-CA', {
    year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'America/Sao_Paulo',
  }).format(date);
}

function FixtureCard({ fixture }: { fixture: FootballFixture }) {
  const kickoff = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' }).format(new Date(fixture.kickoffAt));
  return <article className="fixture-card"><div className="fixture-top"><span>{fixture.competition.name}</span><span className={`status-pill ${fixture.status}`}>{statusLabel(fixture.status)}</span></div><div className="teams"><Team name={fixture.homeTeam.name} logoUrl={fixture.homeTeam.logoUrl} /><div className="result"><strong>{fixture.score.home ?? '–'} <em>:</em> {fixture.score.away ?? '–'}</strong><span>{kickoff}</span></div><Team name={fixture.awayTeam.name} logoUrl={fixture.awayTeam.logoUrl} away /></div><div className="fixture-bottom"><span>{fixture.venueName ?? 'Estádio não informado'}</span><span>ID {fixture.providerId}</span></div></article>;
}

function Team({ name, logoUrl, away = false }: { name: string; logoUrl: string | null; away?: boolean }) {
  return <div className={`team ${away ? 'away' : ''}`}>{logoUrl ? <img src={logoUrl} alt="" /> : <span className="team-fallback">{name.slice(0, 2)}</span>}<strong>{name}</strong></div>;
}

function FixtureSkeleton({ count }: { count: number }) {
  return <div className="fixture-grid">{Array.from({ length: count }, (_, index) => <div className="fixture-card skeleton" key={index}><span /><span /><span /></div>)}</div>;
}

function statusText(state: 'loading' | 'ready' | 'error', count: number): string {
  if (state === 'loading') return 'Consultando nossa API…';
  if (state === 'error') return 'API indisponível';
  return `${count} ${count === 1 ? 'partida encontrada' : 'partidas encontradas'}`;
}

function statusLabel(status: FootballFixture['status']): string {
  const labels: Record<FootballFixture['status'], string> = { scheduled: 'Agendada', live: 'Ao vivo', finished: 'Encerrada', postponed: 'Adiada', cancelled: 'Cancelada', unknown: 'Indefinida' };
  return labels[status];
}
