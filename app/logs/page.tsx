"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { MobileToolbar } from "@/components/mobile-toolbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Terminal, RefreshCcw, Info, AlertTriangle, AlertCircle, CheckCircle } from "lucide-react";

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/logs");
      const data = await res.json();
      setLogs(data);
    } catch (e) {}
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getIcon = (level: string) => {
    switch(level) {
        case "ERROR": return <AlertCircle className="w-4 h-4 text-red-400" />;
        case "WARN": return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
        case "SUCCESS": return <CheckCircle className="w-4 h-4 text-green-400" />;
        default: return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="flex h-full w-full">
      <Sidebar />
      <main className="flex-1 overflow-hidden flex flex-col bg-background relative h-full">
        <header className="p-4 md:p-8 border-b border-white/5 flex items-center justify-between bg-black/20 backdrop-blur-md">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight lg:text-3xl flex items-center gap-2">
                    <Terminal className="w-6 h-6 text-indigo-400" />
                    System Logs
                </h1>
                <p className="text-sm text-muted-foreground mt-1">Real-time tracking of AI operations and backend events.</p>
            </div>
            <button onClick={fetchLogs} className="p-2 hover:bg-white/5 rounded-full transition">
                <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
        </header>

        <ScrollArea className="flex-1">
            <div className="p-4 md:p-8 space-y-2">
                {logs.map((log) => (
                    <div key={log.id} className="p-3 bg-white/5 border border-white/5 rounded-lg flex gap-3 font-mono text-xs md:text-sm items-start hover:bg-white/10 transition">
                        <span className="text-muted-foreground shrink-0 uppercase w-24">[{log.module}]</span>
                        <div className="shrink-0 pt-0.5">{getIcon(log.level)}</div>
                        <div className="flex-1">
                            <p className="text-gray-200">{log.message}</p>
                            <span className="text-[10px] text-muted-foreground mt-1 block">
                                {new Date(log.createdAt).toLocaleString()}
                            </span>
                        </div>
                    </div>
                ))}
                {logs.length === 0 && !loading && <div className="text-center py-20 text-muted-foreground">No logs found yet.</div>}
            </div>
        </ScrollArea>
      </main>
      <MobileToolbar />
    </div>
  );
}
