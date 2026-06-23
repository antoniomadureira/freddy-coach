"use client";
import { useState, useRef, useEffect } from "react";
import { ChatMessage, type Message } from "@/components/ai-coach/chat-message";
import { ChatInput } from "@/components/ai-coach/chat-input";
import { Loader2 } from "lucide-react";

export function CoachChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Olá Freddy! 👋 Sou o teu AI Coach.

Com base nas tuas métricas recentes:
- **Training Readiness:** 78/100 (Óptimo)
- **TSB:** +4.0 (Forma ótima)
- **HRV:** Estável

Estou pronto para te ajudar com planos de treino, análise de performance ou estratégias de prova. O que queres saber hoje?`,
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      await new Promise((r) => setTimeout(r, 1500));
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getMockResponse(content),
        timestamp: new Date(),
        metadata: getMockMetadata(content),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Erro ao comunicar com o coach:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isLoading && (
          <div className="flex gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-card border border-border rounded-2xl px-4 py-3 text-sm">
              <span className="text-muted-foreground">A pensar...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput onSend={handleSend} disabled={isLoading} />
    </>
  );
}

function getMockResponse(input: string): string {
  if (input.toLowerCase().includes("treinar") || input.toLowerCase().includes("hoje")) {
    return `Com base no teu **TSB +4.0** e **Readiness 78**, hoje é um dia excelente para qualidade.

Sugiro um **tempo run de 8km** a ritmo de meia maratona:
- **Aquecimento:** 2km fácil (Z2)
- **Principal:** 8km a 4:45/km (Z3/Z4)
- **Arrefecimento:** 2km fácil

Este treino vai manter o teu CTL estável enquanto aproveitas a frescura atual. 💪`;
  }
  if (input.toLowerCase().includes("maratona")) {
    return `Analisando o teu perfil atual:

✅ **Pronto para maratona?** Sim, com ressalvas.

**Pontos fortes:**
- VO₂ Max: 54.2 (excelente)
- Volume semanal: 48km (sólido)
- TSB positivo (frescura)

**Pontos de atenção:**
- Falta um longo de 30km+ (essencial para confiança)
- FC em ritmo de maratona ainda alta (sugiro mais Z2)

**Recomendação:** Agenda um longo de 32km para o próximo fim de semana a 5:20/km.`;
  }
  return `Entendi a tua pergunta. Com base nas tuas métricas recentes e histórico de treinos, posso dar-te uma resposta mais detalhada.

Queres que analise algum aspeto específico como:
- Planos de treino semanais
- Estratégias de prova
- Análise de fadiga
- Projeções de performance`;
}

function getMockMetadata(input: string): Message["metadata"] {
  if (input.toLowerCase().includes("pace") || input.toLowerCase().includes("longo")) {
    return {
      suggestedPace: { zone: "Z2/Z3", pacePerKm: 320 },
    };
  }
  if (input.toLowerCase().includes("ajuste") || input.toLowerCase().includes("plano")) {
    return {
      workoutAdjustment: {
        type: "Redução de volume",
        description: "Dado o teu HRV ligeiramente baixo hoje, sugiro reduzir o longo de domingo de 28km para 22km.",
      },
    };
  }
  return undefined;
}