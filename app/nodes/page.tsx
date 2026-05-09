"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { MobileToolbar } from "@/components/mobile-toolbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Database, Network } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function NodesPage() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // We are putting a mock nodes list here. 
  // Normally you would fetch from a new API like /api/nodes.
  useEffect(() => {
    // Setting up mock data for preview since we don't have existing nodes right now
    const mockNodes = [
      { id: "1", title: "React Server Components Architecture", content: "Notes on how RSC works...", type: "NOTE", createdAt: new Date().toISOString(), tags: ["react", "frontend"] },
      { id: "2", title: "Authentication Flow v2", content: "Details of the new OAuth implementation.", type: "DOCUMENT", createdAt: new Date().toISOString(), tags: ["auth", "security"] },
      { id: "3", title: "Client Onoo Meeting #4", content: "Action items: prepare AI strategy...", type: "AGENT_THOUGHT", createdAt: new Date().toISOString(), tags: ["onoo", "client"] },
    ];
    
    // Simulate API delay
    setTimeout(() => {
      setNodes(mockNodes);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="flex h-full w-full">
      <Sidebar />
      <main className="flex-1 overflow-hidden flex flex-col p-4 md:p-8 bg-background relative h-full">
        <header className="flex flex-col md:flex-row gap-4 justify-between md:items-center mb-8 shrink-0">
            <div>
                <h1 className="text-3xl font-semibold tracking-tight">Knowledge Nodes</h1>
                <p className="text-muted-foreground">Browse and search your vectorized brain.</p>
            </div>
            <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search concepts..." className="pl-9 bg-black/20" />
            </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 shrink-0 mb-6">
            <Card className="glass-panel border-white/5 bg-white/5">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total MySQL Nodes</CardTitle>
                    <Database className="w-4 h-4 text-primary" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold font-mono">1,248</div>
                </CardContent>
            </Card>
            <Card className="glass-panel border-white/5 bg-white/5">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Pinecone Dimensions</CardTitle>
                    <Network className="w-4 h-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold font-mono">1,248 x 768</div>
                </CardContent>
            </Card>
        </div>

        <ScrollArea className="flex-1 -mx-4 px-4 md:mx-0 md:px-0">
           <div className="space-y-4 pb-24 md:pb-4">
              {loading ? (
                 <div className="animate-pulse space-y-4">
                     <div className="h-24 bg-white/5 rounded-xl border border-white/10" />
                     <div className="h-24 bg-white/5 rounded-xl border border-white/10" />
                     <div className="h-24 bg-white/5 rounded-xl border border-white/10" />
                 </div>
              ) : (
                 nodes.map(node => (
                    <Card key={node.id} className="glass-panel bg-white/5 border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                        <CardHeader className="p-4 md:p-6 pb-3">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-lg group-hover:text-primary transition-colors">{node.title}</CardTitle>
                                <Badge variant="outline" className="font-mono text-[10px] bg-black/30 border-white/10">
                                    {node.type}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 md:p-6 pt-0">
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{node.content}</p>
                            <div className="flex gap-2">
                                {node.tags.map((t: string) => (
                                    <span key={t} className="text-xs text-muted-foreground bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                                        #{t}
                                    </span>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                 ))
              )}
           </div>
        </ScrollArea>
      </main>
      <MobileToolbar />
    </div>
  );
}
