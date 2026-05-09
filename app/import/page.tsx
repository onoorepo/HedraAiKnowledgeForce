"use client";
import { Sidebar } from "@/components/sidebar"
import { MobileToolbar } from "@/components/mobile-toolbar"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UploadCloud, MessageSquare, Code, FileText } from "lucide-react"
import { useState, useRef } from "react"
import { toast } from "sonner"

export default function ImportPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      await uploadFile(file);
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      await uploadFile(file);
    }
  }

  const uploadFile = async (file: File) => {
    setUploading(true);
    try {
        const formData = new FormData();
        formData.append("file", file);
        
        const response = await fetch("/api/import/chat", {
            method: "POST",
            body: formData
        });
        
        if (response.ok) {
            toast.success("File parsed and imported successfully!");
        } else {
            toast.error("Failed to import file.");
        }
    } catch(err) {
        toast.error("An error occurred");
    } finally {
        setUploading(false);
    }
  }

  return (
    <div className="flex h-full w-full">
      <Sidebar />
      <main className="flex-1 overflow-auto p-4 md:p-8 bg-background relative h-full">
        <h1 className="text-3xl font-semibold tracking-tight mb-2">Import Knowledge</h1>
        <p className="text-muted-foreground mb-8">Drag and drop WhatsApp or Facebook chat exports, code snippets, or documents.</p>
        
        <div 
           className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${isDragging ? 'border-primary bg-primary/10' : 'border-white/10 hover:border-white/20 bg-black/20'}`}
           onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
           onDragLeave={() => setIsDragging(false)}
           onDrop={handleDrop}
           onClick={() => !uploading && fileInputRef.current?.click()}
        >
           <input 
             type="file" 
             ref={fileInputRef} 
             style={{ display: 'none' }} 
             onChange={handleChange}
             accept=".txt,.json,.csv,.html"
           />
           <UploadCloud className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
           <h3 className="text-xl font-medium mb-2">Drag & Drop files here</h3>
           <p className="text-sm text-muted-foreground mb-6">Supports .txt, .json, .html, .csv</p>
           <button 
             className={`px-4 py-2 rounded-md transition-colors ${uploading ? 'bg-primary/50 cursor-not-allowed' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}
             disabled={uploading}
           >
              {uploading ? "Parsing & Integrating..." : "Browse Files"}
           </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
           <ImportSourceCard icon={<MessageSquare />} title="Chat Logs" desc="WhatsApp, Messenger, Telegram" />
           <ImportSourceCard icon={<Code />} title="Code Snippets" desc="JS, TS, Python, PHP" />
           <ImportSourceCard icon={<FileText />} title="Documents" desc="PDF, Word, Markdown" />
        </div>
      </main>
      <MobileToolbar />
    </div>
  )
}

function ImportSourceCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <Card className="glass-panel border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
      <CardHeader className="pb-2 flex flex-row items-center gap-4">
        <div className="p-2 bg-primary/20 text-primary rounded-lg">{icon}</div>
        <div>
           <CardTitle className="text-lg">{title}</CardTitle>
           <CardDescription>{desc}</CardDescription>
        </div>
      </CardHeader>
    </Card>
  )
}
