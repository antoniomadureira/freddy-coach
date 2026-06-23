import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Props = {
  data: { vo2: number; load: string; hrvStatus: string; trend: number[] };
};

export function TrainingStatus({ data }: Props) {
  const max = Math.max(...data.trend);
  const min = Math.min(...data.trend);
  return (
    <Card className="card-neon">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Training Status</CardTitle>
        <Badge variant="outline" className="text-[10px] text-primary border-primary/30">
          {data.load}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <Stat label="VO₂ Max" value={data.vo2.toFixed(1)} />
          <Stat label="HRV" value={data.hrvStatus} small />
          <Stat label="Load" value={data.load} small />
        </div>
        <div className="flex items-end gap-1 h-16">
          {data.trend.map((v, i) => {
            const h = ((v - min) / (max - min || 1)) * 100;
            return (
              <div key={i} className="flex-1 rounded-t bg-primary/60 hover:bg-primary transition-colors"
                   style={{ height: `${Math.max(10, h)}%` }} title={v.toString()} />
            );
          })}
        </div>
        <div className="text-[10px] text-muted-foreground mt-1">Últimas 4 semanas</div>
      </CardContent>
    </Card>
  );
}

function Stat({ label, value, small }: { label: string; value: any; small?: boolean }) {
  return (
    <div>
      <div className="text-[10px] uppercase text-muted-foreground">{label}</div>
      <div className={small ? "text-xs font-medium mt-0.5" : "text-lg font-bold tabular-nums"}>{value}</div>
    </div>
  );
}
