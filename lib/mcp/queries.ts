import { createMcpClient } from "./client";
import { z } from "zod";

export const ActivitySchema = z.object({
  id: z.string(),
  type: z.enum(["running", "cycling", "strength", "other"]),
  startTime: z.string().datetime(),
  duration: z.number(),
  distance: z.number(),
  elevationGain: z.number(),
  avgHr: z.number().nullable(),
  avgPace: z.number().nullable(),
  trimp: z.number().optional(),
});
export type Activity = z.infer<typeof ActivitySchema>;

export const HealthSnapshotSchema = z.object({
  date: z.string(),
  restingHr: z.number(),
  hrv: z.number(),
  vo2Max: z.number(),
  trainingReadiness: z.number(),
  trainingStatus: z.string(),
  sleepHours: z.number(),
  sleepStages: z.object({ deep: z.number(), rem: z.number(), light: z.number() }),
  steps: z.number(),
  bodyBattery: z.number(),
});

async function callTool<T>(userId: string, name: string, args: Record<string, any>): Promise<T> {
  const client = await createMcpClient(userId);
  const res = await client.callTool({ name, arguments: args });
  const text = (res.content as any[])[0].text;
  return JSON.parse(text) as T;
}

export async function getActivities(userId: string, from: string, to: string) {
  return callTool<Activity[]>(userId, "garmin_list_activities", { from, to });
}

export async function getHealthDaily(userId: string, from: string, to: string) {
  return callTool<any[]>(userId, "garmin_health_daily", { from, to });
}

export async function getYoYComparison(userId: string) {
  const now = new Date();
  const ytdStart = `${now.getFullYear()}-01-01`;
  const ytdEnd = now.toISOString().slice(0, 10);
  const prevStart = `${now.getFullYear() - 1}-01-01`;
  const prevEnd = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
    .toISOString().slice(0, 10);

  const [current, previous] = await Promise.all([
    getActivities(userId, ytdStart, ytdEnd),
    getActivities(userId, prevStart, prevEnd),
  ]);

  const aggregate = (acts: Activity[]) => {
    const runs = acts.filter(a => a.type === "running");
    return {
      runs: runs.length,
      distanceKm: runs.reduce((s, a) => s + a.distance, 0) / 1000,
      hours: runs.reduce((s, a) => s + a.duration, 0) / 3600,
      elevation: runs.reduce((s, a) => s + a.elevationGain, 0),
      avgHr: runs.reduce((s, a) => s + (a.avgHr ?? 0), 0) / (runs.length || 1),
    };
  };

  return { current: aggregate(current), previous: aggregate(previous) };
}
