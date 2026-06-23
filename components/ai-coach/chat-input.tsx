"use client";
import { useState } from "react";
import { Send, Mic, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  onSend: (message: string) => void;
  disabled?: boolean;
};

const quickPrompts = [
  "Como devo treinar hoje?",
  "Sugere um pace para um longo de 25km",
  "Estou pronto para uma maratona?",
  "Analisa a minha recuperação",
];

export function ChatInput({ onSend, disabled }: Props) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;
    onSend(input);
    setInput("");
  };

  return (
    <div className="border-t border-border bg-card/50 backdrop-blur-sm p-4">
      <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
        {quickPrompts.map((p) => (
          <button
            key={p}
            onClick={() => onSend(p)}
            disabled={disabled}
            className="shrink-0 text-xs px-3 py-1.5 rounded-full border border-border bg-background/50 hover:bg-primary/10 hover:border-primary/30 transition-colors disabled:opacity-50"
          >
            <Sparkles className="w-3 h-3 inline mr-1" />
            {p}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pergunta ao teu coach..."
            disabled={disabled}
            className="w-full bg-background border border-border rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
          >
            <Mic className="w-4 h-4" />
          </button>
        </div>
        <Button
          type="submit"
          disabled={disabled || !input.trim()}
          className="px-4 bg-primary hover:bg-primary/90"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}