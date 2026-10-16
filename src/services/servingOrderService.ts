import type { CatalogDish } from "@/types/menu";
import { findDishByKey } from "@/services/menuCatalogService";

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
    cat.includes("welcome drink")
  ) {
    return 10;
  }

  // 2. Soups
  if (nameEn.includes("soup") || nameTa.includes("சூப்") || cat.includes("soup")) {
    return 15;
  }

  // 3. Starters, Appetizers & 65 Fry
  if (
    nameEn.includes("starter") ||
    nameEn.includes("manchurian") ||
    nameEn.includes("roll") ||
    nameEn.includes("cutlet") ||
    nameEn.includes("samosa") ||
    nameEn.includes("momos") ||
    nameEn.includes("65") ||
    nameEn.includes("tikka") ||
    nameEn.includes("finger") ||
    nameEn.includes("crispy") ||
    cat.includes("starter") ||
    cat.includes("samosa") ||
    cat.includes("momos") ||
    cat.includes("65 fry")
  ) {
    return 20;
  }

  // 4. Traditional Sweets (served first on the plantain leaf)
  // Kesari, Payasam, Laddu, Halwa, Mysore Pak, Jangri, Gulab Jamun, Poli
  if (
    cat.includes("sweet") ||
    nameEn.includes("payasam") ||
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
    nameTa.includes("பாயாசம்") ||
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
  if (nameEn.includes("pongal") || nameTa.includes("பொங்கல்")) {
    return 40;
  }

  // 5b. Vadai / Medu Vada
  if (
    nameEn.includes("vada") ||
    nameEn.includes("vadai") ||
    nameEn.includes("wada") ||
    nameTa.includes("வடை")
  ) {
    return 42;
  }

  // 5c. Idli / Idly (Handles both -li and -ly endings, plus Tamil இட்லி)
  if (
    nameEn.includes("idli") ||
    nameEn.includes("idly") ||
    nameEn.includes("idlee") ||
    nameEn.includes("iddly") ||
    nameTa.includes("இட்லி")
  ) {
    return 44;
  }

  // 5d. Poori
  if (nameEn.includes("poori") || nameEn.includes("puri") || nameTa.includes("பூரி")) {
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
    nameTa.includes("ஊத்தப்பம்")
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
    cat.includes("bread")
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
  if (nameEn.includes("pulao") || nameEn.includes("fried rice") || nameTa.includes("புலாவ்")) {
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
    cat.includes("curry & chops")
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
    nameEn.includes("vadam") ||
    nameEn.includes("vadagam") ||
    nameEn.includes("pickle") ||
    nameEn.includes("oorugai") ||
    nameEn.includes("chutney") ||
    nameEn.includes("thuvaiyal") ||
    nameEn.includes("podi") ||
    nameTa.includes("அப்பளம்") ||
    nameTa.includes("வடம்") ||
    nameTa.includes("வடகம்") ||
    nameTa.includes("ஊறுகாய்") ||
    nameTa.includes("சட்னி") ||
    nameTa.includes("துவையல்") ||
    nameTa.includes("பொடி") ||
    cat.includes("chutney") ||
    cat.includes("pickle") ||
    cat.includes("vadagam") ||
    cat.includes("pappad")
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
    cat.includes("dessert") ||
    cat.includes("special desserts")
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
  if (nameEn.includes("beeda") || nameEn.includes("paan") || nameTa.includes("பீடா")) {
    return 140;
  }

  // Default / Miscellaneous
  return 150;
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

  const newDish = findDishByKey(newDishKey);
  if (!newDish) {
    return [...existingKeys, newDishKey];
  }

  const newRank = getDishCourseRank(newDish);

  // Find the position where all preceding items have rank <= newRank
  let insertIndex = existingKeys.length;
  for (let i = 0; i < existingKeys.length; i++) {
    const existingDish = findDishByKey(existingKeys[i]);
    if (!existingDish) continue;
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
    const dishA = findDishByKey(keyA);
    const dishB = findDishByKey(keyB);
    const rankA = dishA ? getDishCourseRank(dishA) : 150;
    const rankB = dishB ? getDishCourseRank(dishB) : 150;
    return rankA - rankB;
  });
};

/**
 * Sorts an array of dish keys alphabetically (A to Z) by English name.
 */
export const sortDishesAlphabetical = (dishKeys: string[]): string[] => {
  return [...dishKeys].sort((keyA, keyB) => {
    const dishA = findDishByKey(keyA);
    const dishB = findDishByKey(keyB);
    const nameA = dishA?.name_en || dishA?.name || "";
    const nameB = dishB?.name_en || dishB?.name || "";
    return nameA.localeCompare(nameB);
  });
};

/**
 * Sorts an array of dish keys alphabetically by Category name.
 */
export const sortDishesByCategory = (dishKeys: string[]): string[] => {
  return [...dishKeys].sort((keyA, keyB) => {
    const dishA = findDishByKey(keyA);
    const dishB = findDishByKey(keyB);
    const catA = dishA?.category || "";
    const catB = dishB?.category || "";
    return catA.localeCompare(catB);
  });
};
