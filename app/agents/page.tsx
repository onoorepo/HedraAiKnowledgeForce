"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { MobileToolbar } from "@/components/mobile-toolbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Command, Plus, Settings2, X, RefreshCw, Save, Trash2, Shield } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

export default function AgentsPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAgent, setEditingAgent] = useState<any>(null);

  // Form State
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/agents");
      const data = await res.json();
      setAgents(data);
    } catch(e) {
      toast.error("Interlink failure");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const openModal = (agent: any = null) => {
      if (agent) {
          setEditingAgent(agent);
          setName(agent.name);
          setRole(agent.role);
          setSystemPrompt(agent.systemPrompt);
      } else {
          setEditingAgent(null);
          setName("");
          setRole("");
          setSystemPrompt("");
      }
      setShowModal(true);
  };

  const handleSave = async () => {
      if (!name || !role) return toast.error("Identity and Role are required");
      
      const payload = { name, role, systemPrompt, isActive: true };
      const url = editingAgent ? `/api/agents/${editingAgent.id}` : "/api/agents";
      const method = editingAgent ? "PUT" : "POST";

      try {
          const res = await fetch(url, {
              method,
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
          });
          if (res.ok) {
              toast.success(`Agent ${editingAgent ? 'reprogrammed' : 'initialized'}`);
              setShowModal(false);
              fetchAgents();
          }
      } catch (e) {
          toast.error("Initialization error");
      }
  };

  const deleteAgent = async (id: string) => {
      if (!confirm("Decommission this entity?")) return;
      try {
          await fetch(`/api/agents/${id}`, { method: 'DELETE' });
          toast.success("Agent decommissioned");
          fetchAgents();
      } catch (e) {}
  };

  return (
    <div className="flex h-full w-full bg-[#050505]">
      <Sidebar />
      <main className="flex-1 overflow-hidden flex flex-col relative h-full">
        <header className="p-6 md:p-10 flex flex-col md:flex-row gap-4 justify-between md:items-end">
            <div>
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 text-indigo-400 mb-2"
                >
                    <Command className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-widest text-indigo-400/80">Swarm Protocol</span>
                </motion.div>
                <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl text-white">Agent Command</h1>
                <p className="text-sm text-muted-foreground mt-2 max-w-xl">Configure specialized neural agents for specific domains of knowledge and execution.</p>
            </div>
            <Button onClick={() => openModal()} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-600/20 px-8 h-12 rounded-2xl font-bold uppercase tracking-widest text-xs">
                <Plus className="w-4 h-4 mr-2" />
                Spawn Agent
            </Button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 md:px-10 pb-32">
             {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1,2,3].map(i => (
                        <div key={i} className="h-64 bg-white/5 rounded-[2.5rem] border border-white/5 animate-pulse" />
                    ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {agents.map(agent => (
                        <motion.div 
                            layout
                            key={agent.id} 
                            className="group relative p-8 bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] hover:border-indigo-500/30 transition-all duration-500 shadow-2xl flex flex-col gap-6"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                                        <Command className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg text-white group-hover:text-indigo-300 transition-colors">{agent.name}</h3>
                                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold opacity-60">{agent.role}</p>
                                    </div>
                                </div>
                                <Badge className="bg-emerald-500/10 text-emerald-400 border-none px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                    Online
                                </Badge>
                            </div>

                            <div className="bg-black/40 p-5 rounded-2xl border border-white/5 flex-1 relative overflow-hidden group-hover:border-white/10 transition-all">
                                <div className="absolute top-0 right-0 p-3 opacity-10">
                                    <Shield className="w-12 h-12" />
                                </div>
                                <p className="text-xs text-white/50 leading-relaxed line-clamp-4 font-mono">{agent.systemPrompt || "No memory instructions assigned to this agent entity."}</p>
                            </div>

                            <div className="flex gap-3">
                                <Button 
                                    onClick={() => openModal(agent)}
                                    className="flex-1 h-12 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 text-xs font-bold uppercase tracking-widest gap-2"
                                >
                                    <Settings2 className="w-4 h-4" /> REPROGRAM
                                </Button>
                                <Button 
                                    onClick={() => deleteAgent(agent.id)}
                                    variant="ghost" 
                                    className="h-12 w-12 rounded-xl bg-red-400/5 hover:bg-red-400/10 text-red-400"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                    {agents.length === 0 && (
                        <div className="col-span-full py-32 border-2 border-dashed border-white/5 rounded-[3rem] flex flex-col items-center justify-center text-center">
                            <Command className="w-16 h-16 text-indigo-500 opacity-10 mb-6" />
                            <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest">No active agents in the swarm.</p>
                            <Button onClick={() => openModal()} variant="link" className="text-indigo-400 mt-4 underline decoration-indigo-400/30">Initialize First Entity</Button>
                        </div>
                    )}
                </div>
              )}
        </div>

        {/* Create/Edit Modal */}
        <AnimatePresence>
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setShowModal(false)}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-10 shadow-3xl flex flex-col gap-8"
                    >
                        <div className="flex justify-between items-start">
                             <div>
                                 <h2 className="text-3xl font-semibold mb-2">{editingAgent ? 'Reprogram Entity' : 'New System Agent'}</h2>
                                 <p className="text-sm text-muted-foreground">Define the identity and behavioral constraints for this intelligence node.</p>
                             </div>
                             <Button onClick={() => setShowModal(false)} variant="ghost" size="icon" className="rounded-full h-10 w-10 bg-white/5 text-white/50"><X className="w-5 h-5" /></Button>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-black text-white/40 px-1">Agent Identity</label>
                                    <input 
                                        placeholder="E.g. The Strategist" 
                                        value={name} onChange={e => setName(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-indigo-500/50 transition outline-none" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-black text-white/40 px-1">Domain / Role</label>
                                    <input 
                                        placeholder="E.g. Engineering Lead" 
                                        value={role} onChange={e => setRole(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-indigo-500/50 transition outline-none" 
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-black text-white/40 px-1">System Instructions (Prompt)</label>
                                <textarea 
                                    rows={8}
                                    placeholder="Describe how this agent should behave, its tone, and its specialized knowledge..." 
                                    value={systemPrompt} onChange={e => setSystemPrompt(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-5 text-white focus:border-indigo-500/50 transition outline-none resize-none font-mono text-sm leading-relaxed" 
                                />
                            </div>
                        </div>

                        <Button onClick={handleSave} className="w-full h-16 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-indigo-500/20">
                            Deploy Intelligence Node
                        </Button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
      </main>
      <MobileToolbar />
    </div>
  );
}
