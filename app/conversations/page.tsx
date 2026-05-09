"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { MobileToolbar } from "@/components/mobile-toolbar";
import { MessageSquareText, Search, Plus, Filter, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="flex h-full w-full">
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
                <Button className="gap-2 bg-indigo-600"><Plus className="w-4 h-4" /> Import Chat</Button>
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
                        <div className="flex gap-2">
                            <Button size="sm" variant="ghost" className="text-[10px] h-7 bg-white/5 hover:bg-white/10">Analyze with AI</Button>
                            <Button size="sm" variant="ghost" className="text-[10px] h-7 bg-white/5 hover:bg-white/10">Extract Entities</Button>
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
      </main>
      <MobileToolbar />
    </div>
  );
}
