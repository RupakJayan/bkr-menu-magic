import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";
import JSZip from "jszip";
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
import { assetUrl } from "@/utils/assetUrl";

const TAMIL_FONT = "Latha";
const ENGLISH_FONT = "Arial";
const SESSION_FONT = "Nirmala UI";
const BRAND_BROWN = "5C2E1F";
const BORDER = { style: BorderStyle.SINGLE, size: 4, color: "auto" } as const;
const OUTER_BORDER = { style: BorderStyle.SINGLE, size: 8, color: "auto" } as const;
const NO_BORDER = { style: BorderStyle.NIL, size: 0, color: "auto" } as const;
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

const formatSessionTime = (value: string): string => {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value);
  if (!match) return value;
  const hour = Number(match[1]);
  const suffix = hour >= 12 ? "PM" : "AM";
  return `${hour % 12 || 12}:${match[2]} ${suffix}`;
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
  options: {
    bold?: boolean;
    width?: number;
    alignment?: (typeof AlignmentType)[keyof typeof AlignmentType];
    font?: string;
    size?: number;
    color?: string;
    borders?: {
      top?: typeof BORDER | typeof OUTER_BORDER | typeof NO_BORDER;
      bottom?: typeof BORDER | typeof OUTER_BORDER | typeof NO_BORDER;
      left?: typeof BORDER | typeof OUTER_BORDER | typeof NO_BORDER;
      right?: typeof BORDER | typeof OUTER_BORDER | typeof NO_BORDER;
    };
  } = {},
): TableCell => new TableCell({
  width: options.width ? { size: options.width, type: WidthType.DXA } : undefined,
  borders: options.borders ?? { top: BORDER, bottom: BORDER, left: BORDER, right: BORDER },
  margins: { top: 70, bottom: 70, left: 90, right: 90 },
  children: [new Paragraph({
    alignment: options.alignment,
    spacing: { before: 0, after: 0 },
    children: [new TextRun({
      text,
      bold: options.bold,
      size: options.size ?? 22,
      font: options.font ?? ENGLISH_FONT,
      color: options.color,
    })],
  })],
});

const metaTable = (rows: [string, string][]): Table => new Table({
  width: { size: 9639, type: WidthType.DXA },
  indent: { size: -10, type: WidthType.DXA },
  columnWidths: [2717, 567, 6355],
  rows: rows.map(([label, value], rowIndex) => {
    const top = rowIndex === 0 ? OUTER_BORDER : NO_BORDER;
    const bottom = rowIndex === rows.length - 1 ? OUTER_BORDER : NO_BORDER;
    return new TableRow({
      children: [
        cell(label, {
          width: 2717,
          bold: true,
          size: 24,
          font: label.match(/[\u0B80-\u0BFF]/) ? TAMIL_FONT : ENGLISH_FONT,
          borders: { top, bottom, left: OUTER_BORDER, right: NO_BORDER },
        }),
        cell(":", {
          width: 567,
          size: 24,
          borders: { top, bottom, left: NO_BORDER, right: NO_BORDER },
        }),
        cell(value, {
          width: 6355,
          size: 24,
          font: value.match(/[\u0B80-\u0BFF]/) ? TAMIL_FONT : ENGLISH_FONT,
          borders: { top, bottom, left: NO_BORDER, right: OUTER_BORDER },
        }),
      ],
    });
  }),
});

const heading = (text: string, level: (typeof HeadingLevel)[keyof typeof HeadingLevel]) =>
  new Paragraph({
    children: [new TextRun({
      text,
      font: text.match(/[\u0B80-\u0BFF]/) ? TAMIL_FONT : ENGLISH_FONT,
      size: 28,
      bold: true,
      color: BRAND_BROWN,
    })],
    heading: level,
    spacing: { before: 200, after: 100 },
    keepNext: true,
  });

const localized = (
  language: "en" | "ta",
  english: string,
  tamil: string,
): string => language === "ta" ? tamil : english;

