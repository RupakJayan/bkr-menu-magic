import type { CatalogDish } from "@/types/menu";
import { findDishByKey, parseDishKey } from "@/services/menuCatalogService";

/**
 * Calculates authentic South Indian wedding and catering course rank.
 * Comprehensive ranking covering:
 * Drinks -> Starters -> Traditional Sweets -> Tiffin (Pongal, Vada, Idly, Poori, Dosa) ->
 * Breads & Rice -> Sambar & Gravy -> Poriyal & Kootu -> Rasam -> Curd Rice ->
 * Accompaniments (Appalam/Chutney) -> Desserts -> Hot Beverages (Coffee/Tea) -> Beeda.
 *
 * Flawlessly handles both English (including colloquial spellings like "idly") and Tamil script.
 */
export const getDishCourseRank = (dish: {
  name_en?: string;
  name?: string;
  name_ta?: string;
  category?: string;
}): number => {
  const nameEn = (dish.name_en || dish.name || "").toLowerCase().trim();
  const nameTa = (dish.name_ta || "").trim();
  const cat = (dish.category || "").toLowerCase().trim();

  // 1. Welcome Drinks & Juices
  if (
    nameEn.includes("welcome") ||
    nameEn.includes("juice") ||
    nameEn.includes("squash") ||
    nameEn.includes("mocktail") ||
    nameTa.includes("ஜூஸ்") ||
    nameTa.includes("வரவேற்பு") ||
    cat.includes("welcome") ||
    cat.includes("juice")
  ) {
    return 10;
  }

  // 2. Soups
  if (nameEn.includes("soup") || nameTa.includes("சூப்") || cat.includes("soup")) {
    return 15;
  }

  // 3. Starters, Appetizers & 65 Fry (Exclude Tiffin items like Vada, Dosa, Poori)
  const isSpecificTiffin =
    nameEn.includes("vada") ||
    nameEn.includes("vadai") ||
    nameEn.includes("wada") ||
    nameTa.includes("வடை") ||
    nameEn.includes("idli") ||
    nameEn.includes("idly") ||
    nameTa.includes("இட்லி") ||
    nameEn.includes("dosa") ||
    nameEn.includes("dosai") ||
    nameTa.includes("தோசை") ||
    nameEn.includes("poori") ||
    nameTa.includes("பூரி");

  if (
    !isSpecificTiffin &&
    (nameEn.includes("starter") ||
      nameEn.includes("manchurian") ||
      nameEn.includes("roll") ||
      nameEn.includes("cutlet") ||
      nameEn.includes("samosa") ||
      nameEn.includes("momos") ||
      nameEn.includes("65") ||
      nameEn.includes("tikka") ||
      nameEn.includes("finger") ||
      nameEn.includes("crispy") ||
      nameEn.includes("bites") ||
      nameTa.includes("ஸ்டார்டர்") ||
      nameTa.includes("சமோசா") ||
      nameTa.includes("மோமோஸ்") ||
      nameTa.includes("கட்லெட்") ||
      nameTa.includes("ரோல்") ||
      cat.includes("starter") ||
      cat.includes("samosa") ||
      cat.includes("momos") ||
      cat.includes("65 fry"))
  ) {
    return 20;
  }

  // 3b. Traditional Kaaram & Savories (Mixture, Murukku, Thattai, Seedai, Pakoda, Omapodi, Sev, Kaara Boondi)
  if (
    nameEn.includes("mixture") ||
    nameEn.includes("murukku") ||
    nameEn.includes("thattai") ||
    nameEn.includes("seedai") ||
    nameEn.includes("omapodi") ||
    nameEn.includes("sev") ||
    nameEn.includes("kara boondi") ||
    nameEn.includes("kaaram") ||
    nameEn.includes("karam") ||
    nameTa.includes("மிக்சர்") ||
    nameTa.includes("முறுக்கு") ||
    nameTa.includes("தட்டை") ||
    nameTa.includes("சீடை") ||
    nameTa.includes("ஓமப்பொடி") ||
    nameTa.includes("சேவ்") ||
    nameTa.includes("கார பூந்தி") ||
    nameTa.includes("கார வகைகள்") ||
    nameTa.includes("காரம்") ||
    cat.includes("kaaram") ||
    cat.includes("savory") ||
    cat.includes("savouries") ||
    cat.includes("mixture") ||
    cat.includes("murukku")
  ) {
    return 28;
  }

  // 4a. Payasam & Kheer (Traditional liquid sweet)
  if (
    nameEn.includes("payasam") ||
    nameEn.includes("kheer") ||
    nameEn.includes("basundi") ||
    nameTa.includes("பாயாசம்") ||
    nameTa.includes("கீர்") ||
    nameTa.includes("பாசுந்தி") ||
    cat.includes("payasam") ||
    cat.includes("kheer")
  ) {
    return 32;
  }

  // 4b. Traditional Sweets & Halwa (served first on the plantain leaf)
  if (
    cat.includes("sweet") ||
    cat.includes("kesari") ||
    cat.includes("poli") ||
    cat.includes("candy") ||
    cat.includes("chikki") ||
    nameEn.includes("kesari") ||
    nameEn.includes("laddu") ||
    nameEn.includes("laddoo") ||
    nameEn.includes("halwa") ||
    nameEn.includes("mysore pak") ||
    nameEn.includes("mysurpa") ||
    nameEn.includes("poli") ||
    nameEn.includes("jangri") ||
    nameEn.includes("jalebi") ||
    nameEn.includes("jilabi") ||
    nameEn.includes("jamun") ||
    nameEn.includes("sweet") ||
    nameEn.includes("katli") ||
    nameEn.includes("peda") ||
    nameTa.includes("கேசரி") ||
    nameTa.includes("லட்டு") ||
    nameTa.includes("அல்வா") ||
    nameTa.includes("மைசூர் பாக்") ||
    nameTa.includes("போளி") ||
    nameTa.includes("ஜாங்கிரி") ||
    nameTa.includes("ஜிலேபி") ||
    nameTa.includes("ஜாமூன்") ||
    nameTa.includes("இனிப்பு")
  ) {
    return 30;
  }



  // 5. Breakfast / Tiffin Courses (Ordered: Pongal -> Vada -> Idli/Idly -> Poori -> Dosa -> Upma)
  // 5a. Pongal
  if (nameEn.includes("pongal") || nameTa.includes("பொங்கல்") || cat.includes("pongal")) {
    return 40;
  }

  // 5b. Vadai / Medu Vada
  if (
    nameEn.includes("vada") ||
    nameEn.includes("vadai") ||
    nameEn.includes("wada") ||
    nameTa.includes("வடை") ||
    cat.includes("vadai") ||
    cat.includes("vada")
  ) {
    return 42;
  }

  // 5c. Idli / Idly (Handles both -li and -ly endings, plus Tamil இட்லி)
  if (
    nameEn.includes("idli") ||
    nameEn.includes("idly") ||
    nameEn.includes("idlee") ||
    nameEn.includes("iddly") ||
    nameTa.includes("இட்லி") ||
    cat.includes("idly") ||
    cat.includes("idli")
  ) {
    return 44;
  }

  // 5d. Poori & Traditional Tiffin Specials (Paniyaram, Appam, Idiyappam, Adai)
  if (
    nameEn.includes("poori") ||
    nameEn.includes("puri") ||
    nameEn.includes("paniyaram") ||
    nameEn.includes("appam") ||
    nameEn.includes("aappam") ||
    nameEn.includes("idiyappam") ||
    nameEn.includes("adai") ||
    nameTa.includes("பூரி") ||
    nameTa.includes("பணியாரம்") ||
    nameTa.includes("ஆப்பம்") ||
    nameTa.includes("இடியாப்பம்") ||
    nameTa.includes("அடை") ||
    cat.includes("poori") ||
    cat.includes("puri")
  ) {
    return 46;
  }

  // 5e. Dosa / Oothappam
  if (
    nameEn.includes("dosa") ||
    nameEn.includes("dosai") ||
    nameEn.includes("dhosa") ||
    nameEn.includes("roast") ||
    nameEn.includes("oothappam") ||
    nameEn.includes("uthappam") ||
    nameTa.includes("தோசை") ||
    nameTa.includes("ஊத்தப்பம்") ||
    cat.includes("dosa") ||
    cat.includes("dosai")
  ) {
    return 48;
  }

  // 5f. Kichadi, Upma, Sevai, Puttu
  if (
    nameEn.includes("upma") ||
    nameEn.includes("kichadi") ||
    nameEn.includes("khichdi") ||
    nameEn.includes("sevai") ||
    nameEn.includes("puttu") ||
    nameTa.includes("உப்புமா") ||
    nameTa.includes("கிச்சடி") ||
    nameTa.includes("சேவை") ||
    nameTa.includes("புட்டு") ||
    cat.includes("kichadi") ||
    cat.includes("upma") ||
    cat.includes("sevai") ||
    cat.includes("puttu")
  ) {
    return 50;
  }

  // 5g. General Tiffin / Breakfast
  if (cat.includes("tiffin") || cat.includes("breakfast")) {
    return 52;
  }

  // 6. Breads & Rotis (Chappathi, Parotta, Naan, Kulcha, Roti)
  if (
    nameEn.includes("parotta") ||
    nameEn.includes("chappathi") ||
    nameEn.includes("chapati") ||
    nameEn.includes("naan") ||
    nameEn.includes("roti") ||
    nameEn.includes("kulcha") ||
    nameTa.includes("பரோட்டா") ||
    nameTa.includes("சப்பாத்தி") ||
    nameTa.includes("ரொட்டி") ||
    nameTa.includes("நான்") ||
    cat.includes("bread") ||
    cat.includes("roti")
  ) {
    return 60;
  }

  // 7. Rice Varieties & Biryani (Biryani -> Pulao -> Variety Rice -> Plain White Rice)
  if (
    nameEn.includes("biryani") ||
    nameEn.includes("briyani") ||
    nameTa.includes("பிரியாணி") ||
    cat.includes("biryani") ||
    cat.includes("biriyani")
  ) {
    return 62;
  }
  if (
    nameEn.includes("pulao") ||
    nameEn.includes("fried rice") ||
    nameTa.includes("புலாவ்") ||
    cat.includes("pulao")
  ) {
    return 64;
  }
  if (
    nameEn.includes("rice") ||
    nameEn.includes("sadham") ||
    nameEn.includes("bath") ||
    nameTa.includes("சாதம்") ||
    cat.includes("rice") ||
    cat.includes("sadam")
  ) {
    return 66;
  }

  // 8. Sambar, Dhal, Kuzhambu, Kurma, Gravies
  if (
    nameEn.includes("sambar") ||
    nameEn.includes("kuzhambu") ||
    nameEn.includes("kulambu") ||
    nameEn.includes("kurma") ||
    nameEn.includes("dhal") ||
    nameEn.includes("dal") ||
    nameEn.includes("gravy") ||
    nameEn.includes("salna") ||
    nameEn.includes("masala") ||
    nameTa.includes("சாம்பார்") ||
    nameTa.includes("குழம்பு") ||
    nameTa.includes("குருமா") ||
    nameTa.includes("பருப்பு") ||
    cat.includes("sambar") ||
    cat.includes("dhal") ||
    cat.includes("kuzhambu") ||
    cat.includes("gravy")
  ) {
    return 70;
  }

  // 9. Poriyal, Varuval, Kootu, Avial, Chops
  if (
    nameEn.includes("kootu") ||
    nameEn.includes("avial") ||
    nameTa.includes("கூட்டு") ||
    nameTa.includes("அவியல்") ||
    cat.includes("kootu")
  ) {
    return 80;
  }
  if (
    nameEn.includes("poriyal") ||
    nameEn.includes("varuval") ||
    nameEn.includes("fry") ||
    nameEn.includes("chops") ||
    nameTa.includes("பொரியல்") ||
    nameTa.includes("வறுவல்") ||
    cat.includes("poriyal") ||
    cat.includes("chops") ||
    cat.includes("curry")
  ) {
    return 84;
  }

  // 10. Rasam
  if (nameEn.includes("rasam") || nameTa.includes("ரசம்") || cat.includes("rasam")) {
    return 90;
  }

  // 11. Curd Rice, Thayir Sadham, Mor, Buttermilk, Raitha, Pachadi
  if (
    nameEn.includes("curd") ||
    nameEn.includes("thayir") ||
    nameEn.includes("mor") ||
    nameEn.includes("buttermilk") ||
    nameEn.includes("raita") ||
    nameEn.includes("raitha") ||
    nameEn.includes("pachadi") ||
    nameTa.includes("தயிர்") ||
    nameTa.includes("மோர்") ||
    nameTa.includes("பச்சடி") ||
    nameTa.includes("ரய்த்தா") ||
    cat.includes("curd") ||
    cat.includes("raitha")
  ) {
    return 100;
  }

  // 12. Accompaniments (Appalam, Pappad, Pickle, Chutney, Thuvaiyal, Vadam)
  if (
    nameEn.includes("appalam") ||
    nameEn.includes("pappad") ||
    nameEn.includes("pappadam") ||
    nameEn.includes("vadam") ||
    nameEn.includes("vadagam") ||
    nameEn.includes("pickle") ||
    nameEn.includes("oorugai") ||
    nameEn.includes("chutney") ||
    nameEn.includes("thuvaiyal") ||
    nameEn.includes("podi") ||
    nameTa.includes("அப்பளம்") ||
    nameTa.includes("பப்படம்") ||
    nameTa.includes("வடம்") ||
    nameTa.includes("வடகம்") ||
    nameTa.includes("ஊறுகாய்") ||
    nameTa.includes("சட்னி") ||
    nameTa.includes("துவையல்") ||
    nameTa.includes("பொடி") ||
    cat.includes("chutney") ||
    cat.includes("pickle") ||
    cat.includes("vadagam") ||
    cat.includes("vadam") ||
    cat.includes("pappad") ||
    cat.includes("appalam")
  ) {
    return 110;
  }

  // 13. Desserts, Ice Cream, Fruit Salad
  if (
    nameEn.includes("ice cream") ||
    nameEn.includes("fruit") ||
    nameEn.includes("dessert") ||
    nameTa.includes("ஐஸ்கிரீம்") ||
    nameTa.includes("பழங்கள்") ||
    cat.includes("dessert")
  ) {
    return 120;
  }

  // 14. Hot Beverages (Filter Coffee, Tea)
  if (
    nameEn.includes("coffee") ||
    nameEn.includes("tea") ||
    nameTa.includes("காபி") ||
    nameTa.includes("டீ") ||
    cat.includes("hot beverage") ||
    cat.includes("beverage")
  ) {
    return 130;
  }

  // 15. Beeda / Paan
  if (nameEn.includes("beeda") || nameEn.includes("paan") || nameTa.includes("பீடா") || cat.includes("beeda")) {
    return 140;
  }

  // Default / Unclassified Custom Dishes: place at rank 75 (Main Course) instead of after coffee!
  return 75;
};

