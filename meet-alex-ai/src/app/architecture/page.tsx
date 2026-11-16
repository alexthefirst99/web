import type { Metadata } from 'next';
import DocShell from '@/components/DocShell';

export const metadata: Metadata = {
  title: 'Architecture — AlexB',
  description: 'How AlexB works: a small, grounded RAG pipeline inside a Next.js app.',
};

const STEPS = [
  { n: '01', label: 'Frontend', tint: 'var(--pink)' },
  { n: '02', label: 'Content', tint: 'var(--gold)' },
  { n: '03', label: 'Retrieval', tint: 'var(--sage)' },
  { n: '04', label: 'Generation', tint: 'var(--teal)' },
];

export default function ArchitecturePage() {
  return (
    <DocShell title="Architecture" index={1} total={2}>
      <div className="doc-kicker"><b>01</b>System architecture</div>
      <h1 className="doc-h1">How AlexB works.</h1>
      <p className="doc-lead">
        A lightweight, grounded RAG pipeline running entirely within a Next.js app — every answer is drawn from a handful of files I maintain, not from the model&apos;s memory.
      </p>

      <div className="doc-flow" aria-label="Pipeline: frontend, content, retrieval, generation">
        {STEPS.map(s => (
          <div key={s.n} className="doc-step" style={{ ['--tint' as string]: s.tint }}>
            <b>{s.n}</b>
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      <div className="doc-stack">
        <section className="doc-card" style={{ ['--tint' as string]: 'var(--pink)' }}>
          <div className="doc-num">01</div>
          <div>
            <h2>Frontend</h2>
            <p>
              A React single-page app on the Next.js App Router. Tailwind CSS plus a small design system shared with my portfolio handles styling, Framer Motion drives the panel transitions, and a React Three Fiber scene renders the cell-cluster background.
            </p>
            <div className="doc-tags"><span>Next.js</span><span>React</span><span>Tailwind</span><span>Framer Motion</span><span>Three.js</span></div>
          </div>
        </section>

        <section className="doc-card" style={{ ['--tint' as string]: 'var(--gold)' }}>
          <div className="doc-num">02</div>
          <div>
            <h2>Content — the source of truth</h2>
            <p>
              To keep answers factual, everything is grounded in explicitly managed Markdown and JSON files in the <code>/content</code> directory: my résumé, an extended bio, project metadata and skills.
            </p>
            <div className="doc-tree">{'/content\n├── '}<em>resume.json</em>{'\n├── '}<em>bio.md</em>{'\n├── '}<em>projects.json</em>{'\n└── '}<em>skills.json</em></div>
          </div>
        </section>

        <section className="doc-card" style={{ ['--tint' as string]: 'var(--sage)' }}>
          <div className="doc-num">03</div>
          <div>
            <h2>Retrieval</h2>
            <p>
              Each question is embedded with OpenAI&apos;s <code>text-embedding-3-small</code>. The corpus is only a few kilobytes, so the &ldquo;vector store&rdquo; is an in-memory array: a cosine-similarity search over paragraph chunks picks the two best-matching passages and appends them to the system prompt.
            </p>
            <div className="doc-tags"><span>Embeddings</span><span>Cosine similarity</span><span>Top-2 context</span></div>
          </div>
        </section>

        <section className="doc-card" style={{ ['--tint' as string]: 'var(--teal)' }}>
          <div className="doc-num">04</div>
          <div>
            <h2>Generation</h2>
            <p>
              With context retrieved, a strict system prompt has <code>gpt-4o-mini</code> answer only from the provided text. Temperature stays low (0.2) to keep it factual, and the reply comes back as JSON that also tells the interface which panel to show.
            </p>
            <div className="doc-tags"><span>gpt-4o-mini</span><span>Temperature 0.2</span><span>JSON mode</span></div>
          </div>
        </section>
      </div>
    </DocShell>
  );
}
