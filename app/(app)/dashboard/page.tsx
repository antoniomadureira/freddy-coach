"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
} from "recharts";
import {
  Activity,
  TrendingUp,
  Heart,
  Moon,
  Footprints,
  Trophy,
  Clock,
  MapPin,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular fetch de dados - substituir por chamada real ao MCP
    const fetchData = async () => {
      setLoading(true);
      // Aqui entraria a chamada real à API MCP
      // const client = await createRealMCPClient(tokens);
      // const healthData = await client.getHealthMetrics();
      // const activities = await client.getActivities();
      setData(getMockData());
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center space-y-4">
          <Activity className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">A carregar dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral da tua performance e prontidão
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          Última atualização: {new Date().toLocaleDateString("pt-PT")}
        </Badge>
      </div>

      {/* SECÇÃO 1: Painel "In Focus" */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Training Readiness */}
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Training Readiness
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#374151"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    strokeDasharray={`${data?.readiness?.score || 0}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">
                    {data?.readiness?.score || 0}
                  </span>
                  <span className="text-xs text-muted-foreground">/ 100</span>
                </div>
              </div>
              <Badge
                className={
                  (data?.readiness?.score || 0) >= 75
                    ? "bg-green-500"
                    : (data?.readiness?.score || 0) >= 50
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }
              >
                {data?.readiness?.status || "Ótimo"}
              </Badge>
              <div className="grid grid-cols-3 gap-2 w-full text-xs">
                <div className="text-center">
                  <p className="text-muted-foreground">Sono</p>
                  <p className="font-semibold">{data?.readiness?.sleep || 85}%</p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground">HRV</p>
                  <p className="font-semibold">{data?.readiness?.hrv || 72}%</p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground">Carga</p>
                  <p className="font-semibold">{data?.readiness?.load || 68}%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Training Status */}
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Training Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">VO₂ Max</span>
                  <span className="font-semibold">{data?.vo2max || 54.2}</span>
                </div>
                <Progress value={data?.vo2max || 54.2} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Carga Semanal</span>
                  <span className="font-semibold">{data?.weeklyLoad || 420}</span>
                </div>
                <Progress value={(data?.weeklyLoad || 420) / 6} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">HRV Status</span>
                  <span className="font-semibold text-green-500">Estável</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
            </div>
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground mb-2">Últimas 4 semanas</p>
              <ResponsiveContainer width="100%" height={60}>
                <LineChart data={data?.weeklyTrend || []}>
                  <Line
                    type="monotone"
                    dataKey="load"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Running Summary */}
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Running Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Distância</span>
                </div>
                <span className="font-bold">{data?.weeklyDistance || 42.5} km</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Tempo</span>
                </div>
                <span className="font-bold">{data?.weeklyTime || "4:32:15"}</span>
              </div>
              <div className="pt-2">
                <ResponsiveContainer width="100%" height={80}>
                  <BarChart data={data?.dailyDistance || []}>
                    <Bar dataKey="km" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Cross-Training */}
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Cross-Training
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Activity className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Força</p>
                    <p className="text-xs text-muted-foreground">Esta semana</p>
                  </div>
                </div>
                <span className="font-bold">{data?.strengthSessions || 3}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Heart className="h-4 w-4 text-purple-500" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Cardio</p>
                    <p className="text-xs text-muted-foreground">Esta semana</p>
                  </div>
                </div>
                <span className="font-bold">{data?.cardioSessions || 2}</span>
              </div>
            </div>
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground text-center">
                Total: {data?.totalCrossTraining || 5} sessões
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SECÇÃO 2: Comparação YTD vs Ano Anterior */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Comparação Anual (YTD)</h2>
        <div className="grid gap-4 md:grid-cols-5">
          <ComparisonCard
            icon={<Activity className="h-5 w-5" />}
            label="Corridas"
            current={data?.ytd?.runs || 105}
            previous={data?.ytd?.runsPrevious || 87}
            suffix=""
          />
          <ComparisonCard
            icon={<MapPin className="h-5 w-5" />}
            label="Distância"
            current={data?.ytd?.distance || 1566.6}
            previous={data?.ytd?.distancePrevious || 1317.7}
            suffix=" km"
          />
          <ComparisonCard
            icon={<Clock className="h-5 w-5" />}
            label="Tempo"
            current={data?.ytd?.time || "132:43"}
            previous={data?.ytd?.timePrevious || "118:22"}
            suffix=""
            isTime
          />
          <ComparisonCard
            icon={<TrendingUp className="h-5 w-5" />}
            label="Elevação"
            current={data?.ytd?.elevation || 13323}
            previous={data?.ytd?.elevationPrevious || 11245}
            suffix=" m"
          />
          <ComparisonCard
            icon={<Heart className="h-5 w-5" />}
            label="FC Média"
            current={data?.ytd?.avgHR || 137}
            previous={data?.ytd?.avgHRPrevious || 137}
            suffix=" bpm"
          />
        </div>
      </div>

      {/* SECÇÃO 3: Estado de Forma Profundo (TSB / CTL / ATL) */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Estado de Forma</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {/* Banner de Estado */}
          <Card className="col-span-3 bg-gradient-to-r from-green-900/20 to-blue-900/20 border-green-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-green-400">
                    Forma Óptima - TSB +{data?.tsb || 4.0}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Estás numa fase ideal para competições. Mantém a carga atual
                    e foca-te na recuperação.
                  </p>
                </div>
                <Badge className="bg-green-500 text-white">
                  Pronto para competir
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Card: Estado de Forma (TSB) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">TSB (Forma)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <span className="text-4xl font-bold text-green-500">
                  +{data?.tsb || 4.0}
                </span>
                <p className="text-xs text-muted-foreground mt-1">
                  Training Stress Balance
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Overreach</span>
                  <span>Fresco</span>
                </div>
                <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="absolute h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                    style={{
                      left: "0",
                      width: `${((data?.tsb || 4) + 30) / 60 * 100}%`,
                    }}
                  />
                  <div
                    className="absolute h-full w-1 bg-white"
                    style={{
                      left: `${((data?.tsb || 4) + 30) / 60 * 100}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>-30</span>
                  <span>0</span>
                  <span>+30</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-center p-2 bg-muted rounded">
                  <p className="text-muted-foreground">CTL</p>
                  <p className="font-bold">{data?.ctl || 85}</p>
                </div>
                <div className="text-center p-2 bg-muted rounded">
                  <p className="text-muted-foreground">ATL</p>
                  <p className="font-bold">{data?.atl || 81}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card: Gráfico 8 Semanas */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-sm">Evolução CTL/ATL/TSB (8 semanas)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data?.fitnessEvolution || []}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="week" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="ctl"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                    name="Fitness (CTL)"
                  />
                  <Line
                    type="monotone"
                    dataKey="atl"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={false}
                    name="Fadiga (ATL)"
                  />
                  <Line
                    type="monotone"
                    dataKey="tsb"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={false}
                    name="Forma (TSB)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Card: Performance Radar */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle className="text-sm">Radar de Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={data?.radarData || []}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar
                    name="Performance Atual"
                    dataKey="A"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Componente de Comparação YTD
function ComparisonCard({
  icon,
  label,
  current,
  previous,
  suffix,
  isTime = false,
}: any) {
  const diff = isTime
    ? 0
    : typeof current === "number" && typeof previous === "number"
    ? ((current - previous) / previous) * 100
    : 0;
  const isPositive = diff > 0;
  const isNeutral = diff === 0;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            {icon}
            <span className="text-sm">{label}</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold">
                {isTime ? current : current.toFixed(1)}
              </span>
              <span className="text-sm text-muted-foreground">{suffix}</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <span className="text-muted-foreground">vs {previous}</span>
              {!isNeutral && (
                <>
                  {isPositive ? (
                    <ArrowUpRight className="h-3 w-3 text-green-500" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-500" />
                  )}
                  <span className={isPositive ? "text-green-500" : "text-red-500"}>
                    {diff > 0 ? "+" : ""}
                    {diff.toFixed(0)}%
                  </span>
                </>
              )}
              {isNeutral && <Minus className="h-3 w-3 text-muted-foreground" />}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Dados mockados para demonstração
function getMockData() {
  return {
    readiness: {
      score: 78,
      status: "Ótimo",
      sleep: 85,
      hrv: 72,
      load: 68,
    },
    vo2max: 54.2,
    weeklyLoad: 420,
    weeklyDistance: 42.5,
    weeklyTime: "4:32:15",
    strengthSessions: 3,
    cardioSessions: 2,
    totalCrossTraining: 5,
    ytd: {
      runs: 105,
      runsPrevious: 87,
      distance: 1566.6,
      distancePrevious: 1317.7,
      time: "132:43",
      timePrevious: "118:22",
      elevation: 13323,
      elevationPrevious: 11245,
      avgHR: 137,
      avgHRPrevious: 137,
    },
    tsb: 4.0,
    ctl: 85,
    atl: 81,
    weeklyTrend: [
      { week: "W1", load: 380 },
      { week: "W2", load: 420 },
      { week: "W3", load: 450 },
      { week: "W4", load: 420 },
    ],
    dailyDistance: [
      { day: "Seg", km: 8 },
      { day: "Ter", km: 0 },
      { day: "Qua", km: 10 },
      { day: "Qui", km: 6 },
      { day: "Sex", km: 0 },
      { day: "Sáb", km: 12 },
      { day: "Dom", km: 6.5 },
    ],
    fitnessEvolution: [
      { week: "W1", ctl: 78, atl: 75, tsb: 3 },
      { week: "W2", ctl: 80, atl: 78, tsb: 2 },
      { week: "W3", ctl: 82, atl: 82, tsb: 0 },
      { week: "W4", ctl: 83, atl: 80, tsb: 3 },
      { week: "W5", ctl: 84, atl: 79, tsb: 5 },
      { week: "W6", ctl: 85, atl: 81, tsb: 4 },
      { week: "W7", ctl: 85, atl: 80, tsb: 5 },
      { week: "W8", ctl: 85, atl: 81, tsb: 4 },
    ],
    radarData: [
      { subject: "Pace", A: 85, fullMark: 100 },
      { subject: "FC Baixa", A: 78, fullMark: 100 },
      { subject: "Volume", A: 90, fullMark: 100 },
      { subject: "Fitness", A: 85, fullMark: 100 },
      { subject: "Frescura", A: 72, fullMark: 100 },
      { subject: "Elevação", A: 68, fullMark: 100 },
    ],
  };
}