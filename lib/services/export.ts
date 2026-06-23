import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface ExportData {
  user: string;
  weekStart: string;
  stats: {
    distance: string;
    time: string;
    elevation: string;
    avgHR: string;
    readiness: string;
  };
}

export async function generateWeeklyPDF(data: ExportData) {
  const doc = new jsPDF();
  
  // Header
  doc.setFillColor(10, 16, 32); // Dark background
  doc.rect(0, 0, 210, 40, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text("Relatório Semanal", 14, 20);
  doc.setFontSize(12);
  doc.setTextColor(100, 200, 200); // Accent color
  doc.text(`Atleta: ${data.user} | Semana: ${data.weekStart}`, 14, 30);

  // KPIs Box
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.text("Resumo de Performance", 14, 55);
  
  autoTable(doc, {
    startY: 60,
    head: [["Métrica", "Valor"]],
    body: [
      ["Distância Total", data.stats.distance],
      ["Tempo Ativo", data.stats.time],
      ["Elevação Acumulada", data.stats.elevation],
      ["FC Média", data.stats.avgHR],
      ["Readiness Score", data.stats.readiness],
    ],
    theme: "grid",
    headStyles: { fillColor: [10, 16, 32], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [245, 245, 245] },
  });

  // Footer
  doc.setFontSize(10);
  doc.setTextColor(150);
  doc.text("Gerado por freddy.coach AI", 14, doc.internal.pageSize.height - 10);

  doc.save(`Relatorio_Freddy_${data.weekStart}.pdf`);
}