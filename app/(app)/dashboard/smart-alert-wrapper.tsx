"use client";
import { useSmartAlerts } from "@/lib/hooks/use-smart-alerts";

export default function SmartAlertClient({ data }: any) {
  useSmartAlerts({
    tsb: data.tsbToday,
    hrv: data.readiness.sub.hrv,
    sleepHours: data.readiness.sub.sleep / 10,
    readiness: data.readiness.score,
  });
  return null;
}