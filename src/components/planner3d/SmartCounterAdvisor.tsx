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
  IndianRupee,
  Layers,
  Image as ImageIcon,
} from "lucide-react";
import {
  StallItem,
  BudgetTier,
  CapacityAnalysis,
  StallType,
} from "@/types/planner3d";
import { STALL_CATALOG } from "@/services/planner3dService";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SmartCounterAdvisorProps {
  headCount: number;
  onHeadCountChange: (count: number) => void;
  budgetTier: BudgetTier;
  onBudgetTierChange: (tier: BudgetTier) => void;
  analysis: CapacityAnalysis;
  stalls: StallItem[];
  onAddStall: (type: StallType) => void;
  onDuplicateStall: (stallId: string) => void;
  onRemoveStall: (stallId: string) => void;
  onApplyOptimalLayout: () => void;
  onOpenCustomStallModal?: () => void;
}

export const SmartCounterAdvisor: React.FC<SmartCounterAdvisorProps> = ({
  headCount,
  onHeadCountChange,
  budgetTier,
  onBudgetTierChange,
  analysis,
  stalls,
  onAddStall,
  onDuplicateStall,
  onRemoveStall,
  onApplyOptimalLayout,
  onOpenCustomStallModal,
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
    <div className="flex flex-col h-full overflow-y-auto space-y-4 p-4 text-sm scrollbar-thin">
      {/* 1. Headcount & Crowd Planning (Up to 1 Lakh Pax) */}
      <div className="space-y-3 bg-white/5 dark:bg-white/[0.03] p-3.5 rounded-xl border border-line backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-[#00f5d4] dark:text-[#00f5d4]" />
            <span className="font-semibold text-ink">Guest Head Count</span>
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
                className="h-7 w-24 text-xs font-mono font-bold bg-surf border-[#00f5d4]"
              />
              <Button size="sm" onClick={handleHeadcountSubmit} className="h-7 px-2 text-[10px] bg-[#00f5d4] text-black">
                OK
              </Button>
            </div>
          ) : (
            <button
              onClick={() => {
                setHeadcountInput(headCount.toString());
                setIsEditingHeadcount(true);
              }}
              title="Click to type custom guest count"
              className="text-sm font-bold text-ink font-mono px-2.5 py-0.5 rounded bg-surf-2 border border-line hover:border-[#00f5d4] transition-colors"
            >
              {analysis.headCountFormatted} <span className="text-xs font-normal text-mute">pax</span>
            </button>
          )}
        </div>

        {/* Dynamic Headcount Slider */}
        <Slider
          value={[headCount <= 5000 ? headCount : 5000]}
          onValueChange={([val]) => onHeadCountChange(val)}
          min={50}
          max={5000}
          step={50}
          className="py-1"
        />

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
                  ? "bg-[#00f5d4]/20 border-[#00f5d4] text-[#00f5d4] font-bold"
                  : "bg-surf border-line text-mute hover:text-ink"
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Budget Tier & Indian Rupees (₹ INR) Calculations */}
      <div className="space-y-2.5 bg-white/5 dark:bg-white/[0.03] p-3.5 rounded-xl border border-line backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IndianRupee className="h-4 w-4 text-[#d8b36d]" />
            <span className="font-semibold text-ink">Catering Budget (₹ INR)</span>
          </div>
          <span className="text-sm font-extrabold text-[#d8b36d] font-mono">
            {analysis.totalBudgetFormatted}
          </span>
        </div>

        {/* Budget Tiers */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: "economy", label: "Economy", rate: "₹380" },
            { id: "classic", label: "Classic", rate: "₹650" },
            { id: "grandeur", label: "Grandeur", rate: "₹1,250" },
          ].map((tier) => (
            <button
              key={tier.id}
              onClick={() => onBudgetTierChange(tier.id as BudgetTier)}
              className={`py-2 px-1 rounded-xl border transition-all text-center flex flex-col items-center ${
                budgetTier === tier.id
                  ? "bg-[#d8b36d]/20 border-[#d8b36d] text-[#d8b36d] font-bold shadow-sm"
                  : "bg-surf border-line text-mute hover:text-ink"
              }`}
            >
              <span className="text-xs font-semibold capitalize">{tier.label}</span>
              <span className="text-[10px] opacity-80 font-mono mt-0.5">{tier.rate} / pl</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Live Capacity & Queue Wait Analytics */}
      <div className="space-y-3 bg-white/5 dark:bg-white/[0.03] p-3.5 rounded-xl border border-line backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[#00f5d4]" />
            <span className="font-semibold text-ink">Queue Flow Diagnostics</span>
          </div>
          <Badge
            variant="outline"
            className={`text-xs px-2 py-0.5 font-bold ${
              isCongested
                ? "bg-rose-500/15 text-rose-400 border-rose-500/30 animate-pulse"
                : isModerate
                ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
            }`}
          >
            {isCongested ? "Bottleneck Alert" : isModerate ? "Moderate Queue" : "Smooth Flow"}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="p-2.5 rounded-lg bg-surf-2 border border-line">
            <span className="text-[11px] text-mute block">Serving Speed</span>
            <span className="text-base font-bold text-ink font-mono">
              {analysis.totalServingCapacityPerHour}
            </span>
            <span className="text-[10px] text-mute block">guests / hour</span>
          </div>

          <div className="p-2.5 rounded-lg bg-surf-2 border border-line">
            <span className="text-[11px] text-mute block">Avg Wait Time</span>
            <span
              className={`text-base font-bold font-mono ${
                analysis.estimatedWaitMinutes > 15
                  ? "text-rose-400"
                  : analysis.estimatedWaitMinutes > 8
                  ? "text-amber-400"
                  : "text-emerald-400"
              }`}
            >
              ~{analysis.estimatedWaitMinutes} min
            </span>
            <span className="text-[10px] text-mute block">per guest line</span>
          </div>
        </div>

        {/* Live Dosa Counter Duplication Status */}
        <div className="p-3 rounded-lg border border-[#f59e0b]/30 bg-[#f59e0b]/5 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#f59e0b] flex items-center gap-1.5">
              <Utensils className="h-3.5 w-3.5" />
              Live Dosa Stations
            </span>
            <span className="text-xs font-bold font-mono text-ink">
              {analysis.dosaCounterCount} active / {analysis.recommendedDosaCounters} recommended
            </span>
          </div>

          {analysis.dosaCounterCount < analysis.recommendedDosaCounters ? (
            <div className="space-y-2">
              <p className="text-[11px] text-rose-300 leading-snug">
                ⚠️ Single Dosa griddle produces ~80 dosas/hr. For {analysis.headCountFormatted} guests,
                wait time will be <strong>~{analysis.dosaWaitMinutes} mins</strong>! We recommend
                duplicating to <strong>{analysis.recommendedDosaCounters}x counters</strong> (North &
                South wings).
              </p>
              <Button
                size="sm"
                onClick={() => onAddStall("dosa")}
                className="w-full h-8 text-xs bg-[#f59e0b] hover:bg-[#d97706] text-black font-bold rounded-lg shadow-md flex items-center justify-center gap-1.5"
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
        <div className="p-2.5 rounded-lg border border-[#14b8a6]/30 bg-[#14b8a6]/5 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#14b8a6] flex items-center gap-1.5">
              <Droplet className="h-3.5 w-3.5" />
              Handwash Stations (கை கழுவும் இடம்)
            </span>
            <span className="text-xs font-mono font-bold text-ink">
              {analysis.activeHandwashCount} active / {analysis.handwashRequiredCount} needed
            </span>
          </div>
          {analysis.activeHandwashCount < analysis.handwashRequiredCount && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAddStall("handwash_station")}
              className="w-full h-7 text-[11px] border-[#14b8a6]/40 text-[#14b8a6] hover:bg-[#14b8a6]/10 mt-1"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Handwash Station ({analysis.activeHandwashCount}/{analysis.handwashRequiredCount})
            </Button>
          )}
        </div>
      </div>

      {/* 4. Instant 3D Stall Generator Button */}
      {onOpenCustomStallModal && (
        <button
          onClick={onOpenCustomStallModal}
          className="w-full p-3 rounded-xl bg-gradient-to-r from-[#8b5cf6]/20 via-[#a855f7]/15 to-[#00f5d4]/20 border border-[#8b5cf6]/40 hover:border-[#8b5cf6] transition-all flex items-center justify-between text-left group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#8b5cf6] text-white flex items-center justify-center shrink-0 shadow-md">
              <ImageIcon className="h-4 w-4" />
            </div>
            <div>
              <span className="font-bold text-xs text-ink block group-hover:text-[#00f5d4] transition-colors">
                Photo-to-3D Stall Generator
              </span>
              <span className="text-[10px] text-mute block">
                Upload custom stall picture & render on-spot
              </span>
            </div>
          </div>
          <Plus className="h-4 w-4 text-[#8b5cf6] group-hover:scale-110 transition-transform" />
        </button>
      )}

      {/* 5. Actionable Advice & Upgrades */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-xs tracking-wider uppercase text-mute">
            Smart Recommendations
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onApplyOptimalLayout}
            className="h-7 text-xs text-[#00f5d4] hover:text-[#00f5d4] hover:bg-[#00f5d4]/10 flex items-center gap-1 font-semibold"
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
                ? "bg-sky-950/20 border-sky-500/30 text-sky-200"
                : "bg-amber-950/20 border-amber-500/30 text-amber-200"
            }`}
          >
            <div className="font-bold flex items-center gap-1.5">
              {advice.type === "warning" ? (
                <AlertTriangle className="h-3.5 w-3.5 text-rose-400 shrink-0" />
              ) : (
                <Sparkles className="h-3.5 w-3.5 text-[#00f5d4] shrink-0" />
              )}
              {advice.title}
            </div>
            <p className="text-[11px] opacity-90 leading-relaxed">{advice.description}</p>
            {advice.actionLabel && advice.stallTypeToAdd && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddStall(advice.stallTypeToAdd!)}
                className="h-7 text-[11px] mt-1 border-current hover:bg-white/10 rounded-lg flex items-center gap-1 font-semibold"
              >
                <Plus className="h-3 w-3" />
                {advice.actionLabel}
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* 6. Active 3D Stalls Breakdown */}
      <div className="space-y-2 bg-white/5 dark:bg-white/[0.03] p-3 rounded-xl border border-line backdrop-blur-md">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-xs tracking-wider uppercase text-mute">
            Active Stalls ({stalls.length})
          </span>
          <span className="text-[11px] text-mute font-mono">
            Total kW: {stalls.reduce((acc, s) => acc + s.powerRequiredKw, 0).toFixed(1)} kW
          </span>
        </div>

        <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1 scrollbar-thin">
          {stalls.map((stall) => (
            <div
              key={stall.id}
              className="flex items-center justify-between p-2 rounded-lg bg-surf border border-line hover:border-[#00f5d4]/40 transition-colors text-xs"
            >
              <div className="flex items-center gap-2 truncate">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: stall.accentColor }}
                />
                <span className="truncate font-medium text-ink">{stall.name}</span>
                {stall.wing && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-surf-2 text-mute">
                    {stall.wing}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 shrink-0 ml-2">
                <button
                  onClick={() => onDuplicateStall(stall.id)}
                  title="Duplicate this stall"
                  className="p-1 text-mute hover:text-[#00f5d4] transition-colors"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => onRemoveStall(stall.id)}
                  title="Remove stall"
                  className="p-1 text-mute hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
