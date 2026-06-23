"use client";
import { useEffect, useState } from "react";
import { FreddyClient, HealthMetric } from "@/lib/mcp/freddy-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from "recharts";
import { Footprints, Flame, Target, TrendingUp, Loader2 } from "lucide-react";

export default function StepsPage() {
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
  
  // Extrair passos e calorias dos últimos 7 dias
  const last7Days = allHealth.filter((m: HealthMetric) => {
    const daysAgo = (Date.now() - new Date(m.date).getTime()) / (1000 * 60 * 60 * 24);
    return daysAgo <= 7;
  });

  const stepsMetrics = last7Days.filter((m: HealthMetric) => m.metric === 'daily_steps');
  const caloriesMetrics = last7Days.filter((m: HealthMetric) => m.metric.includes('activeKilocalories'));
  const activeTimeMetrics = last7Days.filter((m: HealthMetric) => m.metric.includes('activeTimeInSeconds'));

  // Hoje
  const todaySteps = stepsMetrics.length > 0 ? stepsMetrics[stepsMetrics.length - 1].value : 0;
  const todayCalories = caloriesMetrics.length > 0 ? caloriesMetrics[caloriesMetrics.length - 1].value : 0;
  const todayActiveTime = activeTimeMetrics.length > 0 ? activeTimeMetrics[activeTimeMetrics.length - 1].value : 0;

  // Média
  const avgSteps = stepsMetrics.length > 0 
    ? stepsMetrics.reduce((s: number, m: HealthMetric) => s + m.value, 0) / stepsMetrics.length 
    : 0;
  const totalCalories = caloriesMetrics.reduce((s: number, m: HealthMetric) => s + m.value, 0);

  // Dados para gráfico
  const chartData = stepsMetrics.map((m: HealthMetric) => ({
    date: new Date(m.date).toLocaleDateString("pt-PT", { day: '2-digit', month: '2-digit' }),
    steps: m.value,
  }));

  const goal = 10000;
  const goalPercent = Math.min(100, (todaySteps / goal) * 100);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl md:text-4xl font-bold">Passos & NEAT 👣</h1>
        <p className="text-sm text-muted-foreground mt-1">Dados reais do teu Garmin fenix 7</p>
      </header>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard
          icon={<Footprints className="w-5 h-5 text-primary" />}
          label="Passos Hoje"
          value={todaySteps.toLocaleString()}
          trend={`${goalPercent.toFixed(0)}% do objetivo`}
          positive={todaySteps >= goal}
        />
        <KpiCard
          icon={<Target className="w-5 h-5 text-accent" />}
          label="Média 7d"
          value={Math.round(avgSteps).toLocaleString()}
          trend="passos/dia"
          positive={avgSteps >= goal}
        />
        <KpiCard
          icon={<Flame className="w-5 h-5 text-warning" />}
          label="Calorias Ativas"
          value={Math.round(todayCalories).toString()}
          unit="kcal"
          trend={`Total 7d: ${Math.round(totalCalories)} kcal`}
          positive
        />
        <KpiCard
          icon={<TrendingUp className="w-5 h-5 text-primary" />}
          label="Tempo Ativo"
          value={todayActiveTime > 0 ? `${Math.round(todayActiveTime / 60)}` : '--'}
          unit="min"
          trend="hoje"
          positive={todayActiveTime > 30 * 60}
        />
      </div>

      {/* Progresso do dia */}
      <section>
        <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
          Progresso Diário
        </h2>
        <Card className="card-neon">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm text-muted-foreground">Objetivo de hoje</div>
                <div className="text-3xl font-bold tabular-nums">
                  {todaySteps.toLocaleString()} <span className="text-lg text-muted-foreground">/ {goal.toLocaleString()}</span>
                </div>
              </div>
              <Badge variant="outline" className={`text-sm ${goalPercent >= 100 ? 'bg-accent/10 text-accent border-accent/30' : 'bg-warning/10 text-warning border-warning/30'}`}>
                {goalPercent.toFixed(0)}%
              </Badge>
            </div>
            <div className="h-3 bg-border rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${goalPercent >= 100 ? 'bg-gradient-to-r from-primary to-accent' : 'bg-gradient-to-r from-primary to-warning'}`}
                style={{ width: `${goalPercent}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              {todaySteps >= goal 
                ? "🎉 Objetivo atingido!" 
                : `Faltam ${(goal - todaySteps).toLocaleString()} passos para atingir o objetivo`}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Histórico semanal */}
      <section>
        <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
          Passos · Últimos 7 dias
        </h2>
        <Card className="card-neon">
          <CardContent className="p-5">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData}>
                  <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                    formatter={(value: number) => [value.toLocaleString(), "Passos"]}
                  />
                  <ReferenceLine y={goal} stroke="hsl(var(--warning))" strokeDasharray="3 3" label={{ value: "Objetivo", fill: "hsl(var(--warning))", fontSize: 10 }} />
                  <Bar dataKey="steps" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-muted-foreground">
                Sem dados de passos disponíveis
              </div>
            )}
          </CardContent>
        </Card>
      </section>
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