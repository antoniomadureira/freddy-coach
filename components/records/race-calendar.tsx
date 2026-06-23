import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Target } from "lucide-react";

type Race = {
  id: string;
  name: string;
  date: string;
  distance: string;
  location: string;
  status: "upcoming" | "completed" | "cancelled";
  result?: { time?: number; position?: number; pace?: number };
  goal?: { time?: number; pace?: number };
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

export function RaceCalendar({ races }: { races: Race[] }) {
  const upcoming = races.filter((r) => r.status === "upcoming");
  const past = races.filter((r) => r.status === "completed");

  return (
    <div className="space-y-6">
      {upcoming.length > 0 && (
        <section>
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
            Próximas Provas
          </h3>
          <div className="space-y-3">
            {upcoming.map((race) => (
              <Card key={race.id} className="card-neon">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-semibold">{race.name}</div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(race.date).toLocaleDateString("pt-PT", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {race.location}
                        </span>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/30">
                      {race.distance}
                    </Badge>
                  </div>
                  {race.goal && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <div className="flex items-center gap-1 text-xs text-accent mb-1">
                        <Target className="w-3 h-3" />
                        <span className="font-medium">Objetivo</span>
                      </div>
                      <div className="flex items-baseline gap-3 text-sm">
                        {race.goal.time && (
                          <span className="font-bold tabular-nums">{formatTime(race.goal.time)}</span>
                        )}
                        {race.goal.pace && (
                          <span className="text-muted-foreground">{formatPace(race.goal.pace)} /km</span>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
            Resultados Recentes
          </h3>
          <div className="space-y-2">
            {past.slice(0, 5).map((race) => (
              <div
                key={race.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/50 hover:bg-card transition-colors"
              >
                <div>
                  <div className="text-sm font-medium">{race.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(race.date).toLocaleDateString("pt-PT")} · {race.distance}
                  </div>
                </div>
                <div className="text-right">
                  {race.result?.time && (
                    <div className="text-sm font-bold tabular-nums">{formatTime(race.result.time)}</div>
                  )}
                  {race.result?.position && (
                    <div className="text-xs text-muted-foreground">#{race.result.position}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}