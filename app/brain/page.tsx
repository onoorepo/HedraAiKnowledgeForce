"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { MobileToolbar } from "@/components/mobile-toolbar";
import { Button } from "@/components/ui/button";
import { Search, Database, Trash2, Edit, ExternalLink, RefreshCw, Activity, Terminal, X } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function BrainInventoryPage() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  
  // Edit State
  const [editingNode, setEditingNode] = useState<any>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const fetchNodes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/nodes?q=${query}`);
      const data = await res.json();
      setNodes(data.nodes || []);
    } catch (e) {}
    setLoading(false);
  };

  useEffect(() => {
    fetchNodes();
  }, []);

  const deleteNode = async (id: string) => {
    if (!confirm("⚠️ WARNING: This will permanently delete this node from MySQL and its Vector from Pinecone. Continue?")) return;
    try {
      const res = await fetch(`/api/nodes/${id}`, { method: 'DELETE' });
      if (res.ok) {
          setNodes(nodes.filter(n => n.id !== id));
          toast.success("Node obliterated from neural net.");
      }
    } catch (e) {
      toast.error("Delete failed");
    }
  };

  const handleUpdate = async () => {
      try {
          const res = await fetch(`/api/nodes/${editingNode.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ title: editTitle, content: editContent })
          });
          if(res.ok) {
              setNodes(nodes.map(n => n.id === editingNode.id ? { ...n, title: editTitle, content: editContent } : n));
              setEditingNode(null);
              toast.success("Memory updated successfully.");
          }
      } catch(e) {
          toast.error("Correction failed.");
      }
  };

  return (
    <div className="flex h-full w-full bg-[#050505]">
      <Sidebar />
      <main className="flex-1 overflow-auto flex flex-col relative h-full">
        <header className="p-6 md:p-8 flex flex-col md:flex-row gap-4 justify-between md:items-center border-b border-white/5 bg-black/20 backdrop-blur-md">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight lg:text-3xl flex items-center gap-2">
                    <Database className="w-6 h-6 text-indigo-400" />
                    Neural Inventory
                </h1>
                <p className="text-sm text-muted-foreground mt-1">Total control over your knowledge fragments (MySQL + Pinecone Sync).</p>
            </div>
            <div className="flex gap-2">
                <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input 
                       type="text" 
                       placeholder="Search nodes..." 
                       value={query}
                       onChange={e => setQuery(e.target.value)}
                       onKeyDown={e => e.key === 'Enter' && fetchNodes()}
                       className="bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-sm w-full md:w-64 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all" 
                    />
                </div>
                <Button onClick={fetchNodes} size="icon" variant="ghost" className="rounded-xl border border-white/5 bg-white/5"><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /></Button>
            </div>
        </header>

        <div className="p-6 md:p-8">
            {loading ? (
                <div className="text-center py-20 text-muted-foreground animate-pulse font-mono tracking-widest text-[10px] uppercase">Indexing brain fragments...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {nodes.map(node => (
                        <div key={node.id} className="group p-6 bg-white/5 border border-white/5 rounded-[2rem] hover:border-indigo-500/30 transition-all duration-500 relative flex flex-col h-[320px] shadow-2xl">
                            <div className="flex justify-between items-start mb-4">
                                <span className={`px-3 py-1 rounded-full text-[9px] uppercase font-black tracking-widest ${node.type === 'CODE' ? 'bg-orange-500/10 text-orange-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
                                    {node.type}
                                </span>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                    <Button 
                                        onClick={() => {
                                            setEditingNode(node);
                                            setEditTitle(node.title);
                                            setEditContent(node.content);
                                        }}
                                        size="icon" variant="ghost" className="h-9 w-9 text-indigo-400 hover:bg-white/10 rounded-full"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button onClick={() => deleteNode(node.id)} size="icon" variant="ghost" className="h-9 w-9 text-red-400 hover:bg-red-500/10 rounded-full">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                            <h3 className="font-semibold text-white mb-2 line-clamp-1 group-hover:text-indigo-300 transition-colors">{node.title}</h3>
                            <p className="text-muted-foreground text-xs line-clamp-6 mb-4 leading-relaxed flex-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                {node.content}
                            </p>
                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                                <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/50">
                                    {new Date(node.createdAt).toLocaleDateString()}
                                </span>
                                <Link href={`/search?q=${node.title}`}>
                                    <Button size="sm" variant="ghost" className="text-[10px] h-7 gap-1 font-black tracking-tighter text-indigo-400 hover:bg-transparent">
                                        GRAPH <ExternalLink className="w-3 h-3" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {nodes.length === 0 && !loading && (
                <div className="text-center py-40 border-2 border-dashed border-white/5 rounded-[3rem]">
                    <Database className="w-16 h-16 text-indigo-500 mx-auto mb-6 opacity-10" />
                    <p className="text-muted-foreground font-mono text-xs uppercase tracking-[0.3em]">Cortex_Empty: Awaiting Ingestion</p>
                </div>
            )}
        </div>

        {/* Edit Modal */}
        {editingNode && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div className="w-full max-w-2xl bg-[#111] border border-white/10 rounded-[2.5rem] p-8 space-y-6 shadow-2xl">
                    <div className="flex items-center justify-between">
                         <h2 className="text-2xl font-semibold">Correct Fragment</h2>
                         <Button onClick={() => setEditingNode(null)} variant="ghost" size="icon" className="rounded-full"><X className="w-5 h-5" /></Button>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest font-black text-white/40 px-1">Memory Label</label>
                            <input 
                                value={editTitle}
                                onChange={e => setEditTitle(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-indigo-500 transition-all outline-none" 
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-widest font-black text-white/40 px-1">Synaptic Content</label>
                            <textarea 
                                value={editContent}
                                onChange={e => setEditContent(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white min-h-[300px] focus:border-indigo-500 transition-all outline-none resize-none" 
                            />
                        </div>
                    </div>
                    <Button onClick={handleUpdate} className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase tracking-widest rounded-2xl">
                        Apply Correction
                    </Button>
                </div>
            </div>
        )}
      </main>
      <MobileToolbar />
    </div>
  );
}
