"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip,
} from "recharts";

export type RadarAxis = { axis: string; value: number; baseline: number };

export function PerformanceRadar({ axes }: { axes: RadarAxis[] }) {
  return (
    <Card className="card-neon h-full">
      <CardHeader>
        <CardTitle className="text-sm">Performance Radar</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart data={axes} outerRadius="75%">
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis dataKey="axis"
              tick={{ fontSize: 11, fill: "hsl(var(--foreground))" }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]}
              tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 12, fontSize: 12,
              }}
            />
            <Radar name="Baseline" dataKey="baseline"
                   stroke="hsl(var(--muted-foreground))"
                   fill="hsl(var(--muted-foreground))" fillOpacity={0.1} />
            <Radar name="Agora" dataKey="value"
                   stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.35} />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
