import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  data: { totalKm: number; totalTime: string; daily: { day: string; km: number }[] };
};

export function RunningSummary({ data }: Props) {
  const max = Math.max(...data.daily.map(d => d.km));
  return (
    <Card className="card-neon">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Running · Semana</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-3 mb-4">
          <span className="text-3xl font-bold tabular-nums">{data.totalKm.toFixed(1)}</span>
          <span className="text-sm text-muted-foreground">km · {data.totalTime}</span>
        </div>
        <div className="flex items-end gap-1.5 h-20">
          {data.daily.map((d) => {
            const h = (d.km / max) * 100;
            return (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-t bg-accent/70 hover:bg-accent transition-colors"
                     style={{ height: `${Math.max(5, h)}%` }} title={`${d.km} km`} />
                <span className="text-[9px] text-muted-foreground">{d.day}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
