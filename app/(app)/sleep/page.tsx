"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import { Moon, Brain, Zap, TrendingUp } from "lucide-react";

export default function SleepPage() {
  const mockData = getMockData();

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl md:text-4xl font-bold">Sono & Recuperação 🌙</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Estágios do sono, qualidade e impacto na prontidão
        </p>
      </header>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard icon={<Moon className="w-5 h-5 text-primary" />} label="Duração Média" value="7h 42m" trend="+12min vs semana anterior" positive />
        <KpiCard icon={<Brain className="w-5 h-5 text-accent" />} label="Sono Profundo" value="1h 28m" trend="18% do total" positive />
        <KpiCard icon={<Zap className="w-5 h-5 text-warning" />} label="Readiness Score" value="82/100" trend="Óptimo" positive />
        <KpiCard icon={<TrendingUp className="w-5 h-5 text-primary" />} label="Body Battery" value="78" trend="+5 vs ontem" positive />
      </div>

      {/* Distribuição de estágios */}
      <section>
        <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
          Distribuição de Estágios · Última Noite
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="card-neon">
            <CardHeader>
              <CardTitle className="text-sm">Composição do Sono</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row items-center gap-6">
              <ResponsiveContainer width={220} height={220}>
                <PieChart>
                  <Pie
                    data={mockData.stages}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {mockData.stages.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3 flex-1">
                {mockData.stages.map((stage: any) => (
                  <div key={stage.name} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ background: stage.color }} />
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between">
                        <span className="text-sm font-medium">{stage.name}</span>
                        <span className="text-sm tabular-nums">{stage.value}h</span>
                      </div>
                      <div className="text-xs text-muted-foreground">{stage.percent}% da noite</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="card-neon">
            <CardHeader>
              <CardTitle className="text-sm">Timeline da Noite</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockData.timeline.map((block: any, i: number) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-16 tabular-nums">{block.time}</span>
                    <div
                      className="flex-1 h-6 rounded flex items-center px-2 text-xs font-medium text-white"
                      style={{ background: block.color }}
                    >
                      {block.stage}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Histórico semanal */}
      <section>
        <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
          Sono · Últimos 7 dias
        </h2>
        <Card className="card-neon">
          <CardContent className="p-5">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={mockData.weeklySleep}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  tickLine={false}
                  axisLine={false}
                  label={{
                    value: "horas",
                    angle: -90,
                    position: "insideLeft",
                    style: { fontSize: 10, fill: "hsl(var(--muted-foreground))" },
                  }}
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="deep" stackId="a" fill="#6366f1" name="Profundo" radius={[0, 0, 0, 0]} />
                <Bar dataKey="rem" stackId="a" fill="#a78bfa" name="REM" radius={[0, 0, 0, 0]} />
                <Bar dataKey="light" stackId="a" fill="#34d399" name="Leve" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function KpiCard({ icon, label, value, trend, positive }: any) {
  return (
    <Card className="card-neon">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-3">
          {icon}
          <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
        </div>
        <div className="text-3xl font-bold tabular-nums">{value}</div>
        <div className={`text-xs mt-2 ${positive ? "text-accent" : "text-danger"}`}>
          {trend}
        </div>
      </CardContent>
    </Card>
  );
}

function getMockData() {
  return {
    stages: [
      { name: "Profundo", value: 1.47, percent: 19, color: "#6366f1" },
      { name: "REM", value: 1.65, percent: 21, color: "#a78bfa" },
      { name: "Leve", value: 4.0, percent: 52, color: "#34d399" },
      { name: "Desperto", value: 0.5, percent: 8, color: "#f87171" },
    ],
    timeline: [
      { time: "23:00", stage: "Adormecer", color: "#6366f1" },
      { time: "23:30", stage: "Leve", color: "#34d399" },
      { time: "00:15", stage: "Profundo", color: "#6366f1" },
      { time: "01:30", stage: "REM", color: "#a78bfa" },
      { time: "02:45", stage: "Leve", color: "#34d399" },
      { time: "03:20", stage: "Profundo", color: "#6366f1" },
      { time: "04:30", stage: "REM", color: "#a78bfa" },
      { time: "06:00", stage: "Leve", color: "#34d399" },
      { time: "06:42", stage: "Despertar", color: "#f87171" },
    ],
    weeklySleep: [
      { day: "Seg", deep: 1.3, rem: 1.5, light: 4.2 },
      { day: "Ter", deep: 1.5, rem: 1.7, light: 4.0 },
      { day: "Qua", deep: 1.2, rem: 1.4, light: 4.5 },
      { day: "Qui", deep: 1.6, rem: 1.8, light: 3.8 },
      { day: "Sex", deep: 1.4, rem: 1.6, light: 4.1 },
      { day: "Sáb", deep: 1.8, rem: 2.0, light: 4.3 },
      { day: "Dom", deep: 1.5, rem: 1.7, light: 4.0 },
    ],
  };
}