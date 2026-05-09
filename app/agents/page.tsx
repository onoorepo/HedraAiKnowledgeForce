"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { MobileToolbar } from "@/components/mobile-toolbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Command, Plus, Settings2 } from "lucide-react";

export default function AgentsPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mocking load for preview visually
    setTimeout(() => {
      setAgents([
        { id: "1", name: "The Boss", role: "Core Orchestrator", systemPrompt: "You are the primary manager of the Hak system. You coordinate sub-agents.", isActive: true },
        { id: "2", name: "Onoo Assistant", role: "Client Relations", systemPrompt: "Your context is purely Onoo INC. Handle client tasks.", isActive: true },
        { id: "3", name: "Code Reviewer", role: "Engineering", systemPrompt: "Review typescript code and strictly follow functional patterns.", isActive: false },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  return (
    <div className="flex h-full w-full">
      <Sidebar />
      <main className="flex-1 overflow-hidden flex flex-col p-4 md:p-8 bg-background relative h-full">
        <header className="flex flex-col md:flex-row gap-4 justify-between md:items-center mb-8 shrink-0 mt-8 md:mt-0">
            <div>
                <h1 className="text-3xl font-semibold tracking-tight">Agent Swarm</h1>
                <p className="text-muted-foreground mt-2">Manage your custom AI assistants and their system instructions.</p>
            </div>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20">
                <Plus className="w-4 h-4 mr-2" />
                New Agent
            </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24 md:pb-0 overflow-y-auto">
             {loading ? (
                 <div className="animate-pulse space-y-4 col-span-full">
                     <div className="h-32 bg-white/5 rounded-xl border border-white/10" />
                     <div className="h-32 bg-white/5 rounded-xl border border-white/10" />
                 </div>
              ) : (
                agents.map(agent => (
                    <Card key={agent.id} className="glass-panel relative overflow-hidden group border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                        <CardHeader className="pb-3">
                           <div className="flex justify-between items-start">
                              <div className="flex items-center gap-3">
                                <div className={`p-2.5 rounded-xl ${agent.isActive ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/10 text-muted-foreground'}`}>
                                    <Command className="w-5 h-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">{agent.name}</CardTitle>
                                    <CardDescription>{agent.role}</CardDescription>
                                </div>
                              </div>
                              <Badge variant={agent.isActive ? "default" : "secondary"} className={agent.isActive ? "bg-indigo-500 text-white hover:bg-indigo-600" : ""}>
                                  {agent.isActive ? 'Active' : 'Offline'}
                              </Badge>
                           </div>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-black/20 p-3 rounded-lg border border-white/5 mt-2">
                                <p className="text-sm text-white/70 line-clamp-2 font-mono leading-relaxed">{agent.systemPrompt}</p>
                            </div>
                            
                            <div className="mt-4 flex gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                <Button variant="secondary" size="sm" className="w-full bg-white/10 hover:bg-white/20 text-white">
                                    <Settings2 className="w-4 h-4 mr-2" /> Configure
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))
              )}
        </div>
      </main>
      <MobileToolbar />
    </div>
  );
}
