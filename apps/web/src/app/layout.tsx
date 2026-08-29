import type { Metadata } from 'next';
import './styles.css';

export const metadata: Metadata = {
  title: 'Sports Value Platform',
  description: 'Transparent football probabilities and value signals.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
