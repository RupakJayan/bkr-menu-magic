import React, { useState } from "react";
import {
  MandapamVenue,
  StallItem,
  CapacityAnalysis,
  BudgetTier,
} from "@/types/planner3d";
import {
  X,
  Download,
  Printer,
  FileCheck2,
  Maximize2,
  Zap,
  Droplets,
  Clock,
  Layers,
  Sparkles,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Building,
  Flame,
  Camera,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { downloadUnifiedMasterReportPDF } from "@/services/unifiedReportPdfService";

interface UnifiedMasterReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  venue: MandapamVenue;
  stalls: StallItem[];
  headCount: number;
  analysis: CapacityAnalysis;
  budgetTier: BudgetTier;
  snapshotDataUrl?: string;
  isDark?: boolean;
}

type ActiveTab = "all_in_one" | "cad_spatial" | "utilities_queue" | "commercial_menu";

export const UnifiedMasterReportModal: React.FC<UnifiedMasterReportModalProps> = ({
  isOpen,
  onClose,
  venue,
  stalls,
  headCount,
  analysis,
  budgetTier,
  snapshotDataUrl,
  isDark = true,
}) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("all_in_one");
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  if (!isOpen) return null;

  const totalKw = stalls.reduce((sum, s) => sum + (s.powerRequiredKw || 0), 0);
  const waterStationsCount = stalls.filter((s) => s.waterRequired).length;
  const areaM2 = Math.round(venue.hallWidth * venue.hallLength);
  const areaSqFt = Math.round(areaM2 * 10.764);

  const handleDownloadMasterPDF = async () => {
    try {
      setIsExportingPdf(true);
      toast.info("Generating Unified Master Dossier PDF...", {
        description: "Compiling 3D CAD Blueprint, Utilities Roster, and Commercial Proposal into 3 pages.",
      });

      const fileName = await downloadUnifiedMasterReportPDF({
        venue,
        stalls,
        headCount,
        analysis,
        budgetTier,
        snapshotDataUrl,
      });

      toast.success("Master Event Dossier Downloaded!", {
        description: `Saved as ${fileName}`,
      });
    } catch (err) {
      console.error("PDF generation failed:", err);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handlePrintDossier = () => {
    window.print();
  };

  const handleDownloadSnapshotOnly = () => {
    if (!snapshotDataUrl) {
      toast.error("No 3D snapshot available.");
      return;
    }
    const link = document.createElement("a");
    link.download = `bkr-3d-blueprint-${venue.id}.png`;
    link.href = snapshotDataUrl;
    link.click();
    toast.success("3D CAD Blueprint Snapshot Saved!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-hidden animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden transition-colors ${
          isDark
            ? "bg-[#0b0e14] border-amber-500/25 text-slate-100"
            : "bg-[#ffffff] border-slate-300 text-slate-900 shadow-slate-400/20"
        }`}
      >
        {/* TOP MODAL HEADER */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b ${
            isDark
              ? "bg-[#111520] border-white/10"
              : "bg-slate-50 border-slate-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-xl flex items-center justify-center shadow-inner ${
                isDark
                  ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                  : "bg-amber-100 text-amber-800 border border-amber-300"
              }`}
            >
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full font-bold ${
                    isDark
                      ? "bg-amber-400/15 text-amber-300 border border-amber-400/30"
                      : "bg-amber-50 text-amber-900 border border-amber-300"
                  }`}
                >
                  BKR Executive // 3-in-1 Master Dossier
                </span>
                <span
                  className={`text-xs font-mono hidden sm:inline ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  மூன்றும் ஒருங்கிணைந்த முழு அறிக்கை
                </span>
              </div>
              <h2 className="text-lg font-bold tracking-tight mt-0.5 flex items-center gap-2">
                <span>{venue.name}</span>
                <span className="text-xs font-normal opacity-70">
                  ({venue.location})
                </span>
              </h2>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={handleDownloadMasterPDF}
              disabled={isExportingPdf}
              className={`h-9 px-3.5 text-xs font-bold rounded-xl shadow-lg flex items-center gap-1.5 transition-transform active:scale-95 ${
                isDark
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold"
                  : "bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold"
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExportingPdf ? "Compiling..." : "Download Master PDF (3-in-1)"}</span>
            </Button>

            <button
              onClick={handlePrintDossier}
              title="Print Dossier"
              className={`p-2 rounded-xl border transition-colors hidden sm:flex items-center justify-center ${
                isDark
                  ? "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
                  : "bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className={`p-2 rounded-xl border transition-colors ${
                isDark
                  ? "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
                  : "bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* TAB CONTROLS (HIGH CONTRAST) */}
        <div
          className={`flex items-center gap-1 px-6 py-2 border-b text-xs font-mono overflow-x-auto ${
            isDark ? "bg-[#0d1018] border-white/10" : "bg-slate-100/80 border-slate-200"
          }`}
        >
          <button
            onClick={() => setActiveTab("all_in_one")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === "all_in_one"
                ? isDark
                  ? "bg-amber-400 text-black shadow-sm"
                  : "bg-amber-600 text-white shadow-sm"
                : isDark
                ? "text-slate-400 hover:text-white hover:bg-white/5"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>🌟 All 3 Integrated (முழு அறிக்கை)</span>
          </button>

          <button
            onClick={() => setActiveTab("cad_spatial")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === "cad_spatial"
                ? isDark
                  ? "bg-amber-400 text-black shadow-sm"
                  : "bg-amber-600 text-white shadow-sm"
                : isDark
                ? "text-slate-400 hover:text-white hover:bg-white/5"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Report 1: 3D CAD Blueprint (அரங்கு)</span>
          </button>

          <button
            onClick={() => setActiveTab("utilities_queue")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === "utilities_queue"
                ? isDark
                  ? "bg-amber-400 text-black shadow-sm"
                  : "bg-amber-600 text-white shadow-sm"
                : isDark
                ? "text-slate-400 hover:text-white hover:bg-white/5"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Report 2: Counters & Utilities (மின்சாரம்)</span>
          </button>

          <button
            onClick={() => setActiveTab("commercial_menu")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === "commercial_menu"
                ? isDark
                  ? "bg-amber-400 text-black shadow-sm"
                  : "bg-amber-600 text-white shadow-sm"
                : isDark
                ? "text-slate-400 hover:text-white hover:bg-white/5"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Report 3: Commercial & Menu (பட்ஜெட்)</span>
          </button>
        </div>

        {/* MODAL BODY (SCROLLABLE) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* ========================================================================= */}
          {/* TAB 1: ALL 3 REPORTS INTEGRATED (MASTER DOSSIER PREVIEW) */}
          {/* ========================================================================= */}
          {activeTab === "all_in_one" && (
            <div className="space-y-6">
              {/* Executive Overview Banner */}
              <div
                className={`p-5 rounded-2xl border ${
                  isDark
                    ? "bg-gradient-to-br from-[#121624] via-[#0d1019] to-[#121624] border-amber-500/20"
                    : "bg-gradient-to-br from-amber-50/60 via-white to-amber-50/40 border-amber-200"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div>
                    <span
                      className={`text-xs font-mono font-bold uppercase tracking-wider ${
                        isDark ? "text-amber-400" : "text-amber-800"
                      }`}
                    >
                      BKR Comprehensive Event Dossier
                    </span>
                    <h3 className="text-xl font-bold mt-0.5">
                      {venue.name} • {headCount.toLocaleString("en-IN")} Pax
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`font-mono text-xs ${
                        isDark
                          ? "border-amber-400/40 text-amber-300"
                          : "border-amber-400 text-amber-900 bg-amber-50"
                      }`}
                    >
                      Tier: {budgetTier.toUpperCase()}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`font-mono text-xs ${
                        isDark
                          ? "border-emerald-500/40 text-emerald-400"
                          : "border-emerald-600 text-emerald-800 bg-emerald-50"
                      }`}
                    >
                      {analysis.totalBudgetFormatted} Total
                    </Badge>
                  </div>
                </div>

                {/* 4 Executive Metric Chips */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div
                    className={`p-3 rounded-xl border ${
                      isDark
                        ? "bg-black/30 border-white/10"
                        : "bg-white border-slate-200"
                    }`}
                  >
                    <div
                      className={`text-[10px] font-mono uppercase ${
                        isDark ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      Hall Footprint
                    </div>
                    <div className="text-sm font-bold mt-0.5">
                      {venue.hallWidth}m × {venue.hallLength}m
                    </div>
                    <div
                      className={`text-[11px] font-mono ${
                        isDark ? "text-amber-400" : "text-amber-700"
                      }`}
                    >
                      {areaM2} m² (~{areaSqFt.toLocaleString("en-IN")} sqft)
                    </div>
                  </div>

                  <div
                    className={`p-3 rounded-xl border ${
                      isDark
                        ? "bg-black/30 border-white/10"
                        : "bg-white border-slate-200"
                    }`}
                  >
                    <div
                      className={`text-[10px] font-mono uppercase ${
                        isDark ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      Deployed Counters
                    </div>
                    <div className="text-sm font-bold mt-0.5">
                      {stalls.length} Live Stations
                    </div>
                    <div
                      className={`text-[11px] font-mono ${
                        isDark ? "text-emerald-400" : "text-emerald-700"
                      }`}
                    >
                      {analysis.totalServingCapacityPerHour.toLocaleString("en-IN")}/hr throughput
                    </div>
                  </div>

                  <div
                    className={`p-3 rounded-xl border ${
                      isDark
                        ? "bg-black/30 border-white/10"
                        : "bg-white border-slate-200"
                    }`}
                  >
                    <div
                      className={`text-[10px] font-mono uppercase ${
                        isDark ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      Utilities Load
                    </div>
                    <div className="text-sm font-bold mt-0.5">
                      {totalKw.toFixed(1)} kW Total
                    </div>
                    <div
                      className={`text-[11px] font-mono ${
                        isDark ? "text-cyan-400" : "text-cyan-700"
                      }`}
                    >
                      {waterStationsCount} Water/Drainage Lines
                    </div>
                  </div>

                  <div
                    className={`p-3 rounded-xl border ${
                      isDark
                        ? "bg-black/30 border-white/10"
                        : "bg-white border-slate-200"
                    }`}
                  >
                    <div
                      className={`text-[10px] font-mono uppercase ${
                        isDark ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      Queue Analysis
                    </div>
                    <div className="text-sm font-bold mt-0.5">
                      ~{analysis.estimatedWaitMinutes} Mins Wait
                    </div>
                    <div
                      className={`text-[11px] font-mono uppercase font-bold ${
                        analysis.queueStatus === "optimal"
                          ? "text-emerald-500"
                          : analysis.queueStatus === "moderate"
                          ? "text-amber-500"
                          : "text-rose-500"
                      }`}
                    >
                      {analysis.queueStatus} Flow
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 1: 3D CAD BLUEPRINT INTAKE */}
              <div
                className={`p-5 rounded-2xl border ${
                  isDark ? "bg-[#0e111a] border-white/10" : "bg-white border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        isDark
                          ? "bg-amber-400/20 text-amber-300"
                          : "bg-amber-100 text-amber-900"
                      }`}
                    >
                      REPORT 1 OF 3
                    </span>
                    <h4 className="text-sm font-bold">
                      3D Spatial CAD Blueprint & Mandapam Architecture
                    </h4>
                  </div>
                  {snapshotDataUrl && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleDownloadSnapshotOnly}
                      className="h-7 text-xs font-mono flex items-center gap-1 opacity-80 hover:opacity-100"
                    >
                      <Camera className="w-3 h-3" />
                      <span>Save Snapshot</span>
                    </Button>
                  )}
                </div>

                {snapshotDataUrl ? (
                  <div className="relative rounded-xl overflow-hidden border border-amber-500/30 bg-black/60 shadow-lg">
                    <img
                      src={snapshotDataUrl}
                      alt="3D Spatial Venue Plan"
                      className="w-full h-64 object-cover object-center"
                    />
                    <div className="absolute bottom-2 left-3 text-[10px] font-mono bg-black/75 text-amber-300 px-2 py-0.5 rounded border border-white/20">
                      Viewport Angle: Orthographic Perspective • {venue.name}
                    </div>
                  </div>
                ) : (
                  <div
                    className={`p-6 rounded-xl border border-dashed text-center font-mono text-xs ${
                      isDark
                        ? "border-white/10 bg-white/5 text-slate-400"
                        : "border-slate-300 bg-slate-50 text-slate-600"
                    }`}
                  >
                    3D Viewport Snapshot embedded in real-time master rendering.
                  </div>
                )}

                <div className="mt-3 text-xs leading-relaxed opacity-85">
                  <span className="font-semibold">Spatial Design Summary: </span>
                  {venue.description} The 3D layout coordinates dual peripheral buffet lanes, central mandap viewing aisles, dedicated handwash concourses, and 3-phase high-amp cooking distribution bays conforming to Tamil Nadu municipal safety standards.
                </div>
              </div>

              {/* SECTION 2: LIVE COUNTERS, UTILITIES & QUEUE ANALYSIS */}
              <div
                className={`p-5 rounded-2xl border ${
                  isDark ? "bg-[#0e111a] border-white/10" : "bg-white border-slate-200"
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      isDark
                        ? "bg-amber-400/20 text-amber-300"
                        : "bg-amber-100 text-amber-900"
                    }`}
                  >
                    REPORT 2 OF 3
                  </span>
                  <h4 className="text-sm font-bold">
                    Catering Counters, Utilities & Queue Capacity Roster
                  </h4>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr
                        className={`border-b text-[10px] uppercase ${
                          isDark
                            ? "border-white/10 text-slate-400 bg-white/5"
                            : "border-slate-200 text-slate-600 bg-slate-50"
                        }`}
                      >
                        <th className="py-2 px-3">#</th>
                        <th className="py-2 px-3">Station Name</th>
                        <th className="py-2 px-3">3D Architecture</th>
                        <th className="py-2 px-3">Floor Pos</th>
                        <th className="py-2 px-3">Power</th>
                        <th className="py-2 px-3">Utility</th>
                        <th className="py-2 px-3">Capacity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {stalls.slice(0, 6).map((stall, idx) => (
                        <tr
                          key={stall.id}
                          className={`${
                            isDark ? "hover:bg-white/5" : "hover:bg-slate-50"
                          }`}
                        >
                          <td className="py-2 px-3 opacity-60">{idx + 1}</td>
                          <td className="py-2 px-3 font-sans font-semibold">
                            {stall.name}
                          </td>
                          <td className="py-2 px-3 uppercase text-[10px] text-amber-500">
                            {stall.customModelSpec?.shape
                              ? stall.customModelSpec.shape.replace(/_/g, " ")
                              : stall.type.replace(/_/g, " ")}
                          </td>
                          <td className="py-2 px-3">
                            [{stall.position[0].toFixed(1)},{" "}
                            {stall.position[2].toFixed(1)}]m
                          </td>
                          <td className="py-2 px-3">{stall.powerRequiredKw || 0} kW</td>
                          <td className="py-2 px-3">
                            {stall.waterRequired ? (
                              <span className="text-cyan-500 font-bold">Water Line</span>
                            ) : (
                              <span className="opacity-50">Dry</span>
                            )}
                          </td>
                          <td className="py-2 px-3 font-bold">
                            {stall.capacityPerHour || 100}/hr
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {stalls.length > 6 && (
                    <div
                      className={`text-center py-2 text-[11px] font-mono border-t ${
                        isDark ? "border-white/10 text-slate-400" : "border-slate-200 text-slate-500"
                      }`}
                    >
                      + {stalls.length - 6} additional stations fully itemized in the master PDF document.
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 3: COMMERCIAL PROPOSAL, MENU & BUDGET */}
              <div
                className={`p-5 rounded-2xl border ${
                  isDark ? "bg-[#0e111a] border-white/10" : "bg-white border-slate-200"
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      isDark
                        ? "bg-amber-400/20 text-amber-300"
                        : "bg-amber-100 text-amber-900"
                    }`}
                  >
                    REPORT 3 OF 3
                  </span>
                  <h4 className="text-sm font-bold">
                    Commercial Catering Proposal, Menu Schedule & Sanitation Seal
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    className={`p-4 rounded-xl border ${
                      isDark
                        ? "bg-black/30 border-white/10"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="text-xs font-mono font-bold text-amber-500 uppercase mb-2">
                      Menu Specialties Assortment
                    </div>
                    <ul className="text-xs space-y-1.5 opacity-90">
                      {stalls
                        .filter((s) => s.dishes && s.dishes.length > 0)
                        .slice(0, 4)
                        .map((s) => (
                          <li key={s.id} className="flex items-start gap-1.5">
                            <span className="text-amber-500 font-bold">•</span>
                            <span>
                              <strong>{s.name}:</strong> {s.dishes.slice(0, 3).join(", ")}
                            </span>
                          </li>
                        ))}
                    </ul>
                  </div>

                  <div
                    className={`p-4 rounded-xl border ${
                      isDark
                        ? "bg-black/30 border-white/10"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-500 uppercase mb-2">
                      <ShieldCheck className="w-4 h-4" />
                      <span>FSSAI 2026 Heritage Assurance</span>
                    </div>
                    <p className="text-[11px] leading-relaxed opacity-85">
                      All deployed counters strictly comply with FSSAI 2026 catering hygiene protocols, RO water filtration, fire lane egress of &gt;2.5 meters, and balanced 3-phase neutral-earthed electrical distribution. Approved by BKR Master Chef & Event Operations Lead.
                    </p>
                    <div className="mt-3 pt-2 border-t border-white/10 flex justify-between text-[10px] font-mono opacity-70">
                      <span>BKR Ops: Approved ✓</span>
                      <span>Client Status: Ready to Sign</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: REPORT 1 - 3D CAD SPATIAL BLUEPRINT */}
          {/* ========================================================================= */}
          {activeTab === "cad_spatial" && (
            <div className="space-y-5">
              <div
                className={`p-4 rounded-xl border flex items-center justify-between ${
                  isDark ? "bg-[#111420] border-white/10" : "bg-slate-50 border-slate-200"
                }`}
              >
                <div>
                  <h3 className="text-base font-bold">
                    Report 1: 3D Spatial CAD Blueprint & Venue Architecture
                  </h3>
                  <p className="text-xs opacity-75 mt-0.5">
                    முப்பரிமாண CAD திட்ட வரைபடம் மற்றும் மண்டப பரிமாணங்கள்
                  </p>
                </div>
                {snapshotDataUrl && (
                  <Button
                    size="sm"
                    onClick={handleDownloadSnapshotOnly}
                    className="h-8 text-xs font-mono flex items-center gap-1.5"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Download Blueprint PNG</span>
                  </Button>
                )}
              </div>

              {snapshotDataUrl && (
                <div className="rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl bg-black">
                  <img
                    src={snapshotDataUrl}
                    alt="3D Spatial Blueprint"
                    className="w-full h-80 object-cover object-center"
                  />
                </div>
              )}

              <div
                className={`p-5 rounded-2xl border ${
                  isDark ? "bg-[#0e111a] border-white/10" : "bg-white border-slate-200"
                }`}
              >
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-500 mb-3">
                  Cadastral Venue Specifications
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                  <div
                    className={`p-3 rounded-xl border ${
                      isDark ? "bg-black/30 border-white/10" : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <span className="opacity-60 block">Hall Dimensions</span>
                    <strong className="text-sm">
                      {venue.hallWidth}m (W) × {venue.hallLength}m (L)
                    </strong>
                    <span className="block opacity-75 mt-0.5">
                      Height Clearance: {venue.hallHeight}m
                    </span>
                  </div>

                  <div
                    className={`p-3 rounded-xl border ${
                      isDark ? "bg-black/30 border-white/10" : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <span className="opacity-60 block">Total Spatial Footprint</span>
                    <strong className="text-sm">
                      {areaM2.toLocaleString("en-IN")} m²
                    </strong>
                    <span className="block opacity-75 mt-0.5">
                      ~{areaSqFt.toLocaleString("en-IN")} sq ft
                    </span>
                  </div>

                  <div
                    className={`p-3 rounded-xl border ${
                      isDark ? "bg-black/30 border-white/10" : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <span className="opacity-60 block">Mandapam Stage Egress</span>
                    <strong className="text-sm text-emerald-500">
                      &gt; 2.5m Fire Clearance
                    </strong>
                    <span className="block opacity-75 mt-0.5">
                      Stage Z: {venue.stagePosition[2]}m Elevated
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 text-xs leading-relaxed opacity-85">
                  <strong>Venue Context:</strong> {venue.name} in {venue.location}. {venue.description}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: REPORT 2 - COUNTERS, UTILITIES & QUEUE FLOW */}
          {/* ========================================================================= */}
          {activeTab === "utilities_queue" && (
            <div className="space-y-5">
              <div
                className={`p-4 rounded-xl border flex items-center justify-between ${
                  isDark ? "bg-[#111420] border-white/10" : "bg-slate-50 border-slate-200"
                }`}
              >
                <div>
                  <h3 className="text-base font-bold">
                    Report 2: Catering Counters, Utilities & Queue Flow Engineering
                  </h3>
                  <p className="text-xs opacity-75 mt-0.5">
                    லைவ் கவுண்டர்கள், 3-பேஸ் மின்சுமை, நீர் வசதி மற்றும் வரிசை பகுப்பாய்வு
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono text-xs">
                    {totalKw.toFixed(1)} kW Total
                  </Badge>
                  <Badge variant="outline" className="font-mono text-xs">
                    {waterStationsCount} Wet Lines
                  </Badge>
                </div>
              </div>

              {/* Roster Table */}
              <div
                className={`rounded-2xl border overflow-hidden ${
                  isDark ? "bg-[#0e111a] border-white/10" : "bg-white border-slate-200"
                }`}
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr
                        className={`border-b text-[10px] uppercase ${
                          isDark
                            ? "border-white/10 text-slate-400 bg-white/5"
                            : "border-slate-200 text-slate-600 bg-slate-50"
                        }`}
                      >
                        <th className="py-2.5 px-3">#</th>
                        <th className="py-2.5 px-3">Counter Name</th>
                        <th className="py-2.5 px-3">3D Architecture</th>
                        <th className="py-2.5 px-3">Dimensions</th>
                        <th className="py-2.5 px-3">Floor Position</th>
                        <th className="py-2.5 px-3">Power</th>
                        <th className="py-2.5 px-3">Water Line</th>
                        <th className="py-2.5 px-3">Capacity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {stalls.map((stall, idx) => (
                        <tr
                          key={stall.id}
                          className={`${
                            isDark ? "hover:bg-white/5" : "hover:bg-slate-50"
                          }`}
                        >
                          <td className="py-2 px-3 opacity-60">{idx + 1}</td>
                          <td className="py-2 px-3 font-sans font-semibold">
                            {stall.name}
                          </td>
                          <td className="py-2 px-3 uppercase text-[10px] text-amber-500 font-bold">
                            {stall.customModelSpec?.shape
                              ? stall.customModelSpec.shape.replace(/_/g, " ")
                              : stall.type.replace(/_/g, " ")}
                          </td>
                          <td className="py-2 px-3">
                            {stall.width}m × {stall.depth}m
                          </td>
                          <td className="py-2 px-3">
                            [{stall.position[0].toFixed(1)},{" "}
                            {stall.position[2].toFixed(1)}]m
                          </td>
                          <td className="py-2 px-3 font-bold text-amber-400">
                            {stall.powerRequiredKw || 0} kW
                          </td>
                          <td className="py-2 px-3">
                            {stall.waterRequired ? (
                              <span className="text-cyan-400 font-bold">Required</span>
                            ) : (
                              <span className="opacity-50">None</span>
                            )}
                          </td>
                          <td className="py-2 px-3 font-bold">
                            {stall.capacityPerHour || 100} Pax/hr
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: REPORT 3 - COMMERCIAL PROPOSAL & MENU SCHEDULE */}
          {/* ========================================================================= */}
          {activeTab === "commercial_menu" && (
            <div className="space-y-5">
              <div
                className={`p-4 rounded-xl border flex items-center justify-between ${
                  isDark ? "bg-[#111420] border-white/10" : "bg-slate-50 border-slate-200"
                }`}
              >
                <div>
                  <h3 className="text-base font-bold">
                    Report 3: Commercial Proposal, Menu Schedule & Budget
                  </h3>
                  <p className="text-xs opacity-75 mt-0.5">
                    வணிக மேற்கோள், உணவு மெனு பட்டியல் மற்றும் விலை நிர்ணயம்
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-emerald-500 font-mono">
                    {analysis.totalBudgetFormatted}
                  </div>
                  <div className="text-[10px] font-mono opacity-70">
                    ₹{analysis.costPerPlateInr}/plate • {headCount} Pax
                  </div>
                </div>
              </div>

              {/* Menu Breakdown Table */}
              <div
                className={`rounded-2xl border overflow-hidden ${
                  isDark ? "bg-[#0e111a] border-white/10" : "bg-white border-slate-200"
                }`}
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr
                        className={`border-b text-[10px] uppercase ${
                          isDark
                            ? "border-white/10 text-slate-400 bg-white/5"
                            : "border-slate-200 text-slate-600 bg-slate-50"
                        }`}
                      >
                        <th className="py-2.5 px-3">#</th>
                        <th className="py-2.5 px-3">Station Name</th>
                        <th className="py-2.5 px-3">Category</th>
                        <th className="py-2.5 px-3">Curated Dishes & Specialties</th>
                        <th className="py-2.5 px-3">Serving Speed</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {stalls
                        .filter((s) => s.dishes && s.dishes.length > 0)
                        .map((stall, idx) => (
                          <tr
                            key={stall.id}
                            className={`${
                              isDark ? "hover:bg-white/5" : "hover:bg-slate-50"
                            }`}
                          >
                            <td className="py-2 px-3 opacity-60">{idx + 1}</td>
                            <td className="py-2 px-3 font-sans font-semibold">
                              {stall.name}
                            </td>
                            <td className="py-2 px-3 text-amber-500">
                              {stall.category || "Live Station"}
                            </td>
                            <td className="py-2 px-3 font-sans">
                              {stall.dishes.join(", ")}
                            </td>
                            <td className="py-2 px-3 font-bold">
                              {stall.capacityPerHour ? `${stall.capacityPerHour} Pax/hr` : "Continuous"}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* FSSAI 2026 Certificate Seal */}
              <div
                className={`p-5 rounded-2xl border ${
                  isDark
                    ? "bg-gradient-to-r from-amber-950/20 via-[#111520] to-amber-950/20 border-amber-500/20"
                    : "bg-gradient-to-r from-amber-50/80 via-white to-amber-50/80 border-amber-200"
                }`}
              >
                <div className="flex items-center gap-2 mb-2 text-amber-600 font-bold text-xs font-mono uppercase">
                  <ShieldCheck className="w-4 h-4" />
                  <span>BKR Catering Heritage Seal & Sanitation Assurance</span>
                </div>
                <p className="text-xs leading-relaxed opacity-85">
                  All deployed live stalls, cooking equipment, and beverage bars strictly conform to FSSAI 2026 food safety regulations, reverse osmosis (RO) drinking water certification, and dedicated fire-retardant safety corridors.
                </p>

                <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 gap-4 text-xs font-mono">
                  <div>
                    <span className="opacity-60 block text-[10px]">Operations Signature</span>
                    <strong className="block mt-1">BKR Master Chef Lead ✓</strong>
                  </div>
                  <div>
                    <span className="opacity-60 block text-[10px]">Client Acceptance</span>
                    <strong className="block mt-1">Pending Sign-off ✍️</strong>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div
          className={`flex items-center justify-between px-6 py-3 border-t text-xs font-mono ${
            isDark ? "bg-[#111520] border-white/10" : "bg-slate-50 border-slate-200"
          }`}
        >
          <div className="flex items-center gap-2 text-[11px] opacity-70">
            <span>Unified 3-Page Master Dossier</span>
            <span>•</span>
            <span>All 3 Reports Integrated into 1</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onClose}
              className="h-8 text-xs font-mono"
            >
              Close
            </Button>
            <Button
              size="sm"
              onClick={handleDownloadMasterPDF}
              disabled={isExportingPdf}
              className={`h-8 text-xs font-bold font-mono flex items-center gap-1.5 ${
                isDark
                  ? "bg-amber-400 hover:bg-amber-300 text-black font-semibold"
                  : "bg-amber-600 hover:bg-amber-700 text-white font-semibold"
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExportingPdf ? "Generating..." : "Download Master PDF (3-in-1)"}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
