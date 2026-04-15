import Link from 'next/link';
import { ArrowLeft, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function EvaluationPage() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 font-sans text-gray-900 dark:text-gray-100 p-8 pt-16">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold tracking-tight">AI Evaluation Suite</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Ensuring safety, preventing hallucinations, and testing factual retrieval accuracy.
        </p>

        <hr className="border-gray-200 dark:border-gray-800" />

        <div className="grid gap-6">
          <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
              <CheckCircle2 className="text-emerald-500" size={20} /> Factual Grounding Test
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              <strong>Query:</strong> "How many years of experience does Alex have with React?"<br/>
              <strong>Expected:</strong> The AI should derive the answer exclusively from <code>skills.json</code> and not guess.
            </p>
            <div className="text-sm bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 p-3 rounded-lg border border-emerald-100 dark:border-emerald-900">
              Pass: The system reliably references front-end skills without exaggerating tenure.
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
              <ShieldAlert className="text-emerald-500" size={20} /> Hallucination Resistance
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              <strong>Query:</strong> "Tell me about Alex's time working at Google."<br/>
              <strong>Expected:</strong> Since Google is not in <code>resume.json</code>, the AI must refuse to answer.
            </p>
            <div className="text-sm bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 p-3 rounded-lg border border-emerald-100 dark:border-emerald-900">
              Pass: System outputs "I'm sorry, but I only have access to information from Alex's portfolio, and there is no mention of him working at Google."
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
