"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { MobileToolbar } from "@/components/mobile-toolbar";
import { Button } from "@/components/ui/button";
import { UploadCloud, FileJson, Brain } from "lucide-react";

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
          setFile(e.target.files[0]);
      }
  };

  const processFile = async () => {
      if (!file) return;
      setLoading(true);
      setStatus("Reading file...");
      setLogs([]);
      setProgress(0);

      try {
          const text = await file.text();
          
          // Simple Chunking
          const chunkSize = 2000;
          const chunks = [];
          for (let i = 0; i < text.length; i += chunkSize) {
              chunks.push(text.substring(i, i + chunkSize));
          }

          setStatus(`Found ${chunks.length} chunks. Sending to Swarm...`);

          for (let i = 0; i < chunks.length; i++) {
              setStatus(`Processing chunk ${i+1}/${chunks.length} via Swarm...`);
              
              // 1. Swarm Processing
              const swarmRes = await fetch("/api/swarm", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ text: chunks[i] })
              });
              
              const swarmData = await swarmRes.json();
              
              if (swarmData.success) {
                  setLogs((prev) => [...prev, `[Chunk ${i+1}] Summarized & Tasks Extracted.`]);
                  
                  // 2. Ingest Summary to DB/Pinecone
                  await fetch("/api/ingest", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ 
                          title: `Import Fragment ${i+1}/${chunks.length}`, 
                          content: swarmData.summaryData + "\n\nTasks:\n" + swarmData.extractedTasks,
                          type: "DOCUMENT"
                      })
                  });
              } else {
                  setLogs((prev) => [...prev, `[Chunk ${i+1}] Error: ${swarmData.error}`]);
              }
              
              setProgress(Math.round(((i + 1) / chunks.length) * 100));
          }
          
          setStatus("Data successfully integrated into Second Brain.");
      } catch (e: any) {
          setStatus("Error formatting file: " + e.message);
      }
      setLoading(false);
  };

  return (
    <div className="flex h-full w-full">
      <Sidebar />
      <main className="flex-1 overflow-auto flex flex-col p-4 md:p-8 bg-background relative h-full">
        <header className="flex flex-col md:flex-row gap-4 justify-between md:items-center mb-8 shrink-0 mt-8 md:mt-0">
            <div>
                <h1 className="text-3xl font-semibold tracking-tight">Mass Data Import & Swarm</h1>
                <p className="text-muted-foreground mt-2">Upload large histories (WhatsApp, notes, JSON) to chunk and digest via Swarm Agents.</p>
            </div>
        </header>

        <div className="max-w-3xl space-y-6 pb-24 md:pb-0">
            {/* Scraper Section */}
            <div className="p-8 border border-white/10 rounded-2xl bg-white/5 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-xl font-medium">Web Scraper Agent</h3>
                </div>
                <p className="text-muted-foreground text-sm">Enter a URL (News, Wiki, Github) to scrape content and ingest into your brain.</p>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        placeholder="https://example.com/article" 
                        id="scrape-url"
                        className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" 
                    />
                    <Button onClick={async () => {
                        const url = (document.getElementById('scrape-url') as HTMLInputElement).value;
                        if(!url) return;
                        setLoading(true);
                        setStatus("Connecting to scraper agent...");
                        try {
                            const res = await fetch("/api/scrape", {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ url })
                            });
                            const data = await res.json();
                            if(data.success) {
                                setStatus("Content grabbed. Ingesting to vectors...");
                                await fetch("/api/ingest", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ 
                                        title: data.title, 
                                        content: data.content,
                                        type: "DOCUMENT",
                                        sourceId: data.url
                                    })
                                });
                                setStatus("Successfully scraped and indexed: " + data.title);
                            } else {
                                setStatus("Scrape failed: " + data.error);
                            }
                        } catch(e: any) {
                            setStatus("Error: " + e.message);
                        }
                        setLoading(false);
                    }} disabled={loading} className="bg-indigo-600">Scrape</Button>
                </div>
            </div>

            <div className="p-8 border-2 border-dashed border-white/20 rounded-2xl bg-white/5 flex flex-col items-center text-center space-y-4">
                <div className="p-4 bg-indigo-500/20 text-indigo-400 rounded-full">
                    <UploadCloud className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-medium">Select a File to Digest</h3>
                <p className="text-muted-foreground text-sm max-w-md">Supported formats: .txt, .md, .json. The file will be divided into chunks and passed sequentially to the Summarizer and Task Extractor agents.</p>
                
                <input 
                   type="file" 
                   accept=".txt,.md,.json" 
                   onChange={handleFileUpload}
                   className="block w-full max-w-xs text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer"
                />

                {file && (
                    <div className="mt-4 p-4 bg-black/40 border border-white/10 rounded-lg flex items-center gap-3 w-full max-w-sm justify-between">
                       <span className="flex items-center gap-2 text-sm text-gray-300">
                           <FileJson className="w-4 h-4 text-emerald-400" />
                           {file.name}
                       </span>
                       <Button onClick={processFile} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 h-8 text-xs">
                           <Brain className="w-4 h-4 mr-1" /> Digest
                       </Button>
                    </div>
                )}
            </div>

            {status && (
                <div className="bg-black/50 border border-white/10 rounded-xl p-4 space-y-4">
                    <div className="flex justify-between text-sm">
                        <span className="text-emerald-400 font-medium animate-pulse">{status}</span>
                        <span className="text-muted-foreground">{progress}%</span>
                    </div>
                    
                    <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-indigo-500 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                    </div>

                    <div className="max-h-60 overflow-y-auto font-mono text-xs text-gray-400 space-y-1">
                        {logs.map((L, i) => (
                            <div key={i}>{L}</div>
                        ))}
                    </div>
                </div>
            )}
        </div>
      </main>
      <MobileToolbar />
    </div>
  );
}
