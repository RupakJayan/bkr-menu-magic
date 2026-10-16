import { EventMenu, Session, DayPlan, Dish } from "@/types/menu";
import { getManagedMenuCatalog, buildCatalogKey } from "@/services/localAdminService";
import { createEmptyMenu } from "@/services/menuCalculationService";

const GEMINI_API_KEY_STORAGE = "bkr-gemini-api-key";
export const DEFAULT_GEMINI_API_KEY = "";

/**
 * Retrieve the configured Gemini API key from environment, local storage, or default configuration.
 */
export const getGeminiApiKey = (): string => {
  try {
    const metaEnv = typeof import.meta !== "undefined" && import.meta.env ? import.meta.env.VITE_GEMINI_API_KEY : undefined;
    const processEnv = typeof process !== "undefined" && process.env ? process.env.VITE_GEMINI_API_KEY : undefined;
    const envKey = (metaEnv || processEnv)?.trim();
    if (envKey) return envKey;
  } catch {
    // Ignore environment lookup error
  }
  try {
    if (typeof localStorage !== "undefined") {
      const stored = (localStorage.getItem(GEMINI_API_KEY_STORAGE) || "").trim();
      if (stored) return stored;
    }
  } catch {
    // Ignore storage error
  }
  return DEFAULT_GEMINI_API_KEY;
};

/**
 * Persist the Gemini API key in local storage.
 */
export const setGeminiApiKey = (key: string): void => {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(GEMINI_API_KEY_STORAGE, key.trim());
    }
  } catch {}
};

/**
 * Check if a Gemini API key is configured.
 */
export const hasGeminiApiKey = (): boolean => {
  return Boolean(getGeminiApiKey());
};

export interface ExtractedDish {
  rawText: string;
  name_en: string;
  name_ta: string;
  category: string;
  catalogKey?: string;
  isCatalogMatch: boolean;
  image?: string;
  isVegetarian?: boolean;
}

export interface ExtractedSession {
  name: string;
  type: "breakfast" | "morning_snacks" | "lunch" | "afternoon_snacks" | "evening_snacks" | "dinner" | "custom";
  startTime: string;
  endTime: string;
  headCount: number;
  ratePerPerson: number;
  dishes: ExtractedDish[];
}

export interface ExtractedMenuData {
  clientName: string;
  clientPhone: string;
  venueName: string;
  venueAddress: string;
  startDate: string;
  endDate: string;
  transportCharge: number;
  sessions: ExtractedSession[];
  rawNotesSummary?: string;
}

/**
 * Downscale and compress an image file to Base64 so it can be sent swiftly to Gemini.
 */
export const compressImageFileToBase64 = (
  file: File,
  maxDimension = 1600,
  quality = 0.82
): Promise<{ base64Data: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Unable to create canvas context"));
          return;
        }

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const mimeType = "image/jpeg";
        const dataUrl = canvas.toDataURL(mimeType, quality);
        const base64Data = dataUrl.split(",")[1];
        resolve({ base64Data, mimeType });
      };
      img.onerror = () => reject(new Error("Failed to load image file"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.readAsDataURL(file);
  });
};

/**
 * Build a concise summary of the active BKR dish catalog to assist Gemini in mapping.
 */
const getCatalogSummary = (): string => {
  const catalog = getManagedMenuCatalog();
  const summaryLines: string[] = [];

  for (const [category, dishes] of Object.entries(catalog)) {
    const dishItems = dishes
      .slice(0, 30) // top items per category
      .map((d) => `${d.name_en} (${d.name_ta}) [ID:${d.id}]`)
      .join(", ");
    summaryLines.push(`• Category "${category}": ${dishItems}`);
  }

  return summaryLines.join("\n");
};

/**
 * Match a recognized dish name to the BKR catalog.
 */
export const matchDishToCatalog = (
  nameEn: string,
  nameTa: string,
  preferredCategory?: string
): { catalogKey?: string; matchedDish?: Dish; category?: string } => {
  const catalog = getManagedMenuCatalog();

  const cleanEn = nameEn.toLowerCase().replace(/[^a-z0-9]/g, "");
  const cleanTa = nameTa.trim();

  // 1. Search in preferred category first if given
  if (preferredCategory && catalog[preferredCategory]) {
    for (const dish of catalog[preferredCategory]) {
      const dCleanEn = dish.name_en.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (
        (cleanEn && (dCleanEn === cleanEn || dCleanEn.includes(cleanEn) || cleanEn.includes(dCleanEn))) ||
        (cleanTa && dish.name_ta.includes(cleanTa))
      ) {
        return {
          catalogKey: buildCatalogKey(preferredCategory, dish.id),
          matchedDish: dish,
          category: preferredCategory,
        };
      }
    }
  }

  // 2. Search across entire catalog
  for (const [category, dishes] of Object.entries(catalog)) {
    for (const dish of dishes) {
      const dCleanEn = dish.name_en.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (
        (cleanEn && cleanEn.length >= 3 && (dCleanEn === cleanEn || dCleanEn.includes(cleanEn) || cleanEn.includes(dCleanEn))) ||
        (cleanTa && cleanTa.length >= 2 && (dish.name_ta === cleanTa || dish.name_ta.includes(cleanTa) || cleanTa.includes(dish.name_ta)))
      ) {
        return {
          catalogKey: buildCatalogKey(category, dish.id),
          matchedDish: dish,
          category,
        };
      }
    }
  }

  return {};
};

