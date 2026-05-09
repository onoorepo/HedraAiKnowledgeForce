"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { MobileToolbar } from "@/components/mobile-toolbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Key, Save } from "lucide-react";

export default function SettingsPage() {
  const [secrets, setSecrets] = useState<any[]>([]);
  const [keyName, setKeyName] = useState("");
  const [keyValue, setKeyValue] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSecrets();
  }, []);

  const fetchSecrets = async () => {
    try {
      const res = await fetch('/api/vault');
      const data = await res.json();
      setSecrets(Array.isArray(data) ? data : []);
    } catch(e) {}
  };

  const handleSave = async () => {
    if(!keyName || !keyValue) return;
    setLoading(true);
    try {
      await fetch('/api/vault', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyName, value: keyValue })
      });
      setKeyName("");
      setKeyValue("");
      fetchSecrets();
    } catch(e) {}
    setLoading(false);
  };

  return (
    <div className="flex h-full w-full">
      <Sidebar />
      <main className="flex-1 overflow-auto flex flex-col p-4 md:p-8 bg-background relative h-full">
        <header className="flex flex-col md:flex-row gap-4 justify-between md:items-center mb-8 shrink-0 mt-8 md:mt-0">
            <div>
                <h1 className="text-3xl font-semibold tracking-tight">System Settings & Vault</h1>
                <p className="text-muted-foreground mt-2">Manage encrypted API keys and configuration.</p>
            </div>
        </header>

        <div className="max-w-4xl space-y-6 pb-24 md:pb-0">
            <Card className="glass-panel border-white/5 bg-white/5">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-indigo-400" />
                        E2EE Vault
                    </CardTitle>
                    <CardDescription>Store your integrations keys securely. They are encrypted using AES-256 before saving to MySQL.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Key Name</label>
                                <Input placeholder="e.g. GEMINI_API_KEY" value={keyName} onChange={e => setKeyName(e.target.value)} className="bg-black/20" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Value / Secret</label>
                                <div className="flex gap-2">
                                    <Input type="password" placeholder="••••••••••••" value={keyValue} onChange={e => setKeyValue(e.target.value)} className="bg-black/20" />
                                    <Button onClick={handleSave} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white shrink-0">
                                        <Save className="w-4 h-4 mr-2" />
                                        Save
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/5">
                        <h3 className="text-sm font-medium mb-4 text-muted-foreground">Saved Keys</h3>
                        <div className="space-y-2">
                            {secrets.map(s => (
                                <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <Key className="w-4 h-4 text-muted-foreground" />
                                        <span className="font-mono text-sm">{s.keyName}</span>
                                    </div>
                                    <span className="text-xs text-muted-foreground hidden sm:inline">Stored {new Date(s.updatedAt).toLocaleDateString()}</span>
                                </div>
                            ))}
                            {secrets.length === 0 && <p className="text-sm text-muted-foreground">No keys saved in the vault yet.</p>}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      </main>
      <MobileToolbar />
    </div>
  );
}
