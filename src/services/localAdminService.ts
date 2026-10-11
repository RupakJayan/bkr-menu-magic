import { menuData } from "@/data/menuData";
import type { CatalogDish, Dish, EventMenu, MenuCatalog } from "@/types/menu";

const STORAGE_KEYS = {
  events: "bkr-admin-events",
  contacts: "bkr-admin-contacts",
  menu: "bkr-admin-menu",
  settings: "bkr-admin-settings",
} as const;

export type EventStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface SavedEvent {
  id: string;
  menu: EventMenu;
  status: EventStatus;
  savedAt: string;
}

export interface LocalContact {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "Admin" | "Manager" | "Staff";
}

export interface MenuDishOverride {
  name_en?: string;
  name_ta?: string;
  estimatedCost?: number;
  isVegetarian?: boolean;
  isAvailable?: boolean;
}

export interface CustomMenuDish extends Dish {
  category: string;
}

export interface ManagedMenuState {
  overrides: Record<string, MenuDishOverride>;
  customDishes: CustomMenuDish[];
}

export interface BusinessSettings {
  businessName: string;
  termsEnglish: string[];
  termsTamil: string[];
}

const DEFAULT_SETTINGS: BusinessSettings = {
  businessName: "BKR Catering Services",
  termsEnglish: [
    "Please take the counting at every serving.",
    "Tables, chairs and shamiyana are not included.",
    "Vessels, gas and cleaners are not included.",
    "Prices may vary if the number of guests or dishes changes.",
    "Decreases in guest count during event days will not be considered. Increases on the event day will be charged.",
    "80% of the amount should be paid one week before the event.",
    "The remaining 20% should be paid on the last event day.",
  ],
  termsTamil: [
    "ஒவ்வொரு பரிமாறும் நேரத்திலும் எண்ணிக்கையை சரிபார்க்கவும்.",
    "மேசைகள், நாற்காலிகள் மற்றும் பந்தல் கட்டணம் இதில் சேர்க்கப்படவில்லை.",
    "பாத்திரங்கள், எரிவாயு மற்றும் சுத்தம் செய்பவர்களுக்கான கட்டணம் இதில் சேர்க்கப்படவில்லை.",
    "விருந்தினர் எண்ணிக்கை அல்லது உணவு வகைகள் மாறினால் விலை மாறலாம்.",
    "நிகழ்வு நாட்களில் எண்ணிக்கை குறைந்தால் கணக்கில் எடுத்துக்கொள்ளப்படாது. நிகழ்வு நாளில் எண்ணிக்கை அதிகரித்தால் கூடுதல் கட்டணம் வசூலிக்கப்படும்.",
    "மொத்தத் தொகையில் 80% நிகழ்விற்கு ஒரு வாரத்திற்கு முன் செலுத்த வேண்டும்.",
    "மீதமுள்ள 20% தொகையை கடைசி நிகழ்வு நாளில் செலுத்த வேண்டும்.",
  ],
};

const readStored = <T,>(key: string, fallback: T): T => {
  const raw = window.localStorage.getItem(key);
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch (error) {
    console.error(`Unable to read saved BKR data (${key}).`, error);
    throw new Error(`Saved data for ${key} is invalid. Please export or repair it before continuing.`);
  }
};

