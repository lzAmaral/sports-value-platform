import Link from 'next/link';

export function SiteHeader() {
  return <header className="site-header"><Link className="brand" href="/" aria-label="Sports Value — início"><span className="brand-mark">SV</span><span><strong>Sports Value</strong><small>football intelligence</small></span></Link><nav aria-label="Navegação principal"><Link href="/">Visão geral</Link><Link href="/partidas">Partidas</Link><Link href="/sobre">Sobre o MVP</Link></nav><span className="environment"><i /> ambiente local</span></header>;
}
