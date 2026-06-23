import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Kpi = { label: string; current: string; previous: string; delta: number; unit?: string };

export function YoYKpiStrip({ data }: { data: Kpi[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {data.map((k) => {
        const up = k.delta >= 0;
        const positive = k.label === "FC Média" ? !up : up;
        return (
          <Card key={k.label} className="card-neon">
            <CardContent className="p-4">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                {k.label}
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-xl md:text-2xl font-bold tabular-nums">
                  {k.current}
                </span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  / {k.previous}{k.unit}
                </span>
              </div>
              <div className={cn(
                "mt-2 inline-flex items-center gap-1 text-xs font-medium",
                positive ? "text-accent" : "text-danger"
              )}>
                {up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                {up ? "+" : ""}{k.delta.toFixed(1)}%
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
