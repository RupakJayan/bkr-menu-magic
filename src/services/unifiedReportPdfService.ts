import jsPDFDefault, { jsPDF as jsPDFNamed } from "jspdf";
import autoTable from "jspdf-autotable";
import { MandapamVenue, StallItem, CapacityAnalysis, BudgetTier } from "@/types/planner3d";
import { formatISTDate } from "@/utils/istDate";

const createJsPdf = (options: any): any => {
  const Ctor = typeof jsPDFNamed === "function" ? jsPDFNamed : (jsPDFDefault as any)?.jsPDF || jsPDFDefault;
  return new (Ctor as any)(options);
};

export interface UnifiedReportData {
  venue: MandapamVenue;
  stalls: StallItem[];
  headCount: number;
  analysis: CapacityAnalysis;
  budgetTier: BudgetTier;
  snapshotDataUrl?: string;
  notes?: string;
}

/**
 * Builds a Unified Master Event Dossier PDF integrating all 3 primary reports:
 * 1. 3D Spatial CAD Blueprint & Venue Architectural Report
 * 2. Catering Counters, Utilities & Capacity Queue Flow Report
 * 3. Commercial Catering Proposal, Menu Schedule & Budget Breakdown
 */
export async function buildUnifiedMasterReportPDF(data: UnifiedReportData): Promise<{ blob: Blob; fileName: string }> {
  const doc = createJsPdf({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  const totalKw = data.stalls.reduce((acc, s) => acc + (s.powerRequiredKw || 0), 0);
  const waterLinesCount = data.stalls.filter((s) => s.waterRequired).length;
  const totalAreaM2 = Math.round(data.venue.hallWidth * data.venue.hallLength);

  // Helper colors
  const GOLD: [number, number, number] = [179, 130, 56]; // #b38238
  const DARK_SLATE: [number, number, number] = [15, 23, 42]; // #0f172a
  const CHARCOAL: [number, number, number] = [51, 65, 85]; // #334155
  const MUTED_GRAY: [number, number, number] = [100, 116, 139]; // #64748b
  const LIGHT_BG: [number, number, number] = [248, 250, 252]; // #f8fafc

  const drawHeader = (pageNumber: number, sectionTitle: string) => {
    // Header Banner
    doc.setFillColor(DARK_SLATE[0], DARK_SLATE[1], DARK_SLATE[2]);
    doc.rect(0, 0, pageWidth, 22, "F");

    // Gold accent stripe
    doc.setFillColor(GOLD[0], GOLD[1], GOLD[2]);
    doc.rect(0, 22, pageWidth, 1.5, "F");

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text("BKR CATERING & EVENTS // MASTER EVENT DOSSIER", margin, 12);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
    doc.text("EXECUTIVE VENUE CAD & CATERING ENGINEERING ARCHITECTURE", margin, 18);

    // Section Tag & Page
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(255, 255, 255);
    doc.text(`REPORT ${pageNumber} OF 3: ${sectionTitle}`, pageWidth - margin, 14, { align: "right" });

    // Footer
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(MUTED_GRAY[0], MUTED_GRAY[1], MUTED_GRAY[2]);
    doc.text(`Date Generated: ${formatISTDate(new Date())} IST • Confidential Client Dossier`, margin, pageHeight - 8);
    doc.text(`Page ${pageNumber} of 3`, pageWidth - margin, pageHeight - 8, { align: "right" });
    doc.setDrawColor(220, 225, 230);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
  };

  // =========================================================================================
  // PAGE 1: REPORT 1 - 3D SPATIAL CAD BLUEPRINT & VENUE ARCHITECTURAL REPORT
  // =========================================================================================
  drawHeader(1, "3D SPATIAL BLUEPRINT & VENUE ARCHITECTURE");
  let y = 32;

  // Title Box
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(DARK_SLATE[0], DARK_SLATE[1], DARK_SLATE[2]);
  doc.text(data.venue.name.toUpperCase(), margin, y);
  y += 5.5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(CHARCOAL[0], CHARCOAL[1], CHARCOAL[2]);
  doc.text(`Location: ${data.venue.location}`, margin, y);
  y += 7;

  // Embedded 3D Snapshot Render Image (if provided)
  if (data.snapshotDataUrl) {
    try {
      const imgHeight = 84;
      doc.addImage(data.snapshotDataUrl, "PNG", margin, y, contentWidth, imgHeight);
      // Border around image
      doc.setDrawColor(GOLD[0], GOLD[1], GOLD[2]);
      doc.setLineWidth(0.6);
      doc.rect(margin, y, contentWidth, imgHeight);
      y += imgHeight + 6;
    } catch (e) {
      console.warn("Could not embed snapshot image into PDF:", e);
    }
  }

  // Architectural Specifications Summary Box
  doc.setFillColor(LIGHT_BG[0], LIGHT_BG[1], LIGHT_BG[2]);
  doc.roundedRect(margin, y, contentWidth, 42, 2, 2, "F");
  doc.setDrawColor(GOLD[0], GOLD[1], GOLD[2]);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, contentWidth, 42, 2, 2, "D");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
  doc.text("CAD ARCHITECTURAL & CAD CADASTRAL SPECIFICATIONS", margin + 5, y + 7);

  const col1 = margin + 5;
  const col2 = margin + 65;
  const col3 = margin + 125;
  let specY = y + 15;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(DARK_SLATE[0], DARK_SLATE[1], DARK_SLATE[2]);
  doc.text("HALL DIMENSIONS (W × L × H):", col1, specY);
  doc.text("TOTAL FOOTPRINT AREA:", col2, specY);
  doc.text("PLANNED GUEST CAPACITY:", col3, specY);

  specY += 4.5;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(CHARCOAL[0], CHARCOAL[1], CHARCOAL[2]);
  doc.text(`${data.venue.hallWidth}m × ${data.venue.hallLength}m × ${data.venue.hallHeight}m`, col1, specY);
  doc.text(`${totalAreaM2.toLocaleString("en-IN")} m² (~${(totalAreaM2 * 10.764).toFixed(0)} sq ft)`, col2, specY);
  doc.text(`${data.headCount.toLocaleString("en-IN")} Pax (Peak)`, col3, specY);

  specY += 7;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(DARK_SLATE[0], DARK_SLATE[1], DARK_SLATE[2]);
  doc.text("CEREMONIAL MANDAP POSITION:", col1, specY);
  doc.text("SAFETY EGRESS CLEARANCE:", col2, specY);
  doc.text("ATMOSPHERE & LIGHTING:", col3, specY);

  specY += 4.5;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(CHARCOAL[0], CHARCOAL[1], CHARCOAL[2]);
  doc.text(`Z: ${data.venue.stagePosition[2]}m (Elevated Podium)`, col1, specY);
  doc.text("Min 2.5m Fire Lanes Maintained", col2, specY);
  doc.text("400-Lux Warm Golden Stage Halogen", col3, specY);
  y += 50;

  // Venue Description & Highlights
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(DARK_SLATE[0], DARK_SLATE[1], DARK_SLATE[2]);
  doc.text("ARCHITECTURAL & CROWD FLOW HIGHLIGHTS:", margin, y);
  y += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(CHARCOAL[0], CHARCOAL[1], CHARCOAL[2]);
  const splitDesc = doc.splitTextToSize(
    `${data.venue.description} The 3D layout coordinates dual peripheral buffet lanes, central mandap viewing aisles, dedicated handwash concourses, and 3-phase high-amp cooking distribution bays conforming to Tamil Nadu municipal safety standards.`,
    contentWidth
  );
  doc.text(splitDesc, margin, y);

  // =========================================================================================
  // PAGE 2: REPORT 2 - CATERING COUNTERS, UTILITIES & QUEUE CAPACITY REPORT
  // =========================================================================================
  doc.addPage();
  drawHeader(2, "COUNTERS, UTILITIES & QUEUE CAPACITY ANALYSIS");
  y = 30;

  // 4 Top Metrics Summary Cards
  const cardW = (contentWidth - 9) / 4;
  const metrics = [
    { label: "DEPLOYED STATIONS", val: `${data.stalls.length} Counters`, sub: `${totalKw.toFixed(1)} kW Load` },
    { label: "SERVING THROUGHPUT", val: `${data.analysis.totalServingCapacityPerHour.toLocaleString("en-IN")}`, sub: "Guests / Hour" },
    { label: "ESTIMATED WAIT TIME", val: `${data.analysis.estimatedWaitMinutes} Mins`, sub: `Queue: ${data.analysis.queueStatus.toUpperCase()}` },
    { label: "UTILITY CONNECTIONS", val: `${waterLinesCount} Wet Stations`, sub: "Dedicated Drainage" },
  ];

  metrics.forEach((m, idx) => {
    const cx = margin + idx * (cardW + 3);
    doc.setFillColor(LIGHT_BG[0], LIGHT_BG[1], LIGHT_BG[2]);
    doc.roundedRect(cx, y, cardW, 22, 1.5, 1.5, "F");
    doc.setDrawColor(210, 218, 226);
    doc.roundedRect(cx, y, cardW, 22, 1.5, 1.5, "D");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
    doc.text(m.label, cx + 3, y + 5.5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(DARK_SLATE[0], DARK_SLATE[1], DARK_SLATE[2]);
    doc.text(m.val, cx + 3, y + 12.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(MUTED_GRAY[0], MUTED_GRAY[1], MUTED_GRAY[2]);
    doc.text(m.sub, cx + 3, y + 18);
  });
  y += 28;

  // Stalls Structured Table
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(DARK_SLATE[0], DARK_SLATE[1], DARK_SLATE[2]);
  doc.text("DEPLOYED COUNTERS SPECIFICATIONS ROSTER", margin, y);
  y += 4;

  const tableBody = data.stalls.map((s, i) => {
    const [x, , z] = s.position;
    const coordStr = `[${x >= 0 ? "+" : ""}${x.toFixed(1)}, ${z >= 0 ? "+" : ""}${z.toFixed(1)}]m`;
    const dimStr = `${s.width}×${s.depth}m`;
    const shapeStr = s.customModelSpec?.shape ? s.customModelSpec.shape.replace(/_/g, " ") : s.type.replace(/_/g, " ");

    return [
      String(i + 1),
      s.name,
      shapeStr.toUpperCase(),
      dimStr,
      coordStr,
      `${s.powerRequiredKw || 0} kW`,
      s.waterRequired ? "Water Line" : "Dry",
      `${s.capacityPerHour || 100}/hr`,
    ];
  });

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [["#", "Station Name", "3D Architecture", "Size", "Floor Pos", "Power", "Utility", "Pax/Hr"]],
    body: tableBody,
    theme: "striped",
    headStyles: {
      fillColor: DARK_SLATE,
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: CHARCOAL,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 7, halign: "center" },
      1: { cellWidth: 44, fontStyle: "bold" },
      2: { cellWidth: 32 },
      3: { cellWidth: 18, halign: "center" },
      4: { cellWidth: 26, halign: "center" },
      5: { cellWidth: 16, halign: "right" },
      6: { cellWidth: 20, halign: "center" },
      7: { cellWidth: 19, halign: "right", fontStyle: "bold" },
    },
  });

  // =========================================================================================
  // PAGE 3: REPORT 3 - COMMERCIAL PROPOSAL, MENU SCHEDULE & BUDGET BREAKDOWN
  // =========================================================================================
  doc.addPage();
  drawHeader(3, "COMMERCIAL PROPOSAL, MENU SCHEDULE & BUDGET BREAKDOWN");
  y = 30;

  // Commercial Budget Summary Card
  doc.setFillColor(DARK_SLATE[0], DARK_SLATE[1], DARK_SLATE[2]);
  doc.roundedRect(margin, y, contentWidth, 32, 2, 2, "F");
  doc.setFillColor(GOLD[0], GOLD[1], GOLD[2]);
  doc.rect(margin, y, 4, 32, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
  doc.text("COMMERCIAL CATERING BUDGET & TIER SPECIFICATION", margin + 10, y + 8);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text(`ESTIMATED BUDGET: ${data.analysis.totalBudgetFormatted}`, margin + 10, y + 19);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(210, 220, 230);
  doc.text(
    `Budget Tier: ${data.budgetTier.toUpperCase()} • Rate: ₹${data.analysis.costPerPlateInr}/Plate • Total Planned: ${data.headCount.toLocaleString("en-IN")} Pax`,
    margin + 10,
    y + 27
  );
  y += 38;

  // Menu Highlights & Live Counter Offerings Table
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(DARK_SLATE[0], DARK_SLATE[1], DARK_SLATE[2]);
  doc.text("LIVE STALLS SPECIALTY DISHES & MENU ROSTER", margin, y);
  y += 4;

  const menuRows = data.stalls
    .filter((s) => s.dishes && s.dishes.length > 0)
    .map((s, idx) => [
      String(idx + 1),
      s.name,
      s.category || "Live Station",
      s.dishes.join(", "),
      s.capacityPerHour ? `${s.capacityPerHour} Pax/Hr` : "Continual",
    ]);

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [["#", "Station Name", "Category", "Planned Specialties & Dishes", "Service Output"]],
    body: menuRows.length > 0 ? menuRows : [["1", "Live Catering Ensemble", "General", "South Indian Festive Feasts Assortment", "2,500/hr"]],
    theme: "striped",
    headStyles: {
      fillColor: GOLD,
      textColor: [0, 0, 0],
      fontSize: 8,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: CHARCOAL,
    },
    columnStyles: {
      0: { cellWidth: 7, halign: "center" },
      1: { cellWidth: 42, fontStyle: "bold" },
      2: { cellWidth: 28 },
      3: { cellWidth: 80 },
      4: { cellWidth: 25, halign: "right" },
    },
  });

  const finalY = (doc as any).lastAutoTable?.finalY || y + 60;
  y = finalY + 12;

  // Formal Quality & Electrical Safety Certification Block
  if (y + 40 > pageHeight - 15) {
    doc.addPage();
    drawHeader(3, "BKR CATERING SEAL & FORMAL APPROVAL");
    y = 35;
  }

  doc.setFillColor(LIGHT_BG[0], LIGHT_BG[1], LIGHT_BG[2]);
  doc.roundedRect(margin, y, contentWidth, 34, 2, 2, "F");
  doc.setDrawColor(210, 218, 226);
  doc.roundedRect(margin, y, contentWidth, 34, 2, 2, "D");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(GOLD[0], GOLD[1], GOLD[2]);
  doc.text("BKR CATERING HERITAGE SEAL & SANITATION ASSURANCE", margin + 6, y + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(CHARCOAL[0], CHARCOAL[1], CHARCOAL[2]);
  doc.text(
    "All deployed counters follow FSSAI 2026 catering hygiene protocols, RO water filtration, fire lane egress of >2.5 meters, and balanced 3-phase neutral-earthed electrical distribution. Approved by BKR Master Chef & Event Operations Lead.",
    margin + 6,
    y + 13,
    { maxWidth: contentWidth - 45 }
  );

  // Signatures
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(DARK_SLATE[0], DARK_SLATE[1], DARK_SLATE[2]);
  doc.text("BKR Operations Lead:", margin + 6, y + 27);
  doc.text("Client Confirmation:", margin + 70, y + 27);
  doc.setFont("helvetica", "normal");
  doc.text("__________________________", margin + 6, y + 31);
  doc.text("__________________________", margin + 70, y + 31);

  // File Name
  const cleanVenueName = data.venue.name.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase().slice(0, 24);
  const fileName = `bkr-master-event-dossier-${cleanVenueName}-${data.headCount}pax.pdf`;
  const blob = doc.output("blob");

  return { blob, fileName };
}

/**
 * Direct Download Trigger
 */
export async function downloadUnifiedMasterReportPDF(data: UnifiedReportData): Promise<string> {
  const { blob, fileName } = await buildUnifiedMasterReportPDF(data);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  return fileName;
}
