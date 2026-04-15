import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ArchitecturePage() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 font-sans text-gray-900 dark:text-gray-100 p-8 pt-16">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold tracking-tight">System Architecture</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          How "Meet Alex AI" was built: a lightweight, grounded RAG pipeline running entirely within a Next.js environment.
        </p>

        <hr className="border-gray-200 dark:border-gray-800" />

        <div className="space-y-12">
          
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">1. Frontend (Next.js & Tailwind)</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              The interface is a standard React SPA built on top of Next.js App Router. It uses Tailwind CSS for rapid styling, and Framer Motion for micro-animations that give the chat UI a premium feel. 
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">2. Content Ingestion (Source of Truth)</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              To guarantee factual accuracy, all answers are grounded in a set of explicitly managed markdown and JSON files inside the <code>/content</code> directory. These include my resume, extended biography, and project metadata.
            </p>
            <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-xl font-mono text-sm">
              /content <br/>
              ├── resume.json <br/>
              ├── bio.md <br/>
              ├── projects.json <br/>
              └── skills.json
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">3. Retrieval System</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              When a user asks a question, the backend computes the embedding of the query using OpenAI's <code>text-embedding-3-small</code> model. Because the overall portfolio corpus is small (a few kilobytes of text), the "vector store" can be an in-memory JSON array. The system performs a simple cosine-similarity search against paragraph chunks, extracting the top highest-scoring context to append to the system prompt.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">4. LLM Generation</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Once context is retrieved, a strict system prompt forces the model (<code>gpt-4o-mini</code>) to answer ONLY based on the provided text. The temperature is kept low (0.2) to prevent hallucinations.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
