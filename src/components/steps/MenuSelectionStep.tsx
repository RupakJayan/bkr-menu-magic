import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { EventMenu } from "@/types/menu";
import { buildDishKey, findDishByKey, getManagedMenuCatalog, normalizeDishKeys, addCustomDishToCatalog } from "@/services/menuCatalogService";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Check, ChevronLeft, ChevronRight, Leaf, Mic, MicOff, Plus, Search, Sparkles, TrendingUp, Utensils, Volume2, X, Calendar, Layers, ArrowUpDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useVoiceTyping } from "@/hooks/useVoiceTyping";
import { useToast } from "@/hooks/use-toast";
import {
  getInstantTamilName,
  getInstantEnglishName,
  isTamilScript,
  guessCategoryForDish,
  toTitleCase,
  registerDishToDictionary,
  fetchAiTamilTranslation,
  romanizeTamilToEnglish,
} from "@/services/tamilTranslationService";
import { updateDishInCatalog } from "@/services/localAdminService";
import { SessionMenuManageDialog } from "@/components/menu/SessionMenuManageDialog";
import { AiVoiceAssistantDialog } from "@/components/ai/AiVoiceAssistantDialog";
import {
  insertDishInServingSequence,
  sortDishesByTraditionalCourse,
  sortDishesAlphabetical,
  sortDishesByCategory,
} from "@/services/servingOrderService";
import type { CatalogDish } from "@/types/menu";

