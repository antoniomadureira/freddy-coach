import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, TrendingUp } from "lucide-react";

type Props = {
  distance: "5k" | "10k" | "half" | "marathon";
  time: number;
  date: string;
  event?: string;
  pace: number;
  projection?: { time: number; confidence: number };
};

const distanceLabels = {
  "5k": "5K",
  "10k": "10K",
  half: "Meia Maratona",
  marathon: "Maratona",
};

function formatTime(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.round(totalSeconds % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatPace(secondsPerKm: number): string {
  const min = Math.floor(secondsPerKm / 60);
  const sec = Math.round(secondsPerKm % 60);
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

export function PBCard({ distance, time, date, event, pace, projection }: Props) {
  return (
    <Card className="card-neon">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{distanceLabels[distance]}</CardTitle>
        <Trophy className="w-4 h-4 text-warning" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold tabular-nums mb-1">{formatTime(time)}</div>
        <div className="text-xs text-muted-foreground mb-3">
          {formatPace(pace)} /km · {new Date(date).toLocaleDateString("pt-PT")}
        </div>
        {event && (
          <Badge variant="outline" className="text-[10px] mb-3">
            {event}
          </Badge>
        )}
        
        {projection && (
          <div className="mt-3 pt-3 border-t border-border">
            <div className="flex items-center gap-1 text-xs text-accent mb-1">
              <TrendingUp className="w-3 h-3" />
              <span className="font-medium">Projeção atual</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold tabular-nums">{formatTime(projection.time)}</span>
              <span className="text-[10px] text-muted-foreground">
                ({projection.confidence}% confiança)
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}