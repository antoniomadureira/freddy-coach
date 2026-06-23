import { Card, CardContent } from "@/components/ui/card";
import { Activity, TrendingUp, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = { tsb: number; advice: string };

export function TsbBanner({ tsb, advice }: Props) {
  const state =
    tsb >= 15 ? { label: "Frescura de prova", tone: "accent", Icon: Activity } :
    tsb >= 0  ? { label: "Forma Óptima",    tone: "accent", Icon: TrendingUp } :
    tsb >= -10? { label: "Carga Neutra",    tone: "primary", Icon: Activity } :
    tsb >= -30? { label: "Overreach funcional", tone: "warning", Icon: Flame } :
                { label: "Risco de overreaching", tone: "danger", Icon: Flame };

  const pct = Math.max(0, Math.min(100, ((tsb + 40) / 70) * 100));

  return (
    <Card className="card-neon overflow-hidden">
      <CardContent className="p-5">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-11 h-11 rounded-xl flex items-center justify-center",
              state.tone === "accent" && "bg-accent/10 text-accent",
              state.tone === "primary" && "bg-primary/10 text-primary",
              state.tone === "warning" && "bg-warning/10 text-warning",
              state.tone === "danger" && "bg-danger/10 text-danger",
            )}>
              <state.Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Forma (TSB)</div>
              <div className="text-2xl font-bold tabular-nums">
                {tsb > 0 ? "+" : ""}{tsb.toFixed(1)}
                <span className="ml-3 text-sm font-medium text-foreground/80">
                  {state.label}
                </span>
              </div>
            </div>
          </div>
          <p className="md:ml-auto md:max-w-md text-sm text-muted-foreground">
            {advice}
          </p>
        </div>

        <div className="mt-5 relative h-2 rounded-full overflow-hidden"
             style={{
               background: "linear-gradient(90deg, hsl(var(--danger)), hsl(var(--warning)) 35%, hsl(var(--primary)) 55%, hsl(var(--accent)))"
             }}>
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white ring-2 ring-foreground shadow-lg"
               style={{ left: `${pct}%` }} />
        </div>
        <div className="mt-1.5 flex justify-between text-[10px] text-muted-foreground uppercase tracking-wider">
          <span>Overreach</span><span>Neutro</span><span>Óptimo</span><span>Frescura</span>
        </div>
      </CardContent>
    </Card>
  );
}
