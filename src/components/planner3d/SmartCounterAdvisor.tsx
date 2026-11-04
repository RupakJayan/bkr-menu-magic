import React from "react";
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
  DollarSign,
  Utensils,
  Layers,
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
}) => {
  const isCongested = analysis.queueStatus === "congested";
  const isModerate = analysis.queueStatus === "moderate";

  // Group stalls by type to show counts (e.g. Dosa x2)
  const stallCounts = stalls.reduce((acc, s) => {
    acc[s.type] = (acc[s.type] || 0) + 1;
    return acc;
  }, {} as Record<StallType, number>);

  return (
    <div className="flex flex-col h-full overflow-y-auto space-y-5 p-4 text-sm scrollbar-thin">
      {/* 1. Headcount & Crowd Planning */}
      <div className="space-y-3 bg-white/5 dark:bg-white/[0.03] p-3.5 rounded-xl border border-line backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-[#00f5d4] dark:text-[#00f5d4]" />
            <span className="font-semibold text-ink">Guest Head Count</span>
          </div>
          <span className="text-lg font-bold text-ink font-mono px-2 py-0.5 rounded bg-surf-2 border border-line">
            {headCount} <span className="text-xs font-normal text-mute">pax</span>
          </span>
        </div>

        <Slider
          value={[headCount]}
          onValueChange={([val]) => onHeadCountChange(val)}
          min={50}
          max={2000}
          step={25}
          className="py-1"
        />

        {/* Quick Headcount Presets */}
        <div className="flex items-center gap-1.5 pt-1">
          {[150, 300, 600, 1200].map((count) => (
            <button
              key={count}
              onClick={() => onHeadCountChange(count)}
              className={`flex-1 py-1 text-xs rounded-lg border transition-all ${
                headCount === count
                  ? "bg-[#00f5d4]/20 border-[#00f5d4] text-[#00f5d4] font-bold"
                  : "bg-surf border-line text-mute hover:text-ink"
              }`}
            >
              {count}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Budget Tier Selector */}
      <div className="space-y-2.5 bg-white/5 dark:bg-white/[0.03] p-3.5 rounded-xl border border-line backdrop-blur-md">
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-[#d8b36d]" />
          <span className="font-semibold text-ink">Budget Tier</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {(["economy", "classic", "grandeur"] as BudgetTier[]).map((tier) => (
            <button
              key={tier}
              onClick={() => onBudgetTierChange(tier)}
              className={`py-2 px-1 text-xs rounded-lg border capitalize font-medium transition-all text-center ${
                budgetTier === tier
                  ? "bg-[#d8b36d]/20 border-[#d8b36d] text-[#d8b36d] font-bold shadow-sm"
                  : "bg-surf border-line text-mute hover:text-ink"
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Live Capacity & Queue Wait Analytics */}
      <div className="space-y-3 bg-white/5 dark:bg-white/[0.03] p-3.5 rounded-xl border border-line backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[#00f5d4]" />
            <span className="font-semibold text-ink">Queue & Flow Diagnostics</span>
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
            <span className="text-xs text-mute block">Serving Speed</span>
            <span className="text-base font-bold text-ink font-mono">
              {analysis.totalServingCapacityPerHour}
            </span>
            <span className="text-[10px] text-mute block">guests / hour</span>
          </div>

          <div className="p-2.5 rounded-lg bg-surf-2 border border-line">
            <span className="text-xs text-mute block">Avg Wait Time</span>
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
                ⚠️ Single Dosa griddle produces only ~80 dosas/hr. For {headCount} guests, wait
                time will be <strong>~{analysis.dosaWaitMinutes} mins</strong>! We recommend
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
      </div>

      {/* 4. Actionable Advice & Upgrades */}
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

      {/* 5. Active 3D Stalls Breakdown */}
      <div className="space-y-2 bg-white/5 dark:bg-white/[0.03] p-3 rounded-xl border border-line backdrop-blur-md">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-xs tracking-wider uppercase text-mute">
            Active Stalls ({stalls.length})
          </span>
          <span className="text-[11px] text-mute font-mono">
            Total kW: {stalls.reduce((acc, s) => acc + s.powerRequiredKw, 0).toFixed(1)} kW
          </span>
        </div>

        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
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
