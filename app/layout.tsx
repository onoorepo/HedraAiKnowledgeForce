import type { Metadata } from 'next';
import './globals.css';
import { Inter, JetBrains_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'HedraAiKnowledge (HAK)',
  description: 'Second Brain and Knowledge Graph system powered by Gemini AI',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable, jetbrainsMono.variable, 'dark')} suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased overflow-hidden">
        <div className="relative flex h-screen w-full flex-col overflow-hidden">
          {children}
        </div>
        <Toaster theme="dark" />
      </body>
    </html>
  );
}