const writeStored = <T,>(key: string, value: T): void => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Unable to save BKR data (${key}).`, error);
    throw new Error(`Could not save ${key}. Check browser storage and available space.`);
  }
};

export const getSavedEvents = (): SavedEvent[] =>
  readStored<SavedEvent[]>(STORAGE_KEYS.events, []);

export const saveEventMenu = (menu: EventMenu): SavedEvent[] => {
  const events = getSavedEvents();
  const existing = events.find((event) => event.id === menu.id);
  const saved: SavedEvent = {
    id: menu.id,
    menu: { ...menu, updatedAt: new Date() },
    status: existing?.status ?? "pending",
    savedAt: new Date().toISOString(),
  };
  writeStored(
    STORAGE_KEYS.events,
    existing
      ? events.map((event) => (event.id === menu.id ? saved : event))
      : [saved, ...events],
  );
  return getSavedEvents();
};

export const exportMenuJSON = (menu: EventMenu): void => {
  const safeName = menu.clientDetails.name.trim().replace(/[<>:"/\\|?*]/g, "_") || "Event";
  const filename = `BKR_Menu_${safeName}_${menu.startDate}.json`;
  const blob = new Blob([JSON.stringify(menu, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const importMenuJSON = async (file: File): Promise<EventMenu> => {
  const text = await file.text();
  const data = JSON.parse(text) as EventMenu;
  if (!data.id || !data.clientDetails || !data.days) {
    throw new Error("The selected file is not a valid BKR menu JSON file.");
  }
  saveEventMenu(data);
  window.localStorage.setItem("currentMenu", JSON.stringify(data));
  return data;
};

export const updateEventStatus = (id: string, status: EventStatus): SavedEvent[] => {
  const events = getSavedEvents();
  if (!events.some((event) => event.id === id)) {
    throw new Error("This saved event no longer exists.");
  }
  const updated = events.map((event) => event.id === id ? { ...event, status } : event);
  writeStored(STORAGE_KEYS.events, updated);
  return updated;
};

export const deleteSavedEvent = (id: string): SavedEvent[] => {
  const updated = getSavedEvents().filter((event) => event.id !== id);
  writeStored(STORAGE_KEYS.events, updated);
  return updated;
};

export const getContacts = (): LocalContact[] =>
  readStored<LocalContact[]>(STORAGE_KEYS.contacts, []);

export const saveContact = (contact: LocalContact): LocalContact[] => {
  const contacts = getContacts();
  const updated = contacts.some((entry) => entry.id === contact.id)
    ? contacts.map((entry) => entry.id === contact.id ? contact : entry)
    : [contact, ...contacts];
  writeStored(STORAGE_KEYS.contacts, updated);
  return updated;
};

export const deleteContact = (id: string): LocalContact[] => {
  const updated = getContacts().filter((contact) => contact.id !== id);
  writeStored(STORAGE_KEYS.contacts, updated);
  return updated;
};

export const getMenuAdminState = (): ManagedMenuState =>
  readStored<ManagedMenuState>(STORAGE_KEYS.menu, { overrides: {}, customDishes: [] });

export const saveMenuAdminState = (state: ManagedMenuState): ManagedMenuState => {
  writeStored(STORAGE_KEYS.menu, state);
  return state;
};

export const buildCatalogKey = (category: string, dishId: string): string =>
  `${category}::${dishId}`;

export const getManagedMenuCatalog = (): MenuCatalog => {
  const state = getMenuAdminState();
  const catalog: MenuCatalog = {};
  for (const [category, dishes] of Object.entries(menuData)) {
    const availableDishes = dishes.flatMap((dish) => {
      const key = buildCatalogKey(category, dish.id);
      const override = state.overrides[key];
      if (override?.isAvailable === false) return [];
      return [{ ...dish, ...override }];
    });
    catalog[category] = availableDishes;
  }
  for (const dish of state.customDishes) {
    if (!catalog[dish.category]) catalog[dish.category] = [];
    catalog[dish.category].push(dish);
  }
  return catalog;
};

export const getBusinessSettings = (): BusinessSettings => ({
  ...DEFAULT_SETTINGS,
  ...readStored<Partial<BusinessSettings>>(STORAGE_KEYS.settings, {}),
});

export const saveBusinessSettings = (settings: BusinessSettings): BusinessSettings => {
  writeStored(STORAGE_KEYS.settings, settings);
  return settings;
};

export const getDishFromCatalog = (
  category: string,
  dishId: string,
): CatalogDish | null => {
  const dish = getManagedMenuCatalog()[category]?.find((item) => item.id === dishId);
  return dish ? { ...dish, category } : null;
};
