import { Sidebar } from "@/components/sidebar"
import { MobileToolbar } from "@/components/mobile-toolbar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function ChatsPage() {
  return (
    <div className="flex h-full w-full">
      <Sidebar />
      <main className="flex-1 flex relative overflow-hidden h-full">
        {/* Chat List (Sidebar 2) */}
        <div className="w-full md:w-80 border-r border-border bg-black/10 flex flex-col h-full">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold text-lg">Conversations</h2>
            <div className="flex gap-2 mt-2">
              <Badge variant="secondary" className="bg-blue-500/10 text-blue-400">Business Page</Badge>
              <Badge variant="secondary" className="bg-green-500/10 text-green-400">WhatsApp</Badge>
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
               <ChatItem name="Onoo Customer #129" source="FACEBOOK_BUSINESS" preview="Can you integrate BrandErp with Shopify?" time="10:42 AM" />
               <ChatItem name="Mina" source="WHATSAPP" preview="The server configs are ready for SoulyCore." time="Yesterday" />
               <ChatItem name="Hesham" source="FACEBOOK_PERSONAL" preview="Check out this new Next.js update!" time="Mon" />
            </div>
          </ScrollArea>
        </div>

        {/* Chat Viewer */}
        <div className="hidden md:flex flex-1 flex-col h-full relative">
          <div className="h-16 border-b border-border flex items-center px-6 bg-card/30 glass-panel absolute top-0 w-full z-10">
            <Avatar className="w-8 h-8 mr-3">
              <AvatarFallback>OC</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-sm">Onoo Customer #129</h3>
              <p className="text-xs text-muted-foreground flex items-center">
                <span className="w-2 h-2 rounded-full bg-blue-500 mr-1" />
                Facebook Business Page (Onoo)
              </p>
            </div>
            <div className="ml-auto">
               {/* Controls */}
               <button className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full hover:bg-primary/30">Extract Action Items</button>
            </div>
          </div>

          <ScrollArea className="flex-1 pt-20 px-4 pb-4">
            <div className="max-w-3xl mx-auto space-y-6">
              <MessageBubble sender="Customer" text="Hello, we are looking for a completely custom ERP system for our e-commerce." time="10:30 AM" />
              <MessageBubble isSelf sender="Onoo Team" text="Welcome to Onoo! We can definitely build a custom module on top of BrandErp for you." time="10:35 AM" />
              <MessageBubble sender="Customer" text="Can you integrate BrandErp with Shopify?" time="10:42 AM" />
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t border-border bg-black/20">
            <div className="max-w-3xl mx-auto flex items-center">
               <input disabled type="text" placeholder="Imported chat is read-only. Ask the Boss Agent instead..." className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-muted-foreground" />
            </div>
          </div>
        </div>
        
        <MobileToolbar />
      </main>
    </div>
  )
}

function ChatItem({ name, source, preview, time }: { name: string, source: string, preview: string, time: string }) {
  const isBusiness = source.includes('BUSINESS')
  return (
    <button className="w-full text-left p-3 rounded-lg hover:bg-white/5 transition-colors flex items-start gap-3">
      <Avatar className="w-10 h-10 mt-0.5">
        <AvatarFallback>{name.slice(0,2)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-1">
          <h4 className="font-medium text-sm truncate">{name}</h4>
          <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{time}</span>
        </div>
        <p className="text-xs text-muted-foreground truncate">{preview}</p>
        <span className={`text-[10px] uppercase font-bold mt-1 inline-block ${isBusiness ? 'text-blue-400' : 'text-green-400'}`}>{source.split('_')[0]}</span>
      </div>
    </button>
  )
}

function MessageBubble({ sender, text, time, isSelf }: { sender: string, text: string, time: string, isSelf?: boolean }) {
  return (
    <div className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}>
      <span className="text-xs text-muted-foreground mb-1 ml-1">{sender} â {time}</span>
      <div className={`p-3 rounded-2xl max-w-[80%] ${isSelf ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-white/10 text-foreground rounded-tl-sm glass-panel'}`}>
        <p className="text-sm">{text}</p>
      </div>
    </div>
  )
}
