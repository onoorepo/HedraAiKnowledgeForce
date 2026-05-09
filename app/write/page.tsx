"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { MobileToolbar } from "@/components/mobile-toolbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brain } from "lucide-react";
import { toast } from "sonner";

export default function EditorPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  const saveNote = async () => {
    if (!title || !content) {
        toast.error("Title and content are required.");
        return;
    }
    setSaving(true);
    try {
        const res = await fetch('/api/ingest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content, type: 'NOTE' })
        });
        
        if (res.ok) {
            setTitle("");
            setContent("");
            toast.success("Knowledge node created & vectorized!");
        } else {
            const data = await res.json();
            toast.error(data.error || "Failed to vectorise note.");
        }
    } catch(e) {
        toast.error("Error saving node.");
    }
    setSaving(false);
  }

  return (
    <div className="flex h-full w-full">
      <Sidebar />
      <main className="flex-1 overflow-hidden flex flex-col p-4 md:p-8 bg-background relative h-full">
        <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 shrink-0 mt-8 md:mt-0 gap-4">
            <div>
                <h1 className="text-3xl font-semibold tracking-tight">Smart Editor</h1>
                <p className="text-muted-foreground mt-2">Write, vectorize and store knowledge directly to your brain.</p>
            </div>
            <Button onClick={saveNote} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 w-full md:w-auto">
                <Brain className="w-4 h-4 mr-2" />
                {saving ? "Vectorizing..." : "Vectorize to Brain"}
            </Button>
        </header>

        <div className="flex-1 flex flex-col gap-4 pb-20 md:pb-0">
            <Input 
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Node Title..." 
                className="text-2xl font-bold bg-white/5 border-white/5 p-6 h-auto"
            />
            <textarea 
                value={content}
                onChange={e => setContent(e.target.value)}
                className="flex-1 w-full bg-white/5 border border-white/5 rounded-xl p-6 text-lg text-white/90 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 resize-none font-mono"
                placeholder="Start typing your thoughts, notes, or ideas here... They will be automatically parsed, vectorized, and deeply linked via AI."
            />
        </div>
      </main>
      <MobileToolbar />
    </div>
  );
}
