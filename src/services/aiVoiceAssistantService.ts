import { getGeminiApiKey, matchDishToCatalog } from "@/services/aiLensService";
import { getManagedMenuCatalog, addCustomDishToCatalog, updateDishInCatalog, buildCatalogKey } from "@/services/localAdminService";
import { registerDishToDictionary, isTamilScript, romanizeTamilToEnglish } from "@/services/tamilTranslationService";
import type { CatalogDish, Dish } from "@/types/menu";

export interface RecognizedVoiceDish {
  name_en: string;
  name_ta: string;
  category: string;
  catalogDish?: CatalogDish;
  isExistingMatch: boolean;
  isAlreadyInSession: boolean;
  selected: boolean;
}

export interface VoiceAssistantResult {
  dishes: RecognizedVoiceDish[];
  rawTranscript?: string;
  durationSeconds: number;
}

/**
 * Check if browser supports modern audio recording via MediaRecorder.
 */
export const isMediaRecorderSupported = (): boolean => {
  return (
    typeof window !== "undefined" &&
    typeof navigator !== "undefined" &&
    !!navigator.mediaDevices &&
    typeof navigator.mediaDevices.getUserMedia === "function" &&
    typeof window.MediaRecorder === "function"
  );
};

/**
 * Audio Recording Controller with strict Echo Cancellation and Track Cleanup.
 */
export class AudioRecordingController {
  private mediaStream: MediaStream | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private startTime: number = 0;
  private mimeType: string = "audio/webm";

  /**
   * Start recording audio with hardware/browser echo cancellation.
   */
  async start(): Promise<void> {
    if (!isMediaRecorderSupported()) {
      throw new Error("Audio recording is not supported in this browser. Please use Chrome, Edge, or Safari.");
    }

    // Stop any previous stream
    this.cancel();

    this.mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
      video: false,
    });

    // Detect best supported mime type
    const preferredTypes = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/mp4",
      "audio/aac",
      "audio/ogg;codecs=opus",
    ];

    let chosenType = "";
    for (const t of preferredTypes) {
      if (MediaRecorder.isTypeSupported(t)) {
        chosenType = t;
        break;
      }
    }

    this.mimeType = chosenType || "";
    this.recordedChunks = [];
    this.startTime = Date.now();

    this.mediaRecorder = this.mimeType
      ? new MediaRecorder(this.mediaStream, { mimeType: this.mimeType })
      : new MediaRecorder(this.mediaStream);

    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        this.recordedChunks.push(e.data);
      }
    };

    // Request data slice every 500ms
    this.mediaRecorder.start(500);
  }

  /**
   * Stop recording, terminate all mic tracks to guarantee zero echo/reflection, and return the Audio Blob.
   */
  async stop(): Promise<{ blob: Blob; mimeType: string; durationSeconds: number }> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder || this.mediaRecorder.state === "inactive") {
        this.cleanUpTracks();
        reject(new Error("Recording was not active."));
        return;
      }

      const durationSeconds = Math.max(1, Math.round((Date.now() - this.startTime) / 1000));

      this.mediaRecorder.onstop = () => {
        try {
          const finalMime = this.mimeType || this.recordedChunks[0]?.type || "audio/webm";
          const blob = new Blob(this.recordedChunks, { type: finalMime });
          this.cleanUpTracks();
          resolve({ blob, mimeType: finalMime, durationSeconds });
        } catch (err) {
          this.cleanUpTracks();
          reject(err);
        }
      };

      try {
        this.mediaRecorder.stop();
      } catch (err) {
        this.cleanUpTracks();
        reject(err);
      }
    });
  }

  /**
   * Cancel and discard recording immediately.
   */
  cancel(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
      try {
        this.mediaRecorder.stop();
      } catch {
        // ignore
      }
    }
    this.cleanUpTracks();
    this.recordedChunks = [];
  }

  private cleanUpTracks(): void {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {
          // ignore
        }
      });
      this.mediaStream = null;
    }
    this.mediaRecorder = null;
  }
}

