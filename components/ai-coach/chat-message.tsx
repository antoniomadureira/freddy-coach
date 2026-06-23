import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  metadata?: {
    suggestedPace?: { zone: string; pacePerKm: number };
    workoutAdjustment?: { type: string; description: string };
  };
};

export function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-3 mb-6", isUser && "flex-row-reverse")}>
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
        isUser ? "bg-primary/20 text-primary" : "bg-accent/20 text-accent"
      )}>
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>
      
      <div className={cn("flex-1 max-w-[80%]", isUser && "text-right")}>
        <div className={cn(
          "inline-block rounded-2xl px-4 py-3 text-sm text-left",
          isUser
            ? "bg-primary/10 text-foreground border border-primary/20"
            : "bg-card border border-border"
        )}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              strong: ({ children }) => <strong className="font-semibold text-primary">{children}</strong>,
              code: ({ children }) => (
                <code className="bg-background/50 px-1.5 py-0.5 rounded text-xs font-mono">
                  {children}
                </code>
              ),
              ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-2">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-2">{children}</ol>,
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        {message.metadata?.suggestedPace && (
          <PaceCard data={message.metadata.suggestedPace} />
        )}
        {message.metadata?.workoutAdjustment && (
          <AdjustmentCard data={message.metadata.workoutAdjustment} />
        )}

        <div className="text-[10px] text-muted-foreground mt-1">
          {message.timestamp.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    </div>
  );
}

function PaceCard({ data }: { data: { zone: string; pacePerKm: number } }) {
  const min = Math.floor(data.pacePerKm / 60);
  const sec = Math.round(data.pacePerKm % 60);
  return (
    <div className="mt-2 inline-flex items-center gap-2 bg-accent/10 border border-accent/30 rounded-lg px-3 py-2 text-xs">
      <span className="text-accent font-medium">🎯 Pace sugerido:</span>
      <span className="font-mono font-bold">{min}:{sec.toString().padStart(2, "0")} /km</span>
      <span className="text-muted-foreground">({data.zone})</span>
    </div>
  );
}

function AdjustmentCard({ data }: { data: { type: string; description: string } }) {
  return (
    <div className="mt-2 bg-warning/10 border border-warning/30 rounded-lg px-3 py-2 text-xs">
      <div className="font-medium text-warning mb-1">⚠️ Ajuste ao plano</div>
      <div className="text-foreground/80">{data.description}</div>
    </div>
  );
}