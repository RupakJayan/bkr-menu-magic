import type { CatalogDish } from "@/types/menu";

export type VoiceLanguage = "en-IN" | "ta-IN" | "en-US";
export type VoiceMode = "single" | "continuous";

export interface RecognizedItemResult {
  phrase: string;
  matchedDish: CatalogDish | null;
  status: "added" | "already-added" | "not-found";
}

/**
 * Common South Indian catering colloquial aliases mapping spoken phrases to standard catalog names.
 */
const COMMON_ALIASES: Record<string, string[]> = {
  "idli": ["idli", "idly", "idlee", "iddly", "இட்லி", "mini idli", "sambar idli", "தட்டு இட்லி", "rava idli", "podi idli", "kanchipuram idli"],
  "vada": ["vada", "vadai", "vade", "wada", "medu vada", "மெது வடை", "வடை", "medu vadai"],
  "pongal": ["pongal", "ven pongal", "ghee pongal", "பொங்கல்", "வெண் பொங்கல்"],
  "poori": ["poori", "puri", "பூரி", "mini poori"],
  "dosa": ["dosa", "dosai", "dhosa", "தோசை", "ghee roast", "masala dosa", "ரவா தோசை"],
  "kesari": ["kesari", "கேசரி", "rava kesari", "pineapple kesari"],
  "sambar": ["sambar", "சாம்பார்", "arachuvitta sambar"],
  "rasam": ["rasam", "ரசம்", "tomato rasam", "pepper rasam"],
  "chutney": ["chutney", "சட்னி", "coconut chutney", "kara chutney"],
  "payasam": ["payasam", "பாயாசம்", "semiya payasam", "paruppu payasam", "elaneer payasam"],
  "coffee": ["coffee", "காபி", "filter coffee", "degree coffee"],
  "curd rice": ["curd rice", "thayir sadham", "தயிர் சாதம்", "bagala bath"],
  "sambar rice": ["sambar rice", "sambar sadham", "சாம்பார் சாதம்", "bisi bele bath"],
  "lemon rice": ["lemon rice", "elamichai sadham", "எலுமிச்சை சாதம்"],
  "biryani": ["biryani", "briyani", "பிரியாணி", "veg biryani", "dum biryani"],
  "laddu": ["laddu", "laddoo", "லட்டு", "mothi laddu", "ghee laddu"],
  "halwa": ["halwa", "அல்வா", "wheat halwa", "dumroot halwa"],
  "appalam": ["appalam", "அப்பளம்", "pappad"],
};

/**
 * Clean spoken voice input by removing filler words like "please add", "next", "and".
 */