const formatDate = (value: string): string => {
  return formatISTDate(value, "en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).replace(/\//g, "-");
};

const applyReferenceTemplate = async (menuDocument: Blob): Promise<Blob> => {
  const [templateResponse, menuZip] = await Promise.all([
    fetch(assetUrl("/bkr-menu-template.docx")),
    JSZip.loadAsync(menuDocument),
  ]);
  if (!templateResponse.ok) {
    throw new Error("Could not load the BKR Word template.");
  }
  const templateZip = await JSZip.loadAsync(await templateResponse.arrayBuffer());
  const templateDocument = templateZip.file("word/document.xml");
  const generatedDocument = menuZip.file("word/document.xml");
  if (!templateDocument || !generatedDocument) {
    throw new Error("The Word template or generated document is missing required Word content.");
  }

  const [templateXml, generatedXml] = await Promise.all([
    templateDocument.async("string"),
    generatedDocument.async("string"),
  ]);
  const bodyMatch = /<w:body>([\s\S]*?)<w:sectPr\b[\s\S]*?<\/w:sectPr>\s*<\/w:body>/.exec(generatedXml);
  if (!bodyMatch) throw new Error("Could not read generated Word menu content.");
  const generatedBody = bodyMatch[1];
  const contentWithoutImages = generatedBody.replace(
    /<w:p\b[\s\S]*?<\/w:p>/g,
    (paragraph) => paragraph.includes("<w:drawing>") || paragraph.includes("<w:pict>") ? "" : paragraph,
  );
  const referenceBody = templateXml.replace(
    /(<w:body>)[\s\S]*?(<w:sectPr\b[\s\S]*?<\/w:sectPr>\s*<\/w:body>)/,
    `$1${contentWithoutImages}$2`,
  );
  templateZip.file("word/document.xml", referenceBody);
  return templateZip.generateAsync({
    type: "blob",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });
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
          new TextRun({
            text: getSessionLabel(session, language),
            bold: true,
            size: 28,
            font: language === "ta" ? SESSION_FONT : ENGLISH_FONT,
          }),
          new TextRun({
            text: ` @ ${formatSessionTime(session.startTime)}              NOS: ${session.headCount}`,
            bold: true,
            size: 24,
            font: SESSION_FONT,
          }),
        ],
        spacing: { before: 140, after: 80 },
        keepNext: true,
      }),
      dishes: groupSessionDishes(session).flatMap(([category, dishes]) => [
        new Paragraph({
          children: [new TextRun({ text: category, font: ENGLISH_FONT, size: 24 })],
          spacing: { before: 70, after: 20 },
          keepNext: true,
        }),
        ...dishes.map((dish) => new Paragraph({
          children: [new TextRun({
            text: language === "ta"
              ? dish?.name_ta ?? dish?.name_en ?? ""
              : dish?.name_en ?? dish?.name_ta ?? "",
            font: language === "ta" ? TAMIL_FONT : ENGLISH_FONT,
            size: 24,
          })],
          indent: { left: 300 },
          spacing: { after: 20 },
        })),
      ]),
    })),
  );

  const sessions = menu.days.flatMap((day) => day.sessions);
  const rateRows = [
    new TableRow({
      tableHeader: true,
      children: [
        cell("S.NO", { width: 883, size: 28, font: SESSION_FONT }),
        cell("SESSION", { width: 3233, size: 28, font: SESSION_FONT }),
        cell("RATES", { width: 1978, size: 28, font: SESSION_FONT }),
        cell("NOS", { width: 1959, size: 28, font: SESSION_FONT }),
        cell("TOTAL", { width: 1986, size: 28, font: SESSION_FONT }),
      ],
    }),
    ...sessions.map((session, index) => {
      const rate = session.ratePerPerson ?? 0;
      return new TableRow({
        children: [
          cell(String(index + 1), { width: 883, size: 28, font: SESSION_FONT }),
          cell(session.name.toUpperCase(), { width: 3233, size: 28, font: SESSION_FONT }),
          cell(rate ? `₹ ${rate.toLocaleString("en-IN")}` : "—", { width: 1978, size: 28, font: SESSION_FONT }),
          cell(`${session.headCount} NOS`, { width: 1959, size: 28, font: SESSION_FONT }),
          cell(rate ? (rate * session.headCount).toLocaleString("en-IN") : "—", { width: 1986, size: 28, font: SESSION_FONT }),
        ],
      });
    }),
  ];

  const quotedTotal = sessions.reduce(
    (total, session) => total + (session.ratePerPerson ?? 0) * session.headCount,
    0,
  );
  rateRows.push(new TableRow({
    children: [
      cell("", { width: 883 }),
      cell("TOTAL", { width: 3233, size: 28, font: SESSION_FONT }),
      cell("", { width: 1978 }),
      cell("", { width: 1959 }),
      cell(quotedTotal ? quotedTotal.toLocaleString("en-IN") : "—", { width: 1986, size: 28, font: SESSION_FONT }),
    ],
  }));
  const transportCharge = menu.transportCharge ?? 0;
  if (transportCharge > 0) {
    rateRows.push(new TableRow({
      children: [
        cell(String(sessions.length + 1), { width: 883, size: 28, font: SESSION_FONT }),
        cell("TRANSPORT", { width: 3233, size: 28, font: SESSION_FONT }),
        cell("", { width: 1978, size: 28, font: SESSION_FONT }),
        cell("", { width: 1959, size: 28, font: SESSION_FONT }),
        cell(transportCharge.toLocaleString("en-IN"), { width: 1986, size: 28, font: SESSION_FONT }),
      ],
    }));
  }
  const grandTotal = quotedTotal + transportCharge;
  rateRows.push(new TableRow({
    children: [
      cell("", { width: 883 }),
      cell("GRAND TOTAL", { width: 3233, size: 28, font: SESSION_FONT }),
      cell("", { width: 1978 }),
      cell("", { width: 1959 }),
      cell(grandTotal ? grandTotal.toLocaleString("en-IN") : "—", { width: 1986, size: 28, font: SESSION_FONT }),
    ],
  }));

  return [
    ...rows.flatMap((row) => [row.title, ...row.dishes]),
    new Paragraph({
      children: [new TextRun({
        text: "Rates:",
        font: "Bahnschrift",
        size: 32,
        bold: true,
        color: BRAND_BROWN,
      })],
      spacing: { before: 240, after: 120 },
      keepNext: true,
    }),
    new Table({
      width: { size: 0, type: WidthType.AUTO },
      indent: { size: -574, type: WidthType.DXA },
      columnWidths: [883, 3233, 1978, 1959, 1986],
      rows: rateRows,
    }),
    heading(localized(language, "Terms & Conditions", "விதிமுறைகள் மற்றும் நிபந்தனைகள்"), HeadingLevel.HEADING_2),
    ...(language === "ta" ? settings.termsTamil : settings.termsEnglish).map((term) =>
      new Paragraph({
        children: [new TextRun({
          text: `• ${term}`,
          font: language === "ta" ? TAMIL_FONT : ENGLISH_FONT,
          size: 22,
        })],
        indent: { left: 240 },
        spacing: { after: 70 },
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
  const infoRows: [string, string][] = [
    [localized(language, "NAME", "பெயர்"), menu.clientDetails.name],
    [localized(language, "VENUE", "இடம்"), menu.venueDetails.name],
    [localized(language, "DATE", "தேதி"), menu.startDate === menu.endDate
      ? formatDate(menu.startDate)
      : `${formatDate(menu.startDate)} & ${formatDate(menu.endDate)}`],
    [localized(language, "TAMIL DATE & DAY", "தமிழ் தேதி மற்றும் கிழமை"),
      getTamilSolarDate(menu.startDate, language) || menu.tamilDate || ""],
    [localized(language, "PHONE NO", "தொலைபேசி எண்"), menu.clientDetails.phone],
  ];
  const children = [
    new Paragraph({
      children: [new TextRun({
        text: localized(language, "CATERING SERVICES", "கேட்டரிங் சேவைகள்"),
        font: language === "ta" ? TAMIL_FONT : "Bahnschrift",
        size: 32,
        bold: true,
        color: BRAND_BROWN,
      })],
      alignment: AlignmentType.CENTER,
      spacing: { before: 80, after: 180 },
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
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 720, right: 991, bottom: 1440, left: 1440, header: 432, footer: 0 },
        },
      },
      children,
    }],
  });

  const generatedBlob = await Packer.toBlob(doc);
  const templateMatchedBlob = await applyReferenceTemplate(generatedBlob);
  await downloadDocument(templateMatchedBlob, fileName, saveHandle);
};
