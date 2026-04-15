'use client';

import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { NeuralCanvas } from '@/components/3d/NeuralCanvas';
import { useStore } from '@/store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Terminal } from 'lucide-react';

// ─── Skill bars ──────────────────────────────────────────────────────────────
const SKILLS = [
  { cat: 'Python / Data Science', pct: 92 },
  { cat: 'Data Visualization', pct: 88 },
  { cat: 'Machine Learning', pct: 78 },
  { cat: 'R / Bioinformatics', pct: 75 },
  { cat: 'Cloud / DevOps (AWS)', pct: 60 },
  { cat: 'SQL (In Progress)', pct: 45 },
];

const PROJECTS = [
  { title: 'Loki Interface', sub: 'Gigapixel WSI + LLM Pathology Platform', tags: ['Dash', 'React', 'Deep Learning', 'LLM'], badge: 'Nature Methods ⭐' },
  { title: 'Mjolnir', sub: 'Gene Expression Viz Platform', tags: ['Dash', 'Plotly', 'Bioinformatics'], badge: 'Preprint' },
  { title: 'Visual–Omics', sub: 'Histology × Spatial Transcriptomics', tags: ['ML', '32 Organs'], badge: 'Nature Methods' },
  { title: 'Macrophage Analysis', sub: 'Single-Cell Immune Clustering', tags: ['UMAP', 'Leiden', 'scRNA'], badge: 'Research' },
  { title: 'COVID-19 RNA-seq', sub: 'Differential Expression Pipeline', tags: ['TopHat', 'Python'], badge: 'Research' },
];

const PAPERS = [
  { journal: 'Nature Methods', year: '2025', title: 'A visual–omics foundation model to bridge histopathology with spatial transcriptomics', authors: 'Chen W., Zhang P., Tran T. N., et al.', doi: '10.1038/s41592-025-02707-1' },
  { journal: 'Nature Communications', year: '2025', title: 'Thor: a platform for cell-level investigation of spatial transcriptomics and histology', authors: 'Zhang P., Chen W., Tran T. N., et al.', doi: '10.1038/s41467-025-62593-1' },
];

const EXPERIENCES = [
  {
    title: 'Research Assistant',
    org: 'Houston Methodist — Dr. Guangyu Wang Lab',
    dept: 'Cardiovascular Regeneration Program',
    dates: 'Dec 2022 – Present',
    type: 'Research',
    highlights: [
      'Built reproducible pipelines for large-scale single-cell & spatial data analysis (Python, R, Snakemake)',
      'Applied clustering, trajectory inference & statistical testing to complex datasets',
      'Created interactive dashboards (Dash/Plotly) for cross-functional teams',
      'Delivered analyses supporting Nature Methods & Nature Communications publications',
    ],
  },
  {
    title: 'Marketing & Data Intern',
    org: 'Viet Power Solutions JSC',
    dept: 'Vietnam',
    dates: 'Jan 2022 – Aug 2022',
    type: 'Industry',
    highlights: [
      'Monitored engagement metrics with Google Analytics — +39.5% campaign performance',
      'Launched LinkedIn, Facebook & Google Ads campaigns — +50% user engagement',
      'Produced data-driven reports to inform leadership & refine product strategy',
    ],
  },
];

