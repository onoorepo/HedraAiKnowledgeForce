import Link from 'next/link';
import { Home, Search, BrainCircuit, Command, Plus, PenTool, Database, MessageSquareText, Settings } from 'lucide-react';

export function MobileToolbar() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-black/80 backdrop-blur-2xl border-t border-white/10 flex items-center justify-around px-2 z-50 pb-safe">
      <ToolbarItem href="/" icon={<Home className="w-5 h-5" />} label="Home" />
      <ToolbarItem href="/search" icon={<Search className="w-5 h-5" />} label="Search" />
      <div className="relative -top-3">
          <Link href="/write" className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/40 text-white border-4 border-[#0a0a0a]">
             <PenTool className="w-6 h-6" />
          </Link>
      </div>
      <ToolbarItem href="/brain" icon={<Database className="w-5 h-5" />} label="Brain" />
      <ToolbarItem href="/settings" icon={<Settings className="w-5 h-5" />} label="Setup" />
    </div>
  );
}

function ToolbarItem({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
  return (
    <Link href={href} className="flex flex-col items-center gap-1.5 p-2 text-muted-foreground hover:text-indigo-400 transition-all active:scale-95">
      {icon}
      <span className="text-[9px] uppercase tracking-tighter font-bold">{label}</span>
    </Link>
  );
}
