"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from "recharts";
import { Footprints, Flame, Target, TrendingUp } from "lucide-react";

export default function StepsPage() {
  const mockData = getMockData();

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl md:text-4xl font-bold">Passos & NEAT 👣</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Atividade diária não-desportiva e movimento geral
        </p>
      </header>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard icon={<Footprints className="w-5 h-5 text-primary" />} label="Passos Hoje" value="8,432" trend="84% do objetivo" positive />
        <KpiCard icon={<Target className="w-5 h-5 text-accent" />} label="Objetivo Diário" value="10,000" trend="Personalizado" positive />
        <KpiCard icon={<Flame className="w-5 h-5 text-warning" />} label="Calorias Ativas" value="342" unit="kcal" trend="+12% vs média" positive />
        <KpiCard icon={<TrendingUp className="w-5 h-5 text-primary" />} label="Média Semanal" value="9,128" trend="+520 vs semana anterior" positive />
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
                  8,432 <span className="text-lg text-muted-foreground">/ 10,000</span>
                </div>
              </div>
              <Badge variant="outline" className="text-sm bg-accent/10 text-accent border-accent/30">
                84%
              </Badge>
            </div>
            <div className="h-3 bg-border rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all" style={{ width: "84%" }} />
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Faltam 1,568 passos para atingir o objetivo
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
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={mockData.weeklySteps}>
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
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  formatter={(value: number) => [value.toLocaleString(), "Passos"]}
                />
                <ReferenceLine y={10000} stroke="hsl(var(--warning))" strokeDasharray="3 3" label={{ value: "Objetivo", fill: "hsl(var(--warning))", fontSize: 10 }} />
                <Bar dataKey="steps" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      {/* Distribuição por período */}
      <section>
        <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
          Distribuição por Período do Dia
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {mockData.periods.map((period) => (
            <PeriodCard key={period.name} {...period} />
          ))}
        </div>
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
        <div className={`text-xs mt-2 ${positive ? "text-accent" : "text-danger"}`}>
          {trend}
        </div>
      </CardContent>
    </Card>
  );
}

function PeriodCard({ name, time, steps, percent, icon }: any) {
  return (
    <Card className="card-neon">
      <CardContent className="p-4">
        <div className="text-2xl mb-2">{icon}</div>
        <div className="text-sm font-medium mb-1">{name}</div>
        <div className="text-xs text-muted-foreground mb-2">{time}</div>
        <div className="text-xl font-bold tabular-nums">{steps.toLocaleString()}</div>
        <div className="text-xs text-muted-foreground">{percent}% do total</div>
      </CardContent>
    </Card>
  );
}

function getMockData() {
  return {
    weeklySteps: [
      { day: "Seg", steps: 8200 },
      { day: "Ter", steps: 9500 },
      { day: "Qua", steps: 7800 },
      { day: "Qui", steps: 10200 },
      { day: "Sex", steps: 8900 },
      { day: "Sáb", steps: 11400 },
      { day: "Dom", steps: 8432 },
    ],
    periods: [
      { name: "Manhã", time: "06:00 - 12:00", steps: 3200, percent: 38, icon: "🌅" },
      { name: "Tarde", time: "12:00 - 18:00", steps: 2800, percent: 33, icon: "☀️" },
      { name: "Noite", time: "18:00 - 23:00", steps: 1900, percent: 23, icon: "🌙" },
      { name: "Madrugada", time: "23:00 - 06:00", steps: 532, percent: 6, icon: "🌑" },
    ],
  };
}