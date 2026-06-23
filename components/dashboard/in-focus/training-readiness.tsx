import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Props = {
  data: {
    score: number;
    label: "Low" | "Moderate" | "Optimal";
    sub: { sleep: number; hrv: number; acuteLoad: number };
  };
};

const labelColor = {
  Low: "text-danger bg-danger/10 border-danger/30",
  Moderate: "text-warning bg-warning/10 border-warning/30",
  Optimal: "text-accent bg-accent/10 border-accent/30",
} as const;

export function TrainingReadiness({ data }: Props) {
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (data.score / 100) * circumference;

  return (
    <Card className="card-neon">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Training Readiness</CardTitle>
        <Badge variant="outline" className={cn("text-[10px]", labelColor[data.label])}>
          {data.label}
        </Badge>
      </CardHeader>
      <CardContent className="flex items-center gap-6">
        <div className="relative w-32 h-32 shrink-0">
          <svg viewBox="0 0 120 120" className="-rotate-90 w-full h-full">
            <circle cx="60" cy="60" r="54" stroke="hsl(var(--border))" strokeWidth="10" fill="none" />
            <circle cx="60" cy="60" r="54" stroke="hsl(var(--primary))" strokeWidth="10" fill="none"
                    strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
                    style={{ transition: "stroke-dashoffset .8s ease" }} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold">{data.score}</span>
            <span className="text-[10px] text-muted-foreground">/ 100</span>
          </div>
        </div>
        <div className="flex-1 space-y-2 text-sm">
          <Row label="Sleep" value={data.sub.sleep} />
          <Row label="HRV Status" value={data.sub.hrv} />
          <Row label="Acute Load" value={data.sub.acuteLoad} />
        </div>
      </CardContent>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <div className="w-20 h-1.5 bg-border rounded-full overflow-hidden">
          <div className="h-full bg-primary" style={{ width: `${value}%` }} />
        </div>
        <span className="tabular-nums w-8 text-right">{value}</span>
      </div>
    </div>
  );
}
