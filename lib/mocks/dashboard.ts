export async function getMock() {
  return {
    readiness: { score: 78, label: "Optimal" as const, sub: { sleep: 82, hrv: 74, acuteLoad: 71 } },
    status: {
      vo2: 54.2, load: "Produtiva", hrvStatus: "Equilibrado",
      trend: [52, 52.5, 53, 53.4, 53.8, 54, 54.1, 54.2],
    },
    runningWeek: {
      totalKm: 48.3, totalTime: "04:52:10",
      daily: [
        { day: "Seg", km: 8 }, { day: "Ter", km: 12 }, { day: "Qua", km: 0 },
        { day: "Qui", km: 6 }, { day: "Sex", km: 10 }, { day: "Sáb", km: 0 }, { day: "Dom", km: 12.3 },
      ],
    },
    crossWeek: { sessions: 2, minutes: 90, focus: "Força + Mobilidade" },
    yoy: [
      { label: "Corridas", current: "105", previous: "87", delta: 20.7 },
      { label: "Distância", current: "1566.6", previous: "1317.7", delta: 18.9, unit: "km" },
      { label: "Tempo", current: "132:43", previous: "110:20", delta: 20.2, unit: "h" },
      { label: "Elevação", current: "13323", previous: "10840", delta: 22.9, unit: "m" },
      { label: "FC Média", current: "137", previous: "141", delta: -2.8, unit: "bpm" },
    ],
    tsbToday: 4.0,
    tsbAdvice: "Forma ótima para sessão de qualidade. Prioriza um intervalo longo ou ritmo de meia maratona.",
    tsbSeries: Array.from({ length: 56 }, (_, i) => ({
      date: `D${i}`,
      ctl: 60 + Math.sin(i / 7) * 5 + i * 0.1,
      atl: 55 + Math.sin(i / 3) * 10,
      tsb: (60 + Math.sin(i / 7) * 5 + i * 0.1) - (55 + Math.sin(i / 3) * 10),
    })).map(p => ({ ...p, ctl: +p.ctl.toFixed(1), atl: +p.atl.toFixed(1), tsb: +p.tsb.toFixed(1) })),
    radar: [
      { axis: "Pace", value: 78, baseline: 70 },
      { axis: "FC Baixa", value: 82, baseline: 75 },
      { axis: "Volume", value: 88, baseline: 80 },
      { axis: "Fitness", value: 85, baseline: 78 },
      { axis: "Frescura", value: 62, baseline: 70 },
      { axis: "Elevação", value: 74, baseline: 65 },
    ],
  };
}
