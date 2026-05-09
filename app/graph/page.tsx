"use client";

import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import { Sidebar } from "@/components/sidebar";
import { MobileToolbar } from "@/components/mobile-toolbar";

// Dynamically import to avoid SSR issues with canvas/WebGL
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { 
    ssr: false,
    loading: () => <div className="absolute inset-0 flex items-center justify-center bg-background"><div className="animate-pulse text-muted-foreground font-mono">Initializing HAK Core Graph Rendering...</div></div>
});

export default function GraphPage() {
  const [data, setData] = useState({ nodes: [], links: [] });
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Fetch actual data from backend
    const fetchData = async () => {
        try {
            const res = await fetch('/api/graph');
            const graphData = await res.json();
            if (graphData.nodes) {
                setData(graphData);
            }
        } catch(e) {
            console.error("Failed to fetch graph data", e);
        }
    };
    
    fetchData();
    
    // Update dimensions
    const updateDimensions = () => {
        const container = document.getElementById('graph-container');
        if (container) {
            setDimensions({
                width: container.clientWidth,
                height: container.clientHeight
            });
        }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    setIsClient(true);
    
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return (
    <div className="flex h-full w-full">
      <Sidebar />
      <main className="flex-1 overflow-hidden flex flex-col bg-background relative h-full">
        <div className="absolute top-4 left-4 md:top-8 md:left-8 z-10 pointer-events-none">
            <h1 className="text-3xl font-semibold tracking-tight text-white mb-2 filter drop-shadow-lg">Neural Graph</h1>
            <p className="text-white/70 font-mono text-sm max-w-sm">Visualizing the real-time connections inside the Pinecone vectors and relational MySQL nodes.</p>
        </div>

        <div id="graph-container" className="absolute inset-0 w-full h-full cursor-move">
            {isClient && (
                <ForceGraph2D
                   width={dimensions.width}
                   height={dimensions.height}
                   graphData={data}
                   nodeLabel="label"
                   nodeAutoColorBy="group"
                   linkDirectionalParticles={2}
                   linkDirectionalParticleSpeed={0.01}
                   backgroundColor="#000000" // We use black to blend with dark mode
                   nodeRelSize={6}
                   linkColor={() => 'rgba(255,255,255,0.1)'}
                />
            )}
        </div>
      </main>
      <MobileToolbar />
    </div>
  );
}
