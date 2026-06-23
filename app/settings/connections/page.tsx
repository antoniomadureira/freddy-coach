"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle, ExternalLink, Loader2 } from "lucide-react";

export default function ConnectionsPage() {
  const [mcpUrl, setMcpUrl] = useState("");
  const [mcpToken, setMcpToken] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedUrl = localStorage.getItem("freddy_mcp_url");
    const savedToken = localStorage.getItem("freddy_mcp_token");
    if (savedUrl && savedToken) {
      setMcpUrl(savedUrl);
      setMcpToken(savedToken);
      setIsConnected(true);
    }
  }, []);

  const testConnection = async () => {
    if (!mcpUrl || !mcpToken) {
      toast.error("Preenche a URL e o token");
      return;
    }

    setIsTesting(true);
    try {
      const { createFreddyClient } = await import("@/lib/mcp/freddy-client");
      const client = await createFreddyClient(mcpUrl, mcpToken);
      
      await client.getHealthMetrics();
      await client.disconnect();
      
      toast.success("Conexão testada com sucesso!");
      setIsConnected(true);
    } catch (error) {
      toast.error("Falha na conexão. Verifica a URL e o token.");
      console.error(error);
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = async () => {
    if (!mcpUrl || !mcpToken) {
      toast.error("Preenche todos os campos");
      return;
    }

    setIsSaving(true);
    try {
      localStorage.setItem("freddy_mcp_url", mcpUrl);
      localStorage.setItem("freddy_mcp_token", mcpToken);
      
      toast.success("Configuração guardada com sucesso!");
      
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (error) {
      toast.error("Erro ao guardar configuração");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem("freddy_mcp_url");
    localStorage.removeItem("freddy_mcp_token");
    setMcpUrl("");
    setMcpToken("");
    setIsConnected(false);
    toast.info("Conexão removida");
  };

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Conexões de Dados</h1>
        <p className="text-muted-foreground">
          Configura a ligação ao freddy.coach para aceder aos teus dados reais
        </p>
      </div>

      <div className="space-y-6">
        {/* Step 1 */}
        <div className="p-6 card-neon rounded-xl space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              1
            </div>
            <h2 className="text-xl font-semibold">Cria conta no freddy.coach</h2>
          </div>
          <p className="text-sm text-muted-foreground ml-11">
            Vai a{" "}
            <a 
              href="https://freddy.coach" 
              target="_blank" 
              className="text-primary inline-flex items-center gap-1 hover:underline"
            >
              freddy.coach <ExternalLink className="w-3 h-3" />
            </a>{" "}
            e cria uma conta gratuita.
          </p>
        </div>

        {/* Step 2 */}
        <div className="p-6 card-neon rounded-xl space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              2
            </div>
            <h2 className="text-xl font-semibold">Conecta o teu Garmin</h2>
          </div>
          <p className="text-sm text-muted-foreground ml-11">
            No freddy.coach, vai a "Connect Sources" e autoriza o Garmin.
            Podes também conectar Oura, WHOOP, Polar, Apple Health, etc.
          </p>
        </div>

        {/* Step 3 */}
        <div className="p-6 card-neon rounded-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              3
            </div>
            <h2 className="text-xl font-semibold">Configura a Conexão</h2>
            {isConnected && (
              <CheckCircle className="w-5 h-5 text-accent ml-auto" />
            )}
          </div>
          
          <p className="text-sm text-muted-foreground ml-11 mb-4">
            No dashboard do freddy.coach, copia a tua URL MCP e token. Cola aqui:
          </p>
          
          <div className="ml-11 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                MCP URL
              </label>
              <input
                type="text"
                value={mcpUrl}
                onChange={(e) => setMcpUrl(e.target.value)}
                placeholder="https://freddy.coach/mcp"
                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Ex: https://freddy.coach/mcp
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                MCP Token
              </label>
              <input
                type="password"
                value={mcpToken}
                onChange={(e) => setMcpToken(e.target.value)}
                placeholder="Teu token de acesso"
                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Token de autorização do freddy.coach
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={testConnection}
                disabled={isTesting || !mcpUrl || !mcpToken}
                className="px-4 py-2.5 border border-border rounded-lg font-medium hover:bg-accent/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isTesting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    A testar...
                  </span>
                ) : (
                  "Testar Conexão"
                )}
              </button>

              <button
                onClick={handleSave}
                disabled={isSaving || !mcpUrl || !mcpToken}
                className="flex-1 py-2.5 bg-primary text-background rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving ? "A guardar..." : "Guardar e Ir para Dashboard"}
              </button>

              {isConnected && (
                <button
                  onClick={handleDisconnect}
                  className="px-4 py-2.5 border border-danger text-danger rounded-lg font-medium hover:bg-danger/10 transition-colors"
                >
                  Desconectar
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-6 bg-accent/5 border border-accent/20 rounded-xl">
          <h3 className="font-semibold mb-2 text-accent">💡 Dica</h3>
          <p className="text-sm text-muted-foreground">
            O freddy.coach oferece um plano gratuito com acesso a 1 source e 7 dias de histórico.
            Os planos pagos desbloqueiam mais sources e histórico ilimitado.
          </p>
        </div>
      </div>
    </div>
  );
}