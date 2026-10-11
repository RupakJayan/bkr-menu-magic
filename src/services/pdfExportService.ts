import jsPDF from "jspdf";
import { EventMenu } from "@/types/menu";
import { findDishByKey } from "@/services/menuCatalogService";
import { getBusinessSettings } from "@/services/localAdminService";
import { formatISTDate, getISTDateString } from "@/utils/istDate";
import { getTamilSolarDate } from "@/utils/tamilDate";
import { assetUrl } from "@/utils/assetUrl";

const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGIN = 14;
const FOOTER_SPACE = 13;
const TITLE_SIZE = 16;
const TEXT_SIZE = 14;
const TEXT_LINE = 6.4;
const TAMIL_TEXT = /[\u0B80-\u0BFF]/;

type Language = "en" | "ta";
type RGB = [number, number, number];

const BROWN: RGB = [91, 55, 35];
const INK: RGB = [38, 38, 38];
const MUTED: RGB = [110, 103, 96];
const BORDER: RGB = [220, 213, 205];
const PALE: RGB = [248, 245, 241];

const formatMoney = (amount: number): string =>
  `INR ${amount.toLocaleString("en-IN")}`;

const loadImage = async (path: string): Promise<string> => {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Could not load menu artwork: ${path}`);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === "string"
      ? resolve(reader.result)
      : reject(new Error(`Could not read menu artwork: ${path}`));
    reader.onerror = () => reject(new Error(`Could not read menu artwork: ${path}`));
    reader.readAsDataURL(blob);
  });
};

const getTamilCanvasContext = (): CanvasRenderingContext2D => {
  const context = document.createElement("canvas").getContext("2d");
  if (!context) throw new Error("Your browser could not prepare Tamil text for the PDF.");
  return context;
};

export const generateEventMenuPDF = async (
  menu: EventMenu,
  language: Language = "en",
): Promise<void> => {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const settings = getBusinessSettings();
  const measureContext = getTamilCanvasContext();
  const logo = await loadImage(assetUrl("/bkr-catering-reference.png"));
  const contentWidth = PAGE_WIDTH - MARGIN * 2;
  let y = 15;

  const usesTamil = (text: string): boolean =>
    language === "ta" && TAMIL_TEXT.test(text);

  const setCanvasFont = (size: number, bold: boolean): string => {
    const font = `${bold ? "bold " : ""}${size * 96 / 72 * 2}px Latha, "Noto Sans Tamil", "Arial Unicode MS", sans-serif`;
    measureContext.font = font;
    return font;
  };

  const measureText = (text: string, size: number, bold = false): number => {
    if (usesTamil(text)) {
      setCanvasFont(size, bold);
      return measureContext.measureText(text).width / 2 * 25.4 / 96;
    }
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    return doc.getTextWidth(text);
  };

  const drawText = (
    text: string,
    x: number,
    baseline: number,
    size = TEXT_SIZE,
    options: { bold?: boolean; color?: RGB; align?: "left" | "center" | "right" } = {},
  ): void => {
    const { bold = false, color = INK, align = "left" } = options;
    if (usesTamil(text)) {
      const font = setCanvasFont(size, bold);
      measureContext.textBaseline = "alphabetic";
      const metrics = measureContext.measureText(text);
      const scale = 2;
      const width = Math.ceil(metrics.width + 12);
      const height = Math.ceil(size * 96 / 72 * scale * 1.65);
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, width);
      canvas.height = Math.max(1, height);
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Your browser could not render Tamil text for the PDF.");
      context.font = font;
      context.textBaseline = "alphabetic";
      context.fillStyle = `rgb(${color.join(",")})`;
      context.fillText(text, 6, height * 0.76);
      const imageWidth = width / scale * 25.4 / 96;
      const imageHeight = height / scale * 25.4 / 96;
      const imageX = align === "center" ? x - imageWidth / 2 : align === "right" ? x - imageWidth : x;
      doc.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        imageX,
        baseline - imageHeight * 0.76,
        imageWidth,
        imageHeight,
      );
      return;
    }
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.setTextColor(...color);
    doc.text(text, x, baseline, { align });
  };

  const wrapText = (text: string, maxWidth: number, size: number, bold = false): string[] => {
    const lines: string[] = [];
    let current = "";
    for (const word of text.split(/\s+/)) {
      if (measureText(word, size, bold) > maxWidth) {
        if (current) {
          lines.push(current);
          current = "";
        }
        let part = "";
        for (const character of word) {
          if (part && measureText(part + character, size, bold) > maxWidth) {
            lines.push(part);
            part = character;
          } else {
            part += character;
          }
        }
        current = part;
        continue;
      }
      const candidate = current ? `${current} ${word}` : word;
      if (current && measureText(candidate, size, bold) > maxWidth) {
        lines.push(current);
        current = word;
      } else {
        current = candidate;
      }
    }
    if (current) lines.push(current);
    return lines.length ? lines : [""];
  };

  const startNewPage = (): void => {
    doc.addPage();
    y = 17;
    drawText("BKR CATERING  |  EVENT MENU", MARGIN, y, 10, { bold: true, color: BROWN });
    y += 6;
    doc.setDrawColor(...BORDER);
    doc.setLineWidth(0.3);
    doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
    y += 9;
  };

  const ensureSpace = (height: number): void => {
    if (y + height > PAGE_HEIGHT - FOOTER_SPACE) startNewPage();
  };

  const drawParagraph = (
    text: string,
    options: { size?: number; bold?: boolean; indent?: number; color?: RGB; gap?: number } = {},
  ): void => {
    const { size = TEXT_SIZE, bold = false, indent = 0, color = INK, gap = 1.5 } = options;
    const lines = wrapText(text, contentWidth - indent, size, bold);
    const lineHeight = size * 0.42 + 1.7;
    lines.forEach((line, index) => {
      ensureSpace(lineHeight);
      drawText(line, MARGIN + indent, y + size * 0.34, size, { bold, color });
      y += lineHeight;
      if (index < lines.length - 1) ensureSpace(lineHeight);
    });
    y += gap;
  };

  const drawSectionHeading = (text: string): void => {
    ensureSpace(12);
    y += 3;
    drawText(text, MARGIN, y + TITLE_SIZE * 0.34, TITLE_SIZE, { bold: true, color: BROWN });
    y += 8.5;
    doc.setDrawColor(...BORDER);
    doc.setLineWidth(0.25);
    doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
    y += 5;
  };

  const drawInfoTable = (headers: string[], rows: string[][]): void => {
    const columnWidths = [48, contentWidth - 48];
    const paddingX = 3;
    const paddingY = 2.5;
    const lineHeight = 6.8;

    const drawRow = (cells: string[], header = false): void => {
      const cellLines = cells.map((cell, index) =>
        wrapText(cell, columnWidths[index] - paddingX * 2, TEXT_SIZE, header),
      );
      const rowHeight = Math.max(11, Math.max(...cellLines.map((lines) => lines.length)) * lineHeight + paddingY * 2);
      ensureSpace(rowHeight);
      let x = MARGIN;
      cells.forEach((_, index) => {
        doc.setDrawColor(...BORDER);
        doc.setLineWidth(0.25);
        doc.setFillColor(...(header ? BROWN : index === 0 ? PALE : [255, 255, 255]));
        doc.rect(x, y, columnWidths[index], rowHeight, "FD");
        cellLines[index].forEach((line, lineIndex) => {
          drawText(
            line,
            x + paddingX,
            y + paddingY + TEXT_SIZE * 0.34 + lineIndex * lineHeight,
            TEXT_SIZE,
            {
              bold: header || index === 0,
              color: header ? [255, 255, 255] : index === 0 ? BROWN : INK,
            },
          );
        });
        x += columnWidths[index];
      });
      y += rowHeight;
    };

    drawRow(headers, true);
    rows.forEach((row) => drawRow(row));
    y += 5;
  };

  const drawRatesTable = (rows: string[][]): void => {
    const widths = [19, 54, 31, 32, 46];
    const paddingX = 1.5;
    const paddingY = 2.4;
    const lineHeight = 6.8;
    const drawRow = (values: string[], header = false, total = false): void => {
      const fontSize = TEXT_SIZE;
      const lines = values.map((value, index) =>
        wrapText(value, widths[index] - paddingX * 2, fontSize, header || total),
      );
      const rowHeight = Math.max(11, Math.max(...lines.map((items) => items.length)) * lineHeight + paddingY * 2);
      ensureSpace(rowHeight);
      let x = MARGIN;
      values.forEach((_, index) => {
        doc.setDrawColor(...BORDER);
        doc.setLineWidth(0.25);
        doc.setFillColor(...(header ? BROWN : total ? PALE : [255, 255, 255]));
        doc.rect(x, y, widths[index], rowHeight, "FD");
        lines[index].forEach((line, lineIndex) => {
          drawText(line, x + paddingX, y + paddingY + fontSize * 0.34 + lineIndex * lineHeight, fontSize, {
            bold: header || total,
            color: header ? [255, 255, 255] : total ? BROWN : INK,
          });
        });
        x += widths[index];
      });
      y += rowHeight;
    };

    drawRow(["S.NO", "SESSION", "RATE", "NOS", "TOTAL"], true);
    rows.forEach((row) => drawRow(row, false, row[1] === "GRAND TOTAL"));
    y += 5;
  };

  const logoWidth = 48;
  const logoHeight = logoWidth * 346 / 648;
  doc.addImage(logo, "PNG", PAGE_WIDTH / 2 - logoWidth / 2, y, logoWidth, logoHeight);
  y += logoHeight + 4;
  drawText(
    language === "ta" ? "கேட்டரிங் சேவைகள்" : "CATERING SERVICES",
    PAGE_WIDTH / 2,
    y + TITLE_SIZE * 0.34,
    TITLE_SIZE,
    { bold: true, color: BROWN, align: "center" },
  );
  y += 13;
  doc.setDrawColor(...BROWN);
  doc.setLineWidth(0.5);
  doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
  y += 8;

  const dates = menu.startDate === menu.endDate
    ? formatISTDate(menu.startDate, "en-IN", { dateStyle: "medium" })
    : `${formatISTDate(menu.startDate, "en-IN", { dateStyle: "medium" })} - ${formatISTDate(menu.endDate, "en-IN", { dateStyle: "medium" })}`;
  const info = language === "ta"
    ? [
      ["பெயர்", menu.clientDetails.name],
      ["இடம்", menu.venueDetails.name],
      ["தேதி", dates],
      ["தமிழ் தேதி மற்றும் கிழமை", getTamilSolarDate(menu.startDate) || menu.tamilDate || ""],
      ["தொலைபேசி எண்", menu.clientDetails.phone],
      ["முகவரி", menu.venueDetails.address],
    ]
    : [
      ["NAME", menu.clientDetails.name],
      ["VENUE", menu.venueDetails.name],
      ["DATE", dates],
      ["TAMIL DATE & DAY", getTamilSolarDate(menu.startDate) || menu.tamilDate || ""],
      ["PHONE NO", menu.clientDetails.phone],
      ["ADDRESS", menu.venueDetails.address],
    ];
  if (menu.venueDetails.googleMapsUrl) {
    info.push(language === "ta"
      ? ["Google Maps", menu.venueDetails.googleMapsUrl]
      : ["MAPS", menu.venueDetails.googleMapsUrl]);
  }

  drawSectionHeading(language === "ta" ? "நிகழ்வு விவரங்கள்" : "EVENT DETAILS");
  drawInfoTable(
    language === "ta" ? ["விவரம்", "நிகழ்வு தகவல்"] : ["DETAIL", "INFORMATION"],
    info,
  );

  menu.days.forEach((day) => {
    drawSectionHeading(language === "ta"
      ? `நாள் ${day.dayNumber} - ${formatISTDate(day.date, "en-IN", { weekday: "long", month: "long", day: "numeric" })}`
      : `DAY ${day.dayNumber} - ${formatISTDate(day.date, "en-IN", { weekday: "long", month: "long", day: "numeric" })}`);
    day.sessions.forEach((session) => {
      drawParagraph(
        `${language === "ta" ? session.name : session.name.toUpperCase()} @ ${session.startTime}     NOS: ${session.headCount}`,
        { size: TEXT_SIZE, bold: true, color: BROWN, gap: 3 },
      );
      const groups = new Map<string, string[]>();
      for (const key of new Set(session.selectedDishes)) {
        const dish = findDishByKey(key);
        if (!dish) continue;
        const categoryDishes = groups.get(dish.category) ?? [];
        const name = language === "ta" ? dish.name_ta || dish.name_en : dish.name_en || dish.name_ta;
        if (name) categoryDishes.push(name);
        groups.set(dish.category, categoryDishes);
      }
      if (groups.size === 0) {
        drawParagraph(language === "ta" ? "உணவுகள் தேர்ந்தெடுக்கப்படவில்லை" : "No dishes selected", { color: MUTED });
      }
      groups.forEach((dishes, category) => {
        drawParagraph(category, { size: TEXT_SIZE, bold: true, indent: 2, color: BROWN, gap: 1 });
        dishes.forEach((dish) => drawParagraph(`•  ${dish}`, { indent: 5, gap: 0.7 }));
        y += 2;
      });
      y += 4;
    });
  });

  drawSectionHeading("RATES");
  const sessions = menu.days.flatMap((day) => day.sessions);
  const rateRows = sessions.map((session, index) => {
    const rate = session.ratePerPerson ?? 0;
    return [
      String(index + 1),
      session.name.toUpperCase(),
      rate ? formatMoney(rate) : "—",
      `${session.headCount} NOS`,
      rate ? formatMoney(rate * session.headCount) : "—",
    ];
  });
  const quotedTotal = sessions.reduce((sum, session) => sum + (session.ratePerPerson ?? 0) * session.headCount, 0);
  const transportCharge = menu.transportCharge ?? 0;
  if (transportCharge > 0) {
    rateRows.push([String(sessions.length + 1), "TRANSPORT / OTHER", "", "", formatMoney(transportCharge)]);
  }
  rateRows.push(["", "GRAND TOTAL", "", "", formatMoney(quotedTotal + transportCharge)]);
  drawRatesTable(rateRows);

  const terms = language === "ta" ? settings.termsTamil : settings.termsEnglish;
  if (terms.length > 0) {
    drawSectionHeading(language === "ta" ? "விதிமுறைகள் மற்றும் நிபந்தனைகள்" : "TERMS & CONDITIONS");
    terms.forEach((term, index) => drawParagraph(`${index + 1}. ${term}`, { gap: 1 }));
  }

  const pageCount = doc.getNumberOfPages();
  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page);
    drawText(
      `BKR Catering  |  ${formatISTDate(getISTDateString(), "en-IN", { dateStyle: "medium" })}  |  ${page} / ${pageCount}`,
      PAGE_WIDTH / 2,
      PAGE_HEIGHT - 5,
      9,
      { color: MUTED, align: "center" },
    );
  }

  const safeName = menu.clientDetails.name.trim().replace(/[<>:"/\\|?*]/g, "_").replace(/\s+/g, "_") || "Event";
  const suffix: Record<Language, string> = { en: "English", ta: "Tamil" };
  doc.save(`BKR_Event_Menu_${safeName}_${suffix[language]}.pdf`);
};
