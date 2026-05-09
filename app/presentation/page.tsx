"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { MobileToolbar } from "@/components/mobile-toolbar";
import { 
  BookOpen, 
  Cpu, 
  Layers, 
  Code2, 
  Network, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Database, 
  Terminal, 
  MessageSquare,
  X,
  ChevronRight,
  Filter,
  Search,
  Lightbulb,
  Map as MapIcon,
  Workflow
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { GoogleGenAI } from "@google/genai";
import { toast } from "sonner";

const ARCHITECTURE_DATA = {
  layers: [
    {
      id: "ingestion",
      title: "1. Multi-Modal Ingestion Layer",
      desc: "Mass data intake via Webhooks, manual upload, and real-time scrapers.",
      tech: ["Next.js API", "Turndown", "ProcessingTasks (MySQL)"],
      features: ["WhatsApp Webhooks", "XML/JSON Mass Import", "Markdown Scraper"]
    },
    {
      id: "processing",
      title: "2. The AI Swarm Ops",
      desc: "Heuristic and Generative models working in parallel to tokenize and summarize.",
      tech: ["Gemini 1.5 Flash/Pro", "Swarm Pattern", "RAG Pipeline"],
      features: ["Psychology Analysis", "Automatic Summarization", "Task Extraction"]
    },
    {
      id: "storage",
      title: "3. Hybrid Neural Storage",
      desc: "Dual-persistence logic ensuring structured data and latent semantic relationships.",
      tech: ["MySQL (Prisma)", "Pinecone Vector DB"],
      features: ["Document Catalog", "Vector Embeddings", "Neural Graph Links"]
    },
    {
      id: "retrieval",
      title: "4. The Boss (Orchestrator)",
      desc: "The final intelligence node that serves the user via semantic search.",
      tech: ["Force Graph UI", "Hybrid Search API"],
      features: ["Ask Hedra (Global Search)", "RAG Prompting", "Interactive Graph"]
    }
  ]
};

const CODE_MAP = [
  {
    feat: "Web Scraper",
    endpoint: "/api/scrape",
    logic: "URL -> Turndown -> Markdown -> Brain Ingest",
    tag: "INGEST"
  },
  {
    feat: "Mass Ingest",
    endpoint: "/api/swarm",
    logic: "Chunking -> Recursive LLM calls -> Task Generation",
    tag: "SWARM"
  },
  {
    feat: "Search",
    endpoint: "/api/search",
    logic: "User Query -> Vector Search (Pinecone) -> Context Generation -> LLM",
    tag: "RAG"
  },
  {
    feat: "Security",
    endpoint: "/api/vault",
    logic: "AES-256 Encryption/Decryption for sensitive keys",
    tag: "SECURE"
  }
];

export default function PresentationPage() {
  const [activeTab, setActiveTab] = useState("blueprint");
  const [aiOpen, setAiOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [filterTag, setFilterTag] = useState("ALL");

  const askAi = async () => {
    if (!question) return;
    setLoading(true);
    try {
      const genAI = new GoogleGenAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `You are the Hedra Documentation Specialist. Answer this question about the Hedra AI Knowledge (HAK) project based on current features (Mass Import, Scraper, Pinecone/MySQL Sync, Neural Graph, AI Swarm Agents).\n\nUser Question: ${question}`;
      
      const result = await model.generateContent(prompt);
      setResponse(result.response.text());
    } catch (e) {
      toast.error("Documentation retrieval offline.");
    }
    setLoading(false);
  };

  const filteredCode = filterTag === "ALL" ? CODE_MAP : CODE_MAP.filter(c => c.tag === filterTag);

  return (
    <div className="flex h-full w-full bg-[#030303] text-gray-200">
      <Sidebar />
      <main className="flex-1 overflow-auto flex flex-col relative h-full selection:bg-indigo-500/30">
        
        {/* Cinematic Header */}
        <header className="p-8 md:p-16 space-y-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 text-indigo-500 font-black tracking-widest uppercase text-xs"
          >
            <Cpu className="w-4 h-4" />
            Core System Documentation v2.0
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-white via-white to-gray-500 bg-clip-text text-transparent">
            Hedra Ai Knowledge
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl font-medium">
            The external cortex for Hedra. A deep documentation of the neural architecture, 
            data ingestion pipelines, and the AI Swarm control protocol.
          </p>
        </header>

        {/* Navigation Tabs */}
        <div className="px-8 md:px-16 border-b border-white/5 flex gap-8">
            {["blueprint", "architecture", "code-logic", "roadmap"].map(t => (
                <button 
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === t ? 'text-indigo-400' : 'text-gray-600 hover:text-gray-400'}`}
                >
                    {t.replace('-', ' ')}
                    {activeTab === t && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 shadow-[0_0_10px_#6366f1]" />}
                </button>
            ))}
        </div>

        <div className="p-8 md:p-16 pb-32">
            
            {/* Tab: Blueprint (Bento Box) */}
            {activeTab === 'blueprint' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-8 p-10 bg-white/5 border border-white/5 rounded-[3rem] space-y-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform duration-1000">
                            <BookOpen className="w-48 h-48" />
                        </div>
                        <h2 className="text-3xl font-bold flex items-center gap-3">
                            <Zap className="text-yellow-400" /> Executive Goals
                        </h2>
                        <ul className="space-y-4 text-gray-400">
                            <li className="flex gap-4">
                                <ChevronRight className="text-indigo-500 shrink-0" />
                                <span><strong className="text-white">Zero Information Loss:</strong> Every chat, node, and link is indexed forever.</span>
                            </li>
                            <li className="flex gap-4">
                                <ChevronRight className="text-indigo-500 shrink-0" />
                                <span><strong className="text-white">Relational Intelligence:</strong> Move from static notes to a synaptic web (Neural Graph).</span>
                            </li>
                            <li className="flex gap-4">
                                <ChevronRight className="text-indigo-500 shrink-0" />
                                <span><strong className="text-white">Hybrid Retrieval:</strong> Semantic search (Pinecone) + Hard data (MySQL) = The Perfect Context.</span>
                            </li>
                        </ul>
                    </div>

                    <div className="md:col-span-4 p-8 bg-indigo-600/10 border border-indigo-500/20 rounded-[3rem] flex flex-col justify-between">
                         <div className="space-y-4">
                            <Sparkles className="w-8 h-8 text-indigo-400" />
                            <h3 className="text-xl font-bold">AI Native Core</h3>
                            <p className="text-sm text-indigo-200/60 leading-relaxed">
                                HAK is built around the concept of a "Personal Swarm" — dedicated agents for summarizing, extraction, and profiling.
                            </p>
                         </div>
                         <Button onClick={() => setAiOpen(true)} className="w-full bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl h-14 font-black uppercase tracking-widest text-xs">
                            Ask Documentation Agent
                         </Button>
                    </div>

                    <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-4 gap-6">
                        <FeatureCard icon={<Network />} title="Neural Graph" color="purple" />
                        <FeatureCard icon={<Database />} title="Vector Search" color="emerald" />
                        <FeatureCard icon={<ShieldCheck />} title="Encrypted Vault" color="orange" />
                        <FeatureCard icon={<Terminal />} title="Mass Ingestion" color="cyan" />
                    </div>
                </div>
            )}

            {/* Tab: Architecture */}
            {activeTab === 'architecture' && (
                <div className="space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {ARCHITECTURE_DATA.layers.map((l, i) => (
                           <div key={l.id} className="relative">
                               <motion.div 
                                 initial={{ opacity: 0, y: 20 }}
                                 animate={{ opacity: 1, y: 0 }}
                                 transition={{ delay: i * 0.1 }}
                                 className="p-8 bg-white/5 border border-white/5 rounded-3xl h-full space-y-4 hover:border-indigo-500/30 transition-all border-l-4 border-l-indigo-500"
                               >
                                   <span className="text-[10px] font-black opacity-30 tracking-[0.3em] font-mono">{l.id.toUpperCase()}</span>
                                   <h3 className="text-lg font-bold text-white">{l.title}</h3>
                                   <p className="text-xs text-gray-500 leading-relaxed">{l.desc}</p>
                                   <div className="flex flex-wrap gap-2 pt-4">
                                       {l.tech.map(t => <span key={t} className="text-[9px] px-2 py-1 bg-black/40 rounded-lg text-indigo-300 font-bold">{t}</span>)}
                                   </div>
                               </motion.div>
                               {i < 3 && <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 z-10"><ChevronRight className="text-white/10" /></div>}
                           </div>
                        ))}
                    </div>

                    <div className="p-10 bg-black/40 border border-white/5 rounded-[3rem] space-y-8">
                        <h3 className="text-2xl font-bold flex items-center gap-3"><Workflow className="text-indigo-400" /> The Information Loop</h3>
                        <div className="flex flex-col md:flex-row gap-6 items-center justify-between text-center relative">
                            <div className="p-6 bg-white/5 rounded-2xl border border-white/5 w-64">
                                <span className="block font-bold mb-1">RAW DATA</span>
                                <span className="text-[10px] text-gray-500 uppercase">Input / Upload</span>
                            </div>
                            <div className="h-0.5 w-12 bg-indigo-500/20 hidden md:block" />
                            <div className="p-6 bg-indigo-500/20 rounded-2xl border border-indigo-500/20 w-64">
                                <span className="block font-bold mb-1">PROCESSING</span>
                                <span className="text-[10px] text-indigo-400 uppercase tracking-widest animate-pulse">AI Swarm</span>
                            </div>
                            <div className="h-0.5 w-12 bg-indigo-500/20 hidden md:block" />
                            <div className="p-6 bg-white/5 rounded-2xl border border-white/5 w-64">
                                <span className="block font-bold mb-1">EMBEDDING</span>
                                <span className="text-[10px] text-gray-500 uppercase tracking-widest">Vector Storage</span>
                            </div>
                             <div className="h-0.5 w-12 bg-indigo-500/20 hidden md:block" />
                            <div className="p-6 bg-emerald-500/20 rounded-2xl border border-emerald-500/20 w-64">
                                <span className="block font-bold mb-1">KNOWLEDGE</span>
                                <span className="text-[10px] text-emerald-400 uppercase tracking-widest">Actionable Intelligence</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tab: Code Logic */}
            {activeTab === 'code-logic' && (
                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 bg-white/5 border border-white/5 p-1 px-4 rounded-2xl">
                           <Filter className="w-4 h-4 text-gray-500" />
                           {["ALL", "INGEST", "SWARM", "RAG", "SECURE"].map(tag => (
                               <button 
                                 key={tag}
                                 onClick={() => setFilterTag(tag)}
                                 className={`px-3 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${filterTag === tag ? 'text-indigo-400' : 'text-gray-500 hover:text-white'}`}
                               >
                                   {tag}
                               </button>
                           ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredCode.map((c, i) => (
                            <motion.div 
                              layout
                              key={c.feat}
                              className="p-8 bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] space-y-4 group"
                            >
                                <div className="flex justify-between items-center">
                                    <h4 className="text-xl font-bold flex items-center gap-2">
                                        <Code2 className="w-5 h-5 text-indigo-400" />
                                        {c.feat}
                                    </h4>
                                    <span className="text-[9px] px-2 py-1 bg-white/5 rounded-full font-black opacity-40">{c.tag}</span>
                                </div>
                                <div className="space-y-3 font-mono">
                                    <div className="flex gap-4 text-xs">
                                        <span className="text-indigo-400/50">ENTRY:</span>
                                        <span className="text-indigo-400">{c.endpoint}</span>
                                    </div>
                                    <div className="p-4 bg-black rounded-xl border border-white/5 text-[11px] leading-relaxed text-gray-400">
                                        {c.logic}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Tab: Roadmap & Suggestions */}
            {activeTab === 'roadmap' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <section className="space-y-6">
                         <h3 className="text-2xl font-bold flex items-center gap-3"><Lightbulb className="text-yellow-400" /> Future Improvements</h3>
                         <div className="space-y-4">
                            <RoadmapItem title="WhatsApp Real-time Bridge" desc="Direct integration with Meta API for live cerebral syncing." status="Upcoming" />
                            <RoadmapItem title="Advanced Visualization" desc="3D Neural Galaxy view using Three.js for deeper exploration." status="Planning" />
                            <RoadmapItem title="Self-Correction Loop" desc="AI agents that audit the knowledge base for inconsistencies." status="Research" />
                         </div>
                    </section>
                    <section className="space-y-6">
                         <h3 className="text-2xl font-bold flex items-center gap-3"><MapIcon className="text-indigo-400" /> Strategic Roadmap</h3>
                         <div className="border-l-2 border-white/5 ml-4 space-y-8 pl-8 relative">
                             <div className="relative">
                                <div className="absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-indigo-500 shadow-[0_0_15px_#6366f1]" />
                                <h4 className="font-bold text-white">Q2 - Genesis</h4>
                                <p className="text-xs text-gray-500 mt-1">Core RAG, Graph, and Swarm protocols stabilization.</p>
                             </div>
                             <div className="opacity-50">
                                <div className="absolute -left-[37px] top-1 w-4 h-4 rounded-full border-2 border-white/20 bg-black" />
                                <h4 className="font-bold text-white">Q3 - Multi-Stream</h4>
                                <p className="text-xs text-gray-500 mt-1">Expansion to Audio (Whisper) and Video indexing.</p>
                             </div>
                              <div className="opacity-30">
                                <div className="absolute -left-[37px] top-1 w-4 h-4 rounded-full border-2 border-white/20 bg-black" />
                                <h4 className="font-bold text-white">Q4 - Autonomous Agent</h4>
                                <p className="text-xs text-gray-500 mt-1">The Boss starts making semi-autonomous technical suggestions.</p>
                             </div>
                         </div>
                    </section>
                </div>
            )}

        </div>

        {/* AI Documentation Modal */}
        <AnimatePresence>
            {aiOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setAiOpen(false)}
                        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                    />
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 30 }}
                        className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-10 shadow-3xl h-[600px] flex flex-col"
                    >
                        <div className="flex justify-between items-center mb-8">
                             <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                     <MessageSquare className="w-5 h-5" />
                                 </div>
                                 <h3 className="text-2xl font-bold tracking-tight">Cortex Specialist</h3>
                             </div>
                             <Button onClick={() => setAiOpen(false)} variant="ghost" size="icon" className="rounded-full bg-white/5 text-gray-400"><X /></Button>
                        </div>

                        <div className="flex-1 overflow-y-auto mb-6 pr-4 space-y-6 custom-scrollbar">
                            {response ? (
                                <div className="space-y-4">
                                     <div className="bg-indigo-600/10 border border-indigo-500/20 p-5 rounded-2xl rounded-tl-none">
                                         <p className="text-sm font-mono text-indigo-200 leading-relaxed whitespace-pre-wrap">{response}</p>
                                     </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-full text-center opacity-30">
                                    <div className="space-y-2">
                                        <Layers className="w-12 h-12 mx-auto" />
                                        <p className="text-xs uppercase tracking-widest font-black">Ready to explain architecture</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="relative group">
                            <input 
                              placeholder="Ask about endpoints, architecture, or roadmap..." 
                              value={question}
                              onChange={(e) => setQuestion(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && askAi()}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-32 focus:border-indigo-500/50 outline-none transition-all group-hover:bg-white/10"
                            />
                            <div className="absolute right-2 top-2">
                                <Button onClick={askAi} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-10 px-6 font-bold text-[10px] uppercase tracking-widest">
                                    {loading ? <Terminal className="w-4 h-4 animate-spin" /> : "QUERY AI"}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>

      </main>
      <MobileToolbar />
    </div>
  );
}

function FeatureCard({ icon, title, color }: any) {
    const colors: any = {
        purple: "text-purple-400 bg-purple-500/10 border-purple-500/20 hover:border-purple-500/40",
        emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/40",
        orange: "text-orange-400 bg-orange-500/10 border-orange-500/20 hover:border-orange-500/40",
        cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20 hover:border-cyan-500/40"
    };

    return (
        <div className={`p-6 border rounded-3xl transition-all duration-300 group flex items-center gap-4 ${colors[color]}`}>
            <div className="group-hover:scale-110 transition-transform">{icon}</div>
            <span className="font-bold text-sm uppercase tracking-widest">{title}</span>
        </div>
    );
}

function RoadmapItem({ title, desc, status }: any) {
    return (
        <div className="p-5 bg-white/5 border border-white/5 rounded-2xl flex justify-between items-center group hover:bg-white/10 transition-all">
            <div className="space-y-1">
                <h4 className="font-bold">{title}</h4>
                <p className="text-xs text-gray-500">{desc}</p>
            </div>
            <span className="text-[9px] font-black uppercase px-2 py-1 bg-white/10 rounded-lg opacity-40 group-hover:opacity-100 transition-opacity">{status}</span>
        </div>
    );
}