/**
 * Safely resolves a dish key to a CatalogDish object, with fallback synthesis for
 * custom added dishes if the catalog instance is pending a reload cycle.
 */
export const resolveDishForOrdering = (key: string): CatalogDish => {
  const found = findDishByKey(key);
  if (found) return found;
  const { category, dishId } = parseDishKey(key);
  const cleanName = dishId
    .replace(/^custom_/, "")
    .replace(/_[a-z0-9]+$/, "")
    .replace(/[-_]+/g, " ");
  return {
    id: dishId,
    name: cleanName,
    name_en: cleanName,
    name_ta: "",
    category: category || "Special Dishes",
    isVegetarian: true,
  };
};

/**
 * Inserts a newly added dish key into its proper position in the session's serving sequence.
 * Preserves existing arrangement while seamlessly slotting the new dish into its natural course.
 *
 * Example: If session has [Kesari (30), Pongal (40), Sambar (70), Coffee (130)]
 * Adding "Plain Idly" (rank 44) will insert it between Pongal and Sambar ->
 * Result: [Kesari, Pongal, Plain Idly, Sambar, Coffee].
 */
export const insertDishInServingSequence = (
  existingKeys: string[],
  newDishKey: string
): string[] => {
  if (existingKeys.includes(newDishKey)) {
    return existingKeys;
  }

  if (existingKeys.length === 0) {
    return [newDishKey];
  }

  const newDish = resolveDishForOrdering(newDishKey);
  const newRank = getDishCourseRank(newDish);

  // Find the position where all preceding items have rank <= newRank
  let insertIndex = existingKeys.length;
  for (let i = 0; i < existingKeys.length; i++) {
    const existingDish = resolveDishForOrdering(existingKeys[i]);
    const existingRank = getDishCourseRank(existingDish);
    if (existingRank > newRank) {
      insertIndex = i;
      break;
    }
  }

  const updated = [...existingKeys];
  updated.splice(insertIndex, 0, newDishKey);
  return updated;
};

