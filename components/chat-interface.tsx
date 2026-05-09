"use client";

import { useChat } from "ai/react";
import { Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AgentMessage } from "@/components/agent-message";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useRef } from "react";

export function ChatInterface() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
  });
  
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden h-full">
      <header className="h-16 flex items-center px-4 md:px-8 border-b border-border/50 shrink-0 z-10 glass-panel bg-card/30">
        <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask the Boss Agent anything or search your Brain..."
            className="pl-9 bg-black/20 border-white/10 rounded-full focus-visible:ring-primary h-10 w-full"
            disabled={isLoading}
          />
          <div className="absolute right-3 flex items-center gap-2">
            <span className="hidden md:inline text-xs font-mono text-muted-foreground bg-white/5 px-2 py-1 rounded-md">
              ⌘K
            </span>
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
        </form>
      </header>

      {messages.length === 0 ? (
        <div className="flex-1 overflow-auto p-4 md:p-8 space-y-8">
          <section className="max-w-5xl mx-auto mt-4">
            <h1 className="text-3xl font-semibold tracking-tight mb-2">Good morning, Souly.</h1>
            <p className="text-muted-foreground mb-8">What are we building inside the Hedra Brain today?</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard title="Total Nodes" value="1,248" trend="+12 this week" />
              <StatCard title="Active Agents" value="5" trend="All systems nominal" />
              <StatCard title="Conversations" value="842" trend="+140 messages today" />
            </div>
          </section>

          <section className="max-w-5xl mx-auto mt-12 pb-24 md:pb-8">
            <h2 className="text-lg font-medium mb-4">Recent Ingestions</h2>
            <div className="space-y-3 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border/50 before:to-transparent">
              <TimelineItem title="Chat Import: Onoo Clients" time="2 hours ago" type="CHAT" />
              <TimelineItem title="React Server Components Note" time="5 hours ago" type="NOTE" />
              <TimelineItem title="Pinecone Setup Script" time="1 day ago" type="CODE" />
            </div>
          </section>
        </div>
      ) : (
        <ScrollArea className="flex-1 p-4 md:p-8 pb-32">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((m) => (
              <div key={m.id} className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
                <span className="text-xs text-muted-foreground mb-1 ml-1">
                  {m.role === "user" ? "You" : "Boss Agent"}
                </span>
                <div
                  className={`p-4 rounded-2xl max-w-[85%] ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-sm"
                      : "bg-white/5 border border-white/10 text-foreground rounded-tl-sm glass-panel"
                  }`}
                >
                  {m.role === "user" ? (
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  ) : (
                    <AgentMessage content={m.content} />
                  )}
                  {m.toolInvocations?.map((toolInv) => {
                    const isCompleted = "result" in toolInv;
                    return (
                      <div key={toolInv.toolCallId} className="mt-2 text-xs font-mono text-muted-foreground flex flex-col gap-1 bg-black/30 p-2 rounded">
                        <span className="text-primary">⚙ {toolInv.toolName}</span>
                        {isCompleted ? (
                          <span className="text-emerald-400">✓ Completed</span>
                        ) : (
                          <span className="animate-pulse">Loading...</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>
      )}
    </div>
  );
}

function StatCard({ title, value, trend }: { title: string; value: string; trend: string }) {
  return (
    <Card className="glass-panel border-white/5 bg-white/5">
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-3xl font-mono">{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <span className="text-xs text-emerald-400">{trend}</span>
      </CardContent>
    </Card>
  );
}

function TimelineItem({ title, time, type }: { title: string; time: string; type: string }) {
  return (
    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-black/50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 glass-panel">
        <span className="text-[10px] font-mono text-muted-foreground">{type.slice(0, 2)}</span>
      </div>
      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass-panel bg-white/5 border border-white/5 p-4 rounded-xl hover:bg-white/10 transition-colors cursor-pointer">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-medium text-sm">{title}</h4>
          <span className="text-xs text-muted-foreground">{time}</span>
        </div>
        <p className="text-xs text-muted-foreground">Auto-tagged and vectored. Ready for retrieval.</p>
      </div>
    </div>
  );
}
