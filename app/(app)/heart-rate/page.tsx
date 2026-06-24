"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { Heart, TrendingUp, Activity } from "lucide-react";

export default function HeartRatePage() {
  const mockData = getMockData();

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-3">
        <Heart className="h-8 w-8 text-red-500" />
        <div>
          <h1 className="text-3xl font-bold">Frequência Cardíaca</h1>
          <p className="text-muted-foreground">
            Análise de zonas de FC, recuperação e VO₂ Max
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-3">
        <KpiCard
          icon={<Activity className="h-5 w-5 text-blue-500" />}
          label="FC em Repouso"
          value="52"
          unit="bpm"
          trend="-2 vs mês anterior"
          positive
        />
        <KpiCard
          icon={<TrendingUp className="h-5 w-5 text-green-500" />}
          label="VO₂ Max"
          value="54.2"
          unit="ml/kg/min"
          trend="+1.3 este ano"
          positive
        />
        <KpiCard
          icon={<Heart className="h-5 w-5 text-purple-500" />}
          label="HRV (7d média)"
          value="68"
          unit="ms"
          trend="Estável"
          positive
        />
      </div>

      {/* Zonas de FC */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Zonas de Frequência Cardíaca</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {mockData.zones.map((zone) => (
              <ZoneCard key={zone.zone} {...zone} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Gráfico RHR */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            FC em Repouso · Últimos 30 dias
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={mockData.rhrHistory}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis domain={[45, 60]} className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                }}
              />
              <Area
                type="monotone"
                dataKey="rhr"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* VO2 Max Evolution */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            Evolução VO₂ Max · Últimos 12 meses
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockData.vo2History}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis domain={[48, 56]} className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                }}
              />
              <Line
                type="monotone"
                dataKey="vo2"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: "#10b981" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

function KpiCard({ icon, label, value, unit, trend, positive }: any) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">{icon}</div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">{value}</span>
              <span className="text-sm text-muted-foreground">{unit}</span>
            </div>
            <Badge variant={positive ? "default" : "destructive"} className="text-xs">
              {trend}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ZoneCard({ zone, name, range, minutes, percent, color }: any) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-4">
        <div
          className="absolute top-0 left-0 w-1 h-full"
          style={{ backgroundColor: color }}
        />
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge
              className="text-xs"
              style={{ backgroundColor: color, color: "#fff" }}
            >
              {zone}
            </Badge>
            <span className="text-2xl font-bold">{minutes}min</span>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-sm">{name}</p>
            <p className="text-xs text-muted-foreground">{range} bpm</p>
            <p className="text-xs text-muted-foreground">{percent}% do tempo</p>
          </div>
        </div>
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