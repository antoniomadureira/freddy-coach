"use client";
import { useEffect, useState } from "react";
import { FreddyClient, Activity, HealthMetric } from "@/lib/mcp/freddy-client";
import { Loader2, Heart, Activity as ActivityIcon, TrendingUp, Zap, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line } from "recharts";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      const accessToken = document.cookie.split("; ").find(row => row.startsWith("access_token="))?.split("=")[1];
      if (!accessToken) { setLoading(false); return; }

      try {
        const client = new FreddyClient(accessToken);
        await client.connect();
        
        const [profile, activities, health] = await Promise.all([
          client.getProfile(),
          client.getActivities(30),
          client.getAllHealthMetrics(30),
        ]);

        console.log("📊 DADOS RECEBIDOS:");
        console.log("  Atividades:", activities.length);
        console.log("  Health Metrics:", health.length);
        
        const metricTypes = new Set(health.map((m: HealthMetric) => m.metric));
        console.log("  Tipos disponíveis:", Array.from(metricTypes));

        setData({ profile, activities, health });
        await client.disconnect();
      } catch (err) {
        console.error("❌ Error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>;
  if (!data) return <div className="p-8 text-center">Login necessário</div>;

  // ========== PROCESSAR TODOS OS DADOS ==========
  const weekActivities = data.activities?.filter((a: Activity) => {
    const daysAgo = (Date.now() - new Date(a.date).getTime()) / (1000 * 60 * 60 * 24);
    return daysAgo <= 7;
  }) || [];

  const totalDistance = weekActivities.reduce((sum: number, a: Activity) => sum + a.distance, 0) / 1000;
  const totalTime = weekActivities.reduce((sum: number, a: Activity) => sum + a.duration, 0);
  const totalElevation = weekActivities.reduce((sum: number, a: Activity) => sum + (a.elevation || 0), 0);

  // Health metrics - SEM FILTRO de dias para incluir ACWR/CTL/ATL
  const allHealth = data.health || [];

  // Extrair TODAS as métricas disponíveis
  const getLatest = (metricName: string) => {
    const metrics = allHealth.filter(m => m.metric.includes(metricName) && m.value > 0);
    return metrics.length > 0 ? metrics[metrics.length - 1].value : null;
  };

  const getAverage = (metricName: string, days: number = 7) => {
    const cutoffDate = Date.now() - (days * 24 * 60 * 60 * 1000);
    const metrics = allHealth.filter(m => {
      const metricDate = new Date(m.date).getTime();
      return m.metric.includes(metricName) && m.value > 0 && metricDate >= cutoffDate;
    });
    if (metrics.length === 0) return null;
    return metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length;
  };

  // Métricas específicas
  const restingHR = getLatest('minHeartRate');
  const avgHR = getAverage('averageHeartRate');
  const maxHR = getLatest('maxHeartRate');
  
  const acwr = getLatest('dailyAcuteChronicWorkloadRatio');
  const ctl = getLatest('dailyTrainingLoadChronic');
  const atl = getLatest('dailyTrainingLoadAcute');
  const tsb = (ctl && atl) ? (ctl - atl).toFixed(0) : null;
  
  const stressLevel = getAverage('averageStressLevel');
  const steps = getLatest('steps');
  const activeCalories = getLatest('activeKilocalories');

  // VO2 Max estimado
  let estimatedVO2Max = null;
  const runningActivities = weekActivities.filter((a: Activity) => 
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

  // Dados para gráfico de FC
  const hrChartData = Array.from(new Set(allHealth.map(m => m.date))).sort().slice(-7).map(date => ({
    date: new Date(date).toLocaleDateString("pt-PT", { day: '2-digit', month: '2-digit' }),
    resting: allHealth.find(m => m.date === date && m.metric.includes('minHeartRate'))?.value || null,
    avg: allHealth.find(m => m.date === date && m.metric.includes('averageHeartRate'))?.value || null,
    max: allHealth.find(m => m.date === date && m.metric.includes('maxHeartRate'))?.value || null,
  })).filter(d => d.avg !== null);

  // Dados para gráfico de atividades
  const dailyData = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((day, index) => {
    const dayActs = weekActivities.filter((a: Activity) => {
      const actDay = new Date(a.date).getDay();
      return actDay === (index + 1) % 7;
    });
    const distance = dayActs.reduce((sum: number, a: Activity) => sum + a.distance, 0) / 1000;
    return { day, distance };
  });

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-8">
      <header>
        <h1 className="text-3xl md:text-4xl font-bold">Olá, Atleta 👟</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {new Date().toLocaleDateString("pt-PT", { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </header>

      {/* KPIs PRINCIPAIS */}
      <section>
        <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Métricas Principais</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiCard icon={<Heart className="w-5 h-5 text-danger" />} label="FC Repouso" value={restingHR ? `${Math.round(restingHR)}` : '--'} unit="bpm" />
          <KpiCard icon={<Zap className="w-5 h-5 text-primary" />} label="ACWR" value={acwr ? acwr.toFixed(2) : '--'} unit="ratio" />
          <KpiCard icon={<ActivityIcon className="w-5 h-5 text-accent" />} label="Stress" value={stressLevel ? `${Math.round(stressLevel)}` : '--'} unit="avg" />
          <KpiCard icon={<Calendar className="w-5 h-5 text-warning" />} label="Passos" value={steps ? steps.toLocaleString() : '--'} unit="steps" />
        </div>
      </section>

      {/* IN FOCUS */}
      <section>
        <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">In Focus</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Card 1: FC */}
          <Card className="card-neon">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Heart className="w-4 h-4 text-danger" />
                Frequência Cardíaca
              </CardTitle>
              <Badge variant="outline" className="text-accent">
                {restingHR && restingHR < 60 ? 'Excelente' : 'Normal'}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-[10px] uppercase text-muted-foreground mb-1">Repouso</div>
                  <div className="text-2xl font-bold tabular-nums">{restingHR ? Math.round(restingHR) : '--'}</div>
                  <div className="text-xs text-muted-foreground">bpm</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase text-muted-foreground mb-1">Média</div>
                  <div className="text-2xl font-bold tabular-nums">{avgHR ? Math.round(avgHR) : '--'}</div>
                  <div className="text-xs text-muted-foreground">bpm</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase text-muted-foreground mb-1">Máxima</div>
                  <div className="text-2xl font-bold tabular-nums">{maxHR ? Math.round(maxHR) : '--'}</div>
                  <div className="text-xs text-muted-foreground">bpm</div>
                </div>
              </div>
              
              {hrChartData.length > 0 && (
                <ResponsiveContainer width="100%" height={120}>
                  <LineChart data={hrChartData}>
                    <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 9 }} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }} />
                    <Line type="monotone" dataKey="max" stroke="hsl(var(--danger))" strokeWidth={1.5} dot={false} name="Máx" />
                    <Line type="monotone" dataKey="avg" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} name="Média" />
                    <Line type="monotone" dataKey="resting" stroke="hsl(var(--accent))" strokeWidth={1.5} dot={false} name="Repouso" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Card 2: Training Status */}
          <Card className="card-neon">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Training Status
              </CardTitle>
              <Badge variant="outline" className={acwr && acwr >= 0.8 && acwr <= 1.3 ? 'text-accent' : acwr && acwr < 0.8 ? 'text-warning' : 'text-danger'}>
                {acwr ? (acwr <= 1.3 ? 'Produtiva' : 'Overreach') : 'N/A'}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-[10px] uppercase text-muted-foreground mb-1">VO₂ Max</div>
                  <div className="text-2xl font-bold tabular-nums">{estimatedVO2Max || '--'}</div>
                  <div className="text-xs text-muted-foreground">ml/kg/min</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase text-muted-foreground mb-1">ACWR</div>
                  <div className="text-2xl font-bold tabular-nums">{acwr ? acwr.toFixed(2) : '--'}</div>
                  <div className="text-xs text-muted-foreground">ratio</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase text-muted-foreground mb-1">TSB</div>
                  <div className="text-2xl font-bold tabular-nums">{tsb || '--'}</div>
                  <div className="text-xs text-muted-foreground">forma</div>
                </div>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">CTL (Fitness)</span>
                  <span className="font-medium">{ctl ? ctl.toFixed(0) : '--'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ATL (Fadiga)</span>
                  <span className="font-medium">{atl ? atl.toFixed(0) : '--'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Stress Médio</span>
                  <span className="font-medium">{stressLevel ? Math.round(stressLevel) : '--'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Running Weekly */}
          <Card className="card-neon">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <ActivityIcon className="w-4 h-4 text-accent" />
                Running · Semana
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold tabular-nums">{totalDistance.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">km · {Math.floor(totalTime / 3600)}:{String(Math.floor((totalTime % 3600) / 60)).padStart(2, '0')}h</span>
              </div>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={dailyData}>
                  <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }} />
                  <Bar dataKey="distance" radius={[6, 6, 0, 0]}>
                    {dailyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.distance > 0 ? "hsl(var(--accent))" : "hsl(var(--border))"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Card 4: Resumo */}
          <Card className="card-neon">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Resumo 7 Dias
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <MetricRow label="Atividades" value={weekActivities.length.toString()} />
              <MetricRow label="Distância" value={`${totalDistance.toFixed(1)} km`} />
              <MetricRow label="Tempo" value={`${Math.floor(totalTime / 3600)}h ${Math.floor((totalTime % 3600) / 60)}m`} />
              <MetricRow label="Elevação" value={`${Math.round(totalElevation)} m`} />
              <MetricRow label="Calorias" value={activeCalories ? `${Math.round(activeCalories)} kcal` : '--'} />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ATIVIDADES RECENTES */}
      <section>
        <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Atividades Recentes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {weekActivities.slice(0, 3).map((activity: Activity, index: number) => (
            <Card key={index} className="card-neon">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-semibold text-sm">{activity.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(activity.date).toLocaleDateString("pt-PT", { weekday: 'short', day: 'numeric', month: 'short' })}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px]">{activity.type}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <div className="text-muted-foreground">Distância</div>
                    <div className="font-bold">{(activity.distance / 1000).toFixed(2)} km</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Duração</div>
                    <div className="font-bold">{Math.floor(activity.duration / 60)}:{(activity.duration % 60).toString().padStart(2, '0')}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Elevação</div>
                    <div className="font-bold">{activity.elevation?.toFixed(0) || 0} m</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">FC Média</div>
                    <div className="font-bold">{activity.avgHR || '--'} bpm</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

function KpiCard({ icon, label, value, unit }: any) {
  return (
    <Card className="card-neon">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tabular-nums">{value}</span>
          {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
        </div>
      </CardContent>
    </Card>
  );
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-bold tabular-nums">{value}</span>
    </div>
  );
}