/**
 * Sorts an array of dish keys according to authentic South Indian catering course order.
 */
export const sortDishesByTraditionalCourse = (dishKeys: string[]): string[] => {
  return [...dishKeys].sort((keyA, keyB) => {
    const dishA = resolveDishForOrdering(keyA);
    const dishB = resolveDishForOrdering(keyB);
    const rankA = getDishCourseRank(dishA);
    const rankB = getDishCourseRank(dishB);
    return rankA - rankB;
  });
};

/**
 * Sorts an array of dish keys alphabetically (A to Z) by English name.
 */
export const sortDishesAlphabetical = (dishKeys: string[]): string[] => {
  return [...dishKeys].sort((keyA, keyB) => {
    const dishA = resolveDishForOrdering(keyA);
    const dishB = resolveDishForOrdering(keyB);
    const nameA = dishA.name_en || dishA.name || "";
    const nameB = dishB.name_en || dishB.name || "";
    return nameA.localeCompare(nameB);
  });
};

/**
 * Sorts an array of dish keys alphabetically by Category name.
 */
export const sortDishesByCategory = (dishKeys: string[]): string[] => {
  return [...dishKeys].sort((keyA, keyB) => {
    const dishA = resolveDishForOrdering(keyA);
    const dishB = resolveDishForOrdering(keyB);
    const catA = dishA.category || "";
    const catB = dishB.category || "";
    return catA.localeCompare(catB);
  });
};

