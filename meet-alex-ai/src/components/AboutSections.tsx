'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, ArrowUp } from 'lucide-react';
// Only non-personal content files are imported here: anything imported into this
// client component ships to the browser (resume.json/bio.md also hold private details).
import projectsData from '../../content/projects.json';
import skillsData from '../../content/skills.json';

const PORTFOLIO = 'https://alexthefirst99.github.io/web/';

const PROJECT_LOOK: Record<string, { letter: string; grad: string; short: string }> = {
  'loki-inference': { letter: 'L', grad: 'linear-gradient(135deg,#F1DDB8,#C9A46A)', short: 'the Loki platform' },
  mjolnir: { letter: 'M', grad: 'linear-gradient(135deg,#D3E2CC,#8FAE8A)', short: 'Mjolnir' },
  'visual-omics': { letter: 'V', grad: 'linear-gradient(135deg,#C4D8D9,#7FA3A8)', short: 'the Visual–Omics curation' },
  'macrophage-analysis': { letter: 'A', grad: 'linear-gradient(135deg,#F3EBDD,#CDBFA8)', short: 'the macrophage analysis' },
};

const STEPS = [
  { n: '01', title: 'Ask', text: 'Type a question or tap a topic chip.' },
  { n: '02', title: 'Retrieve', text: 'The question is embedded with text-embedding-3-small and matched against paragraphs from my files by cosine similarity.' },
  { n: '03', title: 'Ground', text: 'The two best passages go to gpt-4o-mini with a strict prompt — answer only from this text — at temperature 0.2.' },
  { n: '04', title: 'Show', text: 'The reply also names a topic, so the data panel switches to the matching facts.' },
];

const QUESTIONS = [
  'What did Alex build at Houston Methodist?',
  'Tell me about the Loki platform',
  'How did he contribute to the Nature Methods paper?',
  'What tools does he use for data visualization?',
  'What results did he get in marketing?',
  'Which roles fit Alex best?',
];

const reveal = (i = 0) => ({
  initial: { opacity: 0, y: 40, filter: 'blur(8px)' },
  whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.9, delay: i * 0.09, ease: [0.2, 0.8, 0.2, 1] as const },
});

function Head({ n, kicker, title, lead }: { n: string; kicker: string; title: string; lead?: string }) {
  return (
    <div className="grid gap-x-14 gap-y-5 items-end grid-cols-1 md:grid-cols-2">
      <div className="flex flex-col gap-[18px]">
        <motion.div {...reveal(0)} className="flex items-center gap-3 text-[15px] text-[var(--muted)]">
          <span className="font-[family-name:var(--font-display)] font-extrabold text-[var(--acc)]">{n}</span>
          {kicker}
        </motion.div>
        <motion.h2 {...reveal(1)} className="m-0 font-extralight text-[clamp(40px,5.2vw,76px)] leading-none tracking-[-0.03em] text-balance">
          {title}
        </motion.h2>
      </div>
      {lead && (
        <motion.p {...reveal(2)} className="m-0 text-lg leading-[1.55] text-[#b9bbc6] max-w-[460px] text-pretty">
          {lead}
        </motion.p>
      )}
    </div>
  );
}

function Section({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="relative px-[clamp(16px,3vw,32px)] pt-[clamp(80px,10vw,140px)] scroll-mt-20">
      <div className="max-w-[1240px] mx-auto">{children}</div>
    </section>
  );
}

