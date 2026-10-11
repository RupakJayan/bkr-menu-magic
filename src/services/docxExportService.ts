import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  ImageRun,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";
import type { EventMenu, Session } from "@/types/menu";
import {
  findDishByKey,
  getManagedMenuCatalog,
} from "@/services/menuCatalogService";
import {
  getBusinessSettings,
  type BusinessSettings,
} from "@/services/localAdminService";
import { formatISTDate } from "@/utils/istDate";
import { getTamilSolarDate } from "@/utils/tamilDate";

const TAMIL_FONT = "Latha";
const ENGLISH_FONT = "Times New Roman";
const BORDER = { style: BorderStyle.SINGLE, size: 1, color: "333333" } as const;
const copyToClipboardFallback = (blob: Blob, fileName: string): void => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => window.URL.revokeObjectURL(url), 1000);
};

const requestSaveFile = async (fileName: string): Promise<FileSystemFileHandle | null> => {
  if (typeof window.showSaveFilePicker === "function") {
    try {
      return await window.showSaveFilePicker({
        suggestedName: fileName,
        types: [{
          description: "Word document",
          accept: { "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"] },
        }],
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return null;
      throw new Error(`Could not save the Word document: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  return null;
};

const downloadDocument = async (
  blob: Blob,
  fileName: string,
  handle: FileSystemFileHandle | null,
): Promise<void> => {
  if (handle) {
    try {
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      return;
    } catch (error) {
      throw new Error(`Could not write the Word document: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  copyToClipboardFallback(blob, fileName);
};

const cell = (
  text: string,
  options: { bold?: boolean; width?: number; alignment?: (typeof AlignmentType)[keyof typeof AlignmentType] } = {},
): TableCell => new TableCell({
  width: options.width ? { size: options.width, type: WidthType.DXA } : undefined,
  borders: { top: BORDER, bottom: BORDER, left: BORDER, right: BORDER },
  children: [new Paragraph({
    alignment: options.alignment,
    children: [new TextRun({ text, bold: options.bold, size: 20 })],
  })],
});

const metaTable = (rows: [string, string][]): Table => new Table({
  width: { size: 9639, type: WidthType.DXA },
  columnWidths: [2717, 567, 6355],
  rows: rows.map(([label, value]) => new TableRow({
    children: [
      cell(label, { width: 2717, bold: true }),
      cell(":", { width: 567 }),
      cell(value, { width: 6355 }),
    ],
  })),
});

const heading = (text: string, level: (typeof HeadingLevel)[keyof typeof HeadingLevel]) =>
  new Paragraph({
    text,
    heading: level,
    spacing: { before: 160, after: 80 },
    keepNext: true,
  });

const localized = (
  language: "en" | "ta",
  english: string,
  tamil: string,
): string => language === "ta" ? tamil : english;

const formatDate = (value: string, language: "en" | "ta"): string => {
  return formatISTDate(value, language === "ta" ? "ta-IN" : "en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const loadBrandAsset = async (path: string): Promise<ArrayBuffer> => {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Could not load the BKR document artwork (${path}).`);
  }
  return response.arrayBuffer();
};

const getSessionLabel = (session: Session, language: "en" | "ta"): string => {
  const tamil: Record<string, string> = {
    Breakfast: "காலை உணவு",
    "Morning Snacks": "காலை சிற்றுண்டி",
    Lunch: "மதிய உணவு",
    "Afternoon Snacks": "மாலை சிற்றுண்டி",
    "Evening Snacks": "மாலை சிற்றுண்டி",
    Dinner: "இரவு உணவு",
  };
  if (language === "en") return session.name.toUpperCase();
  const translation = tamil[session.name];
  return translation ? `${translation} (${session.name.toUpperCase()})` : session.name;
};

const groupSessionDishes = (session: Session) => {
  const groups = new Map<string, ReturnType<typeof findDishByKey>[]>();
  for (const key of new Set(session.selectedDishes)) {
    const dish = findDishByKey(key);
    if (!dish) continue;
    const dishes = groups.get(dish.category) ?? [];
    dishes.push(dish);
    groups.set(dish.category, dishes);
  }
  return [...groups.entries()];
};

const createSessionRows = (
  menu: EventMenu,
  language: "en" | "ta",
  settings: BusinessSettings,
) => {
  const rows = menu.days.flatMap((day) =>
    day.sessions.map((session) => ({
      title: new Paragraph({
        children: [
          new TextRun({ text: getSessionLabel(session, language), bold: true, size: 25 }),
          new TextRun({
            text: ` @ ${session.startTime}              ${localized(language, "NOS", "எண்ணிக்கை")}: ${session.headCount}`,
            bold: true,
            size: 21,
          }),
        ],
        spacing: { before: 180, after: 70 },
        keepNext: true,
      }),
      dishes: groupSessionDishes(session).flatMap(([category, dishes]) => [
        new Paragraph({
          text: category,
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 90, after: 20 },
          keepNext: true,
        }),
        ...dishes.map((dish) => new Paragraph({
          children: [new TextRun({
            text: language === "ta"
              ? dish?.name_ta ?? dish?.name_en ?? ""
              : dish?.name_en ?? dish?.name_ta ?? "",
            size: 21,
          })],
          indent: { left: 240 },
          spacing: { after: 15 },
        })),
      ]),
    })),
  );

  const sessions = menu.days.flatMap((day) => day.sessions);
  const rateRows = [
    new TableRow({
      tableHeader: true,
      children: [
        cell(localized(language, "S.NO", "வ.எண்"), { width: 883, bold: true }),
        cell(localized(language, "SESSION", "நிகழ்வு"), { width: 3233, bold: true }),
        cell(localized(language, "RATE", "விலை"), { width: 1978, bold: true }),
        cell(localized(language, "NOS", "எண்ணிக்கை"), { width: 1959, bold: true }),
        cell(localized(language, "TOTAL", "மொத்தம்"), { width: 1986, bold: true }),
      ],
    }),
    ...sessions.map((session, index) => {
      const rate = session.ratePerPerson ?? 0;
      return new TableRow({
        children: [
          cell(String(index + 1), { width: 883 }),
          cell(getSessionLabel(session, language), { width: 3233 }),
          cell(rate ? `₹ ${rate.toLocaleString("en-IN")}` : "—", { width: 1978 }),
          cell(`${session.headCount} ${localized(language, "NOS", "பேர்")}`, { width: 1959 }),
          cell(rate ? `₹ ${(rate * session.headCount).toLocaleString("en-IN")}` : "—", { width: 1986 }),
        ],
      });
    }),
  ];

  const quotedTotal = sessions.reduce(
    (total, session) => total + (session.ratePerPerson ?? 0) * session.headCount,
    0,
  );
  const transportCharge = menu.transportCharge ?? 0;
  if (transportCharge > 0) {
    rateRows.push(new TableRow({
      children: [
        cell(String(sessions.length + 1), { width: 883 }),
        cell(localized(language, "TRANSPORT / OTHER", "போக்குவரத்து / இதர"), { width: 3233 }),
        cell("", { width: 1978 }),
        cell("", { width: 1959 }),
        cell(`₹ ${transportCharge.toLocaleString("en-IN")}`, { width: 1986 }),
      ],
    }));
  }
  const grandTotal = quotedTotal + transportCharge;
  rateRows.push(new TableRow({
    children: [
      cell("", { width: 883 }),
      cell(localized(language, "GRAND TOTAL", "மொத்தத் தொகை"), { width: 3233, bold: true }),
      cell("", { width: 1978 }),
      cell("", { width: 1959 }),
      cell(grandTotal ? `₹ ${grandTotal.toLocaleString("en-IN")}` : "—", { width: 1986, bold: true }),
    ],
  }));

  return [
    ...rows.flatMap((row) => [row.title, ...row.dishes]),
    heading(localized(language, "Rates", "விலை விவரம்"), HeadingLevel.HEADING_2),
    new Table({
      width: { size: 10039, type: WidthType.DXA },
      columnWidths: [883, 3233, 1978, 1959, 1986],
      rows: rateRows,
    }),
    heading(localized(language, "Terms & Conditions", "விதிமுறைகள் மற்றும் நிபந்தனைகள்"), HeadingLevel.HEADING_2),
    ...(language === "ta" ? settings.termsTamil : settings.termsEnglish).map((term) =>
      new Paragraph({
        text: `• ${term}`,
        indent: { left: 240 },
        spacing: { after: 45 },
      }),
    ),
  ];
};

export const generateEventMenuDOCX = async (
  menu: EventMenu,
  language: "en" | "ta" = "en",
): Promise<void> => {
  const font = language === "ta" ? TAMIL_FONT : ENGLISH_FONT;
  const settings = getBusinessSettings();
  const catalog = getManagedMenuCatalog();
  const catalogCount = Object.values(catalog).reduce((sum, dishes) => sum + dishes.length, 0);
  if (catalogCount === 0) throw new Error("The menu catalog is empty; restore at least one available dish before exporting.");
  const langSuffix = language === "ta" ? "_Tamil" : "_English";
  const safeName = menu.clientDetails.name
    .trim()
    .split("")
    .map((character) => /[<>:"/\\|?*]/.test(character) || character.charCodeAt(0) < 32 ? "_" : character)
    .join("")
    .replace(/\s+/g, "_") || "Event";
  const fileName = `BKR_Event_Menu_${safeName}${langSuffix}.docx`;
  const saveHandle = await requestSaveFile(fileName);
  if (typeof window.showSaveFilePicker === "function" && !saveHandle) return;
  const [logoData, contactBannerData] = await Promise.all([
    loadBrandAsset("/bkr-catering-reference.png"),
    loadBrandAsset("/bkr-contact-banner.jpeg"),
  ]);

  const infoRows: [string, string][] = [
    [localized(language, "NAME", "பெயர்"), menu.clientDetails.name],
    [localized(language, "VENUE", "இடம்"), menu.venueDetails.name],
    [localized(language, "DATE", "தேதி"), menu.startDate === menu.endDate
      ? formatDate(menu.startDate, language)
      : `${formatDate(menu.startDate, language)} & ${formatDate(menu.endDate, language)}`],
    [localized(language, "TAMIL DATE & DAY", "தமிழ் தேதி மற்றும் கிழமை"),
      getTamilSolarDate(menu.startDate) || menu.tamilDate || ""],
    [localized(language, "PHONE NO", "தொலைபேசி எண்"), menu.clientDetails.phone],
  ];
  const children = [
    new Paragraph({
      children: [new ImageRun({
        type: "png",
        data: logoData,
        transformation: { width: 300, height: 137 },
        altText: { name: "BKR Catering", description: "Anaimalai's BKR Catering" },
      })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
    }),
    new Paragraph({
      children: [new ImageRun({
        type: "jpg",
        data: contactBannerData,
        transformation: { width: 468, height: 70 },
        altText: { name: "BKR Catering contacts", description: "BKR Catering services, address and contact details" },
      })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
    }),
    new Paragraph({
      text: localized(language, "CATERING SERVICES", "கேட்டரிங் சேவைகள்"),
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
    }),
    metaTable(infoRows),
    ...createSessionRows(menu, language, settings),
  ];

  const doc = new Document({
    styles: {
      default: { document: { run: { font } } },
      heading1: { run: { font } },
      heading2: { run: { font } },
      heading3: { run: { font } },
    },
    sections: [{
      properties: {
        page: { size: { width: 11906, height: 16838 }, margin: { top: 720, right: 720, bottom: 720, left: 720 } },
      },
      children,
    }],
  });

  const blob = await Packer.toBlob(doc);
  await downloadDocument(blob, fileName, saveHandle);
};
