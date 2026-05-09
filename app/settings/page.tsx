"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { MobileToolbar } from "@/components/mobile-toolbar";
import { Settings, Tag as TagIcon, Key, Palette, Shield, Plus, Trash2, Save, Database, RefreshCw, X, Box, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

const COLORS = [
    "#ef4444", "#f97316", "#f59e0b", "#10b981", "#06b6d4",
    "#3b82f6", "#6366f1", "#8b5cf6", "#d946ef", "#ec4899", "#71717a"
];

const ICONS = ["Tag", "Briefcase", "User", "Lock", "Star", "Heart", "Zap", "AlertCircle", "Code", "Database"];

export default function SettingsPage() {
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  
  // New Tag State
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState(COLORS[0]);
  const [newTagIcon, setNewTagIcon] = useState(ICONS[0]);

  const fetchTags = async () => {
    try {
        const res = await fetch("/api/tags");
        const data = await res.json();
        setTags(data);
    } catch(e) {}
    setLoading(false);
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleCreateTag = async () => {
      if(!newTagName) return toast.error("Name is required");
      try {
          const res = await fetch("/api/tags", {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: newTagName, color: newTagColor, icon: newTagIcon })
          });
          if(res.ok) {
              toast.success("Tag synced to registry");
              setNewTagName("");
              setShowTagModal(false);
              fetchTags();
          }
      } catch(e) {
          toast.error("Failed to create tag");
      }
  };

  const deleteTag = async (id: string) => {
      if(!confirm("Destroy this tag reference?")) return;
      try {
          await fetch("/api/tags", {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id })
          });
          toast.success("Tag removed");
          fetchTags();
      } catch(e) {}
  }

  const seedDatabase = async () => {
    if (!confirm("This will populate your system with default Agents and Tags. Continue?")) return;
    setSeeding(true);
    try {
        const res = await fetch("/api/seed", { method: 'POST' });
        if (res.ok) {
            toast.success("Database seeded successfully!");
            fetchTags();
        } else {
            toast.error("Seeding failed");
        }
    } catch (e) {
        toast.error("Connection error");
    }
    setSeeding(false);
  };

  return (
    <div className="flex h-full w-full bg-[#050505]">
      <Sidebar />
      <main className="flex-1 overflow-auto flex flex-col relative h-full">
        <header className="p-6 md:p-10 flex flex-col md:flex-row gap-4 justify-between md:items-end">
            <div>
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 text-indigo-400 mb-2"
                >
                    <Settings className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-widest">System Architecture</span>
                </motion.div>
                <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">Registry Settings</h1>
                <p className="text-sm text-muted-foreground mt-2 max-w-xl">Configure your neural cortex parameters, data taxonomies, and cross-platform authentication keys.</p>
            </div>
        </header>

        <div className="p-6 md:p-10 space-y-12 max-w-6xl pb-32">
            {/* Tags Section */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-medium flex items-center gap-2">
                            <TagIcon className="w-5 h-5 text-emerald-400" />
                            Taxonomy & Labels
                        </h2>
                        <p className="text-xs text-muted-foreground mt-1">Define semantic labels for classifying global knowledge nodes.</p>
                    </div>
                    <Button onClick={() => setShowTagModal(true)} size="sm" className="gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white">
                        <Plus className="w-4 h-4" /> Create Label
                    </Button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {tags.map((tag) => (
                        <div key={tag.id} className="group relative p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all cursor-default">
                             <div className="w-10 h-10 rounded-xl mb-3 flex items-center justify-center bg-black/40" style={{ boxShadow: `0 0 20px ${tag.color}10` }}>
                                <TagIcon className="w-5 h-5" style={{ color: tag.color }} />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-tight text-white/80">{tag.name}</span>
                            <button 
                                onClick={() => deleteTag(tag.id)}
                                className="absolute top-3 right-3 p-1.5 opacity-0 group-hover:opacity-100 text-red-400/50 hover:text-red-400 transition-all active:scale-90"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    {tags.length === 0 && (
                        <div className="col-span-full py-8 border border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center text-muted-foreground gap-2">
                            <Box className="w-8 h-8 opacity-20" />
                            <span className="text-xs uppercase tracking-widest font-bold">No labels defined</span>
                        </div>
                    )}
                </div>
            </section>

            {/* System Intelligence */}
            <section className="space-y-6">
                <div>
                    <h2 className="text-xl font-medium flex items-center gap-2">
                        <Database className="w-5 h-5 text-indigo-400" />
                        Genesis & Initialization
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1">Heavy operations for system bootstrap and maintenance.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-white/5 border border-white/5 rounded-3xl space-y-4">
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <h3 className="font-semibold text-white">Neural Seeder</h3>
                                <p className="text-xs text-muted-foreground">Populate core AI Agents (Orchestrator, Analyst, etc) and default taxonomy logic.</p>
                            </div>
                            <Database className="w-5 h-5 text-indigo-400 opacity-50" />
                        </div>
                        <Button 
                            onClick={seedDatabase} 
                            disabled={seeding}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white gap-2 h-10 text-xs font-bold uppercase tracking-widest"
                        >
                            {seeding ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
                            Run Genesis Seeder
                        </Button>
                    </div>

                    <div className="p-6 bg-white/5 border border-white/5 rounded-3xl space-y-4">
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <h3 className="font-semibold text-white">Brain Sync</h3>
                                <p className="text-xs text-muted-foreground">Re-index all MySQL documents into Pinecone Vector database to fix sync issues.</p>
                            </div>
                            <RefreshCw className="w-5 h-5 text-emerald-400 opacity-50" />
                        </div>
                        <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 text-xs font-bold uppercase tracking-widest h-10">
                            Trigger Full Re-index
                        </Button>
                    </div>
                </div>
            </section>

             {/* AI Config */}
             <section className="space-y-6">
                <h2 className="text-xl font-medium flex items-center gap-2">
                    <Shield className="w-5 h-5 text-orange-400" />
                    Cortex Credentials
                </h2>
                <div className="p-8 bg-white/5 border border-white/5 rounded-3xl space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-black">NEXT_PUBLIC_GEMINI_API_KEY</label>
                            <span className="text-[10px] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full font-bold">ACTIVE</span>
                        </div>
                        <div className="flex gap-3">
                            <div className="flex-1 relative group">
                                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-hover:text-white/40 transition" />
                                <input type="password" value="************************" disabled className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-indigo-500/50 transition cursor-not-allowed" />
                            </div>
                            <Button className="rounded-xl px-6 bg-white/10 hover:bg-white/20 text-white font-bold text-xs">REPLACE</Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>

        {/* Create Tag Modal */}
        <AnimatePresence>
            {showTagModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        onClick={() => setShowTagModal(false)}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />
                    <motion.div 
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="relative w-full max-w-md bg-[#111] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl"
                    >
                        <div className="p-8 space-y-8">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-semibold">New Label</h3>
                                <button onClick={() => setShowTagModal(false)} className="p-2 hover:bg-white/5 rounded-full text-gray-400"><X /></button>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-black text-white/40 px-1">Label Identity</label>
                                    <input 
                                        autoFocus
                                        placeholder="E.g. Personal Memories" 
                                        value={newTagName}
                                        onChange={(e) => setNewTagName(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-indigo-500/50 transition outline-none" 
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-black text-white/40 px-1">Visual Signature</label>
                                    <div className="flex flex-wrap gap-2.5">
                                        {COLORS.map(c => (
                                            <button 
                                                key={c} 
                                                onClick={() => setNewTagColor(c)}
                                                className={`w-9 h-9 rounded-full transition-all flex items-center justify-center ${newTagColor === c ? 'scale-110 ring-2 ring-white/20 ring-offset-4 ring-offset-black' : 'hover:scale-105'}`}
                                                style={{ backgroundColor: c }}
                                            >
                                                {newTagColor === c && <Check className="w-4 h-4 text-white" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-black text-white/40 px-1">Iconic Identifier</label>
                                    <div className="grid grid-cols-5 gap-2">
                                        {ICONS.map(i => (
                                            <button 
                                                key={i} 
                                                onClick={() => setNewTagIcon(i)}
                                                className={`p-3 rounded-xl border transition-all flex items-center justify-center ${newTagIcon === i ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400' : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/20'}`}
                                            >
                                                <TagIcon className="w-5 h-5" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <Button onClick={handleCreateTag} className="w-full py-7 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase tracking-widest text-sm shadow-xl shadow-indigo-500/20">
                                Deploy to System Registry
                            </Button>
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
