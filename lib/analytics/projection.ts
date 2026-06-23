export function riegelProjection(timeSeconds: number, fromKm: number, toKm: number): number {
  return timeSeconds * Math.pow(toKm / fromKm, 1.06);
}

export function cameronProjection(timeSeconds: number, fromKm: number, toKm: number): number {
  const vo2max = vo2FromTime(timeSeconds, fromKm);
  return timeFromVo2(vo2max, toKm);
}

export function vo2FromTime(timeSeconds: number, distanceKm: number): number {
  const velocity = (distanceKm * 1000) / timeSeconds;
  const minutes = timeSeconds / 60;
  const vo2 = -4.60 + 0.182258 * velocity + 0.000104 * velocity * velocity;
  const pct = 0.8 + 0.1894393 * Math.exp(-0.012778 * minutes) + 0.2989558 * Math.exp(-0.1932605 * minutes);
  return vo2 / pct;
}

export function timeFromVo2(vo2max: number, distanceKm: number): number {
  let lo = 60, hi = 60 * 60 * 8;
  for (let i = 0; i < 50; i++) {
    const mid = (lo + hi) / 2;
    const estimated = vo2FromTime(mid, distanceKm);
    if (estimated < vo2max) hi = mid;
    else lo = mid;
  }
  return (lo + hi) / 2;
}

export function projectPB(
  bestTime: number,
  bestDistanceKm: number,
  targetDistanceKm: number,
  currentTsb: number = 0
): { time: number; pace: number; confidence: number } {
  const base = cameronProjection(bestTime, bestDistanceKm, targetDistanceKm);
  const freshnessFactor = 1 - (currentTsb / 100) * 0.03;
  const adjusted = base * freshnessFactor;
  const ratio = Math.min(bestDistanceKm, targetDistanceKm) / Math.max(bestDistanceKm, targetDistanceKm);
  const confidence = Math.round(ratio * 100);
  return {
    time: Math.round(adjusted),
    pace: adjusted / targetDistanceKm,
    confidence,
  };
}

export function formatPace(secondsPerKm: number): string {
  const min = Math.floor(secondsPerKm / 60);
  const sec = Math.round(secondsPerKm % 60);
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

export function formatTime(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.round(totalSeconds % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m}:${s.toString().padStart(2, "0")}`;
}