/**
 * Convert Blob to Base64 string.
 */
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64Data = result.split(",")[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Transcribe catering audio and extract structured dishes using Gemini 2.5 Flash.
 */
export const processVoiceWithGemini = async (
  audioBlob: Blob,
  audioMimeType: string,
  sessionDishKeys: string[] = [],
  apiKey = getGeminiApiKey()
): Promise<RecognizedVoiceDish[]> => {
  if (!apiKey) {
    throw new Error("Gemini API key is required. Please enter and save your Gemini API key in the setup box above.");
  }

  const base64Audio = await blobToBase64(audioBlob);

  const prompt = `
You are the world-class South Indian Catering AI Voice Assistant for BKR Catering Services (Madurai & Chennai).
Listen attentively to this audio recording. The speaker is ordering or listing catering dishes in Tamil (தமிழ்), English, or colloquial South Indian Tanglish.

Task:
1. Extract every distinct South Indian food and beverage dish mentioned.
2. For each dish, provide:
   - "name_en": Natural, properly capitalized English catering dish name (e.g. "Ghee Pongal", "Medu Vada", "Pineapple Kesari", "Sambar", "Curd Rice").
   - "name_ta": Authentic, flawless culinary Tamil script (e.g. "நெய் பொங்கல்", "மெது வடை", "அன்னாசி கேசரி", "சாம்பார்", "தயிர் சாதம்").
   - "category": Appropriate catering category (e.g. "Breakfast (Tiffin)", "Sweets (Traditional)", "Rice Varieties", "Sambar and Rasam", "Poriyal & Varuval", "Kootu & Avial", "Accompaniments", "Desserts", "Beverages", "Snacks & Starters").

Guidelines:
- If quantities were spoken (e.g. "two vadas, three idlis"), extract the dish name cleanly ("Medu Vada", "Idli").
- If spoken in colloquial Tamil/Tanglish (e.g. "oru poori vadai sambar kesari podunga"), accurately parse into distinct items: Poori, Medu Vada, Sambar, Kesari.
- If no food or drink dishes were spoken in the audio, return an empty array: [].

Respond ONLY with a valid JSON array:
[
  {
    "name_en": "Medu Vada",
    "name_ta": "மெது வடை",
    "category": "Breakfast (Tiffin)"
  }
]
`;

  const modelsToTry = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-flash-latest"];
  let lastError: Error | null = null;

  // Clean mimeType for Gemini (strip codecs parameter like "audio/webm;codecs=opus" -> "audio/webm")
  const cleanMime = audioMimeType.split(";")[0].trim() || "audio/webm";

  for (const model of modelsToTry) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  inlineData: {
                    mimeType: cleanMime,
                    data: base64Audio,
                  },
                },
                { text: prompt },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.1,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error?.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) {
        throw new Error("No text response from Gemini.");
      }

      const parsed: Array<{ name_en: string; name_ta: string; category: string }> = JSON.parse(rawText);

      // Match each recognized dish to the active catalog
      const results: RecognizedVoiceDish[] = parsed.map((item) => {
        const en = item.name_en?.trim() || "";
        const ta = item.name_ta?.trim() || "";
        const cat = item.category?.trim() || "Special Dishes";

        const match = matchDishToCatalog(en, ta, cat);

        let catalogDish: CatalogDish | undefined;
        let isAlready = false;

        if (match.matchedDish && match.category) {
          const key = match.catalogKey || buildCatalogKey(match.category, match.matchedDish.id);
          isAlready = sessionDishKeys.includes(key);
          catalogDish = {
            ...match.matchedDish,
            category: match.category,
          };
        }

        return {
          name_en: catalogDish?.name_en || en || (isTamilScript(ta) ? romanizeTamilToEnglish(ta) : ta),
          name_ta: catalogDish?.name_ta || ta,
          category: match.category || cat,
          catalogDish,
          isExistingMatch: Boolean(match.matchedDish),
          isAlreadyInSession: isAlready,
          selected: !isAlready, // Pre-select all newly heard dishes
        };
      });

      return results;
    } catch (err: any) {
      console.warn(`Gemini audio model ${model} failed, trying next:`, err);
      lastError = err;
    }
  }

  throw lastError || new Error("Failed to transcribe audio with Gemini.");
};

/**
 * Commit selected voice dishes into the catalog, dictionary, and session.
 */
export const commitVoiceDishesToSession = (
  dishes: RecognizedVoiceDish[],
  onAddDishToSession: (category: string, dishId: string) => void,
  onCatalogUpdated?: () => void
): { addedCount: number; newDishesCreated: number } => {
  let addedCount = 0;
  let newDishesCreated = 0;

  for (const item of dishes) {
    if (!item.selected || item.isAlreadyInSession) continue;

    const userEn = (item.name_en || "").trim();
    const userTa = (item.name_ta || "").trim();
    const userCat = (item.category || "").trim();

    if (item.catalogDish) {
      const origEn = (item.catalogDish.name_en || item.catalogDish.name || "").trim();
      const origTa = (item.catalogDish.name_ta || "").trim();
      const origCat = (item.catalogDish.category || item.category || "").trim();
      const targetCat = userCat || origCat;

      // If user modified English, Tamil, or Category during review, update the catalog dish!
      if ((userEn && userEn !== origEn) || (userTa && userTa !== origTa) || (userCat && userCat !== origCat)) {
        updateDishInCatalog(origCat, item.catalogDish.id, {
          name_en: userEn || origEn,
          name_ta: userTa || origTa,
          category: targetCat,
        });
        registerDishToDictionary(userEn || origEn, userTa || origTa, targetCat);
        newDishesCreated++;
      }

      onAddDishToSession(targetCat, item.catalogDish.id);
      addedCount++;
    } else {
      // New custom dish: create in catalog with the user's corrected names
      const finalEn = userEn || userTa || "Special Dish";
      const finalTa = userTa || userEn || "சிறப்பு உணவு";
      const finalCat = userCat || "Special Dishes";

      const created = addCustomDishToCatalog({
        category: finalCat,
        name_en: finalEn,
        name_ta: finalTa,
        isVegetarian: true,
      });

      registerDishToDictionary(finalEn, finalTa, finalCat);

      onAddDishToSession(finalCat, created.id);
      addedCount++;
      newDishesCreated++;
    }
  }

  if (newDishesCreated > 0 && onCatalogUpdated) {
    onCatalogUpdated();
  }

  return { addedCount, newDishesCreated };
};