/**
 * Convert handwritten menu images into structured menu data using Gemini multimodal AI.
 */
export const extractMenuFromHandwrittenImages = async (
  images: { base64Data: string; mimeType: string }[],
  apiKey = getGeminiApiKey()
): Promise<ExtractedMenuData> => {
  if (!apiKey) {
    throw new Error("Gemini API key is required. Please provide your API key in the AI Lens dialog.");
  }

  const catalogContext = getCatalogSummary();

  const prompt = `
You are the AI Vision Lens for BKR Catering Services (a premier South Indian wedding and event catering service).
You are analyzing photograph(s) of a handwritten catering menu order, contract sheet, or note slip.
The handwriting may be in Tamil (தமிழ்), English, or mixed Tanglish.

Your job is to decipher the handwriting and extract:
1. Client Details:
   - name: client name (person who booked the event)
   - phone: client phone number (10 digits if in India)
2. Venue Details:
   - name: Kalyana Mandapam, hall, temple, or residence name
   - address: street, town, or city
3. Dates:
   - startDate: YYYY-MM-DD format (if written or inferable from Tamil date/calendar, else empty string "")
   - endDate: YYYY-MM-DD format (else same as startDate)
4. Transport Charge:
   - transportCharge: numeric charge if specified, else 0
5. Catering Sessions:
   - Group the dishes by event meal session (e.g. Breakfast / காலை உணவு, Lunch / மதிய உணவு, Snacks / மாலை சிற்றுண்டி, Dinner / இரவு உணவு, Muhurtham, Reception).
   - For each session:
     - name: Descriptive session name (e.g., "Breakfast", "Muhurtham Lunch", "Dinner")
     - type: One of: "breakfast", "morning_snacks", "lunch", "afternoon_snacks", "evening_snacks", "dinner", "custom"
     - startTime: e.g. "08:00" for breakfast, "12:30" for lunch, "19:30" for dinner
     - endTime: e.g. "10:00" for breakfast, "14:30" for lunch, "21:30" for dinner
     - headCount: number of persons/guests/plates (default 50 if unmentioned)
     - ratePerPerson: rate per plate (₹) if written, else 0
     - dishes: list of individual dishes written under this session.
       For each dish, provide:
       - rawText: exact text from the handwritten paper
       - name_en: English dish name (e.g., "Ghee Pongal", "Medu Vada", "Pineapple Kesari", "Sambar", "Curd Rice")
       - name_ta: Tamil dish name (e.g., "நெய் பொங்கல்", "மெது வடை", "அன்னாசி கேசரி", "சாம்பார்", "தயிர் சாதம்")
       - category: Best matching category (e.g. "Breakfast (Tiffin)", "Sweets (Traditional)", "Rice Varieties", "Sambar and Rasam", etc.)
       - catalogId: catalog ID if you matched it from the BKR Catalog below, else null

Here is a reference of available BKR Catalog categories and common items:
${catalogContext}

Respond ONLY with valid, parseable JSON matching this schema:
{
  "clientName": string,
  "clientPhone": string,
  "venueName": string,
  "venueAddress": string,
  "startDate": string,
  "endDate": string,
  "transportCharge": number,
  "sessions": [
    {
      "name": string,
      "type": "breakfast" | "morning_snacks" | "lunch" | "afternoon_snacks" | "evening_snacks" | "dinner" | "custom",
      "startTime": string,
      "endTime": string,
      "headCount": number,
      "ratePerPerson": number,
      "dishes": [
        {
          "rawText": string,
          "name_en": string,
          "name_ta": string,
          "category": string,
          "catalogId": string | null
        }
      ]
    }
  ],
  "rawNotesSummary": string
}
`.trim();

  // Try standard modern models in order
  const modelsToTry = [
    "gemini-3.6-flash",
    "gemini-3.7-flash",
    "gemini-3.8-flash",
    "gemini-3.5-flash",
    "gemini-flash-latest",
  ];

  let lastError: Error | null = null;

  for (const modelName of modelsToTry) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(apiKey)}`;

      const contents = [
        {
          parts: [
            ...images.map((img) => ({
              inlineData: {
                mimeType: img.mimeType,
                data: img.base64Data,
              },
            })),
            { text: prompt },
          ],
        },
      ];

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents,
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.1,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData?.error?.message || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(message);
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) {
        throw new Error("No text response received from Gemini.");
      }

      const parsed = JSON.parse(rawText);

      // Post-process sessions and enrich matched dishes
      const enrichedSessions: ExtractedSession[] = (parsed.sessions || []).map((sess: any) => {
        const dishes: ExtractedDish[] = (sess.dishes || []).map((d: any) => {
          const match = matchDishToCatalog(d.name_en || d.rawText, d.name_ta || "", d.category);
          return {
            rawText: d.rawText || d.name_en,
            name_en: match.matchedDish?.name_en || d.name_en || d.rawText,
            name_ta: match.matchedDish?.name_ta || d.name_ta || "",
            category: match.category || d.category || "Custom Menu Items",
            catalogKey: match.catalogKey,
            isCatalogMatch: Boolean(match.catalogKey),
            image: match.matchedDish?.image,
            isVegetarian: match.matchedDish?.isVegetarian ?? true,
          };
        });

        return {
          name: sess.name || "Catering Session",
          type: sess.type || "custom",
          startTime: sess.startTime || "08:00",
          endTime: sess.endTime || "10:00",
          headCount: Math.max(1, Number(sess.headCount) || 50),
          ratePerPerson: Math.max(0, Number(sess.ratePerPerson) || 0),
          dishes,
        };
      });

      return {
        clientName: parsed.clientName || "",
        clientPhone: parsed.clientPhone || "",
        venueName: parsed.venueName || "",
        venueAddress: parsed.venueAddress || "",
        startDate: parsed.startDate || "",
        endDate: parsed.endDate || parsed.startDate || "",
        transportCharge: Math.max(0, Number(parsed.transportCharge) || 0),
        sessions: enrichedSessions,
        rawNotesSummary: parsed.rawNotesSummary || "",
      };
    } catch (err: any) {
      lastError = err;
      console.warn(`Model ${modelName} failed:`, err.message);
      // If error is an invalid API key, do not try other models
      if (err.message?.includes("API_KEY_INVALID") || err.message?.includes("API key not valid")) {
        throw new Error("Invalid Gemini API key. Please check your key from Google AI Studio.");
      }
    }
  }

  throw lastError || new Error("Failed to process handwritten menu image with Gemini AI.");
};

/**
 * Convert extracted AI data into an EventMenu ready to be loaded into the Menu Planner.
 */
export const buildEventMenuFromExtractedData = (
  extracted: ExtractedMenuData,
  baseMenu?: EventMenu
): EventMenu => {
  const empty = baseMenu ? { ...baseMenu } : createEmptyMenu();

  const startDate = extracted.startDate || empty.startDate || new Date().toISOString().split("T")[0];
  const endDate = extracted.endDate || startDate;

  // Build DayPlan
  const dayPlan: DayPlan = {
    dayNumber: 1,
    date: startDate,
    sessions: extracted.sessions.map((sess, idx) => {
      // Gather dish keys: if catalog key exists, use it; else generate custom key
      const selectedDishes = sess.dishes.map((d) => {
        if (d.catalogKey) return d.catalogKey;
        return buildCatalogKey(d.category || "Custom Menu Items", `custom_${Date.now()}_${idx}`);
      });

      return {
        id: `session_ai_${Date.now()}_${idx}`,
        name: sess.name,
        type: sess.type,
        startTime: sess.startTime,
        endTime: sess.endTime,
        headCount: sess.headCount,
        ratePerPerson: sess.ratePerPerson,
        selectedDishes,
      };
    }),
  };

  return {
    ...empty,
    clientDetails: {
      name: extracted.clientName || empty.clientDetails.name,
      phone: extracted.clientPhone || empty.clientDetails.phone,
    },
    venueDetails: {
      name: extracted.venueName || empty.venueDetails.name,
      address: extracted.venueAddress || empty.venueDetails.address,
      googleMapsUrl: empty.venueDetails.googleMapsUrl,
    },
    startDate,
    endDate,
    numberOfDays: 1,
    transportCharge: extracted.transportCharge || 0,
    days: [dayPlan],
    updatedAt: new Date(),
  };
};
