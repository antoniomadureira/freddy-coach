export interface DailyLoad { date: string; trimp: number }

function ema(values: number[], days: number): number[] {
  const k = 1 / days;
  const out: number[] = [];
  let prev = values[0] ?? 0;
  for (const v of values) {
    prev = v * k + prev * (1 - k);
    out.push(prev);
  }
  return out;
}

export function computeTsb(loads: DailyLoad[]) {
  const trimps = loads.map(l => l.trimp);
  const ctl = ema(trimps, 42);
  const atl = ema(trimps, 7);
  const tsb = ctl.map((c, i) => c - atl[i]);
  return loads.map((l, i) => ({
    date: l.date,
    ctl: +ctl[i].toFixed(1),
    atl: +atl[i].toFixed(1),
    tsb: +tsb[i].toFixed(1),
  }));
}
