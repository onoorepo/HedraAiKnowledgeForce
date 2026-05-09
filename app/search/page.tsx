"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { MobileToolbar } from "@/components/mobile-toolbar";
import { Button } from "@/components/ui/button";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      });
      const data = await res.json();
      if (data.results) setResults(data.results);
    } catch(e) {}
    setLoading(false);
  };

  return (
    <div className="flex h-full w-full">
      <Sidebar />
      <div className="flex-1 overflow-hidden p-4 md:p-8 flex flex-col h-full">
        <h1 className="text-3xl font-semibold mb-2">Hybrid Search Engine</h1>
        <p className="text-muted-foreground mb-8">Advanced semantic and lexical search capabilities across Pinecone and MySQL.</p>
        
        <div className="flex gap-2 max-w-3xl w-full mx-auto shrink-0 mb-8">
            <input 
              type="text" 
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="I am looking for..." 
              className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 text-lg focus:outline-none focus:ring-1 focus:ring-indigo-500" 
            />
            <Button onClick={handleSearch} disabled={loading} className="h-full px-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">
               Search
            </Button>
        </div>

        <div className="flex-1 overflow-auto max-w-3xl w-full mx-auto space-y-4 pb-20">
            {loading && <div className="text-center text-muted-foreground animate-pulse">Searching Vectors...</div>}
            
            {results.map(node => (
                <div key={node.id} className="p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition">
                    <h3 className="font-semibold text-lg text-white mb-2">{node.title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-3">{node.content}</p>
                </div>
            ))}
        </div>
      </div>
      <MobileToolbar />
    </div>
  );
}
