"use client";
import { useEffect, useState } from "react";
import { FreddyClient, HealthMetric } from "@/lib/mcp/freddy-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Moon, Brain, Zap, TrendingUp, Loader2, AlertCircle } from "lucide-react";

export default function SleepPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      const accessToken = document.cookie.split("; ").find(row => row.startsWith("access_token="))?.split("=")[1];
      if (!accessToken) { setLoading(false); return; }

      try {
        const client = new FreddyClient(accessToken);
        await client.connect();
        const health = await client.getAllHealthMetrics(30);
        setData({ health });
        await client.disconnect();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>;
  if (!data) return <div className="p-8 text-center">Login necessário</div>;

  const allHealth = data.health || [];
  
  // Verificar se há dados de sono
  const sleepMetrics = allHealth.filter((m: HealthMetric) => 
    m.metric.toLowerCase().includes('sleep')
  );

  // Métricas relacionadas (stress, FC repouso como proxy)
  const last7Days = allHealth.filter((m: HealthMetric) => {
    const daysAgo = (Date.now() - new Date(m.date).getTime()) / (1000 * 60 * 60 * 24);
    return daysAgo <= 7;
  });

  const stressMetrics = last7Days.filter((m: HealthMetric) => m.metric.includes('averageStressLevel'));
  const minHRMetrics = last7Days.filter((m: HealthMetric) => m.metric.includes('minHeartRate'));

  const avgStress = stressMetrics.length > 0 
    ? stressMetrics.reduce((s: number, m: HealthMetric) => s + m.value, 0) / stressMetrics.length 
    : null;
  const latestMinHR = minHRMetrics.length > 0 ? minHRMetrics[minHRMetrics.length - 1].value : null;

  // Estimar readiness baseado em FC repouso e stress
  const readinessScore = Math.round(
    (latestMinHR ? Math.max(0, 100 - latestMinHR) : 50) * 0.6 +
    (avgStress ? Math.max(0, 100 - avgStress) : 50) * 0.4
  );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl md:text-4xl font-bold">Sono & Recuperação 🌙</h1>
        <p className="text-sm text-muted-foreground mt-1">Dados reais do teu Garmin fenix 7</p>
      </header>

      {/* Aviso sobre dados de sono */}
      {sleepMetrics.length === 0 && (
        <Card className="card-neon bg-warning/5 border-warning/20">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-sm">Dados de sono não disponíveis</div>
              <p className="text-xs text-muted-foreground mt-1">
                O teu plano FREE do freddy.coach não expõe dados detalhados de sono. 
                Para aceder a fases do sono, duração e score, considera atualizar para o plano PRO.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPIs de recuperação (proxies) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard
          icon={<Moon className="w-5 h-5 text-primary" />}
          label="Readiness Score"
          value={readinessScore.toString()}
          trend={readinessScore >= 70 ? "Óptimo" : readinessScore >= 40 ? "Moderado" : "Baixo"}
          positive={readinessScore >= 70}
        />
        <KpiCard
          icon={<TrendingUp className="w-5 h-5 text-accent" />}
          label="FC Repouso"
          value={latestMinHR ? Math.round(latestMinHR).toString() : '--'}
          unit="bpm"
          trend={latestMinHR && latestMinHR < 60 ? "Excelente" : "Normal"}
          positive={latestMinHR ? latestMinHR < 60 : false}
        />
        <KpiCard
          icon={<Zap className="w-5 h-5 text-warning" />}
          label="Stress Médio"
          value={avgStress ? Math.round(avgStress).toString() : '--'}
          trend={avgStress && avgStress < 30 ? "Baixo" : avgStress && avgStress < 50 ? "Moderado" : "Alto"}
          positive={avgStress ? avgStress < 30 : false}
        />
        <KpiCard
          icon={<Brain className="w-5 h-5 text-accent" />}
          label="Recuperação"
          value={readinessScore >= 70 ? "Alta" : readinessScore >= 40 ? "Média" : "Baixa"}
          trend="Baseada em FC e stress"
          positive={readinessScore >= 70}
        />
      </div>

      {/* Gráfico de Stress */}
      <section>
        <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
          Stress · Últimos 7 dias
        </h2>
        <Card className="card-neon">
          <CardContent className="p-5">
            {stressMetrics.length > 0 ? (
              <div className="space-y-2">
                {stressMetrics.map((m: HealthMetric, i: number) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-16">
                      {new Date(m.date).toLocaleDateString("pt-PT", { day: '2-digit', month: '2-digit' })}
                    </span>
                    <div className="flex-1 h-6 bg-border rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all"
                        style={{ 
                          width: `${Math.min(100, m.value)}%`,
                          background: m.value < 25 ? "hsl(var(--accent))" : m.value < 50 ? "hsl(var(--warning))" : "hsl(var(--danger))"
                        }}
                      />
                    </div>
                    <span className="text-xs font-bold tabular-nums w-8 text-right">{m.value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                Sem dados de stress disponíveis
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Explicação */}
      <Card className="card-neon bg-accent/5 border-accent/20">
        <CardContent className="p-4">
          <div className="text-xs text-muted-foreground">
            <strong className="text-foreground">💡 Nota:</strong> O Readiness Score é calculado com base na FC de repouso (peso 60%) e nível de stress (peso 40%). 
            Valores mais altos indicam melhor recuperação e prontidão para treino.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function KpiCard({ icon, label, value, unit, trend, positive }: any) {
  return (
    <Card className="card-neon">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-3">
          {icon}
          <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold tabular-nums">{value}</span>
          {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
        </div>
        <div className={`text-xs mt-2 ${positive ? "text-accent" : "text-muted-foreground"}`}>
          {trend}
        </div>
      </CardContent>
    </Card>
  );
}