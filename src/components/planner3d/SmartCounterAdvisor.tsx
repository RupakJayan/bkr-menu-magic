import React, { useState } from "react";
import {
  Users,
  Clock,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Plus,
  Trash2,
  TrendingUp,
  Utensils,
  Droplet,
  Layers,
  Image as ImageIcon,
  Sliders,
  Maximize2,
  Compass,
} from "lucide-react";
import {
  StallItem,
  CapacityAnalysis,
  StallType,
} from "@/types/planner3d";
import { STALL_CATALOG } from "@/services/planner3dService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SmartCounterAdvisorProps {
  headCount: number;
  onHeadCountChange: (count: number) => void;
  analysis: CapacityAnalysis;
  stalls: StallItem[];
  onAddStall: (type: StallType) => void;
  onDuplicateStall: (stallId: string) => void;
  onRemoveStall: (stallId: string) => void;
  onApplyOptimalLayout: () => void;
  onOpenCustomStallModal?: () => void;
  onOpenBriefingModal?: () => void;
}

export const SmartCounterAdvisor: React.FC<SmartCounterAdvisorProps> = ({
  headCount,
  onHeadCountChange,
  analysis,
  stalls,
  onAddStall,
  onDuplicateStall,
  onRemoveStall,
  onApplyOptimalLayout,
  onOpenCustomStallModal,
  onOpenBriefingModal,
}) => {
  const isCongested = analysis.queueStatus === "congested";
  const isModerate = analysis.queueStatus === "moderate";

  const [isEditingHeadcount, setIsEditingHeadcount] = useState(false);
  const [headcountInput, setHeadcountInput] = useState(headCount.toString());

  const handleHeadcountSubmit = () => {
    const parsed = parseInt(headcountInput.replace(/,/g, ""), 10);
    if (!isNaN(parsed) && parsed >= 50) {
      onHeadCountChange(Math.min(100000, parsed));
    }
    setIsEditingHeadcount(false);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto space-y-4 p-4 text-sm scrollbar-thin font-body text-[#f4efe6]">
      
      {/* Studio Briefing Shortcut Banner */}
      {onOpenBriefingModal && (
        <button
          onClick={onOpenBriefingModal}
          className="w-full p-3 rounded-xl bg-[#161822] border border-white/[0.08] hover:border-[#e2c99a]/50 transition-all flex items-center justify-between text-left group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#222532] text-[#e2c99a] flex items-center justify-center shrink-0 border border-white/[0.08]">
              <Sliders className="h-4 w-4" />
            </div>
            <div>
              <span className="font-bold text-xs text-white group-hover:text-[#e2c99a] transition-colors font-display">
                Studio Event Briefing
              </span>
              <span className="text-[10px] text-[#8e95a5] block font-mono">
                Speech or Custom prompt staging
              </span>
            </div>
          </div>
          <span className="text-[11px] font-mono text-[#e2c99a] group-hover:translate-x-0.5 transition-transform">
            Edit →
          </span>
        </button>
      )}

      {/* 1. Headcount & Crowd Planning (Up to 1 Lakh Pax) */}
      <div className="space-y-3 bg-[#13151c] p-3.5 rounded-xl border border-white/[0.08]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-[#e2c99a]" />
            <span className="font-semibold text-white font-display">Guest Head Count</span>
          </div>

          {isEditingHeadcount ? (
            <div className="flex items-center gap-1">
              <Input
                type="number"
                value={headcountInput}
                onChange={(e) => setHeadcountInput(e.target.value)}
                onBlur={handleHeadcountSubmit}
                onKeyDown={(e) => e.key === "Enter" && handleHeadcountSubmit()}
                autoFocus
                className="h-7 w-24 text-xs font-mono font-bold bg-[#0c0d12] border-[#e2c99a] text-white"
              />
              <Button size="sm" onClick={handleHeadcountSubmit} className="h-7 px-2 text-[10px] bg-[#e2c99a] text-black">
                OK
              </Button>
            </div>
          ) : (
            <button
              onClick={() => {
                setHeadcountInput(headCount.toString());
                setIsEditingHeadcount(true);
              }}
              className="text-sm font-extrabold text-[#e2c99a] font-mono hover:underline"
              title="Click to type exact headcount"
            >
              {headCount.toLocaleString("en-IN")} Pax ✎
            </button>
          )}
        </div>

        {/* Quick Headcount Presets from 300 to 1 Lakh */}
        <div className="grid grid-cols-5 gap-1 pt-1">
          {[
            { val: 300, label: "300" },
            { val: 600, label: "600" },
            { val: 1500, label: "1.5K" },
            { val: 5000, label: "5K" },
            { val: 100000, label: "1 Lakh" },
          ].map((chip) => (
            <button
              key={chip.val}
              onClick={() => onHeadCountChange(chip.val)}
              className={`py-1 text-[11px] rounded-lg border transition-all font-mono ${
                headCount === chip.val
                  ? "bg-[#e2c99a] border-[#e2c99a] text-black font-bold shadow-sm"
                  : "bg-[#181a24] border-white/[0.06] text-[#8e95a5] hover:text-white"
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Live Capacity & Queue Wait Analytics */}
      <div className="space-y-3 bg-[#13151c] p-3.5 rounded-xl border border-white/[0.08]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[#e2c99a]" />
            <span className="font-semibold text-white font-display">Queue Flow Diagnostics</span>
          </div>
          <Badge
            variant="outline"
            className={`text-xs px-2 py-0.5 font-bold ${
              isCongested
                ? "bg-rose-500/15 text-rose-300 border-rose-500/30 animate-pulse"
                : isModerate
                ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                : "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
            }`}
          >
            {isCongested ? "Bottleneck Alert" : isModerate ? "Moderate Queue" : "Smooth Flow"}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-2 text-center font-mono">
          <div className="p-2.5 rounded-lg bg-[#0e1017] border border-white/[0.06]">
            <span className="text-[11px] text-[#8e95a5] block">Serving Speed</span>
            <span className="text-base font-bold text-white">
              {analysis.totalServingCapacityPerHour}
            </span>
            <span className="text-[10px] text-[#8e95a5] block">guests / hour</span>
          </div>

          <div className="p-2.5 rounded-lg bg-[#0e1017] border border-white/[0.06]">
            <span className="text-[11px] text-[#8e95a5] block">Avg Wait Time</span>
            <span
              className={`text-base font-bold ${
                analysis.estimatedWaitMinutes > 15
                  ? "text-rose-400"
                  : analysis.estimatedWaitMinutes > 8
                  ? "text-amber-400"
                  : "text-emerald-400"
              }`}
            >
              ~{analysis.estimatedWaitMinutes} min
            </span>
            <span className="text-[10px] text-[#8e95a5] block">per guest line</span>
          </div>
        </div>

        {/* Live Dosa Counter Duplication Status */}
        <div className="p-3 rounded-lg border border-[#c5a059]/30 bg-[#c5a059]/10 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#e2c99a] flex items-center gap-1.5 font-display">
              <Utensils className="h-3.5 w-3.5" />
              Live Dosa Stations
            </span>
            <span className="text-xs font-bold font-mono text-white">
              {analysis.dosaCounterCount} active / {analysis.recommendedDosaCounters} recommended
            </span>
          </div>

          {analysis.dosaCounterCount < analysis.recommendedDosaCounters ? (
            <div className="space-y-2">
              <p className="text-[11px] text-amber-200/90 leading-snug">
                ⚠️ Single Dosa griddle produces ~80 dosas/hr. For {analysis.headCountFormatted} guests,
                wait time will be <strong>~{analysis.dosaWaitMinutes} mins</strong>! We recommend
                duplicating to <strong>{analysis.recommendedDosaCounters}x counters</strong> (North &
                South wings).
              </p>
              <Button
                size="sm"
                onClick={() => onAddStall("dosa")}
                className="w-full h-8 text-xs bg-[#e2c99a] hover:bg-[#c5a059] text-black font-bold rounded-lg shadow-md flex items-center justify-center gap-1.5 transition-transform active:scale-95"
              >
                <Copy className="h-3.5 w-3.5" />
                Duplicate Dosa Counter Now
              </Button>
            </div>
          ) : (
            <p className="text-[11px] text-emerald-300 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
              Optimal Dosa balance ({analysis.dosaCounterCount}x deployed). Queue wait under 4 mins.
            </p>
          )}
        </div>

        {/* Handwash Stations Status */}
        <div className="p-2.5 rounded-lg border border-white/[0.08] bg-[#0e1017] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#e2c99a] flex items-center gap-1.5 font-display">
              <Droplet className="h-3.5 w-3.5" />
              Handwash Stations (கை கழுவும் இடம்)
            </span>
            <span className="text-xs font-mono font-bold text-white">
              {analysis.activeHandwashCount} active / {analysis.handwashRequiredCount} needed
            </span>
          </div>
          {analysis.activeHandwashCount < analysis.handwashRequiredCount && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAddStall("handwash_station")}
              className="w-full h-7 text-[11px] border-white/20 text-[#e2c99a] hover:bg-white/5 mt-1 font-mono"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Handwash Station ({analysis.activeHandwashCount}/{analysis.handwashRequiredCount})
            </Button>
          )}
        </div>
      </div>

      {/* 3. Instant 3D Stall Generator Button */}
      {onOpenCustomStallModal && (
        <button
          onClick={onOpenCustomStallModal}
          className="w-full p-3 rounded-xl bg-[#161822] border border-white/[0.08] hover:border-[#e2c99a]/50 transition-all flex items-center justify-between text-left group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#222532] text-[#e2c99a] flex items-center justify-center shrink-0 border border-white/[0.08]">
              <ImageIcon className="h-4 w-4" />
            </div>
            <div>
              <span className="font-bold text-xs text-white group-hover:text-[#e2c99a] transition-colors font-display">
                Photo-to-3D Stall Generator
              </span>
              <span className="text-[10px] text-[#8e95a5] block font-mono">
                Upload custom stall picture & render on-spot
              </span>
            </div>
          </div>
          <Plus className="h-4 w-4 text-[#e2c99a] group-hover:scale-110 transition-transform" />
        </button>
      )}

      {/* 4. Actionable Advice & Upgrades */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-xs tracking-wider uppercase text-[#8e95a5] font-mono">
            Smart Recommendations
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onApplyOptimalLayout}
            className="h-7 text-xs text-[#e2c99a] hover:text-[#e2c99a] hover:bg-[#e2c99a]/10 flex items-center gap-1 font-semibold"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Auto-Balance 3D Scene
          </Button>
        </div>

        {analysis.adviceList.map((advice, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-xl border text-xs space-y-1.5 transition-all ${
              advice.type === "warning"
                ? "bg-rose-950/20 border-rose-500/30 text-rose-200"
                : advice.type === "upgrade"
                ? "bg-amber-950/20 border-[#c5a059]/30 text-amber-100"
                : "bg-[#161822] border-white/[0.08] text-[#f4efe6]"
            }`}
          >
            <div className="font-bold flex items-center gap-1.5 font-display">
              {advice.type === "warning" ? (
                <AlertTriangle className="h-3.5 w-3.5 text-rose-400 shrink-0" />
              ) : (
                <Sparkles className="h-3.5 w-3.5 text-[#e2c99a] shrink-0" />
              )}
              {advice.title}
            </div>
            <p className="text-[11px] opacity-90 leading-relaxed font-body">{advice.description}</p>
            {advice.actionLabel && advice.stallTypeToAdd && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddStall(advice.stallTypeToAdd!)}
                className="h-7 text-[11px] mt-1 border-white/20 text-[#e2c99a] hover:bg-white/10 rounded-lg flex items-center gap-1 font-semibold"
              >
                <Plus className="h-3 w-3" />
                {advice.actionLabel}
              </Button>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};