export default function AboutSections({ onAsk }: { onAsk: (q: string) => void }) {
  const projects = projectsData.projects;
  const categories = skillsData.categories;
  const skillCount = categories.reduce((n, c) => n + c.skills.length, 0);

  const FILES = [
    { name: 'resume.json', what: 'Education, experience, publications and contact details.', count: '2 roles · 2 degrees · 2 papers' },
    { name: 'bio.md', what: 'Who I am, where I work, and what I’m looking for — plus a personal statement.', count: 'Bio & statement' },
    { name: 'projects.json', what: 'Each project’s description, highlights, tags and the paper it fed into.', count: `${projects.length} projects` },
    { name: 'skills.json', what: 'Languages, methods and tools, grouped by area — including what I’m learning now.', count: `${categories.length} areas · ${skillCount} skills` },
  ];

  return (
    <div className="relative z-[1] pb-[clamp(40px,6vw,80px)]">
      {/* ── 02 How it works ─────────────────────────────────────────── */}
      <Section id="how">
        <Head n="02" kicker="How it works" title="From question to grounded answer." lead="A small retrieval-augmented pipeline. Every answer is built from passages of my own files — never from the model’s memory." />
        <div className="relative mt-[clamp(36px,5vw,64px)] grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <div aria-hidden className="hidden lg:block absolute left-[6%] right-[6%] top-[62px] border-t border-dashed border-white/25" />
          {STEPS.map((s, i) => (
            <motion.div key={s.n} {...reveal(i)} className="tile relative rounded-[32px] p-6 flex flex-col gap-3 backdrop-blur-xl bg-[rgba(20,10,14,.7)]">
              <span className="w-[76px] h-[76px] rounded-full grid place-items-center border border-white/20 bg-[rgba(30,16,22,.9)] font-[family-name:var(--font-display)] font-extrabold text-[26px] text-[var(--acc)] shadow-[inset_0_1px_1px_rgba(255,255,255,.25)]">{s.n}</span>
              <div className="text-[22px] font-normal mt-2">{s.title}</div>
              <p className="m-0 text-[15px] leading-[1.55] text-[#b9bbc6]">{s.text}</p>
            </motion.div>
          ))}
        </div>
        <motion.div {...reveal(1)} className="mt-6">
          <Link href="/architecture" data-magnetic className="inline-flex items-center gap-3 h-[52px] pl-5 pr-2 rounded-full bg-white/[.08] border border-white/15 text-[15px] hover:bg-white/[.14] transition-colors">
            Full architecture
            <span className="w-9 h-9 rounded-full bg-white text-[var(--ink)] grid place-items-center"><ArrowUpRight size={15} /></span>
          </Link>
        </motion.div>
      </Section>

      {/* ── 03 What it knows ────────────────────────────────────────── */}
      <Section id="sources">
        <Head n="03" kicker="What it knows" title="Four files. Nothing else." lead="The assistant’s whole world is four small files I maintain by hand. If it isn’t in them, the AI doesn’t know it." />
        <div className="mt-[clamp(36px,5vw,64px)] grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {FILES.map((f, i) => (
            <motion.div key={f.name} {...reveal(i)} className="tile rounded-[32px] p-6 min-h-[230px] flex flex-col justify-between gap-6">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-[15px] text-[var(--acc)]">{f.name}</span>
                <span className="w-2 h-2 rounded-full bg-[var(--acc)] shadow-[0_0_10px_var(--acc)] pulse-dot" />
              </div>
              <p className="m-0 text-base leading-[1.5] text-[#d4d6de]">{f.what}</p>
              <span className="self-start px-3 py-1.5 rounded-full bg-white/[.08] text-[13px] text-[var(--mist)]">{f.count}</span>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ── 04 Projects in detail ───────────────────────────────────── */}
      <Section id="projects">
        <Head n="04" kicker="Projects in detail" title="What I’ve built." lead="The same write-ups the assistant reads. Tap “Ask about this” to hear it explain one." />
        <div className="mt-[clamp(36px,5vw,64px)] grid gap-4 grid-cols-1 lg:grid-cols-2">
          {projects.map((p, i) => {
            const look = PROJECT_LOOK[p.id] ?? { letter: p.title[0], grad: 'linear-gradient(135deg,#F3EBDD,#CDBFA8)', short: p.title };
            return (
              <motion.article key={p.id} {...reveal(i % 2)} data-spot className="relative rounded-[36px] p-[clamp(20px,2.6vw,30px)] border border-white/10 bg-[linear-gradient(180deg,#1a1216,#0e090b)] shadow-[0_40px_80px_rgba(0,0,0,.45),inset_0_1px_0_rgba(255,255,255,.06)] flex flex-col gap-4">
                <div className="flex items-start gap-4">
                  <span className="w-14 h-14 rounded-full grid place-items-center text-[#1a0a10] font-[family-name:var(--font-display)] font-extrabold text-xl shrink-0 shadow-[inset_0_1px_0_rgba(255,255,255,.6)]" style={{ background: look.grad }}>{look.letter}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-[var(--muted)]">
                      <span>{p.org} · {p.date}</span>
                      <span className="px-2.5 py-1 rounded-full bg-white text-[var(--ink)]">{p.badge.replace(' ⭐', '')}</span>
                    </div>
                    <h3 className="m-0 mt-1.5 text-[clamp(20px,2vw,26px)] font-normal leading-tight">{p.title}</h3>
                  </div>
                </div>
                <p className="m-0 text-[15px] leading-[1.6] text-[#c9cbd4]">{p.description}</p>
                <ul className="m-0 p-0 list-none flex flex-col gap-2">
                  {p.highlights.slice(0, 3).map((h) => (
                    <li key={h} className="flex gap-3 text-sm leading-[1.5] text-[#b9bbc6]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--acc)] shadow-[0_0_8px_var(--acc)] mt-2 shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-2 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-1.5">
                    {p.tags.slice(0, 4).map((t) => (
                      <span key={t} className="px-3 py-1.5 rounded-full bg-white/[.08] border border-white/10 text-[13px]">{t}</span>
                    ))}
                  </div>
                  <button type="button" data-magnetic onClick={() => onAsk(`Tell me about ${look.short}`)} className="ml-auto inline-flex items-center gap-2.5 h-11 pl-4 pr-1.5 rounded-full bg-white text-[var(--ink)] text-sm shrink-0">
                    Ask about this
                    <span className="w-8 h-8 rounded-full bg-[#f0f0f2] grid place-items-center"><ArrowRight size={14} /></span>
                  </button>
                </div>
              </motion.article>
            );
          })}
        </div>
      </Section>

      {/* ── 05 Try asking ───────────────────────────────────────────── */}
      <Section id="ask">
        <Head n="05" kicker="Try asking" title="Questions worth asking." lead="Tap one — the page scrolls back up and the assistant answers from my files." />
        <div className="mt-[clamp(36px,5vw,64px)] grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {QUESTIONS.map((q, i) => (
            <motion.button key={q} type="button" {...reveal(i % 3)} onClick={() => onAsk(q)} className="tile group text-left rounded-[28px] p-5 pl-6 flex items-center justify-between gap-4 min-h-[96px]">
              <span className="text-[17px] leading-[1.35]">{q}</span>
              <span className="w-11 h-11 rounded-full bg-white/[.08] grid place-items-center shrink-0 transition-colors group-hover:bg-white group-hover:text-[var(--ink)]"><ArrowRight size={16} /></span>
            </motion.button>
          ))}
        </div>
      </Section>

      {/* ── 06 Guardrails ───────────────────────────────────────────── */}
      <Section id="guardrails">
        <Head n="06" kicker="Guardrails" title="Grounded, not guessing." lead="Ask about something that isn’t in my files — say, a job at Google — and it tells you so instead of making it up." />
        <div className="relative mt-[clamp(36px,5vw,64px)] grid gap-4 grid-cols-1 sm:grid-cols-3 isolate">
          <div aria-hidden className="absolute -inset-x-[4%] -inset-y-[20%] -z-10 pointer-events-none">
            <div className="blob w-[34%] left-[2%] top-[10%] blur-[40px] opacity-70" style={{ background: 'radial-gradient(circle, #c2385a, transparent 65%)' }} />
            <div className="blob w-[30%] left-[36%] top-[20%] blur-[40px] opacity-60" style={{ background: 'radial-gradient(circle, #8FAE8A, transparent 65%)' }} />
            <div className="blob w-[32%] right-[0%] top-[0%] blur-[40px] opacity-60" style={{ background: 'radial-gradient(circle, #C9A46A, transparent 65%)' }} />
          </div>
          {[
            { v: '04', l: 'Source files', s: 'résumé · bio · projects · skills' },
            { v: '0.2', l: 'Model temperature', s: 'low randomness, factual answers' },
            { v: '02', l: 'Evaluation checks passing', s: 'grounding · hallucination resistance' },
          ].map((t, i) => (
            <motion.div key={t.l} {...reveal(i)} className="glass-shell rounded-[40px] p-7 min-h-[230px] flex flex-col justify-between">
              <div className="text-xl font-medium">{t.l}</div>
              <div>
                <div className="font-[family-name:var(--font-display)] font-extrabold text-[clamp(64px,7vw,96px)] leading-[.85]">{t.v}</div>
                <div className="text-sm text-white/80 mt-3">{t.s}</div>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div {...reveal(1)} className="mt-6">
          <Link href="/evaluation" data-magnetic className="inline-flex items-center gap-3 h-[52px] pl-5 pr-2 rounded-full bg-white/[.08] border border-white/15 text-[15px] hover:bg-white/[.14] transition-colors">
            See the evaluation
            <span className="w-9 h-9 rounded-full bg-white text-[var(--ink)] grid place-items-center"><ArrowUpRight size={15} /></span>
          </Link>
        </motion.div>
      </Section>

      {/* ── 07 Contact ──────────────────────────────────────────────── */}
      <Section id="contact">
        <motion.div {...reveal(0)} data-spot className="relative overflow-hidden rounded-[40px] p-[clamp(24px,4vw,56px)] border border-white/10 bg-[linear-gradient(180deg,#1a1216,#0e090b)] shadow-[0_40px_80px_rgba(0,0,0,.45),inset_0_1px_0_rgba(255,255,255,.06)]">
          <div aria-hidden className="blob w-[65%] -left-[15%] -bottom-[70%] blur-[50px] opacity-40" style={{ background: 'radial-gradient(circle, var(--g4), transparent 62%)' }} />
          <div aria-hidden className="blob w-[55%] -right-[15%] -top-[60%] blur-[50px] opacity-25" style={{ background: 'radial-gradient(circle, var(--g2), transparent 62%)' }} />
          <div className="relative grid gap-x-14 gap-y-10 items-end grid-cols-1 md:grid-cols-2">
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-3 text-[15px] text-[var(--muted)]">
                <span className="font-[family-name:var(--font-display)] font-extrabold text-[var(--acc)]">07</span>Contact
              </div>
              <h2 className="m-0 font-extralight text-[clamp(52px,7vw,104px)] leading-[.95] tracking-[-0.04em]">Want the full story?</h2>
              <p className="m-0 text-lg leading-[1.55] text-[#b9bbc6] max-w-[440px]">My portfolio has the case studies, career timeline and publications — or reach out directly.</p>
            </div>
            <div className="flex flex-col gap-2.5">
              {[
                { k: 'Portfolio', v: 'alexthefirst99.github.io/web', href: PORTFOLIO, top: true },
                { k: 'Email', v: 'ttran247@CougarNet.UH.EDU', href: 'mailto:ttran247@CougarNet.UH.EDU' },
                { k: 'LinkedIn', v: 'in/tuntran271299', href: 'https://linkedin.com/in/tuntran271299' },
                { k: 'Résumé', v: 'Download PDF', href: `${PORTFOLIO}Resume/TuNTran_Resume_DataScience.pdf` },
              ].map((r) => (
                <a
                  key={r.k}
                  href={r.href}
                  target={r.top ? '_top' : r.href.startsWith('mailto:') ? undefined : '_blank'}
                  rel={r.top || r.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                  className="tile flex items-center gap-4 rounded-full py-4 pr-4 pl-6"
                >
                  <span className="text-sm text-[var(--muted)] w-[84px] shrink-0">{r.k}</span>
                  <span className="flex-1 min-w-0 text-[17px] truncate">{r.v}</span>
                  <span className="w-10 h-10 rounded-full bg-white/[.08] grid place-items-center shrink-0"><ArrowUpRight size={16} /></span>
                </a>
              ))}
            </div>
          </div>
        </motion.div>
        <div className="mt-7 px-2 flex flex-wrap justify-between gap-3 text-sm text-[var(--muted)]">
          <span>© Tu N (Alex) Tran · Houston, Texas</span>
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
            Back to top <ArrowUp size={14} />
          </button>
        </div>
      </Section>
    </div>
  );
}
