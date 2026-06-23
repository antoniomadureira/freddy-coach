"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type AlertType = "critical" | "warning" | "info";

interface AlertConfig {
  id: string;
  message: string;
  type: AlertType;
  timestamp: number;
}

// Configurações de sensibilidade do coach
const THRESHOLDS = {
  TSB_CRITICAL: -35,
  TSB_WARNING: -20,
  HRV_LOW: 45,
  SLEEP_LOW: 6.5, // horas
  READINESS_LOW: 40,
};

export function useSmartAlerts(data: {
  tsb?: number;
  hrv?: number;
  sleepHours?: number;
  readiness?: number;
}) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!data) return;

    // 1. Verificação de Overtraining (TSB)
    if (data.tsb && data.tsb < THRESHOLDS.TSB_CRITICAL && !dismissed.has("tsb_crit")) {
      toast.error("🚨 Risco de Overtraining Detectado", {
        description: `O teu TSB está em ${data.tsb.toFixed(1)}. Reduz a carga imediatamente. Recomenda-se 2 dias de descanso total.`,
        duration: 10000,
        action: { label: "Entendido", onClick: () => setDismissed(prev => new Set(prev).add("tsb_crit")) }
      });
    } else if (data.tsb && data.tsb < THRESHOLDS.TSB_WARNING && data.tsb > THRESHOLDS.TSB_CRITICAL && !dismissed.has("tsb_warn")) {
      toast.warning("️ Acumulação de Fadiga", {
        description: `TSB em queda (${data.tsb.toFixed(1)}). Considera reduzir o volume do treino de hoje.`,
        duration: 8000,
        action: { label: "Ver Plano", onClick: () => setDismissed(prev => new Set(prev).add("tsb_warn")) }
      });
    }

    // 2. Verificação de Recuperação (HRV + Sono)
    if (data.hrv && data.hrv < THRESHOLDS.HRV_LOW && !dismissed.has("hrv_low")) {
      toast.info("🌙 Recuperação Incompleta", {
        description: `A tua HRV está baixa (${data.hrv}ms). O teu sistema nervoso ainda está sob stress.`,
        duration: 6000,
        action: { label: "OK", onClick: () => setDismissed(prev => new Set(prev).add("hrv_low")) }
      });
    }

    // 3. Check de Hidratação (Simulado - apenas info)
    const hour = new Date().getHours();
    if (hour > 18 && !dismissed.has("hydrate")) {
      toast.info("💧 Hora de Hidratar", {
        description: "Lembra-te de beber 500ml de água antes de dormir para otimizar a recuperação noturna.",
        duration: 5000,
        action: { label: "Ok", onClick: () => setDismissed(prev => new Set(prev).add("hydrate")) }
      });
    }

  }, [data, dismissed]);
}