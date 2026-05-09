"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { MobileToolbar } from "@/components/mobile-toolbar";
import { Settings, Tag as TagIcon, Key, Palette, Shield, Plus, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SettingsPage() {
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  const addTag = async () => {
      const name = prompt("Tag Name:");
      if(!name) return;
      try {
          await fetch("/api/tags", {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name, color: "#4f46e5", icon: "Tag" })
          });
          fetchTags();
          toast.success("Tag created");
      } catch(e) {}
  };

  return (
    <div className="flex h-full w-full">
      <Sidebar />
      <main className="flex-1 overflow-auto flex flex-col bg-background relative h-full">
        <header className="p-4 md:p-8 flex flex-col md:flex-row gap-4 justify-between md:items-center border-b border-white/5 bg-black/20">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight lg:text-3xl flex items-center gap-2">
                    <Settings className="w-6 h-6 text-indigo-400" />
                    System Registry
                </h1>
                <p className="text-sm text-muted-foreground mt-1">Configure your cortex taxonomies, tags, and secured credentials.</p>
            </div>
        </header>

        <div className="p-4 md:p-8 space-y-8 max-w-5xl">
            {/* Tags Section */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-medium flex items-center gap-2">
                        <TagIcon className="w-5 h-5 text-emerald-400" />
                        Taxonomy & Tags
                    </h2>
                    <Button onClick={addTag} size="sm" variant="outline" className="gap-2 border-white/10">
                        <Plus className="w-4 h-4" /> Add Tag
                    </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {tags.map((tag) => (
                        <div key={tag.id} className="p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition flex flex-col items-center gap-2 relative group">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: tag.color + '20' }}>
                                <TagIcon className="w-4 h-4" style={{ color: tag.color }} />
                            </div>
                            <span className="text-xs font-medium">{tag.name}</span>
                            <button className="absolute top-1 right-1 p-1 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition">
                                <Trash2 className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* AI Config Section */}
            <section className="space-y-4">
                <h2 className="text-xl font-medium flex items-center gap-2">
                    <Shield className="w-5 h-5 text-orange-400" />
                    AI Engine Credentials
                </h2>
                <div className="p-6 bg-white/5 border border-white/5 rounded-2xl space-y-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Gemini Pro API Key</label>
                        <div className="flex gap-2">
                            <input type="password" value="************************" disabled className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm" />
                            <Button variant="ghost" className="text-indigo-400 hover:text-indigo-300">Update</Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="space-y-4">
                <h2 className="text-xl font-medium flex items-center gap-2">
                    <Palette className="w-5 h-5 text-pink-400" />
                    Color Coding & Visuals
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-black/20 border border-white/5 rounded-xl">
                        <p className="text-sm text-gray-400 mb-2">Business Interaction Palette</p>
                        <div className="flex gap-2">
                            <div className="w-6 h-6 rounded bg-emerald-500"></div>
                            <div className="w-6 h-6 rounded bg-emerald-600"></div>
                            <div className="w-6 h-6 rounded bg-emerald-700"></div>
                        </div>
                    </div>
                    <div className="p-4 bg-black/20 border border-white/5 rounded-xl">
                        <p className="text-sm text-gray-400 mb-2">Personal Memory Palette</p>
                        <div className="flex gap-2">
                            <div className="w-6 h-6 rounded bg-indigo-500"></div>
                            <div className="w-6 h-6 rounded bg-indigo-600"></div>
                            <div className="w-6 h-6 rounded bg-indigo-700"></div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
      </main>
      <MobileToolbar />
    </div>
  );
}
