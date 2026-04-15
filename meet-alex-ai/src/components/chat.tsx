'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, User, Bot, Loader2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm Alex's AI portfolio assistant. I can answer questions about his background, skills, and projects. What would you like to know?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e?: React.FormEvent, presetPrompt?: string) => {
    if (e) e.preventDefault();
    const query = presetPrompt || input;
    if (!query.trim() || isLoading) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: query }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      
      setMessages([...newMessages, { role: 'assistant', content: data.content }]);
    } catch (err) {
      console.error(err);
      setMessages([...newMessages, { role: 'assistant', content: 'Oops! Something went wrong while connecting to the server.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const prompts = [
    "Give me a 30-second summary",
    "Show Alex's best projects",
    "Explain Alex's technical strengths",
    "Which roles fit Alex best?"
  ];

  return (
    <div className="flex flex-col w-full max-w-3xl border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-gray-950 shadow-xl max-h-[700px] h-full">
      <div className="p-4 border-b border-gray-100 dark:border-gray-900 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center">
        <div>
          <h2 className="font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            Meet Alex AI
          </h2>
          <p className="text-xs text-gray-500 mt-1">Ask questions grounded in my actual background</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6" ref={scrollRef}>
        {messages.map((msg, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={i} 
            className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0">
                <Bot size={18} className="text-blue-600 dark:text-blue-400" />
              </div>
            )}
            <div className={`p-4 rounded-2xl max-w-[85%] text-sm whitespace-pre-wrap leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200 rounded-bl-none border border-gray-100 dark:border-gray-800'}`}>
              {msg.content}
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center shrink-0">
                <User size={18} className="text-gray-600 dark:text-gray-400" />
              </div>
            )}
          </motion.div>
        ))}
        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0">
               <Bot size={18} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-blue-500" /> 
              <span className="text-sm text-gray-500">Retrieving context...</span>
            </div>
          </motion.div>
        )}
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800">
        {messages.length === 1 && (
           <div className="flex flex-wrap gap-2 mb-4">
             {prompts.map(p => (
               <button 
                 key={p} 
                 onClick={() => handleSubmit(undefined, p)}
                 className="text-xs bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 px-3 py-1.5 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-900 transition-colors text-gray-600 dark:text-gray-400"
               >
                 {p}
               </button>
             ))}
           </div>
        )}
        <form onSubmit={handleSubmit} className="relative flex items-center shadow-sm">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Ask about my projects, skills, or background..."
            className="w-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 p-4 pr-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 text-sm"
          />
          <button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="absolute right-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
