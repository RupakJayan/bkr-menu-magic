import React, { useState } from "react";
import {
  Users,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Plus,
  TrendingUp,
  Utensils,
  Droplet,
  Image as ImageIcon,
  Sliders,
} from "lucide-react";
import {
  StallItem,
  CapacityAnalysis,
  StallType,
} from "@/types/planner3d";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhysicsHoverCard } from "@/components/ui/PhysicsHoverCard";
import {
  CrosshairVector,
  DimensionCaliperVector,
  QueuingCurveVector,
  DatumVector,
} from "@/components/ui/VectorIcons";

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
  isDark?: boolean;
}

export const SmartCounterAdvisor: React.FC<SmartCounterAdvisorProps> = ({
  headCount,
  onHeadCountChange,
  analysis,
  onAddStall,
  onApplyOptimalLayout,
  onOpenCustomStallModal,
  onOpenBriefingModal,
  isDark = true,
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

  // Erlang-C mathematical parameters
  const arrivalRateLambda = Math.round(headCount / 1.5); // Pax per peak hour
  const serviceRateMu = 120; // 120 units per counter per hour
  const channelsC = Math.max(1, analysis.dosaCounterCount);
  const trafficIntensity = Math.min(0.99, Math.round((arrivalRateLambda / (channelsC * serviceRateMu)) * 100) / 100);

  return (
    <div
      className={`flex flex-col h-full overflow-y-auto space-y-4 p-4 text-sm scrollbar-thin font-sans select-none transition-colors ${
        isDark ? "bg-[#11131a] text-[#f4efe6]" : "bg-white text-slate-900"
      }`}
    >
      {/* Studio Briefing Shortcut Banner */}
      {onOpenBriefingModal && (
        <PhysicsHoverCard
          maxTilt={4}
          onClick={onOpenBriefingModal}
          className={`w-full p-3 rounded-xl border transition-all flex items-center justify-between text-left group cursor-pointer ${
            isDark
              ? "bg-[#141620] border-white/[0.08] hover:border-[#f0c889]/50"
              : "bg-slate-50 border-slate-200 hover:border-[#b38238]/60 shadow-sm"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                isDark
                  ? "bg-[#202330] text-[#f0c889] border-white/[0.08]"
                  : "bg-amber-50 text-[#b38238] border-amber-200"
              }`}
            >
              <Sliders className="h-4 w-4" />
            </div>
            <div>
              <span
                className={`font-bold text-xs group-hover:underline transition-colors font-mono block ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                EVENT BRIEFING // STAGE 01
              </span>
              <span className={`text-[10px] block font-mono ${isDark ? "text-neutral-400" : "text-slate-500"}`}>
                Voice intake &amp; venue parameter staging
              </span>
            </div>
          </div>
          <span
            className={`text-[11px] font-mono font-bold group-hover:translate-x-0.5 transition-transform ${
              isDark ? "text-[#f0c889]" : "text-[#b38238]"
            }`}
          >
            Edit →
          </span>
        </PhysicsHoverCard>
      )}

      {/* 1. Headcount & Crowd Planning (Up to 1 Lakh Pax) */}
      <PhysicsHoverCard
        maxTilt={3}
        className={`space-y-3 p-3.5 rounded-xl border ${
          isDark ? "bg-[#11131a] border-white/[0.08]" : "bg-slate-50 border-slate-200 shadow-sm"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className={`h-4 w-4 ${isDark ? "text-[#f0c889]" : "text-[#b38238]"}`} />
            <span
              className={`font-semibold text-xs font-mono uppercase ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              GUEST HEADCOUNT
            </span>
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
                className={`h-7 w-24 text-xs font-mono font-bold ${
                  isDark
                    ? "bg-[#0c0d12] border-[#f0c889] text-white"
                    : "bg-white border-[#b38238] text-slate-900"
                }`}
              />
              <Button
                size="sm"
                onClick={handleHeadcountSubmit}
                className={`h-7 px-2 text-[10px] font-mono font-bold ${
                  isDark ? "bg-[#f0c889] text-black" : "bg-[#b38238] text-white"
                }`}
              >
                OK
              </Button>
            </div>
          ) : (
            <button
              onClick={() => {
                setHeadcountInput(headCount.toString());
                setIsEditingHeadcount(true);
              }}
              className={`text-xs font-bold font-mono hover:underline flex items-center gap-1 ${
                isDark ? "text-[#f0c889]" : "text-[#b38238]"
              }`}
              title="Click to edit headcount"
            >
              <span>{headCount.toLocaleString("en-IN")} PAX</span>
              <span className={`text-[10px] ${isDark ? "text-neutral-400" : "text-slate-500"}`}>[EDIT]</span>
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
            { val: 100000, label: "100K" },
          ].map((chip) => (
            <button
              key={chip.val}
              onClick={() => onHeadCountChange(chip.val)}
              className={`py-1 text-[10px] rounded-md border transition-all font-mono font-semibold ${
                headCount === chip.val
                  ? isDark
                    ? "bg-[#f0c889] border-[#f0c889] text-black font-bold shadow-sm"
                    : "bg-[#b38238] border-[#b38238] text-white font-bold shadow-sm"
                  : isDark
                  ? "bg-[#161822] border-white/[0.06] text-neutral-400 hover:text-white"
                  : "bg-white border-slate-200 text-slate-600 hover:text-slate-900"
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </PhysicsHoverCard>

      {/* 2. Scientific Queuing Theory Analytics (Erlang-C & Little's Law) */}
      <PhysicsHoverCard
        maxTilt={3}
        className={`space-y-3 p-3.5 rounded-xl border ${
          isDark ? "bg-[#11131a] border-white/[0.08]" : "bg-slate-50 border-slate-200 shadow-sm"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QueuingCurveVector size={16} className={isDark ? "text-[#f0c889]" : "text-[#b38238]"} />
            <span className={`font-semibold text-xs font-mono uppercase ${isDark ? "text-white" : "text-slate-900"}`}>
              QUEUING FLUIDICS
            </span>
          </div>
          <Badge
            variant="outline"
            className={`text-[10px] px-2 py-0.5 font-mono font-bold ${
              isCongested
                ? "bg-rose-500/15 text-rose-500 border-rose-500/30"
                : isModerate
                ? "bg-amber-500/15 text-amber-600 border-amber-500/30"
                : "bg-emerald-500/15 text-emerald-600 border-emerald-500/30"
            }`}
          >
            {isCongested ? "CONGESTED" : isModerate ? "MODERATE" : "LAMINAR FLOW"}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-2 text-center font-mono">
          <div className={`p-2.5 rounded-lg border ${isDark ? "bg-[#0e1017] border-white/[0.06]" : "bg-white border-slate-200"}`}>
            <span className={`text-[10px] block uppercase ${isDark ? "text-neutral-400" : "text-slate-500"}`}>THROUGHPUT</span>
            <span className={`text-base font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              {analysis.totalServingCapacityPerHour}
            </span>
            <span className={`text-[9px] block ${isDark ? "text-neutral-400" : "text-slate-500"}`}>PAX / HOUR</span>
          </div>

          <div className={`p-2.5 rounded-lg border ${isDark ? "bg-[#0e1017] border-white/[0.06]" : "bg-white border-slate-200"}`}>
            <span className={`text-[10px] block uppercase ${isDark ? "text-neutral-400" : "text-slate-500"}`}>WAIT TIME (Wq)</span>
            <span
              className={`text-base font-bold ${
                analysis.estimatedWaitMinutes > 15
                  ? "text-rose-500"
                  : analysis.estimatedWaitMinutes > 8
                  ? "text-amber-500"
                  : "text-emerald-500"
              }`}
            >
              {analysis.estimatedWaitMinutes}m
            </span>
            <span className={`text-[9px] block ${isDark ? "text-neutral-400" : "text-slate-500"}`}>INTENSITY: {trafficIntensity}</span>
          </div>
        </div>

        {/* Live Dosa Counter Duplication Status */}
        <div
          className={`p-3 rounded-lg border space-y-2 ${
            isDark ? "border-[#c5a059]/30 bg-[#c5a059]/10" : "border-amber-300 bg-amber-50/80"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-mono font-semibold flex items-center gap-1.5 ${isDark ? "text-[#f0c889]" : "text-[#b38238]"}`}>
              <Utensils className="h-3.5 w-3.5" />
              <span>LIVE DOSA BAYS</span>
            </span>
            <span className={`text-xs font-bold font-mono ${isDark ? "text-white" : "text-slate-900"}`}>
              {analysis.dosaCounterCount} DEPLOYED / {analysis.recommendedDosaCounters} REQ
            </span>
          </div>

          {analysis.dosaCounterCount < analysis.recommendedDosaCounters ? (
            <div className="space-y-2">
              <p className={`text-[11px] font-sans leading-snug ${isDark ? "text-amber-200/90" : "text-amber-900"}`}>
                Single griddle throughput is 80 units/hr. For {analysis.headCountFormatted} guests,
                wait times escalate to <strong>{analysis.dosaWaitMinutes} minutes</strong>. Deploy <strong>{analysis.recommendedDosaCounters}x stations</strong> across North and South wings.
              </p>
              <Button
                size="sm"
                onClick={() => onAddStall("dosa")}
                className={`w-full h-8 text-xs font-mono font-bold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-transform active:scale-95 ${
                  isDark ? "bg-[#f0c889] hover:bg-[#d4a359] text-black" : "bg-[#b38238] hover:bg-[#946824] text-white"
                }`}
              >
                <Copy className="h-3.5 w-3.5" />
                <span>DEPLOY SECOND DOSA STATION</span>
              </Button>
            </div>
          ) : (
            <p className={`text-[11px] font-mono flex items-center gap-1.5 ${isDark ? "text-emerald-300" : "text-emerald-700 font-semibold"}`}>
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
              <span>DUAL WING BALANCED // AVERAGE WAIT &lt; 4 MIN</span>
            </p>
          )}
        </div>

        {/* Handwash Stations Status */}
        <div className={`p-2.5 rounded-lg border space-y-1 ${isDark ? "border-white/[0.08] bg-[#0e1017]" : "border-slate-200 bg-white"}`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-mono font-semibold flex items-center gap-1.5 ${isDark ? "text-[#f0c889]" : "text-[#b38238]"}`}>
              <Droplet className="h-3.5 w-3.5 text-sky-500" />
              <span>HANDWASH CONCOURSE</span>
            </span>
            <span className={`text-xs font-mono font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              {analysis.activeHandwashCount} / {analysis.handwashRequiredCount}
            </span>
          </div>
          {analysis.activeHandwashCount < analysis.handwashRequiredCount && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAddStall("handwash_station")}
              className={`w-full h-7 text-[10px] mt-1 font-mono uppercase ${
                isDark
                  ? "border-white/20 text-[#f0c889] hover:bg-white/5"
                  : "border-slate-300 text-[#b38238] hover:bg-slate-100"
              }`}
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Concourse Sinks ({analysis.activeHandwashCount}/{analysis.handwashRequiredCount})
            </Button>
          )}
        </div>
      </PhysicsHoverCard>

      {/* 3. Photo-to-3D Stall Generator Shortcut */}
      {onOpenCustomStallModal && (
        <PhysicsHoverCard
          maxTilt={4}
          onClick={onOpenCustomStallModal}
          className={`w-full p-3 rounded-xl border transition-all flex items-center justify-between text-left group cursor-pointer ${
            isDark
              ? "bg-[#141620] border-white/[0.08] hover:border-[#f0c889]/50"
              : "bg-slate-50 border-slate-200 hover:border-[#b38238]/60 shadow-sm"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                isDark
                  ? "bg-[#202330] text-[#f0c889] border-white/[0.08]"
                  : "bg-amber-50 text-[#b38238] border-amber-200"
              }`}
            >
              <ImageIcon className="h-4 w-4" />
            </div>
            <div>
              <span
                className={`font-bold text-xs group-hover:underline transition-colors font-mono block ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                PHOTO // 3D STALL SYNTHESIS
              </span>
              <span className={`text-[10px] block font-mono ${isDark ? "text-neutral-400" : "text-slate-500"}`}>
                Reconstruct custom counter from photography
              </span>
            </div>
          </div>
          <Plus className={`h-4 w-4 group-hover:scale-110 transition-transform ${isDark ? "text-[#f0c889]" : "text-[#b38238]"}`} />
        </PhysicsHoverCard>
      )}

      {/* 4. Actionable Advice & Upgrades */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className={`font-bold text-[10px] tracking-wider uppercase font-mono ${isDark ? "text-neutral-400" : "text-slate-500"}`}>
            CAPACITY RECOMMENDATIONS
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onApplyOptimalLayout}
            className={`h-7 text-xs font-mono flex items-center gap-1 font-semibold ${
              isDark ? "text-[#f0c889] hover:text-white hover:bg-white/10" : "text-[#b38238] hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <CrosshairVector size={13} />
            <span>Auto-Balance</span>
          </Button>
        </div>

        {analysis.adviceList.map((advice, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-xl border text-xs space-y-1.5 transition-all ${
              advice.type === "warning"
                ? isDark
                  ? "bg-rose-950/20 border-rose-500/30 text-rose-200"
                  : "bg-rose-50 border-rose-200 text-rose-900"
                : advice.type === "upgrade"
                ? isDark
                  ? "bg-amber-950/20 border-[#c5a059]/30 text-amber-100"
                  : "bg-amber-50 border-amber-200 text-amber-950"
                : isDark
                ? "bg-[#141620] border-white/[0.08] text-[#f4efe6]"
                : "bg-slate-50 border-slate-200 text-slate-800"
            }`}
          >
            <div className="font-bold flex items-center gap-1.5 font-mono text-xs">
              {advice.type === "warning" ? (
                <AlertTriangle className="h-3.5 w-3.5 text-rose-500 shrink-0" />
              ) : (
                <DatumVector size={14} className={isDark ? "text-[#f0c889]" : "text-[#b38238]"} />
              )}
              {advice.title}
            </div>
            <p className="text-[11px] opacity-90 leading-relaxed font-sans">{advice.description}</p>
            {advice.actionLabel && advice.stallTypeToAdd && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddStall(advice.stallTypeToAdd!)}
                className={`h-7 text-[10px] mt-1 rounded-lg flex items-center gap-1 font-mono uppercase font-bold ${
                  isDark
                    ? "border-white/20 text-[#f0c889] hover:bg-white/10"
                    : "border-slate-300 text-[#b38238] hover:bg-slate-100"
                }`}
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