interface MenuSelectionStepProps {
  menu: EventMenu;
  onMenuChange: (menu: EventMenu) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const MenuSelectionStep: React.FC<MenuSelectionStepProps> = ({
  menu,
  onMenuChange,
  onNext,
  onPrevious,
}) => {
  const { toast } = useToast();
  const [catalogVersion, setCatalogVersion] = useState(0);
  const menuData = useMemo(() => getManagedMenuCatalog(), [catalogVersion]);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [currentSessionIndex, setCurrentSessionIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    Object.keys(menuData)[0] || "Breakfast (Tiffin)",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isSessionManageOpen, setIsSessionManageOpen] = useState(false);
  const [isAiVoiceAssistantOpen, setIsAiVoiceAssistantOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Quick Add Custom Dish states
  const [customDishEn, setCustomDishEn] = useState("");
  const [customDishTa, setCustomDishTa] = useState("");
  const [customDishCategory, setCustomDishCategory] = useState("");
  const [isCustomExpanded, setIsCustomExpanded] = useState(false);
  const [isAiTranslatingCustom, setIsAiTranslatingCustom] = useState(false);
  const customAiTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Spoken Dish Confirmation State (Solves: "when i say something 'idly' it adds all relevant items ... optimize to confirm what i ask and proceed")
  const [pendingConfirmationDish, setPendingConfirmationDish] = useState<{
    dish: CatalogDish;
    phrase: string;
    alternatives: CatalogDish[];
  } | null>(null);
  const [requireVoiceConfirmation, setRequireVoiceConfirmation] = useState(true);

  const currentDay = menu.days[currentDayIndex];
  const currentSession = currentDay?.sessions[currentSessionIndex];

  // Close recommendations dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDish = (category: string, dishId: string) => {
    if (!currentSession) return;

    const updatedDays = [...menu.days];
    const session = updatedDays[currentDayIndex].sessions[currentSessionIndex];
    const dishKey = buildDishKey(category, dishId);
    session.selectedDishes = normalizeDishKeys(session.selectedDishes);

    if (session.selectedDishes.includes(dishKey)) {
      session.selectedDishes = session.selectedDishes.filter(
        (id) => id !== dishKey,
      );
    } else {
      // Intelligently insert into session's serving sequence according to authentic catering course order
      session.selectedDishes = insertDishInServingSequence(
        session.selectedDishes,
        dishKey
      );
    }

    onMenuChange({
      ...menu,
      days: updatedDays,
      updatedAt: new Date(),
    });
  };

  const handleNext = () => {
    // Move to next session or next day
    if (currentSessionIndex < currentDay.sessions.length - 1) {
      setCurrentSessionIndex(currentSessionIndex + 1);
    } else if (currentDayIndex < menu.days.length - 1) {
      setCurrentDayIndex(currentDayIndex + 1);
      setCurrentSessionIndex(0);
    } else {
      // All sessions completed
      onNext();
    }
  };

  const handlePrevious = () => {
    // Move to previous session or previous day
    if (currentSessionIndex > 0) {
      setCurrentSessionIndex(currentSessionIndex - 1);
    } else if (currentDayIndex > 0) {
      setCurrentDayIndex(currentDayIndex - 1);
      setCurrentSessionIndex(
        menu.days[currentDayIndex - 1].sessions.length - 1,
      );
    } else {
      // Go back to session planning
      onPrevious();
    }
  };

  const categories = useMemo(() => Object.keys(menuData) as Array<keyof typeof menuData>, [menuData]);

  const allCatalogItems = useMemo(() => {
    return categories.flatMap((cat) =>
      menuData[cat].map((item) => ({ ...item, category: cat }))
    );
  }, [categories, menuData]);

  const nextSessionInfo = useMemo(() => {
    if (!currentDay) return { name: "", isLast: true };
    if (currentSessionIndex < currentDay.sessions.length - 1) {
      return {
        name: currentDay.sessions[currentSessionIndex + 1].name,
        isLast: false,
      };
    } else if (currentDayIndex < menu.days.length - 1) {
      const nextDay = menu.days[currentDayIndex + 1];
      const nextSess = nextDay?.sessions[0]?.name || "Session 1";
      return {
        name: `Day ${nextDay.dayNumber} - ${nextSess}`,
        isLast: false,
      };
    } else {
      return {
        name: "Review & Pricing",
        isLast: true,
      };
    }
  }, [currentDay, currentSessionIndex, currentDayIndex, menu.days]);

  const {
    isListening,
    voiceMode,
    setVoiceMode,
    voiceLang,
    setVoiceLang,
    interimTranscript,
    recentResults,
    clearRecentResults,
    confirmAddDish,
    startListening,
    stopListening,
    toggleListening,
    isSupported: isVoiceSupported,
    errorMessage: voiceError,
  } = useVoiceTyping({
    catalogDishes: allCatalogItems,
    requireConfirmation: requireVoiceConfirmation,
    isConfirmationPending: !!pendingConfirmationDish,
    onDishRecognizedForConfirmation: (payload) => {
      setPendingConfirmationDish(payload);
    },
    onDishAdded: (dish) => {
      toggleDish(dish.category, dish.id);
    },
    onDishAlreadyAdded: (dish) => {
      toast({
        title: "Already in Menu! ℹ️",
        description: `"${dish.name_en}" (${dish.name_ta}) is already selected for this session.`,
      });
    },
    onCustomDishSpoken: (phrase: string) => {
      // Instantly provide accurate bilingual translation for voice-spoken items
      const isTa = isTamilScript(phrase);
      let nameEn = "";
      let nameTa = "";

      if (isTa) {
        nameTa = phrase.trim();
        const lookedUp = getInstantEnglishName(phrase);
        nameEn = (!lookedUp || isTamilScript(lookedUp)) ? romanizeTamilToEnglish(phrase) : lookedUp;
      } else {
        nameEn = toTitleCase(phrase);
        nameTa = getInstantTamilName(phrase) || "";
      }

      const cat = guessCategoryForDish(phrase) || selectedCategory || categories[0] || "Special Dishes";

      try {
        const created = addCustomDishToCatalog({
          category: cat,
          name_en: nameEn,
          name_ta: nameTa,
          isVegetarian: true,
        });

        // 1. Immediately register into bilingual culinary dictionary & aliases
        registerDishToDictionary(nameEn, nameTa, cat);

        // 2. In parallel, run AI background translation & enrichment (non-blocking)
        fetchAiTamilTranslation(phrase)
          .then((aiEnrich) => {
            if (aiEnrich) {
              const enrichedEn = (!aiEnrich.name_en || isTamilScript(aiEnrich.name_en))
                ? (nameEn || romanizeTamilToEnglish(phrase))
                : aiEnrich.name_en;
              const enrichedTa = aiEnrich.name_ta || nameTa;

              registerDishToDictionary(enrichedEn, enrichedTa, aiEnrich.category);
              updateDishInCatalog(cat, created.id, {
                name_en: enrichedEn,
                name_ta: enrichedTa,
                category: aiEnrich.category,
              });
              setCatalogVersion((v) => v + 1);
            }
          })
          .catch(() => {
            // Non-blocking fallback
          });

        setCatalogVersion((v) => v + 1);

        return {
          ...created,
          category: cat,
        };
      } catch (err: any) {
        console.error("Error creating spoken custom dish:", err);
        return null;
      }
    },
    onSearchQueryChange: (query) => {
      setSearchQuery(query);
      setIsSearchFocused(true);
      setHighlightedIndex(-1);
    },
    isDishAlreadySelected: (dish) => {
      if (!currentSession) return false;
      const key = buildDishKey(dish.category, dish.id);
      return currentSession.selectedDishes.includes(key);
    },
  });

  // Automatically clear voice activity, stop mic & reset pending confirmation on day or session switch
  // (Solves: "after adding to menu and switch to next session, it is still showing me the voice activity")
  useEffect(() => {
    stopListening();
    clearRecentResults();
    setPendingConfirmationDish(null);
    setIsSearchFocused(false);
  }, [currentDayIndex, currentSessionIndex, stopListening, clearRecentResults]);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  // Highlight matching substring like Google search suggestions
  const highlightMatch = (text: string | undefined, query: string) => {
    if (!text) return "";
    const trimmed = query.trim();
    if (!trimmed) return text;
    try {
      const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const parts = text.split(new RegExp(`(${escaped})`, "gi"));
      return parts.map((part, index) => {
        if (part.toLowerCase() === trimmed.toLowerCase()) {
          return (
            <span key={index} className="font-extrabold text-pink-600 underline decoration-pink-300">
              {part}
            </span>
          );
        }
        return part;
      });
    } catch {
      return text;
    }
  };

  // Popular / signature catering items for empty query state
  const popularDishes = useMemo(() => {
    const popularKeywords = ["jamun", "biryani", "sambar", "kesari", "poori", "paneer", "rasam", "vadai", "payasam", "dosa", "idli"];
    const matches = allCatalogItems.filter((item) => {
      const name = (item.name_en || item.name || "").toLowerCase();
      return popularKeywords.some((kw) => name.includes(kw));
    });
    return matches.length > 0 ? matches : allCatalogItems;
  }, [allCatalogItems]);

  // Google-style predictive suggestions (ranked by prefix match then substring)
  // No artificial limit of 8 - shows all matching recommendations smoothly scrollable!
  const suggestions = useMemo(() => {
    if (!normalizedQuery) {
      return popularDishes;
    }
    return allCatalogItems
      .filter((item) => {
        const nameEn = (item.name_en || item.name || "").toLowerCase();
        const nameTa = (item.name_ta || "").toLowerCase();
        const cat = item.category.toLowerCase();
        return (
          nameEn.includes(normalizedQuery) ||
          nameTa.includes(normalizedQuery) ||
          cat.includes(normalizedQuery)
        );
      })
      .sort((a, b) => {
        const aNameEn = (a.name_en || a.name || "").toLowerCase();
        const bNameEn = (b.name_en || b.name || "").toLowerCase();
        const aNameTa = (a.name_ta || "").toLowerCase();
        const bNameTa = (b.name_ta || "").toLowerCase();

        const aPrefix = aNameEn.startsWith(normalizedQuery) || aNameTa.startsWith(normalizedQuery) ? 2 : 1;
        const bPrefix = bNameEn.startsWith(normalizedQuery) || bNameTa.startsWith(normalizedQuery) ? 2 : 1;

        if (aPrefix !== bPrefix) return bPrefix - aPrefix;
        return aNameEn.localeCompare(bNameEn);
      });
  }, [allCatalogItems, normalizedQuery, popularDishes]);

  // Translate custom dish using Gemini 3.6 Flash AI with automatic dictionary fallback
  const translateCustomWithAi = useCallback(async (textToTranslate: string) => {
    const query = textToTranslate.trim();
    if (!query || query.length < 2) return;
    setIsAiTranslatingCustom(true);
    try {
      const aiResult = await fetchAiTamilTranslation(query);
      if (aiResult?.name_ta) {
        setCustomDishTa(aiResult.name_ta);
        if (aiResult.name_en && !isTamilScript(query)) {
          setCustomDishEn(aiResult.name_en);
        }
        if (aiResult.category) {
          setCustomDishCategory(aiResult.category);
        }
      }
    } catch (err) {
      console.warn("AI translation error:", err);
    } finally {
      setIsAiTranslatingCustom(false);
    }
  }, []);

  // Automatically pre-fill custom dish input fields with instant Tamil translation & debounced Gemini AI
  useEffect(() => {
    const q = searchQuery.trim();
    if (!q) {
      setCustomDishEn("");
      setCustomDishTa("");
      return;
    }
    const hasTamil = isTamilScript(q);
    if (hasTamil) {
      setCustomDishTa(q);
      const en = getInstantEnglishName(q);
      if (en && !isTamilScript(en)) setCustomDishEn(en);
    } else {
      setCustomDishEn(toTitleCase(q));
      const ta = getInstantTamilName(q);
      if (ta) setCustomDishTa(ta);
    }
    const guessed = guessCategoryForDish(q);
    if (guessed) {
      setCustomDishCategory(guessed);
    }

    // Debounced AI translation for newly typed query
    if (customAiTimerRef.current) clearTimeout(customAiTimerRef.current);
    if (q.length >= 3) {
      customAiTimerRef.current = setTimeout(() => {
        translateCustomWithAi(q);
      }, 500);
    }

    return () => {
      if (customAiTimerRef.current) clearTimeout(customAiTimerRef.current);
    };
  }, [searchQuery, translateCustomWithAi]);

  const handleAddCustomSearchedDish = () => {
    const nameEn = customDishEn.trim() || customDishTa.trim();
    const nameTa = customDishTa.trim() || customDishEn.trim();
    const cat = customDishCategory || selectedCategory || categories[0] || "Special Dishes";

    if (!nameEn && !nameTa) {
      toast({
        title: "Dish Name Required",
        description: "Please enter at least an English or Tamil dish name.",
        variant: "destructive",
      });
      return;
    }

    try {
      const created = addCustomDishToCatalog({
        category: cat,
        name_en: nameEn,
        name_ta: nameTa,
        isVegetarian: true,
      });

      // 1. Immediately register into bilingual culinary dictionary & aliases
      registerDishToDictionary(nameEn, nameTa, cat);

      // 2. Select dish for current session
      toggleDish(cat, created.id);

      // 3. Trigger catalog reload across the application
      setCatalogVersion((v) => v + 1);

      // 4. Background Gemini AI translation and enrichment if needed
      fetchAiTamilTranslation(nameEn || nameTa)
        .then((aiEnrich) => {
          if (aiEnrich && (aiEnrich.name_en !== nameEn || aiEnrich.name_ta !== nameTa)) {
            registerDishToDictionary(aiEnrich.name_en, aiEnrich.name_ta, aiEnrich.category);
            updateDishInCatalog(cat, created.id, {
              name_en: aiEnrich.name_en,
              name_ta: aiEnrich.name_ta,
              category: aiEnrich.category,
            });
            setCatalogVersion((v) => v + 1);
          }
        })
        .catch(() => {});

      toast({
        title: "New Dish Added & Selected!",
        description: `"${nameEn}" (${nameTa}) added to "${cat}" and selected for ${currentSession?.name || "session"}.`,
      });

      setIsCustomExpanded(false);
      setSearchQuery("");
      setIsSearchFocused(false);
    } catch (err: any) {
      toast({
        title: "Could not add dish",
        description: err?.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  // Full search results for the catalog grid
  const searchResults = useMemo(() => {
    if (!normalizedQuery) return [];
    return allCatalogItems.filter((item) => {
      const nameEn = (item.name_en || item.name || "").toLowerCase();
      const nameTa = (item.name_ta || "").toLowerCase();
      const cat = item.category.toLowerCase();
      return (
        nameEn.includes(normalizedQuery) ||
        nameTa.includes(normalizedQuery) ||
        cat.includes(normalizedQuery)
      );
    });
  }, [allCatalogItems, normalizedQuery]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isSearchFocused || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        const item = suggestions[highlightedIndex];
        toggleDish(item.category, item.id);
      } else {
        setIsSearchFocused(false);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsSearchFocused(false);
    }
  };

  const removeDishFromSession = useCallback((dishKey: string) => {
    if (!currentSession) return;
    const updatedDays = [...menu.days];
    const session = updatedDays[currentDayIndex].sessions[currentSessionIndex];
    session.selectedDishes = session.selectedDishes.filter((k) => k !== dishKey);
    onMenuChange({
      ...menu,
      days: updatedDays,
      updatedAt: new Date(),
    });
  }, [currentSession, menu, currentDayIndex, currentSessionIndex, onMenuChange]);

  const reorderDishesInSession = useCallback(
    (newOrderKeys: string[]) => {
      if (!currentSession) return;
      const updatedDays = [...menu.days];
      const session = updatedDays[currentDayIndex].sessions[currentSessionIndex];
      session.selectedDishes = newOrderKeys;
      onMenuChange({
        ...menu,
        days: updatedDays,
        updatedAt: new Date(),
      });
    },
    [currentSession, menu, currentDayIndex, currentSessionIndex, onMenuChange]
  );

  if (!currentSession) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p>No sessions configured. Please go back and add sessions.</p>
          <Button onClick={onPrevious} className="mt-4">
            Back to Session Planning
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Session Header - Signature BKR Traditional Style */}
      <div className="menu-session-heading planner-step-banner rounded-xl shadow-lg p-5 w-full">
        <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-lg bg-white/10 border border-white/20 shrink-0">
              <Utensils className="h-6 w-6 text-[#d8b36d]" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h2 className="text-2xl font-bold truncate">
                Day {currentDay.dayNumber} - {currentSession.name}
              </h2>
              <p className="text-sm opacity-90 mt-0.5">
                {currentSession.startTime} – {currentSession.endTime} | {currentSession.headCount} guests
              </p>
            </div>
          </div>

          {/* Header Action Buttons: Manage Session Menu + Selected Items Counter */}
          <div className="flex items-center gap-2.5 self-start sm:self-center shrink-0 flex-wrap">
            <Button
              size="sm"
              onClick={() => setIsSessionManageOpen(true)}
              className="bg-[#d8b36d] text-[#2a1708] hover:bg-[#e4c27f] font-semibold text-xs rounded-xl shadow-md h-9 px-3.5 transition-all hover:scale-[1.02]"
            >
              <Utensils className="h-3.5 w-3.5 mr-1.5" />
              Manage Menu ({currentSession.selectedDishes.length})
            </Button>

            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white/15 dark:bg-white/10 border border-white/20 shadow-sm">
              <span className="text-lg font-bold">
                {currentSession.selectedDishes.length}
              </span>
              <span className="text-xs uppercase tracking-wider font-semibold opacity-90">
                {currentSession.selectedDishes.length === 1 ? "Item Selected" : "Items Selected"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Universal Day & Session Navigator Bar — Allows switching to ANY day and ANY session at any time */}
      <div className="bg-surf rounded-2xl shadow-md p-4 border border-line space-y-3">
        {/* Multi-Day Selector */}
        {menu.days.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 border-b border-line/60">
            <span className="text-xs font-bold text-ink/70 shrink-0 uppercase tracking-wider flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-acc" /> Days:
            </span>
            {menu.days.map((day, idx) => (
              <button
                key={day.dayNumber}
                type="button"
                onClick={() => {
                  setCurrentDayIndex(idx);
                  setCurrentSessionIndex(0);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                  currentDayIndex === idx
                    ? "bg-[#762934] text-white shadow-sm font-bold ring-2 ring-[#d8b36d]/50"
                    : "bg-surf-2 border border-line text-ink hover:bg-surf hover:border-acc/40"
                }`}
              >
                Day {day.dayNumber} ({day.date})
              </button>
            ))}
          </div>
        )}

        {/* Sessions Switcher Pills - Allows selecting any session anytime */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <span className="text-xs font-bold text-ink/70 shrink-0 uppercase tracking-wider flex items-center gap-1">
              <Layers className="h-3.5 w-3.5 text-acc" /> Sessions:
            </span>
            {currentDay.sessions.map((sess, idx) => {
              const isActive = currentSessionIndex === idx;
              return (
                <button
                  key={sess.id || idx}
                  type="button"
                  onClick={() => setCurrentSessionIndex(idx)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 flex items-center gap-2 transition-all ${
                    isActive
                      ? "bg-[#762934] text-white shadow-md ring-2 ring-[#d8b36d]/70 font-bold"
                      : "bg-surf-2 border border-line text-ink hover:border-acc/40 hover:bg-surf"
                  }`}
                >
                  <span>{sess.name}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? "bg-[#d8b36d] text-[#2a1708]" : "bg-line text-ink/70"
                    }`}
                  >
                    {sess.selectedDishes.length}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Jump / Next Session Pill */}
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <Button
              size="sm"
              variant="outline"
              onClick={handleNext}
              className="h-8 text-xs font-semibold border-acc/40 text-acc hover:bg-acc/10 rounded-lg"
            >
              <span>{nextSessionInfo.isLast ? "Review Step" : `Next: ${nextSessionInfo.name}`}</span>
              <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </div>

        {/* Selected Dishes Serving Order Strip */}
        {currentSession.selectedDishes.length > 0 && (
          <div className="pt-2.5 border-t border-line/60 space-y-2 animate-fade-in">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-ink">
                <Utensils className="h-3.5 w-3.5 text-acc" />
                <span>Serving Sequence ({currentSession.selectedDishes.length} dishes):</span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const sorted = sortDishesByTraditionalCourse(currentSession.selectedDishes);
                    reorderDishesInSession(sorted);
                    toast({
                      title: "Arranged by Course Order! 🍲",
                      description: "Dishes sorted in authentic South Indian catering sequence (Sweets → Tiffin → Rice → Sambar → Rasam → Curd → Desserts).",
                    });
                  }}
                  className="h-6 px-2 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700/50 rounded-lg flex items-center gap-1"
                  title="Auto-arrange dishes into authentic South Indian catering course sequence"
                >
                  🍲 Course Order
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const sorted = sortDishesAlphabetical(currentSession.selectedDishes);
                    reorderDishesInSession(sorted);
                    toast({
                      title: "Arranged A → Z! 🔤",
                      description: "Dishes sorted alphabetically by English name.",
                    });
                  }}
                  className="h-6 px-2 text-[11px] font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/40 border-blue-300 dark:border-blue-700/50 rounded-lg flex items-center gap-1"
                  title="Auto-arrange dishes alphabetically A to Z"
                >
                  🔤 A → Z
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setIsSessionManageOpen(true)}
                  className="h-6 px-2.5 text-[11px] font-semibold text-acc hover:bg-acc/10 border-acc/40 rounded-lg flex items-center gap-1 transition-transform hover:scale-105"
                  title="Arrange or reorder dishes for this session"
                >
                  <ArrowUpDown className="h-3 w-3" />
                  Arrange Details
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {currentSession.selectedDishes.map((key, idx) => {
                const dish = findDishByKey(key);
                if (!dish) return null;
                return (
                  <div
                    key={key}
                    onClick={() => setIsSessionManageOpen(true)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-surf-2 border border-line hover:border-acc/40 hover:bg-surf transition-all shrink-0 cursor-pointer text-xs"
                    title={`#${idx + 1}: ${dish.name_en} (${dish.name_ta}) - Click to rearrange`}
                  >
                    <span className="text-[10px] font-bold text-acc">#{idx + 1}</span>
                    <span className="font-semibold text-ink truncate max-w-[140px]">{dish.name_en}</span>
                    {dish.name_ta && (
                      <span className="text-[10px] text-mute font-tamil truncate max-w-[120px]">({dish.name_ta})</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Search Bar & Category Tabs */}
      <div className="bg-white rounded-2xl shadow-lg p-4 space-y-4">
        {/* Search & Voice Assistant Action Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pb-1">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              onClick={() => {
                if (isListening) stopListening();
                setIsAiVoiceAssistantOpen(true);
              }}
              className="h-9 px-3.5 text-xs bg-gradient-to-r from-[#762934] via-[#8c3240] to-[#b34052] dark:from-[#d8b36d] dark:to-[#f3d99d] text-white dark:text-[#2a1708] font-bold rounded-xl shadow-md flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <Mic className="h-4 w-4 text-[#d8b36d] dark:text-[#2a1708] animate-pulse" />
              <span>AI Voice Assistant</span>
              <Badge className="bg-[#d8b36d]/30 text-[#d8b36d] dark:bg-[#2a1708]/20 dark:text-[#2a1708] text-[9px] px-1.5 py-0 border-0 font-bold">
                Gemini 2.5 Flash
              </Badge>
            </Button>
            <span className="text-[11px] text-mute hidden md:inline">
              World-class Tamil & English speech recognition · Zero audio reflection
            </span>
          </div>

          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setIsSessionManageOpen(true)}
            className="h-9 text-xs font-semibold border-acc/40 text-acc hover:bg-acc/10 rounded-xl"
          >
            <Utensils className="h-3.5 w-3.5 mr-1.5" />
            Manage Session Menu ({currentSession.selectedDishes.length})
          </Button>
        </div>

        {/* Google-style Search Input & Recommendations Container */}
        <div ref={searchContainerRef} className="relative z-40 space-y-2">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchFocused(true);
                setHighlightedIndex(-1);
              }}
              onFocus={() => {
                if (isListening) stopListening();
                setIsSearchFocused(true);
                setHighlightedIndex(-1);
              }}
              onKeyDown={handleKeyDown}
              inputMode="text"
              lang="en"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              placeholder={
                isListening
                  ? voiceMode === "continuous"
                    ? "Listening continuously... Say dishes one by one (e.g. Idli, Medu Vada, Sambar, Kesari)..."
                    : "Listening... Speak a dish name now (e.g. Pongal, பாயாசம்)..."
                  : "Search dishes or type for recommendations (e.g., Laddu, Sambar, பாயாசம், Biryani)..."
              }
              className={`pl-11 pr-24 h-12 text-base rounded-xl border transition-all shadow-sm ${
                isListening
                  ? "border-acc ring-2 ring-acc/20 bg-surf text-ink"
                  : "border-line bg-surf text-ink placeholder:text-mute focus:border-acc focus:ring-1 focus:ring-acc"
              }`}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setHighlightedIndex(-1);
                  }}
                  className="text-mute hover:text-ink p-1 rounded-md"
                  aria-label="Clear search"
                  title="Clear search text"
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              {/* Instant Free Voice Typing Mic */}
              <button
                type="button"
                onClick={toggleListening}
                className={`p-2 rounded-lg transition-all flex items-center justify-center ${
                  isListening
                    ? "bg-acc text-accink shadow-sm animate-pulse"
                    : "text-acc hover:bg-acc/10"
                }`}
                title={
                  isListening
                    ? "Stop Voice Typing"
                    : "Start Voice Typing (Instant continuous voice entry with beep)"
                }
                aria-label={isListening ? "Stop Voice Typing" : "Start Voice Typing"}
              >
                <Mic className={`h-5 w-5 ${isListening ? "text-accink" : "text-acc"}`} />
              </button>
            </div>
          </div>

          {/* Voice Mode & Language Selector Bar */}
          {isVoiceSupported && (
            <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-mute flex items-center gap-1.5">
                  <Mic className="h-3.5 w-3.5 text-acc" />
                  Voice mode:
                </span>
                <div className="inline-flex rounded-full border border-line p-0.5 bg-surf2">
                  <button
                    type="button"
                    onClick={() => {
                      setVoiceMode("single");
                      if (isListening) stopListening();
                    }}
                    className={`px-3 py-1 rounded-full text-xs transition-colors ${
                      voiceMode === "single"
                        ? "bg-acc text-accink font-bold shadow-theme-sm"
                        : "text-mute hover:text-ink font-medium"
                    }`}
                  >
                    Single Search
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setVoiceMode("continuous");
                      if (isListening) stopListening();
                    }}
                    className={`px-3 py-1 rounded-full text-xs transition-colors flex items-center gap-1.5 ${
                      voiceMode === "continuous"
                        ? "bg-acc text-accink font-bold shadow-theme-sm"
                        : "text-mute hover:text-ink font-medium"
                    }`}
                    title="Hands-free continuous listening: speak multiple items and they will be auto-added to this session!"
                  >
                    <Sparkles className="h-3 w-3" />
                    Continuous Menu Add
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-semibold text-mute">Language:</span>
                <div className="inline-flex rounded-full border border-line p-0.5 bg-surf2">
                  <button
                    type="button"
                    onClick={() => setVoiceLang("en-IN")}
                    className={`px-2.5 py-0.5 rounded-full text-[11px] transition-colors ${
                      voiceLang === "en-IN"
                        ? "bg-acc text-accink font-bold shadow-theme-sm"
                        : "text-mute hover:text-ink font-medium"
                    }`}
                  >
                    English (India)
                  </button>
                  <button
                    type="button"
                    onClick={() => setVoiceLang("ta-IN")}
                    className={`px-2.5 py-0.5 rounded-full text-[11px] transition-colors ${
                      voiceLang === "ta-IN"
                        ? "bg-acc text-accink font-bold shadow-theme-sm"
                        : "text-mute hover:text-ink font-medium"
                    }`}
                  >
                    தமிழ் (Tamil)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Continuous Voice Active Status Banner */}
          {isListening && voiceMode === "continuous" && (
            <div className="p-3.5 rounded-xl border border-line bg-surf shadow-theme-sm space-y-2.5 animate-fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-ink">
                  <span className="w-2.5 h-2.5 rounded-full bg-acc animate-ping shrink-0" />
                  <span>Continuous Voice Adding Active · Speak dishes one by one</span>
                </div>
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  <Button
                    size="sm"
                    onClick={() => {
                      stopListening();
                      setIsSessionManageOpen(true);
                    }}
                    className="h-7 px-3 text-xs bg-acc text-accink font-bold hover:bg-acc/90 rounded-full shadow-sm"
                  >
                    Done & Manage Menu ({currentSession.selectedDishes.length})
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={stopListening}
                    className="h-7 text-xs border-line bg-surf2 hover:bg-surf text-ink font-semibold rounded-full"
                  >
                    Stop Mic
                  </Button>
                </div>
              </div>

              {interimTranscript && (
                <p className="text-xs text-mute italic">
                  Hearing: &ldquo;<span className="font-semibold text-ink">{interimTranscript}</span>&rdquo;...
                </p>
              )}
            </div>
          )}

          {/* Spoken Dish Confirmation Card (Solves: "when i say something 'idly' it adds all relevant items ... optimize to confirm what i ask and proceed") */}
          {pendingConfirmationDish && (
            <div className="p-3.5 rounded-2xl border-2 border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 shadow-lg space-y-2.5 animate-fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0 shadow-sm">
                    <Mic className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                        Voice Recognized: &ldquo;{pendingConfirmationDish.phrase}&rdquo;
                      </span>
                      <span className="text-xs text-mute">→ Add to {currentSession?.name || "Session"}?</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap mt-0.5">
                      <span className="text-base font-extrabold text-emerald-950 dark:text-emerald-100">
                        {pendingConfirmationDish.dish.name_en}
                      </span>
                      <span className="font-tamil font-semibold text-xs text-emerald-700 dark:text-emerald-300">
                        ({pendingConfirmationDish.dish.name_ta})
                      </span>
                      <Badge variant="outline" className="text-[10px] bg-white/70 dark:bg-black/30 border-emerald-300 text-emerald-800 dark:text-emerald-200">
                        {pendingConfirmationDish.dish.category}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  <Button
                    size="sm"
                    onClick={() => {
                      confirmAddDish(pendingConfirmationDish.dish, pendingConfirmationDish.phrase);
                      setPendingConfirmationDish(null);
                    }}
                    className="h-8 px-4 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-md transition-transform hover:scale-105"
                  >
                    <Check className="h-3.5 w-3.5 mr-1" />
                    Confirm & Add
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPendingConfirmationDish(null)}
                    className="h-8 px-2.5 text-xs border-emerald-300 bg-white/80 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-200 rounded-xl hover:bg-emerald-100"
                  >
                    <X className="h-3.5 w-3.5 mr-1" />
                    Dismiss
                  </Button>
                </div>
              </div>

              {/* Alternative matches if multiple (e.g. Sambar Idli, Mini Idli, Kanchipuram Idli when user said idli) */}
              {pendingConfirmationDish.alternatives.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap pt-1.5 border-t border-emerald-200 dark:border-emerald-800/60 text-xs">
                  <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                    Or select specific dish:
                  </span>
                  {pendingConfirmationDish.alternatives.map((alt) => (
                    <button
                      key={alt.id}
                      type="button"
                      onClick={() => {
                        confirmAddDish(alt, pendingConfirmationDish.phrase);
                        setPendingConfirmationDish(null);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-emerald-900/60 hover:bg-emerald-100 dark:hover:bg-emerald-800 text-emerald-900 dark:text-emerald-100 text-xs font-semibold border border-emerald-300 transition-colors shadow-2xs flex items-center gap-1"
                    >
                      <Plus className="h-3 w-3 text-emerald-600" />
                      <span>{alt.name_en}</span>
                      <span className="font-tamil font-normal text-[10px] opacity-80">({alt.name_ta})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Voice Added Items Activity Tray — Persists so user sees what was added and repeated */}
          {recentResults.length > 0 && (
            <div className="p-3 rounded-xl border border-line/80 bg-surf shadow-sm space-y-2 animate-fade-in">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-ink">
                  <Sparkles className="h-3.5 w-3.5 text-acc shrink-0" />
                  <span>
                    Voice Activity ({recentResults.filter((r) => r.status === "added").length} added
                    {recentResults.some((r) => r.status === "already-added") &&
                      `, ${recentResults.filter((r) => r.status === "already-added").length} already in menu`}
                    )
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsSessionManageOpen(true)}
                    className="h-6 px-2.5 text-[11px] font-semibold text-acc hover:bg-acc/10 border-acc/40 rounded-lg"
                  >
                    <Utensils className="h-3 w-3 mr-1" />
                    Manage Menu ({currentSession.selectedDishes.length})
                  </Button>
                  <button
                    type="button"
                    onClick={clearRecentResults}
                    className="text-[11px] text-mute hover:text-ink underline ml-1"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-0.5 max-h-32 overflow-y-auto">
                {recentResults.map((res, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className={`text-[11px] font-semibold flex items-center gap-1 rounded-full px-2.5 py-0.5 ${
                      res.status === "added"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-700"
                        : res.status === "already-added"
                        ? "bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-700"
                        : "bg-surf2 text-mute border-line"
                    }`}
                  >
                    {res.status === "added" && "✅ Added: "}
                    {res.status === "already-added" && "ℹ️ Already in menu: "}
                    {res.status === "not-found" && "❓ Not found: "}
                    <span className="font-bold">{res.matchedDish ? res.matchedDish.name_en : res.phrase}</span>
                    {res.matchedDish?.name_ta && (
                      <span className="opacity-80 font-normal text-[10px]">({res.matchedDish.name_ta})</span>
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {voiceError && (
            <div className="p-2.5 rounded-lg bg-surf2 border border-line text-xs text-danger font-medium">
              {voiceError}
            </div>
          )}

          {/* Google-style Instant Recommendations Dropdown */}
          {isSearchFocused && (
            <div className="planner-search-dropdown absolute left-0 right-0 top-full mt-2 rounded-2xl shadow-2xl overflow-hidden z-50">
              {/* Dropdown Header */}
              <div className="planner-search-dropdown-header px-4 py-2.5 flex items-center justify-between text-xs font-medium border-b">
                <div className="flex items-center gap-1.5">
                  {normalizedQuery ? (
                    <>
                      <Sparkles className="h-3.5 w-3.5 text-pink-500 dark:text-amber-400" />
                      <span>
                        Recommended dishes for &ldquo;<span className="text-pink-600 dark:text-amber-400 font-semibold">{searchQuery}</span>&rdquo;
                      </span>
                    </>
                  ) : (
                    <>
                      <TrendingUp className="h-3.5 w-3.5 text-pink-500 dark:text-amber-400" />
                      <span>Popular Catering Recommendations</span>
                    </>
                  )}
                </div>
                <span className="text-[11px] opacity-75">
                  {suggestions.length} recommendation{suggestions.length === 1 ? "" : "s"}
                </span>
              </div>

              {/* Quick Add Custom Dish while searching (Bilingual: English & Tamil) */}
              {normalizedQuery && (
                <div className="p-3 bg-surf2 border-b border-line">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                      <Plus className="h-3.5 w-3.5 text-acc" />
                      Add &ldquo;{searchQuery}&rdquo; as new dish to catering menu:
                    </span>
                    {suggestions.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setIsCustomExpanded((prev) => !prev)}
                        className="text-xs text-acc font-semibold hover:underline"
                      >
                        {isCustomExpanded ? "Hide form" : "+ Open custom dish form"}
                      </button>
                    )}
                  </div>

                  {(isCustomExpanded || suggestions.length === 0) && (
                    <div className="mt-2.5 pt-2 border-t border-line/60 space-y-2.5 animate-fade-in">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-mute tracking-wider block mb-1">
                            English Dish Name *
                          </label>
                          <Input
                            value={customDishEn}
                            onChange={(e) => {
                              const val = e.target.value;
                              setCustomDishEn(val);
                              // Only auto-fill Tamil if Tamil field is empty
                              if (!customDishTa.trim()) {
                                if (isTamilScript(val)) {
                                  setCustomDishTa(val);
                                } else {
                                  const ta = getInstantTamilName(val);
                                  if (ta) setCustomDishTa(ta);
                                }
                              }
                              const guessed = guessCategoryForDish(val);
                              if (guessed) setCustomDishCategory(guessed);
                            }}
                            placeholder="e.g. Jackfruit Payasam"
                            inputMode="text"
                            lang="en"
                            autoComplete="off"
                            autoCorrect="off"
                            spellCheck={false}
                            autoCapitalize="words"
                            className="h-8 text-xs bg-surf border-line text-ink rounded-md"
                          />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[10px] uppercase font-bold text-mute tracking-wider">
                              தமிழ் பெயர் (Tamil Name) *
                            </label>
                            <div className="flex items-center gap-1.5">
                              {isAiTranslatingCustom && (
                                <span className="text-[10px] text-acc font-semibold animate-pulse flex items-center gap-1">
                                  <Sparkles className="h-2.5 w-2.5 animate-spin text-acc" />
                                  Translating...
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={() => translateCustomWithAi(customDishEn || customDishTa)}
                                disabled={isAiTranslatingCustom || (!customDishEn.trim() && !customDishTa.trim())}
                                className="text-[10px] font-bold text-acc hover:underline flex items-center gap-1 disabled:opacity-40"
                                title="Translate with Gemini 3.6 Flash AI"
                              >
                                <Sparkles className="h-2.5 w-2.5" />
                                ✨ Gemini AI
                              </button>
                            </div>
                          </div>
                          <Input
                            value={customDishTa}
                            onChange={(e) => {
                              const val = e.target.value;
                              setCustomDishTa(val);
                              // Only auto-fill English if English field is empty
                              if (!customDishEn.trim()) {
                                if (!isTamilScript(val)) {
                                  setCustomDishEn(toTitleCase(val));
                                } else {
                                  const en = getInstantEnglishName(val);
                                  if (en && !isTamilScript(en)) setCustomDishEn(en);
                                }
                              }
                            }}
                            placeholder="e.g. பலாப்பழ பாயாசம்"
                            inputMode="text"
                            lang="ta"
                            autoComplete="off"
                            autoCorrect="off"
                            spellCheck={false}
                            className="h-8 text-xs bg-surf border-line text-ink rounded-md font-tamil"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-1">
                        <div className="flex items-center gap-2 flex-1">
                          <label className="text-[10px] uppercase font-bold text-mute tracking-wider shrink-0">
                            Category:
                          </label>
                          <select
                            value={customDishCategory || selectedCategory}
                            onChange={(e) => setCustomDishCategory(e.target.value)}
                            className="h-8 text-xs rounded-md bg-surf border border-line text-ink px-2 flex-1 min-w-[140px]"
                          >
                            {categories.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                        </div>

                        <Button
                          type="button"
                          size="sm"
                          onClick={handleAddCustomSearchedDish}
                          disabled={!customDishEn.trim() && !customDishTa.trim()}
                          className="h-8 text-xs bg-acc text-accink hover:opacity-95 font-bold rounded-lg shadow-theme-sm shrink-0"
                        >
                          <Plus className="h-3.5 w-3.5 mr-1" />
                          Add & Select Dish
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Suggestions List (Uncapped, smooth scroll through all matching items) */}
              {suggestions.length === 0 ? (
                <div className="p-5 text-center text-mute space-y-1">
                  <p className="text-sm font-semibold text-ink">No existing catalog dishes match &ldquo;{searchQuery}&rdquo;</p>
                  <p className="text-xs text-mute">Fill in the English and Tamil names above and click &ldquo;Add & Select Dish&rdquo; to add it instantly!</p>
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto">
                  {suggestions.map((item, index) => {
                    const dishKey = buildDishKey(item.category, item.id);
                    const isSelected = currentSession.selectedDishes.includes(dishKey);
                    const isHighlighted = highlightedIndex === index;

                    return (
                      <div
                        key={dishKey}
                        onMouseEnter={() => setHighlightedIndex(index)}
                        className={`planner-search-item px-4 py-2.5 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                          isHighlighted ? "is-highlighted" : ""
                        }`}
                        onClick={() => {
                          toggleDish(item.category, item.id);
                        }}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 shadow-sm">
                            <img
                              src={item.image}
                              alt={item.name_en || item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400";
                              }}
                            />
                            {isSelected && (
                              <div className="absolute inset-0 bg-emerald-600/70 backdrop-blur-[0.5px] flex items-center justify-center">
                                <Check className="h-4 w-4 text-white stroke-[3]" />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold truncate">
                                {highlightMatch(item.name_en || item.name, searchQuery)}
                              </p>
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-pink-50 text-pink-700 dark:bg-white/10 dark:text-amber-200 border border-pink-200 dark:border-amber-400/20 shrink-0">
                                {item.category}
                              </span>
                            </div>
                            <p className="text-xs text-pink-600 dark:text-amber-400/90 truncate font-medium">
                              {highlightMatch(item.name_ta, searchQuery)}
                            </p>
                          </div>
                        </div>

                        {/* Fast Add / Toggle Action with explicit theme-safe classes */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDish(item.category, item.id);
                          }}
                          className={isSelected ? "planner-search-added-btn shrink-0" : "planner-search-add-btn shrink-0"}
                        >
                          {isSelected ? (
                            <>
                              <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                              Added
                            </>
                          ) : (
                            <>
                              <Plus className="h-3.5 w-3.5" />
                              Add
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Dropdown Footer Navigation Shortcuts */}
              <div className="planner-search-dropdown-footer px-4 py-2 flex items-center justify-between text-[11px] border-t">
                <div className="flex items-center gap-1.5">
                  <span className="planner-search-kbd px-1.5 py-0.5 rounded text-[10px] font-mono">↑↓</span>
                  <span>navigate</span>
                  <span className="planner-search-kbd px-1.5 py-0.5 rounded text-[10px] font-mono ml-1.5">Enter</span>
                  <span>toggle/add</span>
                  <span className="planner-search-kbd px-1.5 py-0.5 rounded text-[10px] font-mono ml-1.5">Esc</span>
                  <span>close</span>
                </div>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setIsSearchFocused(false);
                  }}
                  className="text-pink-600 dark:text-amber-400 hover:underline font-semibold"
                >
                  View full grid →
                </button>
              </div>
            </div>
          )}
        </div>

        {searchQuery.trim() ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-700">
                Found {searchResults.length} dish{searchResults.length === 1 ? "" : "es"} matching &ldquo;{searchQuery}&rdquo;
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery("")}
                className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50"
              >
                Clear search & view categories
              </Button>
            </div>

            {searchResults.length === 0 ? (
              <div className="p-6 bg-surf2 rounded-xl border border-line text-center space-y-4">
                <div>
                  <p className="text-ink font-bold text-base">No catalog dishes found matching &ldquo;{searchQuery}&rdquo;</p>
                  <p className="text-xs text-mute mt-0.5">You can add it right now as a new catering dish with both English and Tamil names!</p>
                </div>

                <div className="max-w-xl mx-auto p-4 bg-surf rounded-xl border border-line text-left space-y-3 shadow-theme-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-mute uppercase tracking-wider block mb-1">
                        English Dish Name *
                      </label>
                      <Input
                        value={customDishEn}
                        onChange={(e) => setCustomDishEn(e.target.value)}
                        placeholder="e.g. Jackfruit Payasam"
                        className="h-9 text-xs bg-surf border-line text-ink rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-mute uppercase tracking-wider block mb-1">
                        தமிழ் பெயர் (Tamil Name) *
                      </label>
                      <Input
                        value={customDishTa}
                        onChange={(e) => setCustomDishTa(e.target.value)}
                        placeholder="e.g. பலாப்பழ பாயாசம்"
                        className="h-9 text-xs bg-surf border-line text-ink rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-2 flex-1">
                      <label className="text-xs font-bold text-mute uppercase tracking-wider shrink-0">
                        Category:
                      </label>
                      <select
                        value={customDishCategory || selectedCategory}
                        onChange={(e) => setCustomDishCategory(e.target.value)}
                        className="h-9 text-xs rounded-lg bg-surf border border-line text-ink px-2.5 flex-1"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <Button
                      type="button"
                      onClick={handleAddCustomSearchedDish}
                      disabled={!customDishEn.trim() && !customDishTa.trim()}
                      className="h-9 text-xs bg-acc text-accink hover:opacity-95 font-bold rounded-btn shadow-theme-sm shrink-0 px-4"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Add to Menu & Select
                    </Button>
                  </div>
                </div>

                <div>
                  <Button variant="outline" size="sm" onClick={() => setSearchQuery("")} className="text-xs">
                    Clear Search & Browse All Categories
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                {searchResults.map((item) => {
                  const dishKey = buildDishKey(item.category, item.id);
                  const isSelected = currentSession.selectedDishes.includes(dishKey);

                  return (
                    <div
                      key={dishKey}
                      className={`cursor-pointer transition-all hover:scale-105 ${
                        isSelected ? "scale-105" : ""
                      }`}
                      onClick={() => toggleDish(item.category, item.id)}
                    >
                      <div
                        className={`bg-white rounded-xl shadow-md overflow-hidden border-3 transition-all ${
                          isSelected
                            ? "border-green-500 shadow-green-200 ring-4 ring-green-200"
                            : "border-gray-200 hover:border-orange-400 hover:shadow-lg"
                        }`}
                      >
                        {/* Food Image */}
                        <div className="relative aspect-square overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name_en || item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400";
                            }}
                          />
                          {isSelected && (
                            <div className="absolute inset-0 bg-green-500/30 backdrop-blur-[1px] flex items-center justify-center">
                              <div className="bg-green-500 text-white rounded-full p-3 shadow-2xl">
                                <Check className="h-6 w-6 stroke-[3]" />
                              </div>
                            </div>
                          )}
                          <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-medium">
                            {item.category}
                          </span>
                          {item.isVegetarian && (
                            <div
                              className="planner-vegetarian-mark absolute top-2 right-2 bg-green-500 text-white p-1.5 rounded-full shadow-lg"
                              aria-label="Vegetarian"
                              title="Vegetarian"
                            >
                              <Leaf className="h-4 w-4" aria-hidden="true" />
                            </div>
                          )}
                        </div>

                        {/* Food Details */}
                        <div className="p-3 bg-gradient-to-b from-white to-gray-50">
                          <h3 className="font-bold text-sm line-clamp-2 text-gray-900 mb-1 min-h-[2.5rem]">
                            {item.name_en || item.name}
                          </h3>
                          <p className="text-xs text-pink-600 line-clamp-1 font-medium">
                            {item.name_ta}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="menu-category-list w-full flex-nowrap justify-start h-auto gap-2 bg-transparent p-0">
              {categories.map((category) => {
                const items = menuData[category];
                const selectedCount = items.filter((item) =>
                  currentSession.selectedDishes.includes(
                    buildDishKey(category, item.id),
                  ),
                ).length;

                return (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="menu-category-tab shrink-0 min-w-[120px] h-auto py-2.5 px-3 border border-gray-200 data-[state=active]:bg-gradient-to-br data-[state=active]:from-orange-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-lg transition-all font-semibold"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-sm">{category}</span>
                      {selectedCount > 0 && (
                        <Badge className="bg-green-500 text-white font-bold px-2 py-0.5 text-xs">
                          {selectedCount}
                        </Badge>
                      )}
                    </div>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category} value={category} className="mt-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                  {menuData[category].map((item) => {
                    const isSelected = currentSession.selectedDishes.includes(
                      buildDishKey(category, item.id),
                    );

                    return (
                      <div
                        key={buildDishKey(category, item.id)}
                        className={`cursor-pointer transition-all hover:scale-105 ${
                          isSelected ? "scale-105" : ""
                        }`}
                        onClick={() => toggleDish(category, item.id)}
                      >
                        <div
                          className={`bg-white rounded-xl shadow-md overflow-hidden border-3 transition-all ${
                            isSelected
                              ? "border-green-500 shadow-green-200 ring-4 ring-green-200"
                              : "border-gray-200 hover:border-orange-400 hover:shadow-lg"
                          }`}
                        >
                          {/* Food Image */}
                          <div className="relative aspect-square overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.name_en || item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400";
                              }}
                            />
                            {isSelected && (
                              <div className="absolute inset-0 bg-green-500/30 backdrop-blur-[1px] flex items-center justify-center">
                                <div className="bg-green-500 text-white rounded-full p-3 shadow-2xl">
                                  <Check className="h-6 w-6 stroke-[3]" />
                                </div>
                              </div>
                            )}
                            {item.isVegetarian && (
                              <div
                                className="planner-vegetarian-mark absolute top-2 right-2 bg-green-500 text-white p-1.5 rounded-full shadow-lg"
                                aria-label="Vegetarian"
                                title="Vegetarian"
                              >
                                <Leaf className="h-4 w-4" aria-hidden="true" />
                              </div>
                            )}
                          </div>

                          {/* Food Details */}
                          <div className="p-3 bg-gradient-to-b from-white to-gray-50">
                            <h3 className="font-bold text-sm line-clamp-2 text-gray-900 mb-1 min-h-[2.5rem]">
                              {item.name_en || item.name}
                            </h3>
                            <p className="text-xs text-pink-600 line-clamp-1 font-medium">
                              {item.name_ta}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>

      {/* Navigation - Modern BKR Traditional Style */}
      <div className="bg-surf rounded-2xl shadow-lg p-4 border border-line">
        <div className="menu-selection-navigation flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={handlePrevious}
            className="flex-1 h-12 text-base font-semibold border-2 border-line hover:bg-surf-2 rounded-xl"
          >
            <ChevronLeft className="h-5 w-5 mr-2" />
            Previous
          </Button>

          <Button
            onClick={handleNext}
            className="flex-1 h-12 text-base font-semibold rounded-xl bg-acc text-accink hover:bg-acc/90 shadow-md transition-all hover:scale-[1.01]"
          >
            {nextSessionInfo.isLast
              ? "Continue to Review & Pricing"
              : `Proceed to Next Session (${nextSessionInfo.name})`}
            <ChevronRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>

      {/* Session Menu Management Dialog (MERN Actions on Added Dishes & Serving Sequence Arrangement) */}
      <SessionMenuManageDialog
        open={isSessionManageOpen}
        onOpenChange={setIsSessionManageOpen}
        day={currentDay}
        session={currentSession}
        categories={categories as string[]}
        onRemoveDish={removeDishFromSession}
        onAddDish={(cat, dishId) => toggleDish(cat, dishId)}
        onReorderDishes={reorderDishesInSession}
        onNextSession={handleNext}
        isLastSession={nextSessionInfo.isLast}
        nextSessionName={nextSessionInfo.name}
        onCatalogChanged={() => {
          setCatalogVersion((v) => v + 1);
          onMenuChange({ ...menu, updatedAt: new Date() });
        }}
      />

      {/* World-Class AI Voice Assistant Dialog (Powered by Gemini 2.5 Flash, Zero Audio Reflection) */}
      <AiVoiceAssistantDialog
        open={isAiVoiceAssistantOpen}
        onOpenChange={setIsAiVoiceAssistantOpen}
        dayNumber={currentDay.dayNumber}
        sessionName={currentSession.name}
        sessionDishKeys={currentSession.selectedDishes}
        categories={categories as string[]}
        onAddDishToSession={(cat, dishId) => toggleDish(cat, dishId)}
        onCatalogUpdated={() => {
          setCatalogVersion((v) => v + 1);
          onMenuChange({ ...menu, updatedAt: new Date() });
        }}
        onFallbackToBrowserVoice={() => {
          setVoiceMode("continuous");
          startListening();
        }}
      />
    </div>
  );
};
