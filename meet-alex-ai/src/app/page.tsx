'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useStore, type AppMode } from '@/store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Volume2, VolumeX } from 'lucide-react';
import HoverFx from '@/components/HoverFx';
import AboutSections from '@/components/AboutSections';

// ─── Sound ───────────────────────────────────────────────────────────────────
let audioCtx: AudioContext | null = null;
const playTechBeep = () => {
  if (typeof window === 'undefined') return;
  if (!audioCtx) {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new Ctx();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(600 + Math.random() * 400, audioCtx.currentTime);

  gainNode.gain.setValueAtTime(0.015, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 0.03);
};

function TypewriterText({ text, isMuted }: { text: string; isMuted: boolean }) {
  const [displayedText, setDisplayedText] = useState('');
  const { isNarrating, setIsNarrating } = useStore();
  const mutedRef = useRef(isMuted);

  useEffect(() => {
    mutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    setDisplayedText('');
    setIsNarrating(true);
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      if (!mutedRef.current && i % 2 === 0) {
        playTechBeep();
      }
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        setIsNarrating(false);
      }
    }, 12);

    return () => {
      clearInterval(interval);
      setIsNarrating(false);
    };
  }, [text, setIsNarrating]);

  return (
    <>
      {displayedText}
      {isNarrating && (
        <span className="caret inline-block w-2 h-[18px] ml-0.5 align-[-3px] bg-[#16161a]" />
      )}
    </>
  );
}

// ─── Data ────────────────────────────────────────────────────────────────────
const MODE_LABELS: Record<string, string> = {
  overview: 'Overview',
  projects: 'Projects',
  skills: 'Skills',
  research: 'Publications',
  experience: 'Experience',
  education: 'Education',
  role_fit: 'Role fit',
  qa: 'Overview',
};
const MODE_ORDER = ['overview', 'projects', 'skills', 'research', 'experience', 'education', 'role_fit'];

const SKILLS = [
  { cat: 'Python / Data Science', pct: 92 },
  { cat: 'Data Visualization', pct: 88 },
  { cat: 'Machine Learning', pct: 78 },
  { cat: 'R / Bioinformatics', pct: 75 },
  { cat: 'Cloud / DevOps (AWS)', pct: 60 },
  { cat: 'SQL (In Progress)', pct: 45 },
];

const PROJECTS = [
  { title: 'Loki Inference Platform', sub: 'Full-stack deep learning · Houston Methodist', tags: ['Dash', 'React', 'LLM'], badge: 'Nature Methods', letter: 'L', grad: 'linear-gradient(135deg,#F1DDB8,#C9A46A)' },
  { title: 'Mjolnir', sub: 'Gene expression visualization platform', tags: ['Dash', 'Plotly'], badge: 'Nature Comms', letter: 'M', grad: 'linear-gradient(135deg,#D3E2CC,#8FAE8A)' },
  { title: 'Visual–Omics', sub: 'Histology × spatial transcriptomics · 32 organs', tags: ['ML', 'Python'], badge: 'Nature Methods', letter: 'V', grad: 'linear-gradient(135deg,#C4D8D9,#7FA3A8)' },
  { title: 'Macrophage Analysis', sub: 'Single-cell immune clustering', tags: ['UMAP', 'Leiden'], badge: 'Research', letter: 'A', grad: 'linear-gradient(135deg,#F3EBDD,#CDBFA8)' },
];

const PAPERS = [
  { journal: 'Nature Methods', year: '2025', title: 'A visual–omics foundation model to bridge histopathology with spatial transcriptomics', authors: 'Chen W., Zhang P., Tran T. N., et al.', doi: '10.1038/s41592-025-02707-1' },
  { journal: 'Nature Communications', year: '2025', title: 'Thor: a platform for cell-level investigation of spatial transcriptomics and histology', authors: 'Zhang P., Chen W., Tran T. N., et al.', doi: '10.1038/s41467-025-62593-1' },
];

