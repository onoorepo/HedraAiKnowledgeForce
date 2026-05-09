"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { MobileToolbar } from "@/components/mobile-toolbar";
import { Activity, Clock, CheckCircle, AlertCircle, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
        const res = await fetch("/api/tasks");
        const data = await res.json();
        setTasks(data);
    } catch(e) {}
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 5000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
      switch(status) {
          case "COMPLETED": return "text-emerald-400";
          case "PROCESSING": return "text-indigo-400";
          case "FAILED": return "text-red-400";
          default: return "text-gray-400";
      }
  };

  return (
    <div className="flex h-full w-full">
      <Sidebar />
      <main className="flex-1 overflow-auto flex flex-col bg-background relative h-full">
        <header className="p-4 md:p-8 flex items-center justify-between border-b border-white/5 bg-black/20">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight lg:text-3xl flex items-center gap-2">
                    <Activity className="w-6 h-6 text-indigo-400" />
                    Background Operations
                </h1>
                <p className="text-sm text-muted-foreground mt-1">Monitor neural ingestion jobs and automated brain sync tasks.</p>
            </div>
            <Button onClick={fetchTasks} variant="ghost" size="icon" className={loading ? 'animate-spin' : ''}>
                <RefreshCw className="w-4 h-4" />
            </Button>
        </header>

        <div className="p-4 md:p-8 space-y-4 max-w-4xl">
            {tasks.map((task) => (
                <div key={task.id} className="p-6 bg-white/5 border border-white/5 rounded-2xl flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg bg-white/5 ${getStatusColor(task.status)}`}>
                                {task.status === "COMPLETED" ? <CheckCircle className="w-5 h-5" /> : 
                                 task.status === "FAILED" ? <AlertCircle className="w-5 h-5" /> : 
                                 <Clock className="w-5 h-5 animate-pulse" />}
                            </div>
                            <div>
                                <h3 className="font-medium text-white">{task.name}</h3>
                                <p className="text-xs text-muted-foreground">ID: {task.id}</p>
                            </div>
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${getStatusColor(task.status)}`}>
                            {task.status}
                        </span>
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] text-muted-foreground uppercase font-bold">
                            <span>Processing Progress</span>
                            <span>{task.progress}% ({task.totalChunks} chunks)</span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                            <div 
                                className={`h-full transition-all duration-500 ${task.status === 'FAILED' ? 'bg-red-500' : 'bg-indigo-500'}`} 
                                style={{ width: `${task.progress}%` }}
                            ></div>
                        </div>
                    </div>

                    {task.errorMessage && (
                        <p className="text-[10px] text-red-400 bg-red-400/10 p-2 rounded border border-red-400/20">
                            {task.errorMessage}
                        </p>
                    )}

                    <div className="flex items-center justify-between mt-2 pt-4 border-t border-white/5">
                         <span className="text-[10px] text-muted-foreground">
                             Started: {new Date(task.createdAt).toLocaleString()}
                         </span>
                         {task.status !== 'PROCESSING' && (
                             <Button size="icon" variant="ghost" className="h-8 w-8 text-red-400">
                                 <Trash2 className="w-4 h-4" />
                             </Button>
                         )}
                    </div>
                </div>
            ))}
            {tasks.length === 0 && !loading && (
                <div className="text-center py-20 text-muted-foreground">No active or past jobs found.</div>
            )}
        </div>
      </main>
      <MobileToolbar />
    </div>
  );
}
