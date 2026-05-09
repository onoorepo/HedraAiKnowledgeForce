"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { MobileToolbar } from "@/components/mobile-toolbar";
import { Button } from "@/components/ui/button";
import { Search, Database, Trash2, Edit, ExternalLink, RefreshPw } from "lucide-react";
import Link from "next/link";

export default function BrainInventoryPage() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const fetchNodes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/nodes?q=${query}`);
      const data = await res.json();
      setNodes(data.nodes);
    } catch (e) {}
    setLoading(false);
  };

  useEffect(() => {
    fetchNodes();
  }, []);

  const deleteNode = async (id: string) => {
    if (!confirm("Are you sure? This will delete from MySQL and vectors from Pinecone as well!")) return;
    try {
      await fetch(`/api/nodes/${id}`, { method: 'DELETE' });
      setNodes(nodes.filter(n => n.id !== id));
    } catch (e) {
      alert("Delete failed");
    }
  };

  return (
    <div className="flex h-full w-full">
      <Sidebar />
      <main className="flex-1 overflow-auto flex flex-col bg-background relative h-full">
        <header className="p-4 md:p-8 flex flex-col md:flex-row gap-4 justify-between md:items-center border-b border-white/5 bg-black/20">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
                    <Database className="w-6 h-6 text-indigo-400" />
                    Neural Inventory
                </h1>
                <p className="text-sm text-muted-foreground mt-1">Manage all extracted knowledge fragments and semantic nodes.</p>
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
                       className="bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm w-full md:w-64 focus:outline-none focus:ring-1 focus:ring-indigo-500" 
                    />
                </div>
                <Button onClick={fetchNodes} size="icon" variant="ghost"><RefreshPw className="w-4 h-4" /></Button>
            </div>
        </header>

        <div className="p-4 md:p-8">
            {loading ? (
                <div className="text-center py-20 text-muted-foreground">Indexing brain fragments...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {nodes.map(node => (
                        <div key={node.id} className="group p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition relative">
                            <div className="flex justify-between items-start mb-3">
                                <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] uppercase font-bold tracking-wider">
                                    {node.type}
                                </span>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                                    <Button onClick={() => deleteNode(node.id)} size="icon" variant="ghost" className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                            <h3 className="font-semibold text-lg text-white mb-2 line-clamp-1">{node.title}</h3>
                            <p className="text-muted-foreground text-sm line-clamp-3 mb-4 leading-relaxed">{node.content}</p>
                            <div className="flex items-center justify-between mt-auto">
                                <span className="text-[10px] text-muted-foreground">
                                    {new Date(node.createdAt).toLocaleDateString()}
                                </span>
                                <Link href={`/search?q=${node.title}`}>
                                    <Button size="sm" variant="ghost" className="text-xs h-7 gap-1">
                                        View in Graph <ExternalLink className="w-3 h-3" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {nodes.length === 0 && !loading && <div className="text-center py-40 text-muted-foreground">The digital brain is empty. Start by importing data.</div>}
        </div>
      </main>
      <MobileToolbar />
    </div>
  );
}