export const cleanSpokenPhrase = (phrase: string): string => {
  return phrase
    .replace(/\b(please\s+add|add|and|also|next|put|வேண்டும்|போடு|மற்றும்|அப்புறம்)\b/gi, "")
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

/**
 * Split a continuous spoken sentence into individual candidate dish phrases.
 * Supports delimiters like commas, "and", "also", "next", "மற்றும்".
 */
export const splitContinuousSpeech = (transcript: string): string[] => {
  return transcript
    .split(/[,+]|\band\b|\balso\b|\bnext\b|\bமற்றும்\b|\bஅப்புறம்\b|\n/i)
    .map((item) => cleanSpokenPhrase(item))
    .filter((item) => item.length >= 2);
};

/**
 * Match a spoken phrase against the available catalog items.
 */
export const findBestDishMatch = (
  spokenPhrase: string,
  catalogDishes: CatalogDish[]
): CatalogDish | null => {
  const query = cleanSpokenPhrase(spokenPhrase).toLowerCase();
  if (!query) return null;

  const queryTa = query.trim();

  // 1. Exact match on English name
  const exactEn = catalogDishes.find(
    (d) => d.name_en.toLowerCase() === query
  );
  if (exactEn) return exactEn;

  // 2. Exact match on Tamil name
  const exactTa = catalogDishes.find(
    (d) => d.name_ta.trim() === queryTa
  );
  if (exactTa) return exactTa;

  // 3. Name starts with spoken query or query starts with dish name
  const prefixEn = catalogDishes.find((d) => {
    const en = d.name_en.toLowerCase();
    return en.startsWith(query) || query.startsWith(en);
  });
  if (prefixEn) return prefixEn;

  // 4. Substring contains match
  const containsEn = catalogDishes.find(
    (d) => d.name_en.toLowerCase().includes(query) || query.includes(d.name_en.toLowerCase())
  );
  if (containsEn) return containsEn;

  const containsTa = catalogDishes.find(
    (d) => d.name_ta.includes(queryTa) || queryTa.includes(d.name_ta)
  );
  if (containsTa) return containsTa;

  // 5. Alias dictionary match
  for (const [key, aliasList] of Object.entries(COMMON_ALIASES)) {
    if (aliasList.some((alias) => query.includes(alias) || alias.includes(query))) {
      // Find a dish whose name contains this key or alias
      const aliasMatch = catalogDishes.find((d) => {
        const en = d.name_en.toLowerCase();
        return en.includes(key) || aliasList.some((a) => en.includes(a) || d.name_ta.includes(a));
      });
      if (aliasMatch) return aliasMatch;
    }
  }

  return null;
};

/**
 * Find all potential dish matches for a spoken phrase, sorted by match relevance.
 * Used for voice confirmation so user can confirm or pick their intended dish.
 */
export const findAllDishMatches = (
  spokenPhrase: string,
  catalogDishes: CatalogDish[],
  limit = 5
): CatalogDish[] => {
  const query = cleanSpokenPhrase(spokenPhrase).toLowerCase();
  if (!query || query.length < 2) return [];

  const matches: CatalogDish[] = [];
  const seenIds = new Set<string>();

  const addMatch = (dish: CatalogDish) => {
    if (!seenIds.has(dish.id)) {
      seenIds.add(dish.id);
      matches.push(dish);
    }
  };

  // 1. Exact / best match first
  const exact = findBestDishMatch(spokenPhrase, catalogDishes);
  if (exact) addMatch(exact);

  // 2. Starts with query
  for (const d of catalogDishes) {
    if (matches.length >= limit) break;
    const en = d.name_en.toLowerCase();
    if (en.startsWith(query) || d.name_ta.startsWith(query)) {
      addMatch(d);
    }
  }

  // 3. Includes query
  for (const d of catalogDishes) {
    if (matches.length >= limit) break;
    const en = d.name_en.toLowerCase();
    if (en.includes(query) || d.name_ta.includes(query)) {
      addMatch(d);
    }
  }

  // 4. Check aliases
  for (const [key, aliasList] of Object.entries(COMMON_ALIASES)) {
    if (matches.length >= limit) break;
    if (aliasList.some((alias) => query.includes(alias) || alias.includes(query))) {
      for (const d of catalogDishes) {
        if (matches.length >= limit) break;
        const en = d.name_en.toLowerCase();
        if (en.includes(key) || aliasList.some((a) => en.includes(a) || d.name_ta.includes(a))) {
          addMatch(d);
        }
      }
    }
  }

  return matches.slice(0, limit);
};

/**
 * Dynamically register a new alias or custom dish into the voice alias dictionary.
 */
export const registerVoiceAlias = (key: string, aliases: string[]): void => {
  const lowerKey = key.toLowerCase().trim();
  if (!COMMON_ALIASES[lowerKey]) {
    COMMON_ALIASES[lowerKey] = [];
  }
  for (const a of aliases) {
    const cleanA = a.trim();
    if (cleanA && !COMMON_ALIASES[lowerKey].includes(cleanA)) {
      COMMON_ALIASES[lowerKey].push(cleanA);
    }
  }
};

/**
 * Check if the current browser environment supports the Web Speech Recognition API.
 */
export const isSpeechRecognitionSupported = (): boolean => {
  return typeof window !== "undefined" && Boolean(
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  );
};

/**
 * Play a crisp, fast tick-like beep when an item is added via voice.
 * Fast 50ms confirmation tick sound for satisfying continuous entry.
 */
export const playVoiceTickSound = (): void => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(1100, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1600, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch {
    // Web Audio blocked or unsupported; ignore silently
  }
};

/**
 * Play a double low-tone pip when an item is already in the menu.
 */
export const playAlreadyAddedSound = (): void => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    // First pip
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(440, ctx.currentTime);
    gain1.gain.setValueAtTime(0.2, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.04);

    // Second pip 60ms later
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(360, ctx.currentTime + 0.06);
    gain2.gain.setValueAtTime(0.2, ctx.currentTime + 0.06);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.10);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.06);
    osc2.stop(ctx.currentTime + 0.10);
  } catch {
    // Web Audio blocked or unsupported; ignore silently
  }
};

/**
 * Speak quick voice feedback (Disabled by default to prevent audio reflecting into phone/tablet microphone).
 */
export const speakVoiceFeedback = (_text: string): void => {
  // Speech synthesis deliberately disabled to prevent speaker audio reflecting into mobile microphones
};

/**
 * Alias for backward compatibility
 */
export const playVoiceSuccessChime = playVoiceTickSound;
