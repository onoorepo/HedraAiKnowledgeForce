"use client";

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Card } from './ui/card';

export function AgentMessage({ content }: { content: string }) {
  const parts = content.split(/<widget([^>]*)>([^<]*)<\/widget>/gi);
  
  if (parts.length === 1) {
    return <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border-white/10 prose-pre:border"><ReactMarkdown>{content}</ReactMarkdown></div>;
  }

  return (
    <div className="space-y-4">
       {parts.map((part, i) => {
         if (i % 3 === 0) return <div key={i} className="prose prose-invert max-w-none"><ReactMarkdown>{part}</ReactMarkdown></div>;
         if (i % 3 === 1) return null; // attributes match
         
         const attributesStr = parts[i - 1] || "";
         const isChart = attributesStr.includes('type="CHART"');
         const isWhiteboard = attributesStr.includes('type="WHITEBOARD"');
         
         return (
           <Card key={i} className="p-4 bg-muted/20 border-white/10 glass-panel">
             <div className="text-xs font-mono text-muted-foreground mb-2">Interactive Render: {isChart ? 'Chart' : 'Whiteboard'}</div>
             <div className="w-full h-48 flex items-center justify-center bg-black/50 rounded pointer-events-auto">
               <span className="text-sm text-foreground/50 text-center px-4">Displaying data:<br/>{part.slice(0, 80)}...</span>
             </div>
           </Card>
         )
       })}
    </div>
  )
}
