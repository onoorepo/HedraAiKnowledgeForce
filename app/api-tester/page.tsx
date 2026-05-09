"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { MobileToolbar } from "@/components/mobile-toolbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ApiTesterPage() {
  const [log, setLog] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const testIngest = async () => {
    setLoading(true);
    setLog("Testing /api/ingest...");
    try {
      const res = await fetch("/api/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Test Node " + new Date().toISOString(),
          content: "This is a test node containing some valuable knowledge about AI and Pinecone.",
          type: "NOTE"
        })
      });
      const data = await res.json();
      setLog("Response from /api/ingest:\n" + JSON.stringify(data, null, 2));
    } catch (e: any) {
      setLog("Error: " + e.message);
    }
    setLoading(false);
  };

  const testSearch = async () => {
    setLoading(true);
    setLog("Testing /api/search...");
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: "valuable knowledge AI" })
      });
      const data = await res.json();
      setLog("Response from /api/search:\n" + JSON.stringify(data, null, 2));
    } catch (e: any) {
      setLog("Error: " + e.message);
    }
    setLoading(false);
  };

  const testSeed = async () => {
    setLoading(true);
    setLog("Seeding Database with Dummy Data...");
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const data = await res.json();
      setLog("Response from /api/seed:\n" + JSON.stringify(data, null, 2));
    } catch (e: any) {
      setLog("Error: " + e.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex h-full w-full">
      <Sidebar />
      <main className="flex-1 overflow-auto flex flex-col p-4 md:p-8 bg-background relative h-full">
        <h1 className="text-3xl font-semibold mb-4">API & Backend Tester</h1>
        <p className="text-muted-foreground mb-8 text-sm">
          Use this panel to debug and verify that the backend routes (Pinecone, Gemini, MySQL) are working smoothly.
        </p>

        <div className="flex gap-4 flex-wrap mb-8">
          <Button onClick={testIngest} disabled={loading} className="bg-blue-600 hover:bg-blue-700">Test /api/ingest</Button>
          <Button onClick={testSearch} disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">Test /api/search</Button>
          <Button onClick={testSeed} disabled={loading} className="bg-purple-600 hover:bg-purple-700">Seed Database</Button>
        </div>

        <div className="flex-1 bg-black/50 border border-white/10 rounded-xl p-4 overflow-auto">
          <pre className="font-mono text-sm text-green-400 whitespace-pre-wrap">{log || "Click a button to test an API route. Results will appear here."}</pre>
        </div>
      </main>
      <MobileToolbar />
    </div>
  );
}
