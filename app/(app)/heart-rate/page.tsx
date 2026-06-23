"use client";
import { useEffect, useState } from "react";
import { FreddyClient, HealthMetric, Activity } from "@/lib/mcp/freddy-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area, AreaChart, Legend,
} from "recharts";
import { Heart, TrendingUp, Activity as ActivityIcon, Loader2 } from "lucide-react";

export default function HeartRatePage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      const accessToken = document.cookie.split("; ").find(row => row.startsWith("access_token="))?.split("=")[1];
      if (!accessToken) { setLoading(false); return; }

      try {
        const client = new FreddyClient(accessToken);
        await client.connect();
        const [health, activities] = await Promise.all([
          client.getAllHealthMetrics(30),
          client.getActivities(30),
        ]);
        setData({ health, activities });
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
  const activities = data.activities || [];

  // FC dos últimos 7 dias
  const last7Days = allHealth.filter((m: HealthMetric) => {
    const daysAgo = (Date.now() - new Date(m.date).getTime()) / (1000 * 60 * 60 * 24);
    return daysAgo <= 7;
  });

  const minHRMetrics = last7Days.filter((m: HealthMetric) => m.metric.includes('minHeartRate'));
  const avgHRMetrics = last7Days.filter((m: HealthMetric) => m.metric.includes('averageHeartRate'));
  const maxHRMetrics = last7Days.filter((m: HealthMetric) => m.metric.includes('maxHeartRate'));

  const latestMinHR = minHRMetrics.length > 0 ? minHRMetrics[minHRMetrics.length - 1].value : null;
  const latestAvgHR = avgHRMetrics.length > 0 ? avgHRMetrics[avgHRMetrics.length - 1].value : null;
  const latestMaxHR = maxHRMetrics.length > 0 ? maxHRMetrics[maxHRMetrics.length - 1].value : null;
  const avgMinHR = minHRMetrics.length > 0 ? minHRMetrics.reduce((s: number, m: HealthMetric) => s + m.value, 0) / minHRMetrics.length : null;

  // VO2 Max estimado
  let estimatedVO2Max = null;
  const runningActivities = activities.filter((a: Activity) => 
    a.type === 'RUNNING' && a.distance >= 1000 && a.duration > 0
  );
  
  if (runningActivities.length > 0) {
    const bestActivity = runningActivities.reduce((best, current) => {
      const paceBest = best.duration / best.distance;
      const paceCurrent = current.duration / current.distance;
      return paceCurrent < paceBest ? current : best;
    });
    
    const paceMinPerKm = (bestActivity.duration / 60) / (bestActivity.distance / 1000);
    if (paceMinPerKm >= 3 && paceMinPerKm <= 10) {
      estimatedVO2Max = Math.round((15.3 - paceMinPerKm) * 3.5 + 35);
      if (estimatedVO2Max < 30 || estimatedVO2Max > 75) {
        if (paceMinPerKm < 5) estimatedVO2Max = 65;
        else if (paceMinPerKm < 6) estimatedVO2Max = 55;
        else estimatedVO2Max = 45;
      }
    }
  }

  // Dados para gráfico de FC (últimos 7 dias)
  const hrChartData = Array.from(new Set(last7Days.map(m => m.date))).sort().map(date => ({
    date: new Date(date).toLocaleDateString("pt-PT", { day: '2-digit', month: '2-digit' }),
    resting: last7Days.find(m => m.date === date && m.metric.includes('minHeartRate'))?.value || null,
    avg: last7Days.find(m => m.date === date && m.metric.includes('averageHeartRate'))?.value || null,
    max: last7Days.find(m => m.date === date && m.metric.includes('maxHeartRate'))?.value || null,
  })).filter(d => d.avg !== null);

  // FC das atividades
  const activityHR = activities.filter((a: Activity) => a.avgHR && a.avgHR > 0);
  const avgActivityHR = activityHR.length > 0 
    ? activityHR.reduce((s: number, a: Activity) => s + (a.avgHR || 0), 0) / activityHR.length 
    : null;

  // Zonas de FC (baseadas em FC Máxima estimada)
  const estimatedMaxHR = latestMaxHR || 190;
  const zones = [
    { zone: "Z1", name: "Recuperação", range: `${Math.round(estimatedMaxHR * 0.5)}-${Math.round(estimatedMaxHR * 0.6)}`, color: "#60a5fa" },
    { zone: "Z2", name: "Aeróbico", range: `${Math.round(estimatedMaxHR * 0.6)}-${Math.round(estimatedMaxHR * 0.7)}`, color: "#34d399" },
    { zone: "Z3", name: "Tempo", range: `${Math.round(estimatedMaxHR * 0.7)}-${Math.round(estimatedMaxHR * 0.8)}`, color: "#fbbf24" },
    { zone: "Z4", name: "Limiar", range: `${Math.round(estimatedMaxHR * 0.8)}-${Math.round(estimatedMaxHR * 0.9)}`, color: "#fb923c" },
    { zone: "Z5", name: "Máximo", range: `${Math.round(estimatedMaxHR * 0.9)}-${Math.round(estimatedMaxHR)}`, color: "#f87171" },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl md:text-4xl font-bold">Frequência Cardíaca ❤️</h1>
        <p className="text-sm text-muted-foreground mt-1">Dados reais do teu Garmin fenix 7</p>
      </header>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard
          icon={<Heart className="w-5 h-5 text-danger" />}
          label="FC Repouso"
          value={latestMinHR ? Math.round(latestMinHR).toString() : '--'}
          unit="bpm"
          trend={avgMinHR ? `Média 7d: ${Math.round(avgMinHR)} bpm` : 'Sem dados'}
          positive={latestMinHR ? latestMinHR < 60 : false}
        />
        <KpiCard
          icon={<ActivityIcon className="w-5 h-5 text-primary" />}
          label="VO₂ Max"
          value={estimatedVO2Max ? estimatedVO2Max.toString() : '--'}
          unit="ml/kg/min"
          trend={runningActivities.length > 0 ? `Baseado em ${runningActivities.length} corrida(s)` : 'Sem dados'}
          positive={estimatedVO2Max ? estimatedVO2Max >= 50 : false}
        />
        <KpiCard
          icon={<TrendingUp className="w-5 h-5 text-accent" />}
          label="FC Atividade"
          value={avgActivityHR ? Math.round(avgActivityHR).toString() : '--'}
          unit="bpm"
          trend={`${activityHR.length} atividade(s) recentes`}
          positive
        />
        <KpiCard
          icon={<ActivityIcon className="w-5 h-5 text-warning" />}
          label="FC Máxima"
          value={latestMaxHR ? Math.round(latestMaxHR).toString() : '--'}
          unit="bpm"
          trend="Último registo"
          positive
        />
      </div>

      {/* Zonas de FC */}
      <section>
        <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
          Zonas de Frequência Cardíaca
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {zones.map((zone) => (
            <ZoneCard key={zone.zone} {...zone} />
          ))}
        </div>
      </section>

      {/* Gráfico FC */}
      <section>
        <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
          Evolução da FC · Últimos 7 dias
        </h2>
        <Card className="card-neon">
          <CardContent className="p-5">
            {hrChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={hrChartData}>
                  <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="max" stroke="hsl(var(--danger))" strokeWidth={2} dot={{ r: 3 }} name="Máxima" />
                  <Line type="monotone" dataKey="avg" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 3 }} name="Média" />
                  <Line type="monotone" dataKey="resting" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ r: 3 }} name="Repouso" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Sem dados de FC disponíveis
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
          <span className="text-sm text-muted-foreground">{unit}</span>
        </div>
        <div className={`text-xs mt-2 ${positive ? "text-accent" : "text-muted-foreground"}`}>
          {trend}
        </div>
      </CardContent>
    </Card>
  );
}

function ZoneCard({ zone, name, range, color }: any) {
  return (
    <Card className="card-neon">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="text-[10px]" style={{ borderColor: color, color }}>
            {zone}
          </Badge>
        </div>
        <div className="text-sm font-medium mb-1">{name}</div>
        <div className="text-xs text-muted-foreground">{range} bpm</div>
        <div className="h-1.5 bg-border rounded-full overflow-hidden mt-2">
          <div className="h-full rounded-full" style={{ background: color, width: '100%' }} />
        </div>
      </CardContent>
    </Card>
  );
}