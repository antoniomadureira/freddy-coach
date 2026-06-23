import { PBCard } from "@/components/records/pb-card";
import { RaceCalendar } from "@/components/records/race-calendar";
import { PBEvolutionChart } from "@/components/records/pb-evolution-chart";
import { projectPB } from "@/lib/analytics/projection";

export default async function RecordsPage() {
  const mockData = getMockData();

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl md:text-4xl font-bold">Recordes & Provas 🏆</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Os teus personal bests e calendário de competições
        </p>
      </header>

      <section>
        <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
          Personal Bests
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockData.pbs.map((pb) => {
            const projection = projectPB(pb.time, getDistanceKm(pb.distance), 42.195, 4.0);
            return (
              <PBCard
                key={pb.distance}
                distance={pb.distance}
                time={pb.time}
                date={pb.date}
                event={pb.event}
                pace={pb.pace}
                projection={pb.distance !== "marathon" ? projection : undefined}
              />
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
          Evolução Temporal
        </h2>
        <PBEvolutionChart data={mockData.pbHistory} />
      </section>

      <section>
        <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
          Calendário de Provas
        </h2>
        <RaceCalendar races={mockData.races} />
      </section>
    </div>
  );
}

function getDistanceKm(distance: string): number {
  const map: Record<string, number> = { "5k": 5, "10k": 10, half: 21.0975, marathon: 42.195 };
  return map[distance] ?? 10;
}

function getMockData() {
  return {
    pbs: [
      { distance: "5k" as const, time: 1080, date: "2025-09-15", event: "Corrida do Tejo", pace: 216 },
      { distance: "10k" as const, time: 2280, date: "2025-10-20", event: "Ponte 25 de Abril", pace: 228 },
      { distance: "half" as const, time: 4980, date: "2025-11-10", event: "Meia de Lisboa", pace: 236.5 },
      { distance: "marathon" as const, time: 10680, date: "2025-04-07", event: "Maratona de Sevilla", pace: 253.5 },
    ],
    pbHistory: [
      { date: "2024-03-01", time: 5400, distance: "half" },
      { date: "2024-06-15", time: 5280, distance: "half" },
      { date: "2024-09-20", time: 5100, distance: "half" },
      { date: "2025-02-10", time: 5040, distance: "half" },
      { date: "2025-11-10", time: 4980, distance: "half" },
    ],
    races: [
      {
        id: "1",
        name: "Maratona de Lisboa",
        date: "2026-04-06",
        distance: "marathon",
        location: "Lisboa, Portugal",
        status: "upcoming" as const,
        goal: { time: 10440, pace: 248 },
      },
      {
        id: "2",
        name: "Meia de Cascais",
        date: "2026-02-15",
        distance: "half",
        location: "Cascais, Portugal",
        status: "upcoming" as const,
        goal: { time: 4860, pace: 230.8 },
      },
      {
        id: "3",
        name: "São Silvestre de Lisboa",
        date: "2025-12-31",
        distance: "10k",
        location: "Lisboa, Portugal",
        status: "completed" as const,
        result: { time: 2340, position: 42, pace: 234 },
      },
      {
        id: "4",
        name: "Meia de Lisboa",
        date: "2025-11-10",
        distance: "half",
        location: "Lisboa, Portugal",
        status: "completed" as const,
        result: { time: 4980, position: 18, pace: 236.5 },
      },
    ],
  };
}