function SkillsPanel() {
  return (
    <div className="w-96 font-mono">
      <div className="text-red-500 text-xs tracking-widest mb-4 uppercase">// Skill Matrix</div>
      {SKILLS.map((s, i) => (
        <div key={s.cat} className="mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-white/60">{s.cat}</span>
            <span className="text-red-400">{s.pct}%</span>
          </div>
          <div className="h-[2px] bg-red-900/30 rounded">
            <motion.div
              className="h-full rounded"
              style={{ background: 'linear-gradient(90deg, #8b0000, #ff003c)', boxShadow: '0 0 6px #ff003c' }}
              initial={{ width: 0 }}
              animate={{ width: `${s.pct}%` }}
              transition={{ duration: 0.8, delay: i * 0.08, ease: 'easeOut' }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function ProjectsPanel() {
  return (
    <div className="font-mono" style={{ width: 500 }}>
      <div className="text-red-500 text-xs tracking-widest mb-4 uppercase">// Project Engrams</div>
      <div className="grid grid-cols-2 gap-3">
        {PROJECTS.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-black/70 border border-red-900/50 p-3"
            style={{ boxShadow: '0 0 15px rgba(255,0,60,0.08)' }}
          >
            <div className="flex justify-between items-start mb-1">
              <span className="text-white text-xs font-bold">{p.title}</span>
              <span className="text-red-500 text-[9px] px-1.5 py-0.5 bg-red-900/20">{p.badge}</span>
            </div>
            <div className="text-white/40 text-[10px] mb-2">{p.sub}</div>
            <div className="flex flex-wrap gap-1">
              {p.tags.map(t => (
                <span key={t} className="text-[9px] px-1.5 py-0.5 bg-red-900/20 text-red-400/70">{t}</span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ResearchPanel() {
  return (
    <div className="w-96 font-mono">
      <div className="text-red-500 text-xs tracking-widest mb-4 uppercase">// Publication Log</div>
      {PAPERS.map((p, i) => (
        <motion.div
          key={p.doi}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.15 }}
          className="bg-black/70 border border-red-900/40 p-4 mb-3"
          style={{ boxShadow: '0 0 20px rgba(255,0,60,0.07)' }}
        >
          <div className="flex justify-between mb-2">
            <span className="text-red-400 text-xs tracking-wider">{p.journal}</span>
            <span className="text-red-900 text-xs">{p.year}</span>
          </div>
          <div className="text-white text-xs leading-relaxed mb-2">{p.title}</div>
          <div className="text-white/40 text-[10px] mb-2">{p.authors}</div>
          <div className="text-red-900 text-[9px] tracking-wider">doi:{p.doi}</div>
        </motion.div>
      ))}
    </div>
  );
}

function ExperiencePanel() {
  return (
    <div className="font-mono" style={{ width: 460 }}>
      <div className="text-red-500 text-xs tracking-widest mb-4 uppercase">// Work Experience Log</div>
      {EXPERIENCES.map((exp, i) => (
        <motion.div
          key={exp.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.15 }}
          className="bg-black/70 border border-red-900/40 p-4 mb-3"
          style={{ boxShadow: '0 0 20px rgba(255,0,60,0.07)' }}
        >
          <div className="flex justify-between items-start mb-1">
            <span className="text-white text-sm font-bold">{exp.title}</span>
            <span className="text-[9px] px-2 py-0.5 bg-red-900/20 text-red-400">{exp.type}</span>
          </div>
          <div className="text-red-400/70 text-xs mb-0.5">{exp.org}</div>
          <div className="text-white/30 text-[10px] mb-3">{exp.dept} · {exp.dates}</div>
          <ul className="space-y-1.5">
            {exp.highlights.map((h, j) => (
              <motion.li
                key={j}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 + j * 0.06 }}
                className="flex gap-2 text-white/60 text-[10px] leading-relaxed"
              >
                <span className="text-red-700 flex-shrink-0 mt-0.5">▸</span>
                <span>{h}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  );
}

function OverviewPanel() {
  const stats = [
    { label: 'Degree', value: 'MS Eng. Data Science' },
    { label: 'School', value: 'Univ. of Houston' },
    { label: 'GPA', value: '3.42 / 4.0' },
    { label: 'Publications', value: '2 (Nature tier)' },
    { label: 'Current Role', value: 'Research Assistant' },
    { label: 'Status', value: 'Seeking Internship' },
  ];
  return (
    <div className="font-mono" style={{ width: 380 }}>
      <div className="text-red-500 text-xs tracking-widest mb-1 uppercase">// Identity Engram</div>
      <div className="text-white text-xl font-bold mb-1">Tu N. (Alex) Tran</div>
      <div className="text-white/40 text-xs mb-4">Houston Methodist · UH Engineering</div>
      <div className="grid grid-cols-2 gap-2">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.07 }}
            className="bg-red-950/10 border border-red-900/30 p-2.5"
          >
            <div className="text-red-600 text-[9px] tracking-widest uppercase mb-1">{s.label}</div>
            <div className="text-white text-xs">{s.value}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function DataPanel({ mode }: { mode: string }) {
  const panels: Record<string, React.ReactNode> = {
    skills: <SkillsPanel />,
    projects: <ProjectsPanel />,
    research: <ResearchPanel />,
    experience: <ExperiencePanel />,
    overview: <OverviewPanel />,
    role_fit: <OverviewPanel />,
  };
  return <>{panels[mode] ?? <OverviewPanel />}</>;
}

// ─── Main App ────────────────────────────────────────────────────────────────
export default function App() {
  const { narratorText, mode, isNarrating, updateStateFromAI, setCameraTarget } = useStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);

  useEffect(() => {
    if (mode === 'overview') setCameraTarget([0, 0, 0]);
    else if (mode === 'projects') setCameraTarget([2, 0, 0]);
    else if (mode === 'skills') setCameraTarget([-2, -1, 0]);
    else if (mode === 'research') setCameraTarget([0, 2, 0]);
    else if (mode === 'experience') setCameraTarget([-2, 2, 0]);
  }, [mode, setCameraTarget]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const query = input;
    setInput('');
    const userMessage = { role: 'user', content: query };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    
    setIsLoading(true);
    setHasInteracted(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      
      setMessages([...newMessages, { role: 'assistant', content: data.content || 'Processing...' }]);
      updateStateFromAI((data.mode as any) || 'overview', data.focusId || null, data.content || 'Processing...');
    } catch (err) {
      console.error(err);
      useStore.getState().setNarratorText('Network anomaly. Connection lost.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen bg-black overflow-hidden relative font-mono">
      {/* WebGL Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas>
          <NeuralCanvas />
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col p-6 gap-4">
        {/* Header */}
        <div className="flex justify-between items-center text-xs text-red-500/60 tracking-widest uppercase">
          <div className="flex items-center gap-2">
            <Terminal size={12} className="animate-pulse" />
            <span>ALEX // CORE [ONLINE]</span>
          </div>
          <div>SECTOR: [{mode}]</div>
        </div>

        {/* Data Panel — left side, always visible */}
        <div className="flex flex-1 items-center gap-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: -24, filter: 'blur(8px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: -16, filter: 'blur(4px)' }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="pointer-events-none"
            >
              <DataPanel mode={mode} />
            </motion.div>
          </AnimatePresence>

          {/* Narration Text — right side terminal readout, always visible */}
          <AnimatePresence mode="wait">
            {narratorText && (
              <motion.div
                key={narratorText}
                initial={{ opacity: 0, x: 24, filter: 'blur(8px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: 16, filter: 'blur(4px)' }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="pointer-events-none ml-auto max-w-sm"
              >
                <div className="border-l border-red-900/50 pl-4 flex flex-col" style={{ maxHeight: '60vh' }}>
                  <div className="text-red-500/60 text-[9px] tracking-widest uppercase mb-3 flex-shrink-0">// System Narration</div>
                  <p className="text-white/80 text-xs leading-6 font-mono whitespace-pre-wrap overflow-y-auto pr-2 pointer-events-auto"
                     style={{ scrollbarWidth: 'thin', scrollbarColor: '#7f1d1d transparent' }}>
                    {narratorText}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom bar — input only */}
        <div className="pointer-events-auto space-y-2 max-w-xl mx-auto w-full">

          {/* Quick prompt chips */}
          <div className="flex flex-wrap gap-2 justify-center mb-1">
            {[
              'Show his projects',
              'What are his skills?',
              'Research & publications',
              'Work experience',
              'Who is Alex?',
              'Is he a good hire?',
            ].map((prompt) => (
              <button
                key={prompt}
                onClick={() => {
                  setInput(prompt);
                  // auto-submit
                  setTimeout(() => {
                    const form = document.getElementById('chat-form') as HTMLFormElement;
                    form?.requestSubmit();
                  }, 50);
                }}
                disabled={isLoading}
                className="text-[10px] uppercase tracking-widest px-3 py-1.5 border border-red-900/40 text-red-500/60 hover:border-red-500/60 hover:text-red-400 hover:bg-red-950/20 transition-all disabled:opacity-30"
              >
                {prompt}
              </button>
            ))}
          </div>
          {isLoading && (
            <p className="text-red-500/40 text-xs tracking-widest text-center animate-pulse">
              BREACHING BLACKWALL...
            </p>
          )}
          <form id="chat-form" onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              placeholder="Inject payload  — try 'projects', 'skills', 'research'..."
              className="w-full bg-black/80 backdrop-blur-md border-b-2 border-red-500/30 text-red-400 placeholder-red-900/40 px-4 py-3 focus:outline-none focus:border-red-500 transition-all text-xs uppercase tracking-widest"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-red-700 hover:text-red-400 disabled:opacity-0 transition-colors"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
