"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";

type PB = { date: string; time: number; distance: string };

export function PBEvolutionChart({ data }: { data: PB[] }) {
  const chartData = data.map((pb) => ({
    date: new Date(pb.date).toLocaleDateString("pt-PT", { month: "short", year: "2-digit" }),
    tempo: +(pb.time / 60).toFixed(1),
    distance: pb.distance,
  }));

  return (
    <Card className="card-neon">
      <CardHeader>
        <CardTitle className="text-sm">Evolução dos PBs · Meia Maratona</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
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
              formatter={(value: number) => [`${value} min`, "Tempo"]}
            />
            <Line
              type="monotone"
              dataKey="tempo"
              stroke="hsl(var(--primary))"
              strokeWidth={2.5}
              dot={{ fill: "hsl(var(--primary))", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}