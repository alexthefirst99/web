import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

interface DocumentChunk {
  id: string;
  source: string;
  content: string;
  embedding?: number[];
}

// In-memory store (for demo purposes)
let vectorStore: DocumentChunk[] = [];

// Naive cosine similarity
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Load content from disk
export function loadContentFiles(): DocumentChunk[] {
  const contentDir = path.join(process.cwd(), 'content');
  const chunks: DocumentChunk[] = [];

  const files = ['bio.md', 'resume.json', 'skills.json', 'projects.json'];

  files.forEach(file => {
    const filePath = path.join(contentDir, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      chunks.push({
        id: file,
        source: file,
        content: content
      });
    }
  });

  return chunks;
}

export async function searchContent(query: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;

  const chunks = loadContentFiles();
  
  // FALLBACK: If no API key, just return all content since it's small,
  // or a simple keyword match (here we just concatenate everything for MVP if small)
  if (!apiKey || apiKey === 'YOUR_OPENAI_API_KEY' || apiKey.trim() === '') {
    console.log('[RAG] No OpenAI API Key found. Using fallback keyword matcher (returning all docs).');
    return chunks.map(c => `--- Source: ${c.source} ---\n${c.content}`).join('\n\n');
  }

  // With API Key: actual vector embedding search
  const openai = new OpenAI({ apiKey });
  
  // Real implementation would cache embeddings. For MVP demo, we embed on the fly (or pretend)
  // Let's at least embed the query
  const queryEmbeddingRes = await openai.embeddings.create({
    input: query,
    model: 'text-embedding-3-small',
  });
  const queryEmbedding = queryEmbeddingRes.data[0].embedding;

  // We would also embed the chunks here or load from pre-embedded JSON.
  // We'll simulate loading from store or building on the fly.
  if (vectorStore.length === 0) {
    const embeddingsResults = await Promise.all(
      chunks.map(chunk => 
        openai.embeddings.create({
          input: chunk.content,
          model: 'text-embedding-3-small',
        })
      )
    );
    
    embeddingsResults.forEach((res, i) => {
      chunks[i].embedding = res.data[0].embedding;
      vectorStore.push(chunks[i]);
    });
  }

  // Rank
  const ranked = vectorStore
    .map(chunk => ({
      chunk,
      score: cosineSimilarity(queryEmbedding, chunk.embedding!)
    }))
    .sort((a, b) => b.score - a.score);

  // Return top 2 contexts
  const topContexts = ranked.slice(0, 2).map(r => `--- Source: ${r.chunk.source} ---\n${r.chunk.content}`);
  return topContexts.join('\n\n');
}
