import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Home, Search, BrainCircuit, Users, UploadCloud, MessageSquareText, Command, Settings, PenTool } from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-64 h-full bg-black/40 border-r border-white/5 backdrop-blur-xl shrink-0">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-lg tracking-tight">System HAK</span>
        </div>
        
        <div className="space-y-1">
          <SidebarItem href="/" icon={<Home className="w-4 h-4" />} label="Dashboard" />
          <SidebarItem href="/search" icon={<Search className="w-4 h-4" />} label="Hybrid Search" />
          <SidebarItem href="/write" icon={<PenTool className="w-4 h-4 text-emerald-400" />} label="Smart Editor" />
          <SidebarItem href="/api-tester" icon={<Search className="w-4 h-4 text-orange-400" />} label="API Tester" />
          <SidebarItem href="/agents" icon={<Command className="w-4 h-4" />} label="My Agents" />
          <SidebarItem href="/import" icon={<UploadCloud className="w-4 h-4" />} label="Import Data" />
          <SidebarItem href="/graph" icon={<BrainCircuit className="w-4 h-4 text-purple-400" />} label="Knowledge Graph" />
        </div>
      </div>
      <div className="mt-auto p-6">
         <SidebarItem href="/settings" icon={<Settings className="w-4 h-4" />} label="Settings" />
      </div>
    </aside>
  );
}

function SidebarItem({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <Link 
      href={href} 
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
        active ? "bg-white/10 text-white" : "text-muted-foreground hover:bg-white/5 hover:text-white"
      )}
    >
      {icon}
      <span>{label}</span>
      {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />}
    </Link>
  );
}
