"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area, AreaChart,
} from "recharts";
import { Heart, TrendingUp, Activity } from "lucide-react";

export default function HeartRatePage() {
  const mockData = getMockData();

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl md:text-4xl font-bold">Frequência Cardíaca ❤️</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Zonas de treino, FC em repouso e evolução do VO₂ Max
        </p>
      </header>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard
          icon={<Heart className="w-5 h-5 text-danger" />}
          label="FC em Repouso"
          value="52"
          unit="bpm"
          trend="-2 vs mês anterior"
          positive
        />
        <KpiCard
          icon={<Activity className="w-5 h-5 text-primary" />}
          label="VO₂ Max"
          value="54.2"
          unit="ml/kg/min"
          trend="+1.3 este ano"
          positive
        />
        <KpiCard
          icon={<TrendingUp className="w-5 h-5 text-accent" />}
          label="HRV (7d média)"
          value="68"
          unit="ms"
          trend="Estável"
          positive
        />
      </div>

      {/* Zonas de FC */}
      <section>
        <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
          Zonas de Frequência Cardíaca
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {mockData.zones.map((zone) => (
            <ZoneCard key={zone.zone} {...zone} />
          ))}
        </div>
      </section>

      {/* Gráfico RHR */}
      <section>
        <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
          FC em Repouso · Últimos 30 dias
        </h2>
        <Card className="card-neon">
          <CardContent className="p-5">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={mockData.rhrHistory}>
                <defs>
                  <linearGradient id="rhrGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  domain={[45, 60]}
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
                />
                <Area
                  type="monotone"
                  dataKey="rhr"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#rhrGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      {/* VO2 Max Evolution */}
      <section>
        <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
          Evolução VO₂ Max · Últimos 12 meses
        </h2>
        <Card className="card-neon">
          <CardContent className="p-5">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={mockData.vo2History}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  domain={[50, 56]}
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
                />
                <Line
                  type="monotone"
                  dataKey="vo2"
                  stroke="hsl(var(--accent))"
                  strokeWidth={2.5}
                  dot={{ fill: "hsl(var(--accent))", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
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
        <div className={`text-xs mt-2 ${positive ? "text-accent" : "text-danger"}`}>
          {trend}
        </div>
      </CardContent>
    </Card>
  );
}

function ZoneCard({ zone, name, range, minutes, percent, color }: any) {
  return (
    <Card className="card-neon">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="text-[10px]" style={{ borderColor: color, color }}>
            {zone}
          </Badge>
          <span className="text-xs text-muted-foreground">{minutes}min</span>
        </div>
        <div className="text-sm font-medium mb-1">{name}</div>
        <div className="text-xs text-muted-foreground mb-3">{range} bpm</div>
        <div className="h-1.5 bg-border rounded-full overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${percent}%`, background: color }} />
        </div>
        <div className="text-xs text-muted-foreground mt-1">{percent}% do tempo</div>
      </CardContent>
    </Card>
  );
}

function getMockData() {
  return {
    zones: [
      { zone: "Z1", name: "Recuperação", range: "100-120", minutes: 45, percent: 15, color: "#60a5fa" },
      { zone: "Z2", name: "Aeróbico", range: "120-140", minutes: 120, percent: 40, color: "#34d399" },
      { zone: "Z3", name: "Tempo", range: "140-160", minutes: 60, percent: 20, color: "#fbbf24" },
      { zone: "Z4", name: "Limiar", range: "160-175", minutes: 45, percent: 15, color: "#fb923c" },
      { zone: "Z5", name: "Máximo", range: "175-195", minutes: 30, percent: 10, color: "#f87171" },
    ],
    rhrHistory: Array.from({ length: 30 }, (_, i) => ({
      date: `${i + 1}`,
      rhr: +(50 + Math.sin(i / 5) * 3 + Math.random() * 2).toFixed(1),
    })),
    vo2History: [
      { month: "Jul", vo2: 51.2 },
      { month: "Ago", vo2: 51.8 },
      { month: "Set", vo2: 52.1 },
      { month: "Out", vo2: 52.6 },
      { month: "Nov", vo2: 53.0 },
      { month: "Dez", vo2: 53.2 },
      { month: "Jan", vo2: 53.5 },
      { month: "Fev", vo2: 53.8 },
      { month: "Mar", vo2: 54.0 },
      { month: "Abr", vo2: 54.1 },
      { month: "Mai", vo2: 54.2 },
      { month: "Jun", vo2: 54.2 },
    ],
  };
}