const EXPERIENCES = [
  {
    title: 'Research Assistant',
    org: 'Houston Methodist · Dr. Guangyu Wang Lab',
    dates: 'Dec 2022 — Present',
    chipBg: 'linear-gradient(90deg,#C9A46A,#F1DDB8)',
    highlights: [
      'Built data pipelines for large-scale single-cell and spatial omics datasets to support ML model development and evaluation',
      'Applied unsupervised learning and statistical analysis to identify patterns in high-dimensional biological data',
      'Assessed model predictions and validated outputs against biological signals for reliability and interpretability',
      'Developed interactive dashboards for visualization of model results by research teams',
      'Contributed to Nature Methods and Nature Communications publications',
    ],
  },
  {
    title: 'Marketing & Data Intern',
    org: 'Viet Power Solutions JSC · Vietnam',
    dates: 'Jan — Aug 2022',
    chipBg: 'linear-gradient(90deg,#A9C4A2,#D3E2CC)',
    highlights: [
      'Monitored digital engagement metrics with Google Analytics: +39.5% campaign performance',
      'Designed and launched targeted LinkedIn, Facebook & Google Ads campaigns: +50% user engagement',
      'Produced clear, data-driven reports to inform leadership and refine product strategy',
    ],
  },
];

const EDUCATION = [
  { degree: 'M.S. Engineering Data Science and AI', school: 'University of Houston · Cullen College of Engineering', meta: 'Houston, TX · Expected December 2026', gpa: '3.63' },
  { degree: 'B.S. Mathematics, Minor in Finance', school: 'University of Massachusetts Lowell', meta: "Lowell, MA · Aug 2017 — Aug 2021 · Dean's List 2020–2021", gpa: '3.135' },
];

const STATS = [
  { label: 'Degree', value: 'M.S. Data Science & AI' },
  { label: 'School', value: 'University of Houston' },
  { label: 'GPA', value: '3.63 / 4.0' },
  { label: 'Publications', value: '2 · Nature family' },
  { label: 'Current role', value: 'Research Assistant' },
  { label: 'Status', value: 'Seeking internship' },
];

const ROLES = [
  'Biomedical / health-tech data science',
  'Research engineering & ML pipelines',
  'Data visualization & dashboards',
  'Analytics with clear communication',
];

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.07, duration: 0.4 },
});

