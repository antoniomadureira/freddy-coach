import { CoachChat } from "@/components/ai-coach/coach-chat";

export default function AICoachPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto">
      <header className="p-4 md:p-6 border-b border-border">
        <h1 className="text-2xl md:text-3xl font-bold">AI Coach 🧠</h1>
        <p className="text-sm text-muted-foreground mt-1">
          O teu treinador pessoal com memória de contexto e insights em tempo real
        </p>
      </header>
      <CoachChat />
    </div>
  );
}
