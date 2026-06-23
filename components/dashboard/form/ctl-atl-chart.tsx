"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ReferenceLine,
} from "recharts";

type Point = { date: string; ctl: number; atl: number; tsb: number };

export function CtlAtlChart({ series }: { series: Point[] }) {
  return (
    <Card className="card-neon h-full">
      <CardHeader>
        <CardTitle className="text-sm">Fitness · Fadiga · Forma (8 semanas)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={series} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                   tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                   tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 12, fontSize: 12,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <ReferenceLine y={0} stroke="hsl(var(--foreground))" strokeOpacity={0.2} />
            <Line type="monotone" dataKey="ctl" name="Fitness (CTL)"
                  stroke="hsl(var(--primary))" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="atl" name="Fadiga (ATL)"
                  stroke="hsl(var(--warning))" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="tsb" name="Forma (TSB)"
                  stroke="hsl(var(--accent))" strokeWidth={2}
                  strokeDasharray="4 4" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
