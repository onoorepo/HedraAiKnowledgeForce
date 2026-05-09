"use client";

import { useEffect, useState } from "react";
import Link from 'next/link';
import { Sidebar } from "@/components/sidebar";
import { MobileToolbar } from "@/components/mobile-toolbar";
import { MessageSquareText, Search, Plus, Filter, Users, Calendar, Sparkles, X, BrainCircuit, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [activeAnalysis, setActiveAnalysis] = useState<{ title: string, result: string } | null>(null);

  useEffect(() => {
    const fetchConv = async () => {
        try {
            const res = await fetch("/api/conversations");
            const data = await res.json();
            setConversations(data);
        } catch(e) {}
        setLoading(false);
    };
    fetchConv();
  }, []);

  const runAnalysis = async (c: any, action: string) => {
    setAnalyzing(true);
    try {
        const chatHistory = c.messages.map((m: any) => `${m.sender}: ${m.text}`).join("\n");
        const genAI = new GoogleGenAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        let prompt = "";
        let title = "";
        if (action === "SUMMARY") {
            prompt = `Analyze this conversation and provide a concise summary, key topics, and any implicit emotional tone:\n\n${chatHistory}`;
            title = "Neural Summary";
        } else if (action === "EXTRACT_TASKS") {
            prompt = `Identify any actionable tasks, deadlines, or commitments made in this conversation. Output as a bulleted list:\n\n${chatHistory}`;
            title = "Action Extraction";
        } else if (action === "PSYCHOLOGY") {
            prompt = `Analyze the personality traits and social dynamics of the participants based on their communication style in this chat:\n\n${chatHistory}`;
            title = "Psychological Profile";
        }

        const result = await model.generateContent(prompt);
        setActiveAnalysis({ title, result: result.response.text() });
    } catch(e) {
        toast.error("Cognitive bypass failed.");
    }
    setAnalyzing(false);
  };

  return (
    <div className="flex h-full w-full bg-[#050505]">
      <Sidebar />
      <main className="flex-1 overflow-hidden flex flex-col bg-background relative h-full">
        <header className="p-4 md:p-8 flex flex-col md:flex-row gap-4 justify-between md:items-center border-b border-white/5 bg-black/20">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight lg:text-3xl flex items-center gap-2">
                    <MessageSquareText className="w-6 h-6 text-indigo-400" />
                    Archive Hub
                </h1>
                <p className="text-sm text-muted-foreground mt-1">Browse WhatsApp, Facebook, and Personal chat histories.</p>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" className="gap-2 border-white/10"><Filter className="w-4 h-4" /> Filter</Button>
                <Link href="/import">
                    <Button className="gap-2 bg-indigo-600"><Plus className="w-4 h-4" /> Import Chat</Button>
                </Link>
            </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {conversations.map((c) => (
                    <div key={c.id} className="group p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-indigo-500/50 transition cursor-pointer relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3">
                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${c.type === 'BUSINESS' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                {c.platform}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                <Users className="w-6 h-6 text-gray-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">{(c.participants as any[]).join(", ")}</h3>
                                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                    <Calendar className="w-3 h-3" /> {new Date(c.updatedAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-400 line-clamp-2 mb-4 leading-relaxed">
                            {c.messages?.[0]?.text || "No preview available..."}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <Button 
                                onClick={() => runAnalysis(c, 'SUMMARY')}
                                disabled={analyzing}
                                size="sm" variant="ghost" className="text-[10px] h-7 bg-white/5 hover:bg-white/10 text-indigo-400 font-bold uppercase tracking-tighter"
                            >
                                <Sparkles className="w-3 h-3 mr-1" /> Summary
                            </Button>
                            <Button 
                                onClick={() => runAnalysis(c, 'EXTRACT_TASKS')}
                                disabled={analyzing}
                                size="sm" variant="ghost" className="text-[10px] h-7 bg-white/5 hover:bg-white/10 text-emerald-400 font-bold uppercase tracking-tighter"
                            >
                                <Activity className="w-3 h-3 mr-1" /> Tasks
                            </Button>
                            <Button 
                                onClick={() => runAnalysis(c, 'PSYCHOLOGY')}
                                disabled={analyzing}
                                size="sm" variant="ghost" className="text-[10px] h-7 bg-white/5 hover:bg-white/10 text-orange-400 font-bold uppercase tracking-tighter"
                            >
                                <BrainCircuit className="w-3 h-3 mr-1" /> Profile
                            </Button>
                        </div>
                    </div>
                ))}
                {conversations.length === 0 && !loading && (
                    <div className="col-span-full text-center py-40 border-2 border-dashed border-white/5 rounded-3xl">
                        <MessageSquareText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                        <p className="text-muted-foreground">No chat archives found. Upload XML/HTML backups in Import section.</p>
                    </div>
                )}
            </div>
        </div>

        {/* Analysis Result Modal */}
        <AnimatePresence>
            {activeAnalysis && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setActiveAnalysis(null)}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-10 shadow-3xl flex flex-col gap-6"
                    >
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-semibold flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-indigo-400" />
                                {activeAnalysis.title}
                            </h2>
                            <Button onClick={() => setActiveAnalysis(null)} variant="ghost" size="icon" className="rounded-full h-10 w-10 bg-white/5 text-white/50 hover:bg-white/10">
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                        <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-sm font-mono italic opacity-90">
                                {activeAnalysis.result}
                            </p>
                        </div>
                        <Button onClick={() => setActiveAnalysis(null)} className="h-14 bg-white/5 hover:bg-white/10 text-white rounded-2xl border border-white/10 font-bold uppercase tracking-widest text-xs">
                            Acknowledge Intelligence
                        </Button>
                    </motion.div>
                </div>
            )}
            {analyzing && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-4">
                        <RefreshCw className="w-12 h-12 text-indigo-500 animate-spin" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Cerebral Analysis in Progress...</span>
                    </div>
                </div>
            )}
        </AnimatePresence>
      </main>
      <MobileToolbar />
    </div>
  );
}