// ─── Panels ──────────────────────────────────────────────────────────────────
function OverviewPanel() {
  return (
    <div className="flex flex-col gap-[18px]">
      <div>
        <div className="text-[clamp(30px,3.2vw,44px)] font-extralight tracking-[-0.02em] leading-[1.05]">Tu N. (Alex) Tran</div>
        <div className="text-base text-[var(--mist)] mt-1.5">Houston Methodist · UH Engineering</div>
      </div>
      <div className="grid gap-2.5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {STATS.map((s, i) => (
          <motion.div key={s.label} {...fadeUp(i)} className="tile rounded-3xl px-[18px] py-4">
            <div className="text-[13px] tracking-[.06em] uppercase text-[var(--muted)]">{s.label}</div>
            <div className="text-[17px] mt-1.5">{s.value}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function RoleFitPanel() {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="text-[clamp(28px,3vw,40px)] font-extralight tracking-[-0.02em] leading-[1.05] mb-2">Where I fit best</div>
      {ROLES.map((r, i) => (
        <motion.div key={r} {...fadeUp(i)} className="tile flex items-center gap-4 rounded-full py-3.5 pr-3.5 pl-[22px]">
          <span className="font-[family-name:var(--font-display)] font-extrabold text-[15px] text-[var(--muted)] w-6">{String(i + 1).padStart(2, '0')}</span>
          <span className="flex-1 text-[17px]">{r}</span>
          <span className="w-10 h-10 rounded-full bg-white/[.08] grid place-items-center"><ArrowUpRight size={16} /></span>
        </motion.div>
      ))}
    </div>
  );
}

function SkillsPanel() {
  return (
    <div className="flex flex-col gap-4">
      {SKILLS.map((s, i) => (
        <div key={s.cat}>
          <div className="flex justify-between items-baseline gap-3 text-base mb-2">
            <span>{s.cat}</span>
            <span className="font-[family-name:var(--font-display)] font-extrabold text-lg text-[var(--acc)]">{s.pct}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/[.08] overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, var(--g3), var(--acc))', boxShadow: '0 0 14px var(--acc)' }}
              initial={{ width: 0 }}
              animate={{ width: `${s.pct}%` }}
              transition={{ duration: 0.9, delay: i * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function ProjectsPanel() {
  return (
    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
      {PROJECTS.map((p, i) => (
        <motion.div key={p.title} {...fadeUp(i)} className="tile rounded-[28px] p-5 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span
              className="w-11 h-11 rounded-full grid place-items-center text-[#1a0a10] font-[family-name:var(--font-display)] font-extrabold text-lg shrink-0"
              style={{ background: p.grad }}
            >
              {p.letter}
            </span>
            <span className="text-[17px] font-medium leading-tight">{p.title}</span>
          </div>
          <div className="text-[15px] text-[var(--mist)] leading-snug">{p.sub}</div>
          <div className="flex flex-wrap gap-1.5 mt-auto">
            <span className="px-3 py-1.5 rounded-full bg-white text-[var(--ink)] text-[13px]">{p.badge}</span>
            {p.tags.map((t) => (
              <span key={t} className="px-3 py-1.5 rounded-full bg-white/[.08] border border-white/10 text-[13px]">{t}</span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function ResearchPanel() {
  return (
    <div className="flex flex-col gap-3">
      {PAPERS.map((p, i) => (
        <motion.a
          key={p.doi}
          {...fadeUp(i)}
          href={`https://doi.org/${p.doi}`}
          target="_blank"
          rel="noopener noreferrer"
          className="tile flex flex-col gap-2.5 rounded-[30px] px-6 py-[22px] transition-colors hover:border-white/25"
        >
          <div className="flex justify-between items-center gap-3">
            <span className="text-[15px] font-medium text-[var(--acc)]">{p.journal}</span>
            <span className="font-[family-name:var(--font-display)] font-extrabold text-lg">{p.year}</span>
          </div>
          <div className="text-[clamp(18px,1.8vw,22px)] font-light leading-[1.3] text-pretty">{p.title}</div>
          <div className="flex justify-between items-center gap-3 flex-wrap">
            <span className="text-sm text-[var(--mist)]">{p.authors}</span>
            <span className="text-[13px] text-[var(--muted)]">doi:{p.doi} ↗</span>
          </div>
        </motion.a>
      ))}
    </div>
  );
}

function ExperiencePanel() {
  return (
    <div className="flex flex-col gap-3">
      {EXPERIENCES.map((e, i) => (
        <motion.div key={e.title} {...fadeUp(i)} className="tile rounded-[30px] px-6 py-[22px] flex flex-col gap-3">
          <div className="flex justify-between items-start gap-3 flex-wrap">
            <div>
              <div className="text-xl font-medium">{e.title}</div>
              <div className="text-[15px] text-[var(--mist)] mt-1">{e.org}</div>
            </div>
            <span className="px-3 py-[7px] rounded-full text-[#1a0a10] text-[13px] whitespace-nowrap" style={{ background: e.chipBg }}>
              {e.dates}
            </span>
          </div>
          <ul className="flex flex-col gap-2">
            {e.highlights.map((h) => (
              <li key={h} className="flex gap-3 text-[15px] leading-[1.45] text-[#d4d6de]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--acc)] mt-2 shrink-0" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  );
}

function EducationPanel() {
  return (
    <div className="flex flex-col gap-3">
      {EDUCATION.map((e, i) => (
        <motion.div key={e.degree} {...fadeUp(i)} className="tile rounded-[30px] px-6 py-[22px] flex items-center gap-5 flex-wrap">
          <div className="flex-[1_1_260px] min-w-0">
            <div className="text-[19px] font-medium leading-tight">{e.degree}</div>
            <div className="text-[15px] text-[var(--mist)] mt-1.5">{e.school}</div>
            <div className="text-sm text-[var(--muted)] mt-1.5">{e.meta}</div>
          </div>
          <div className="text-right">
            <div className="text-[13px] tracking-[.06em] text-[var(--muted)]">GPA</div>
            <div className="text-[56px] font-extralight leading-[.9] tracking-[-0.03em]">{e.gpa}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function DataPanel({ mode }: { mode: string }) {
  const panels: Record<string, React.ReactNode> = {
    skills: <SkillsPanel />,
    projects: <ProjectsPanel />,
    research: <ResearchPanel />,
    experience: <ExperiencePanel />,
    education: <EducationPanel />,
    overview: <OverviewPanel />,
    role_fit: <RoleFitPanel />,
  };
  return <>{panels[mode] ?? <OverviewPanel />}</>;
}

// ─── Main App ────────────────────────────────────────────────────────────────
export default function App() {
  const { narratorText, mode, isNarrating, updateStateFromAI } = useStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [isSoundMuted, setIsSoundMuted] = useState(true);
  const [hasAskedWho, setHasAskedWho] = useState(false);
  const [lastQuery, setLastQuery] = useState('');

  const modeLabel = MODE_LABELS[mode] ?? 'Overview';
  const modeNum = String(Math.max(0, MODE_ORDER.indexOf(mode)) + 1).padStart(2, '0');

  const sendQuery = async (query: string) => {
    if (!query.trim() || isLoading) return;
    setInput('');
    setLastQuery(query);
    const newMessages = [...messages, { role: 'user', content: query }];
    setMessages(newMessages);
    if (query.toLowerCase().includes('who is alex')) setHasAskedWho(true);

    setIsLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();

      setMessages([...newMessages, { role: 'assistant', content: data.content || 'Processing...' }]);
      let safeMode: AppMode = 'overview';
      if (data.mode && typeof data.mode === 'string') {
        const lowerMode = data.mode.toLowerCase();
        if (lowerMode.includes('skill')) safeMode = 'skills';
        else if (lowerMode.includes('project')) safeMode = 'projects';
        else if (lowerMode.includes('research') || lowerMode.includes('paper')) safeMode = 'research';
        else if (lowerMode.includes('experience') || lowerMode.includes('work')) safeMode = 'experience';
        else if (lowerMode.includes('education') || lowerMode.includes('degree') || lowerMode.includes('school')) safeMode = 'education';
        else if (lowerMode.includes('role')) safeMode = 'role_fit';
      }
      updateStateFromAI(safeMode, data.focusId || null, data.content || 'Processing...');
    } catch (err) {
      console.error(err);
      useStore.getState().setNarratorText('Network error. Connection lost, please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Used by the sections below the chat: scroll back up, then ask.
  const askFromBelow = (q: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    sendQuery(q);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendQuery(input);
  };

  const chips = [
    { label: 'Who is Alex?', mode: 'overview' },
    ...(hasAskedWho ? [{ label: 'Show his projects', mode: 'projects' }] : []),
    { label: 'What are his skills?', mode: 'skills' },
    { label: 'Research & publications', mode: 'research' },
    { label: 'Work experience', mode: 'experience' },
    { label: 'Education background', mode: 'education' },
  ];

  const statusLabel = isLoading ? 'Thinking' : isNarrating ? 'Answering' : 'Ready';

  return (
    <div className="relative min-h-[100dvh] overflow-x-clip bg-[#0b0608] text-white">
      <HoverFx />
      {/* Header */}
      <header className="fixed left-0 right-0 z-50 pointer-events-none top-[max(14px,env(safe-area-inset-top))]">
        <div className="max-w-[1280px] mx-auto px-[clamp(14px,3vw,32px)] flex items-center justify-between gap-3">
          <a
            href="https://alexthefirst99.github.io/web/"
            target="_top"
            aria-label="Back to portfolio"
            data-magnetic
            className="glass-pill pointer-events-auto w-14 h-14 rounded-full grid place-items-center font-[family-name:var(--font-display)] font-extrabold text-lg shrink-0"
          >
            AT
          </a>
          <div className="glass-pill pointer-events-auto flex items-center gap-3.5 py-2 pr-2 pl-[22px] rounded-full min-w-0">
            <span className="text-[17px] font-medium italic tracking-[-0.01em] truncate">Meet AlexB</span>
            <span className="px-3 py-[7px] rounded-full bg-white/10 text-[13px] whitespace-nowrap">{modeLabel}</span>
          </div>
          <a
            href="https://alexthefirst99.github.io/web/"
            target="_top"
            data-magnetic
            className="pointer-events-auto h-14 pl-5 pr-2 rounded-full bg-white text-black flex items-center gap-3 text-[15px] shrink-0 shadow-[0_10px_30px_rgba(0,0,0,.35)]"
          >
            <span className="hidden sm:inline">Portfolio</span>
            <span className="w-10 h-10 rounded-full bg-[#f0f0f2] grid place-items-center"><ArrowUpRight size={16} /></span>
          </a>
        </div>
      </header>

      <main className="relative z-[1] h-[calc(100dvh-28px)] min-h-[560px] pt-[84px] px-[clamp(10px,2vw,24px)] pb-[clamp(10px,1.6vw,20px)]">
        <div className="max-w-[1320px] h-full mx-auto">
          <div className="glass-shell h-full rounded-[clamp(36px,5vw,72px)]" data-tilt>
            {/* Glow */}
            <div aria-hidden data-depth="40" className="blob w-[55%] -left-[15%] -top-[10%] blur-[60px] opacity-45" style={{ background: 'radial-gradient(circle, var(--g2), transparent 65%)' }} />
            <div aria-hidden data-depth="-30" className="blob w-[55%] -right-[15%] top-[20%] blur-[60px] opacity-70" style={{ background: 'radial-gradient(circle, var(--g3), transparent 65%)' }} />
            <div aria-hidden data-depth="20" className="blob w-[70%] left-[10%] -bottom-[45%] blur-[60px] opacity-85" style={{ background: 'radial-gradient(circle, var(--g4), transparent 62%)' }} />
            <div aria-hidden className="absolute inset-x-0 top-0 h-[45%] pointer-events-none bg-gradient-to-b from-black/60 to-transparent" />
            <div
              aria-hidden
              className="absolute inset-0 rounded-[inherit] pointer-events-none"
              style={{ background: 'linear-gradient(90deg,rgba(255,255,255,.16),rgba(255,255,255,0) 7%,rgba(255,255,255,0) 93%,rgba(255,255,255,.12)),radial-gradient(45% 14% at 50% 100%,rgba(255,255,255,.22),transparent 70%)' }}
            />

            <div className="relative z-[2] h-full flex flex-col gap-[clamp(14px,2.2vh,26px)] p-[clamp(18px,3vw,40px)]">
              {/* Title row */}
              <div className="shrink-0 flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
                <div className="flex flex-col gap-3.5">
                  <div className="self-start flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[.14] backdrop-blur-md text-[15px]">
                    <span className="pulse-dot w-2 h-2 rounded-full bg-[var(--acc)] shadow-[0_0_12px_var(--acc)]" />
                    Online · grounded on 4 source files
                  </div>
                  <h1 className="m-0 font-[family-name:var(--font-display)] font-extrabold text-[clamp(40px,min(7vw,9vh),96px)] leading-[.86] tracking-[-0.01em] [text-shadow:0_0_50px_rgba(255,255,255,.3)]">
                    ASK ALEXB
                  </h1>
                </div>
                <p className="hidden sm:block m-0 max-w-[420px] text-[clamp(17px,1.6vw,20px)] leading-[1.45] font-light text-white/90 text-pretty">
                  A small RAG assistant that answers only from my résumé, bio, projects and skills. Pick a topic or type a question.
                </p>
              </div>

              {/* Panels */}
              <div className="thin-scroll flex-1 min-h-0 flex flex-wrap gap-4 items-stretch overflow-y-auto">
                {/* Data panel */}
                <div data-spot className="thin-scroll flex-[999_1_520px] min-w-0 min-h-[280px] max-h-full overflow-y-auto rounded-[40px] p-[clamp(20px,2.6vw,30px)] bg-[rgba(10,4,7,.42)] border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,.08)] flex flex-col gap-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 text-[15px] text-[var(--mist)]">
                      <span className="font-[family-name:var(--font-display)] font-extrabold text-[var(--acc)]">{modeNum}</span>
                      {modeLabel}
                    </div>
                    <span className="px-3 py-[7px] rounded-full bg-white/[.08] text-[13px] text-[var(--mist)]">Data panel</span>
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={mode}
                      initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
                      transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
                    >
                      <DataPanel mode={mode} />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Narration card */}
                <div className="max-lg:order-first flex-[1_1_340px] min-w-0 min-h-[280px] max-h-full rounded-[40px] p-[clamp(20px,2.6vw,30px)] bg-white text-[var(--ink)] shadow-[0_30px_60px_rgba(40,0,30,.45)] flex flex-col gap-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-[clamp(24px,2.4vw,30px)] font-light tracking-[-0.02em]">Narration</div>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-2 px-3 py-[7px] rounded-full bg-[#f0f0f2] text-[13px] text-[#4a4b53]">
                        <span className={`w-[7px] h-[7px] rounded-full bg-[var(--ink)] ${isLoading || isNarrating ? 'pulse-dot' : ''}`} />
                        {statusLabel}
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsSoundMuted(!isSoundMuted)}
                        data-magnetic
                        aria-label={isSoundMuted ? 'Unmute AI voice' : 'Mute AI voice'}
                        title={isSoundMuted ? 'Unmute AI voice' : 'Mute AI voice'}
                        className="w-9 h-9 rounded-full bg-[#f0f0f2] grid place-items-center text-[#4a4b53] hover:text-[var(--ink)] transition-colors"
                      >
                        {isSoundMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                      </button>
                    </div>
                  </div>
                  {lastQuery && (
                    <div className="self-end max-w-[90%] px-4 py-2.5 rounded-[20px_20px_6px_20px] bg-[var(--ink)] text-white text-[15px]">
                      {lastQuery}
                    </div>
                  )}
                  <div className="thin-scroll-dark flex-1 min-h-0 overflow-y-auto pr-1.5">
                    <p className="m-0 text-base leading-relaxed text-[#2a2b31] whitespace-pre-wrap">
                      <TypewriterText text={narratorText} isMuted={isSoundMuted} />
                    </p>
                  </div>
                  <div className="flex items-center gap-2.5 pt-3 border-t border-[#ececef] text-[13px] text-[#6a6b73]">
                    <span className="w-7 h-7 rounded-full bg-[#f0f0f2] grid place-items-center font-[family-name:var(--font-display)] font-extrabold text-[11px] text-[var(--ink)]">AT</span>
                    Answers come only from my files.
                    <Link href="/architecture" className="ml-auto whitespace-nowrap underline-offset-2 hover:underline">How it works</Link>
                  </div>
                </div>
              </div>

              {/* Chips + input */}
              <div className="shrink-0 flex flex-col gap-3.5 max-w-[1100px] w-full mx-auto">
                <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] -mx-1 px-1 justify-[safe_center]">
                  {chips.map((c) => {
                    const on = c.mode === mode && !!lastQuery;
                    return (
                      <button
                        key={c.label}
                        type="button"
                        onClick={() => sendQuery(c.label)}
                        disabled={isLoading}
                        className={`shrink-0 whitespace-nowrap px-4 py-2.5 rounded-full border text-[14px] transition-colors disabled:opacity-40 ${
                          on ? 'bg-white text-[var(--ink)] border-white' : 'bg-white/[.06] text-white border-white/15 hover:bg-white/[.12]'
                        }`}
                      >
                        {c.label}
                      </button>
                    );
                  })}
                </div>
                <form
                  id="chat-form"
                  onSubmit={handleSubmit}
                  className="w-full max-w-[880px] mx-auto flex items-center gap-2.5 py-1.5 pr-1.5 pl-2 rounded-full bg-[rgba(34,20,26,.6)] backdrop-blur-xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,.45)]"
                >
                  <label htmlFor="chat-input" className="sr-only">Ask a question about Alex</label>
                  <input
                    id="chat-input"
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading}
                    autoComplete="off"
                    placeholder={isLoading ? 'Thinking…' : 'Ask anything… try projects, skills, research'}
                    className="flex-1 min-w-0 h-[52px] px-4 bg-transparent border-0 text-base outline-none placeholder:text-white/55"
                  />
                  <button
                    type="submit"
                    data-magnetic
                    disabled={isLoading || !input.trim()}
                    className="flex items-center gap-3 pl-5 pr-2 h-[52px] rounded-full bg-white text-[var(--ink)] text-base shrink-0 disabled:opacity-50 transition-opacity"
                  >
                    Ask
                    <span className="w-[38px] h-[38px] rounded-full bg-[#f0f0f2] grid place-items-center"><ArrowRight size={16} /></span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <AboutSections onAsk={askFromBelow} />
    </div>
  );
}
