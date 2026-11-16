import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import HoverFx from './HoverFx';

/**
 * Shared frame for the secondary pages (/architecture, /evaluation):
 * same ambient background and header geometry as the main AI page and the portfolio
 * (AT badge · section pill · white round button).
 */
export default function DocShell({
  title,
  index,
  total,
  children,
}: {
  title: string;
  index: number;
  total: number;
  children: React.ReactNode;
}) {
  const pad2 = (n: number) => String(n).padStart(2, '0');
  return (
    <div className="doc">
      <HoverFx />
      <div className="ai-blobs" aria-hidden><i /><i /><i /></div>
      <div className="ai-grain doc-fixed" aria-hidden />

      <header className="doc-hdr">
        <div className="ai-hdr">
          <Link href="/" data-magnetic className="ai-logo ai-glass-dark" aria-label="AlexB home">AT</Link>
          <div className="ai-pill ai-glass-dark">
            <span className="ai-pill-title">{title}</span>
            <span className="ai-pill-count">{pad2(index)}/{pad2(total)}</span>
          </div>
          <Link href="/" data-magnetic className="ai-round" aria-label="Back to the chat" title="Back to the chat">
            <ArrowLeft size={20} />
          </Link>
        </div>
      </header>

      <main className="doc-main">{children}</main>

      <footer className="doc-foot">
        <span>AlexB · Tu N (Alex) Tran</span>
        <nav>
          <Link href="/architecture">Architecture</Link>
          <Link href="/evaluation">Evaluation</Link>
          <Link href="/">Chat ↗</Link>
        </nav>
      </footer>
    </div>
  );
}
