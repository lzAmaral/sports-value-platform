import type { Metadata } from 'next';
import { SiteHeader } from '@/components/site-header';
import './styles.css';

export const metadata: Metadata = {
  title: 'Sports Value Platform',
  description: 'Inteligência esportiva com dados rastreáveis e modelos transparentes.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body><SiteHeader />{children}<footer className="site-footer"><span>Sports Value Platform · MVP local</span><span>Conteúdo analítico. Sem garantia de resultado.</span></footer></body>
    </html>
  );
}
