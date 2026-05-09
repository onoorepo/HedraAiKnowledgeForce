"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { MobileToolbar } from "@/components/mobile-toolbar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, User } from "lucide-react";
import ReactMarkdown from 'react-markdown';

export default function BossAgentPage() {
  const [messages, setMessages] = useState<{role: string, content: string}[]>([
      { role: "assistant", content: "Hello! I am The Boss. I'm connected to your Second Brain. Ask me anything, or tell me to digest new logic!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages })
      });
      
      const data = await res.json();
      if (data.content) {
          setMessages([...newMessages, { role: "assistant", content: data.content }]);
      } else if (data.error) {
          setMessages([...newMessages, { role: "assistant", content: `**Error:** ${data.error}` }]);
      }
    } catch(e) {
      setMessages([...newMessages, { role: "assistant", content: "**Error:** Failed to connect to the brain." }]);
    }
    setLoading(false);
  };

  return (
    <div className="flex h-full w-full">
      <Sidebar />
      <main className="flex-1 overflow-hidden flex flex-col bg-background relative h-full">
        
        <header className="flex-none p-4 md:p-8 flex items-center justify-between border-b border-white/5 bg-black/20 backdrop-blur-md">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
                    <Bot className="w-6 h-6 text-indigo-400" />
                    The Boss Agent
                </h1>
                <p className="text-sm text-muted-foreground mt-1">Your core orchestrator + RAG active.</p>
            </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 pb-24 md:pb-8">
            {messages.map((msg, i) => (
                <div key={i} className={`flex gap-4 max-w-4xl mx-auto ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <Avatar className={`w-8 h-8 shrink-0 ${msg.role === 'user' ? 'bg-indigo-600' : 'bg-surface2 border border-white/10'}`}>
                        <AvatarFallback className="bg-transparent">
                            {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-indigo-400" />}
                        </AvatarFallback>
                    </Avatar>
                    <div className={`p-4 rounded-2xl ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-none'}`}>
                        <div className="prose prose-invert max-w-none text-sm md:text-base prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 text-white/90">
                           <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                    </div>
                </div>
            ))}
            {loading && (
                <div className="flex gap-4 max-w-4xl mx-auto">
                    <Avatar className="w-8 h-8 shrink-0 bg-surface2 border border-white/10">
                        <AvatarFallback className="bg-transparent"><Bot className="w-4 h-4 text-indigo-400" /></AvatarFallback>
                    </Avatar>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 rounded-tl-none flex items-center">
                        <span className="flex space-x-1">
                            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
                        </span>
                    </div>
                </div>
            )}
        </div>

        <div className="flex-none p-4 md:p-8 border-t border-white/5 bg-background pb-20 md:pb-4">
            <div className="max-w-4xl mx-auto relative flex items-center">
                <textarea 
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                    placeholder="Ask your brain or instruct The Boss..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-4 pr-16 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none h-14 overflow-hidden shadow-lg"
                    style={{ lineHeight: '1.5' }}
                />
                <Button 
                   onClick={sendMessage} 
                   disabled={loading || !input.trim()}
                   size="icon"
                   className="absolute right-2 top-2 h-10 w-10 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white"
                >
                    <Send className="w-4 h-4" />
                </Button>
            </div>
            <div className="max-w-4xl mx-auto text-center mt-2">
                 <span className="text-xs text-muted-foreground">Press Enter to send, Shift+Enter for new line. RAG is automatically applied to context.</span>
            </div>
        </div>

      </main>
      <MobileToolbar />
    </div>
  );
}
