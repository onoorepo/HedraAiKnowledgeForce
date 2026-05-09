import Link from 'next/link';
import { Home, Search, BrainCircuit, Command, Plus, PenTool } from 'lucide-react';

export function MobileToolbar() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-xl border-t border-white/5 flex items-center justify-around px-4 z-50">
      <Link href="/" className="p-2 text-muted-foreground hover:text-white"><Home className="w-5 h-5" /></Link>
      <Link href="/search" className="p-2 text-muted-foreground hover:text-white"><Search className="w-5 h-5" /></Link>
      <Link href="/write" className="w-12 h-12 -mt-6 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white border-4 border-black">
         <PenTool className="w-5 h-5" />
      </Link>
      <Link href="/graph" className="p-2 text-muted-foreground hover:text-white"><BrainCircuit className="w-5 h-5" /></Link>
      <Link href="/settings" className="p-2 text-muted-foreground hover:text-white"><Command className="w-5 h-5" /></Link>
    </div>
  );
}
