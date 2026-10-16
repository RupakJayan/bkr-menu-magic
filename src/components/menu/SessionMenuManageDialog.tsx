import React, { useState, useMemo, useCallback, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  buildDishKey,
  findDishByKey,
  addCustomDishToCatalog,
  updateDishInCatalog,
} from "@/services/menuCatalogService";
import {
  getInstantTamilName,
  getInstantEnglishName,
  isTamilScript,
  guessCategoryForDish,
  toTitleCase,
  registerDishToDictionary,
  fetchAiTamilTranslation,
} from "@/services/tamilTranslationService";
import {
  Check,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  GripVertical,
  ListOrdered,
  Edit2,
  Leaf,
  Plus,
  Save,
  Search,
  Sparkles,
  Trash2,
  Utensils,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { CatalogDish, DayPlan, Session } from "@/types/menu";

interface SessionMenuManageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  day: DayPlan;
  session: Session;
  categories: string[];
  onRemoveDish: (dishKey: string) => void;
  onAddDish: (category: string, dishId: string) => void;
  onReorderDishes: (newOrderKeys: string[]) => void;
  onNextSession: () => void;
  isLastSession: boolean;
  nextSessionName?: string;
  onCatalogChanged: () => void;
}

export const SessionMenuManageDialog: React.FC<SessionMenuManageDialogProps> = ({
  open,
  onOpenChange,
  day,
  session,
  categories,
  onRemoveDish,
  onAddDish,
  onReorderDishes,
  onNextSession,
  isLastSession,
  nextSessionName,
  onCatalogChanged,
}) => {
  const { toast } = useToast();
  const [filterText, setFilterText] = useState("");
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  // New Dish Form State
  const [newDishEn, setNewDishEn] = useState("");
  const [newDishTa, setNewDishTa] = useState("");
  const [newDishCategory, setNewDishCategory] = useState(categories[0] || "Special Dishes");

  // Editing Dish State
  const [editingDishKey, setEditingDishKey] = useState<string | null>(null);
  const [editDishEn, setEditDishEn] = useState("");
  const [editDishTa, setEditDishTa] = useState("");
  const [editDishCategory, setEditDishCategory] = useState("");
  const [localCatalogVersion, setLocalCatalogVersion] = useState(0);

  // Resolve all selected dishes for the session
  const sessionDishes: Array<{ key: string; dish: CatalogDish }> = useMemo(() => {
    return session.selectedDishes
      .map((key) => {
        const dish = findDishByKey(key);
        return dish ? { key, dish } : null;
      })
      .filter((item): item is { key: string; dish: CatalogDish } => item !== null);
  }, [session.selectedDishes, localCatalogVersion]);

  // Group dishes by category
  const filteredDishes = useMemo(() => {
    const q = filterText.trim().toLowerCase();
    if (!q) return sessionDishes;
    return sessionDishes.filter(({ dish }) => {
      const nameEn = (dish.name_en || dish.name || "").toLowerCase();
      const nameTa = (dish.name_ta || "").toLowerCase();
      const cat = dish.category.toLowerCase();
      return nameEn.includes(q) || nameTa.includes(q) || cat.includes(q);
    });
  }, [sessionDishes, filterText]);

  // -------------------------------------------------------------
  // REORDERING & SERVING SEQUENCE MANAGEMENT
  // -------------------------------------------------------------
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    const currentKeys = [...session.selectedDishes];
    const temp = currentKeys[index - 1];
    currentKeys[index - 1] = currentKeys[index];
    currentKeys[index] = temp;
    onReorderDishes(currentKeys);
  };

  const handleMoveDown = (index: number) => {
    if (index >= session.selectedDishes.length - 1) return;
    const currentKeys = [...session.selectedDishes];
    const temp = currentKeys[index + 1];
    currentKeys[index + 1] = currentKeys[index];
    currentKeys[index] = temp;
    onReorderDishes(currentKeys);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;
    const currentKeys = [...session.selectedDishes];
    const [moved] = currentKeys.splice(draggedIndex, 1);
    currentKeys.splice(targetIndex, 0, moved);
    setDraggedIndex(null);
    onReorderDishes(currentKeys);
    toast({
      title: "Dishes Reordered ✨",
      description: "Serving sequence updated successfully.",
    });
  };

  // Traditional South Indian Wedding / Catering Sequence
  const handleArrangeTraditional = () => {
    const rankDish = (dish: CatalogDish): number => {
      const name = (dish.name_en || dish.name || "").toLowerCase();
      const cat = (dish.category || "").toLowerCase();

      // 1. Welcome Drinks & Soups
      if (name.includes("welcome") || name.includes("juice") || name.includes("soup") || cat.includes("beverage") || cat.includes("drink")) {
        if (name.includes("soup") || name.includes("juice")) return 10;
      }
      // 2. Starters & Appetizers
      if (name.includes("starter") || name.includes("manchurian") || name.includes("roll") || name.includes("cutlet") || name.includes("chilli")) return 20;

      // 3. Sweets (Traditional first: Kesari, Payasam, Laddu, Halwa, Mysore Pak)
      if (cat.includes("sweet") || name.includes("payasam") || name.includes("kesari") || name.includes("laddu") || name.includes("halwa") || name.includes("sweet") || name.includes("poli") || name.includes("jangri") || name.includes("jamun")) return 30;

      // 4. Breakfast / Tiffin (Pongal -> Vada -> Idli -> Poori -> Dosa)
      if (name.includes("pongal")) return 40;
      if (name.includes("vada") || name.includes("vadai")) return 42;
      if (name.includes("idli")) return 44;
      if (name.includes("poori") || name.includes("puri")) return 46;
      if (name.includes("dosa") || name.includes("dosai") || name.includes("oothappam")) return 48;
      if (cat.includes("tiffin") || cat.includes("breakfast")) return 50;

      // 5. Variety Rice & Breads (Parotta, Chappathi, Biryani, Pulao, Fried Rice, White Rice)
      if (name.includes("parotta") || name.includes("chappathi") || name.includes("naan") || name.includes("roti") || cat.includes("bread")) return 60;
      if (name.includes("biryani") || name.includes("briyani") || name.includes("pulao") || name.includes("fried rice")) return 62;
      if (name.includes("white rice") || name.includes("plain rice") || name.includes("sadham") || name.includes("rice")) return 64;

      // 6. Sambar, Kurma, Gravies
      if (name.includes("sambar") || name.includes("kurma") || name.includes("kuzhambu") || name.includes("gravy")) return 70;

      // 7. Poriyal, Varuval, Kootu, Avial
      if (name.includes("kootu") || name.includes("avial")) return 80;
      if (name.includes("poriyal") || name.includes("varuval") || name.includes("roast") || name.includes("fry")) return 82;

      // 8. Rasam
      if (name.includes("rasam")) return 90;

      // 9. Curd Rice & More (Thayir sadham)
      if (name.includes("curd") || name.includes("thayir") || name.includes("mor") || name.includes("buttermilk") || name.includes("raita") || name.includes("pachadi")) return 100;

      // 10. Accompaniments (Appalam, Pickle, Chutney, Thuvaiyal, Vadam)
      if (name.includes("appalam") || name.includes("pappad") || name.includes("pickle") || name.includes("oorugai") || name.includes("chutney") || name.includes("thuvaiyal") || name.includes("vadam")) return 110;

      // 11. Desserts, Ice Cream, Fruits, Coffee, Beeda
      if (name.includes("ice cream") || name.includes("fruit") || name.includes("dessert")) return 120;
      if (name.includes("coffee") || name.includes("tea")) return 130;
      if (name.includes("beeda") || name.includes("paan")) return 140;

      return 150;
    };

    const sorted = [...sessionDishes].sort((a, b) => rankDish(a.dish) - rankDish(b.dish));
    onReorderDishes(sorted.map((item) => item.key));
    toast({
      title: "Arranged in Traditional Course Order! 🍲✨",
      description: "Organized: Sweets → Tiffin / Rice → Sambar → Rasam → Curd Rice → Desserts.",
    });
  };

  // Alphabetical Sort (A to Z)
  const handleSortAlphabetical = () => {
    const sorted = [...sessionDishes].sort((a, b) => {
      const nameA = (a.dish.name_en || a.dish.name || "").toLowerCase();
      const nameB = (b.dish.name_en || b.dish.name || "").toLowerCase();
      return nameA.localeCompare(nameB);
    });
    onReorderDishes(sorted.map((item) => item.key));
    toast({
      title: "Arranged Alphabetically (A → Z) 🔤",
      description: "Sorted dishes from A to Z.",
    });
  };

  // Group by Category
  const handleSortByCategory = () => {
    const sorted = [...sessionDishes].sort((a, b) => a.dish.category.localeCompare(b.dish.category));
    onReorderDishes(sorted.map((item) => item.key));
    toast({
      title: "Grouped by Category 🏷️",
      description: "Dishes grouped by catering categories.",
    });
  };

  // Reverse Order
  const handleReverseOrder = () => {
    const reversed = [...session.selectedDishes].reverse();
    onReorderDishes(reversed);
    toast({
      title: "Serving Sequence Inverted 🔄",
      description: "Reversed order of selected dishes.",
    });
  };

  const [isAiTranslating, setIsAiTranslating] = useState(false);
  const aiDebounceRef = useRef<any>(null);

  const translateWithAi = useCallback(
    async (text: string, target: "new" | "edit") => {
      const clean = text.trim();
      if (!clean || isTamilScript(clean)) return;
      setIsAiTranslating(true);
      try {
        const res = await fetchAiTamilTranslation(clean);
        if (res.name_ta) {
          if (target === "new") {
            setNewDishTa(res.name_ta);
            if (res.category && categories.includes(res.category)) {
              setNewDishCategory(res.category);
            }
          } else {
            setEditDishTa(res.name_ta);
            if (res.category && categories.includes(res.category)) {
              setEditDishCategory(res.category);
            }
          }
        }
      } finally {
        setIsAiTranslating(false);
      }
    },
    [categories]
  );

  // Live Auto-Translation when typing English in Add Form
  const handleNewDishEnChange = (val: string) => {
    setNewDishEn(val);
    
    // Auto-fill Tamil ONLY if Tamil field is empty
    if (!newDishTa.trim()) {
      if (isTamilScript(val)) {
        setNewDishTa(val);
      } else {
        const instantTa = getInstantTamilName(val);
        if (instantTa) {
          setNewDishTa(instantTa);
        }
      }
    }
    
    const guessed = guessCategoryForDish(val);
    if (guessed && categories.includes(guessed)) {
      setNewDishCategory(guessed);
    }
  };

  // Live Auto-Translation when typing Tamil in Add Form
  const handleNewDishTaChange = (val: string) => {
    setNewDishTa(val);
    
    // Auto-fill English ONLY if English field is empty
    if (!newDishEn.trim()) {
      if (!isTamilScript(val)) {
        setNewDishEn(val);
      } else {
        const instantEn = getInstantEnglishName(val);
        if (instantEn && !isTamilScript(instantEn)) {
          setNewDishEn(instantEn);
        }
      }
    }
  };

  const handleAddNewDish = () => {
    const nameEn = newDishEn.trim() || newDishTa.trim();
    const nameTa = newDishTa.trim() || newDishEn.trim();
    const cat = newDishCategory || categories[0] || "Special Dishes";

    if (!nameEn && !nameTa) {
      toast({
        title: "Dish Name Required",
        description: "Please enter a name for the dish in English or Tamil.",
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

      // Register dish into bilingual culinary dictionary in parallel
      registerDishToDictionary(nameEn, nameTa, cat);

      onAddDish(cat, created.id);
      setLocalCatalogVersion((v) => v + 1);
      onCatalogChanged();

      toast({
        title: "Dish Added to Session! ✨",
        description: `"${nameEn}" (${nameTa}) added to ${cat} and registered in dictionary.`,
      });

      setNewDishEn("");
      setNewDishTa("");
      setIsAddFormOpen(false);
    } catch (err: any) {
      toast({
        title: "Could not add dish",
        description: err?.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  const startEditingDish = (key: string, dish: CatalogDish) => {
    setEditingDishKey(key);
    setEditDishEn(dish.name_en || dish.name || "");
    setEditDishTa(dish.name_ta || "");
    setEditDishCategory(dish.category);
  };

  const cancelEditingDish = () => {
    setEditingDishKey(null);
    setEditDishEn("");
    setEditDishTa("");
    setEditDishCategory("");
  };

  const saveEditedDish = (oldKey: string, oldDish: CatalogDish) => {
    const nameEn = editDishEn.trim() || editDishTa.trim();
    const nameTa = editDishTa.trim() || editDishEn.trim();
    const newCategory = editDishCategory || oldDish.category;

    if (!nameEn && !nameTa) {
      toast({
        title: "Name Required",
        description: "Dish name cannot be blank.",
        variant: "destructive",
      });
      return;
    }

    try {
      // 1. Update in catalog
      updateDishInCatalog(oldDish.category, oldDish.id, {
        name_en: nameEn,
        name_ta: nameTa,
        category: newCategory,
      });

      // 2. Register updated names into bilingual dictionary
      registerDishToDictionary(nameEn, nameTa, newCategory);

      // 3. If category changed, update key in session
      if (newCategory !== oldDish.category) {
        onRemoveDish(oldKey);
        onAddDish(newCategory, oldDish.id);
      }

      setLocalCatalogVersion((v) => v + 1);
      onCatalogChanged();
      setEditingDishKey(null);

      toast({
        title: "Dish Updated! ✏️",
        description: `Updated to "${nameEn}" (${nameTa}).`,
      });
    } catch (err: any) {
      toast({
        title: "Update failed",
        description: err?.message || "Could not save edits.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0 overflow-hidden bg-surf border-line shadow-2xl">
        {/* Header - Signature BKR Burgundy */}
        <div className="bg-[#762934] text-white p-5 border-b border-[#5c1f28]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-white/10 border border-white/20">
                <Utensils className="h-6 w-6 text-[#d8b36d]" />
              </div>
              <div>
                <DialogTitle className="text-xl sm:text-2xl font-serif tracking-wide text-white flex items-center gap-2">
                  <span>Day {day.dayNumber} — {session.name}</span>
                  <Badge className="bg-[#d8b36d] text-[#2a1708] border-none text-xs font-semibold px-2 py-0.5">
                    {session.selectedDishes.length} Items
                  </Badge>
                </DialogTitle>
                <DialogDescription className="text-white/80 text-xs sm:text-sm mt-0.5">
                  Review, edit, add, or remove dishes for this session before proceeding to the next.
                </DialogDescription>
              </div>
            </div>

            <Button
              size="sm"
              onClick={() => setIsAddFormOpen((v) => !v)}
              className="bg-[#d8b36d] text-[#2a1708] hover:bg-[#e4c27f] font-semibold text-xs rounded-full px-3.5 shadow-sm self-start sm:self-auto"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              {isAddFormOpen ? "Cancel Add" : "Add Custom Dish"}
            </Button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Quick Add Form (Collapsible) */}
          {isAddFormOpen && (
            <div className="p-4 rounded-xl border border-acc/30 bg-acc/5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-ink flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-[#762934] dark:text-[#d8b36d]" />
                  Add New Dish with Instant Tamil Name
                </h4>
                <Badge variant="outline" className="text-[10px] text-[#762934] dark:text-[#d8b36d] border-[#762934]/30">
                  Instant Auto-Translate
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-ink/80">Dish Name (English)</label>
                  <Input
                    placeholder="e.g. Mushroom Pepper Fry"
                    value={newDishEn}
                    onChange={(e) => handleNewDishEnChange(e.target.value)}
                    inputMode="text"
                    lang="en"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                    autoCapitalize="words"
                    className="h-9 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-ink/80 flex items-center justify-between">
                    <span>உணவு பெயர் (தமிழ்)</span>
                    <button
                      type="button"
                      onClick={() => translateWithAi(newDishEn, "new")}
                      disabled={isAiTranslating || !newDishEn.trim()}
                      className="text-[11px] text-acc hover:text-acc/80 flex items-center gap-1 font-semibold transition-colors disabled:opacity-40"
                    >
                      <Sparkles className={`h-3 w-3 ${isAiTranslating ? "animate-spin text-amber-500" : ""}`} />
                      <span>{isAiTranslating ? "Gemini Translating..." : "✨ Gemini AI Translate"}</span>
                    </button>
                  </label>
                  <div className="relative">
                    <Input
                      placeholder="எ.கா. காளான் மிளகு வறுவல்"
                      value={newDishTa}
                      onChange={(e) => handleNewDishTaChange(e.target.value)}
                      inputMode="text"
                      lang="ta"
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck={false}
                      className="h-9 text-xs font-tamil pr-8"
                    />
                    {isAiTranslating && (
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2">
                        <Sparkles className="h-3.5 w-3.5 text-acc animate-pulse" />
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-ink/70">Category:</span>
                  <select
                    value={newDishCategory}
                    onChange={(e) => setNewDishCategory(e.target.value)}
                    className="text-xs border border-line rounded-lg px-2.5 py-1.5 bg-surf text-ink"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  size="sm"
                  onClick={handleAddNewDish}
                  className="bg-acc text-accink font-semibold text-xs h-9 px-4 rounded-lg shadow-sm"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add & Select for {session.name}
                </Button>
              </div>
            </div>
          )}

          {/* Search Filter within current session */}
          <div className="flex items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
              <Input
                placeholder="Filter dishes in this session..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="pl-9 h-9 text-xs bg-surf-2 border-line"
              />
              {filterText && (
                <button
                  onClick={() => setFilterText("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <span className="text-xs font-medium text-ink/60 shrink-0">
              Showing {filteredDishes.length} of {sessionDishes.length}
            </span>
          </div>

          {/* Quick Arrange Toolbar */}
          {sessionDishes.length > 1 && (
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-surf-2 border border-line">
              <div className="flex items-center gap-1.5 text-xs font-bold text-ink">
                <ArrowUpDown className="h-4 w-4 text-acc" />
                <span>Arrange Serving Sequence ({sessionDishes.length} items):</span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleArrangeTraditional}
                  className="h-7 px-2.5 text-[11px] font-semibold text-acc hover:bg-acc/10 border-acc/40 rounded-lg flex items-center gap-1"
                  title="Organize into authentic South Indian wedding course order: Starters → Sweets → Tiffin / Rice → Sambar → Rasam → Curd Rice → Desserts"
                >
                  <Sparkles className="h-3 w-3" />
                  Traditional Course Order
                </Button>

                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleSortByCategory}
                  className="h-7 px-2 text-[11px] font-medium border-line hover:bg-surf text-ink rounded-lg"
                  title="Group dishes by category"
                >
                  By Category
                </Button>

                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleSortAlphabetical}
                  className="h-7 px-2 text-[11px] font-medium border-line hover:bg-surf text-ink rounded-lg"
                  title="Sort dishes A to Z"
                >
                  A → Z
                </Button>

                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleReverseOrder}
                  className="h-7 px-2 text-[11px] font-medium border-line hover:bg-surf text-ink rounded-lg"
                  title="Reverse current sequence"
                >
                  Reverse
                </Button>
              </div>
            </div>
          )}

          {/* Dish List */}
          {filteredDishes.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-xl border border-dashed border-line bg-surf-2">
              <Utensils className="h-10 w-10 text-ink/30 mx-auto mb-2" />
              <p className="text-sm font-semibold text-ink">
                {sessionDishes.length === 0 ? "No dishes selected for this session yet." : "No dishes match your filter."}
              </p>
              <p className="text-xs text-ink/60 mt-1 max-w-sm mx-auto">
                Use voice search, catalog selection, or the "Add Custom Dish" button above to populate this session.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredDishes.map(({ key, dish }, index) => {
                const isEditing = editingDishKey === key;

                if (isEditing) {
                  return (
                    <div
                      key={key}
                      className="p-3.5 rounded-xl border-2 border-acc/40 bg-acc/5 space-y-3 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-acc">Edit Dish #{index + 1}</span>
                        <div className="flex items-center gap-1.5">
                          {dish.id.startsWith("custom") ? (
                            <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 text-[10px] font-semibold">
                              ✨ Custom Dish
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-[10px] text-mute border-line">
                              Catalog Item
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="text-[11px] font-semibold text-ink/70">English Name</label>
                          <Input
                            value={editDishEn}
                            onChange={(e) => setEditDishEn(e.target.value)}
                            inputMode="text"
                            lang="en"
                            autoComplete="off"
                            autoCorrect="off"
                            spellCheck={false}
                            autoCapitalize="words"
                            className="h-8 text-xs mt-0.5"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-ink/70 flex items-center justify-between">
                            <span>Tamil Name (தமிழ்)</span>
                            <button
                              type="button"
                              onClick={() => translateWithAi(editDishEn, "edit")}
                              disabled={isAiTranslating || !editDishEn.trim()}
                              className="text-[10px] text-acc hover:text-acc/80 flex items-center gap-1 font-semibold disabled:opacity-40"
                              title="Fetch accurate Tamil translation from Gemini AI"
                            >
                              <Sparkles className={`h-2.5 w-2.5 ${isAiTranslating ? "animate-spin text-amber-500" : ""}`} />
                              <span>{isAiTranslating ? "Translating..." : "✨ Gemini AI"}</span>
                            </button>
                          </label>
                          <div className="relative">
                            <Input
                              value={editDishTa}
                              onChange={(e) => setEditDishTa(e.target.value)}
                              inputMode="text"
                              lang="ta"
                              autoComplete="off"
                              autoCorrect="off"
                              spellCheck={false}
                              className="h-8 text-xs font-tamil mt-0.5 pr-7"
                            />
                            {isAiTranslating && (
                              <span className="absolute right-2 top-1/2 -translate-y-1/2">
                                <Sparkles className="h-3 w-3 text-acc animate-pulse" />
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] text-ink/70">Category:</span>
                          <select
                            value={editDishCategory}
                            onChange={(e) => setEditDishCategory(e.target.value)}
                            className="text-xs border border-line rounded px-2 py-1 bg-surf text-ink"
                          >
                            {categories.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={cancelEditingDish}
                            className="h-7 text-xs px-2.5"
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => saveEditedDish(key, dish)}
                            className="h-7 text-xs px-3 bg-acc text-accink font-semibold"
                          >
                            <Save className="h-3 w-3 mr-1" />
                            Save
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={key}
                    draggable={!filterText}
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    className={`flex items-center justify-between p-3 rounded-xl border border-line bg-surf-2 hover:bg-surf transition-all gap-3 ${
                      draggedIndex === index ? "opacity-40 border-acc border-dashed" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Sequence Number & Drag Handle */}
                      <div
                        className="flex items-center gap-1 text-ink/40 hover:text-ink cursor-grab active:cursor-grabbing p-1 rounded shrink-0"
                        title="Drag to rearrange serving sequence"
                      >
                        <GripVertical className="h-4 w-4" />
                        <span className="text-[11px] font-bold text-acc w-5 text-center">
                          #{index + 1}
                        </span>
                      </div>

                      {/* Image Thumbnail */}
                      <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-line relative bg-gray-100">
                        <img
                          src={dish.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100"}
                          alt={dish.name_en || dish.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100";
                          }}
                        />
                        {dish.isVegetarian && (
                          <div
                            className="absolute bottom-0.5 right-0.5 bg-green-600 text-white p-0.5 rounded-full"
                            title="Vegetarian"
                          >
                            <Leaf className="h-2 w-2" />
                          </div>
                        )}
                      </div>

                      {/* Names & Category */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-semibold text-ink truncate">
                            {dish.name_en || dish.name}
                          </h4>
                          <Badge variant="outline" className="text-[10px] text-ink/60 border-line py-0">
                            {dish.category}
                          </Badge>
                        </div>
                        <p className="text-xs text-[#762934] dark:text-[#d8b36d] font-medium truncate font-tamil">
                          {dish.name_ta || getInstantTamilName(dish.name_en || dish.name)}
                        </p>
                      </div>
                    </div>

                    {/* Actions: Move Up, Move Down, Edit & Remove */}
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={index === 0 || !!filterText}
                        onClick={() => handleMoveUp(index)}
                        className="h-8 w-8 p-0 text-ink/60 hover:text-ink hover:bg-acc/10 rounded-lg disabled:opacity-20"
                        title="Move dish up in serving sequence"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={index === session.selectedDishes.length - 1 || !!filterText}
                        onClick={() => handleMoveDown(index)}
                        className="h-8 w-8 p-0 text-ink/60 hover:text-ink hover:bg-acc/10 rounded-lg disabled:opacity-20"
                        title="Move dish down in serving sequence"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => startEditingDish(key, dish)}
                        className="h-8 w-8 p-0 text-ink/60 hover:text-ink hover:bg-acc/10 rounded-lg"
                        title="Edit dish name or category"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onRemoveDish(key)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                        title="Remove dish from this session"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Navigation - Proceed to Next Session */}
        <div className="p-4 border-t border-line bg-surf flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="text-xs text-ink/60">
            Current Session: <strong className="text-ink">{session.name}</strong> ({session.selectedDishes.length} dishes)
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs font-semibold h-9"
            >
              Close & Keep Editing
            </Button>

            <Button
              size="sm"
              onClick={() => {
                // Sync all session dishes into our dictionary
                sessionDishes.forEach(({ dish }) => {
                  const en = dish.name_en || dish.name || "";
                  const ta = dish.name_ta || "";
                  if (en && ta) {
                    registerDishToDictionary(en, ta, dish.category);
                  }
                });
                onOpenChange(false);
                onNextSession();
              }}
              className="bg-acc text-accink hover:bg-acc/90 font-semibold text-xs h-9 px-4 rounded-lg shadow-sm"
            >
              {isLastSession ? (
                <>
                  Proceed to Review & Costing
                  <ChevronRight className="h-4 w-4 ml-1.5" />
                </>
              ) : (
                <>
                  Proceed to Next Session {nextSessionName ? `(${nextSessionName})` : ""}
                  <ChevronRight className="h-4 w-4 ml-1.5" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
