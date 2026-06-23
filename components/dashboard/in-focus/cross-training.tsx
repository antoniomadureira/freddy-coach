import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell } from "lucide-react";

type Props = { sessions: number; minutes: number; focus: string };

export function CrossTraining({ data }: { data: Props }) {
  return (
    <Card className="card-neon">
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <Dumbbell className="w-4 h-4 text-warning" />
        <CardTitle className="text-sm font-medium">Cross-Training</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <div className="text-[10px] uppercase text-muted-foreground">Sessões</div>
            <div className="text-2xl font-bold tabular-nums">{data.sessions}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase text-muted-foreground">Minutos</div>
            <div className="text-2xl font-bold tabular-nums">{data.minutes}</div>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">Foco: <span className="text-foreground">{data.focus}</span></div>
      </CardContent>
    </Card>
  );
}
