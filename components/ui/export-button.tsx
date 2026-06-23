"use client";
import { FileDown, Share2, ExternalLink } from "lucide-react";
import { generateWeeklyPDF } from "@/lib/services/export";

export function ExportMenu({ userName }: { userName: string }) {
  const handleExport = async () => {
    const mockData = {
      user: userName,
      weekStart: "23 Jun 2026",
      stats: {
        distance: "48.3 km",
        time: "04:52:10",
        elevation: "420 m",
        avgHR: "142 bpm",
        readiness: "78/100",
      }
    };
    await generateWeeklyPDF(mockData);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleExport}
        className="inline-flex items-center gap-2 px-3 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-sm font-medium transition-colors"
      >
        <FileDown className="w-4 h-4" />
        PDF
      </button>
      <button className="inline-flex items-center gap-2 px-3 py-2 bg-accent/10 hover:bg-accent/20 text-accent rounded-lg text-sm font-medium transition-colors">
        <Share2 className="w-4 h-4" />
        Partilhar
      </button>
    </div>
  );
}