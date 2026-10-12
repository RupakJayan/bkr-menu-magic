/**
 * Google Drive REST API Service (v3)
 * Scoped to drive.file
 */

import { EventMenu } from "@/types/menu";
import type { SavedEvent } from "@/services/localAdminService";
import { getTamilSolarDate } from "@/utils/tamilDate";
import { buildEventMenuPDFBlob } from "@/services/pdfExportService";
import { buildEventMenuDOCXBlob } from "@/services/docxExportService";
import { formatISTDate, getISTDateString } from "@/utils/istDate";
import { ALLOWED_ADMIN_EMAILS } from "@/services/googleAuthService";

export const BKR_FOLDER_NAME = "BKR Catering Events";
const FOLDER_MIME = "application/vnd.google-apps.folder";
const SPREADSHEET_MIME = "application/vnd.google-apps.spreadsheet";
export const DEFAULT_DRIVE_ACCOUNT = "bkrcaters@gmail.com";

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
}

interface DriveFileList {
  files: DriveFile[];
}

/**
 * Clean strings for Google Drive folder and file naming
 */
export const sanitizeDriveName = (value?: string): string =>
  (value || "")
    .trim()
    .replace(/[<>:"/\\|?*#%&{}]/g, "")
    .replace(/\s+/g, "_") || "Unknown";

/**
 * Compute the subfolder name according to specification:
 * date_venueplace_clientname_tamil
 */
export const getEventSubfolderName = (menu: EventMenu): string => {
  const datePart = sanitizeDriveName(menu.startDate || "Date");
  const venuePart = sanitizeDriveName(
    menu.venueDetails?.name || menu.venueDetails?.address || "Venue",
  );
  const clientPart = sanitizeDriveName(menu.clientDetails?.name || "Client");
  const tamilPart = sanitizeDriveName(
    getTamilSolarDate(menu.startDate, "ta") ||
      getTamilSolarDate(menu.startDate, "en") ||
      menu.tamilDate ||
      "Tamil",
  );
  return `${datePart}_${venuePart}_${clientPart}_${tamilPart}`;
};

/**
 * Automatically share the "BKR Catering Events" root folder with all authorized admin accounts
 * so that events added from different Google accounts sync in one central shared folder.
 */
export const shareFolderWithAuthorizedAdmins = async (
  folderId: string,
  accessToken: string,
): Promise<void> => {
  try {
    const listRes = await fetch(
      `https://www.googleapis.com/drive/v3/files/${folderId}/permissions?fields=permissions(id,emailAddress,role)&supportsAllDrives=true`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );

    const existingEmails = new Set<string>();
    if (listRes.ok) {
      const data = await listRes.json();
      (data.permissions || []).forEach((p: { emailAddress?: string }) => {
        if (p.emailAddress) existingEmails.add(p.emailAddress.toLowerCase().trim());
      });
    }

    for (const email of ALLOWED_ADMIN_EMAILS) {
      const normalized = email.toLowerCase().trim();
      if (!existingEmails.has(normalized)) {
        try {
          await fetch(
            `https://www.googleapis.com/drive/v3/files/${folderId}/permissions?sendNotificationEmail=false&supportsAllDrives=true`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                role: "writer",
                type: "user",
                emailAddress: email,
              }),
            },
          );
        } catch {
          // If permission fails or already owner, continue
        }
      }
    }
  } catch (e) {
    console.warn("Could not auto-share folder with all admins:", e);
  }
};

/**
 * Find or create the dedicated "BKR Catering Events" root folder in Google Drive.
 * Searches both user's drive and shared items across all authorized accounts.
 */
export const getOrCreateBkrFolder = async (
  accessToken: string,
): Promise<string> => {
  // 1. Search in user's owned files or accessible shared files
  const query = encodeURIComponent(
    `mimeType='${FOLDER_MIME}' and name='${BKR_FOLDER_NAME}' and trashed=false`,
  );

  const searchRes = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)&supportsAllDrives=true&includeItemsFromAllDrives=true`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  if (searchRes.ok) {
    const searchData: DriveFileList = await searchRes.json();
    if (searchData.files && searchData.files.length > 0) {
      const folderId = searchData.files[0].id;
      shareFolderWithAuthorizedAdmins(folderId, accessToken).catch(() => {});
      return folderId;
    }
  }

  // 2. Search explicitly in shared items (sharedWithMe)
  const sharedQuery = encodeURIComponent(
    `mimeType='${FOLDER_MIME}' and name='${BKR_FOLDER_NAME}' and sharedWithMe=true and trashed=false`,
  );

  const sharedRes = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${sharedQuery}&fields=files(id,name)&supportsAllDrives=true&includeItemsFromAllDrives=true`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  if (sharedRes.ok) {
    const sharedData: DriveFileList = await sharedRes.json();
    if (sharedData.files && sharedData.files.length > 0) {
      const folderId = sharedData.files[0].id;
      shareFolderWithAuthorizedAdmins(folderId, accessToken).catch(() => {});
      return folderId;
    }
  }

  // 3. Create folder if it doesn't exist yet
  const createRes = await fetch("https://www.googleapis.com/drive/v3/files?supportsAllDrives=true", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: BKR_FOLDER_NAME,
      mimeType: FOLDER_MIME,
    }),
  });

  if (!createRes.ok) {
    const err = await createRes.text();
    throw new Error(`Could not create Google Drive folder: ${err}`);
  }

  const createdData = await createRes.json();
  const newFolderId = createdData.id;
  shareFolderWithAuthorizedAdmins(newFolderId, accessToken).catch(() => {});
  return newFolderId;
};

/**
 * Find or create an event subfolder inside the root "BKR Catering Events" folder
 */
export const getOrCreateEventSubfolder = async (
  subfolderName: string,
  parentFolderId: string,
  accessToken: string,
): Promise<string> => {
  const query = encodeURIComponent(
    `mimeType='${FOLDER_MIME}' and name='${subfolderName}' and '${parentFolderId}' in parents and trashed=false`,
  );

  const searchRes = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  if (searchRes.ok) {
    const searchData: DriveFileList = await searchRes.json();
    if (searchData.files && searchData.files.length > 0) {
      return searchData.files[0].id;
    }
  }

  const createRes = await fetch("https://www.googleapis.com/drive/v3/files", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: subfolderName,
      mimeType: FOLDER_MIME,
      parents: [parentFolderId],
    }),
  });

  if (!createRes.ok) {
    const err = await createRes.text();
    throw new Error(`Could not create event subfolder '${subfolderName}': ${err}`);
  }

  const createdData = await createRes.json();
  return createdData.id;
};

/**
 * Upload or update a single file in a Google Drive folder using multipart upload
 */
export const uploadOrUpdateDriveFile = async (
  fileName: string,
  mimeType: string,
  blob: Blob,
  folderId: string,
  accessToken: string,
): Promise<string> => {
  const query = encodeURIComponent(
    `name='${fileName}' and '${folderId}' in parents and trashed=false`,
  );

  const searchRes = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  let existingId: string | null = null;
  if (searchRes.ok) {
    const data: DriveFileList = await searchRes.json();
    if (data.files && data.files.length > 0) {
      existingId = data.files[0].id;
    }
  }

  const metadata = {
    name: fileName,
    mimeType,
    parents: existingId ? undefined : [folderId],
  };

  const form = new FormData();
  form.append(
    "metadata",
    new Blob([JSON.stringify(metadata)], { type: "application/json" }),
  );
  form.append("file", blob, fileName);

  const url = existingId
    ? `https://www.googleapis.com/upload/drive/v3/files/${existingId}?uploadType=multipart`
    : "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart";

  const uploadRes = await fetch(url, {
    method: existingId ? "PATCH" : "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
    body: form,
  });

  if (!uploadRes.ok) {
    const err = await uploadRes.text();
    throw new Error(`Failed to upload ${fileName}: ${err}`);
  }

  const result = await uploadRes.json();
  return result.id;
};

/**
 * Save an EventMenu with its dedicated subfolder (date_venueplace_clientname_tamil)
 * containing the four documents:
 * 1. English PDF
 * 2. Tamil PDF
 * 3. English DOCX
 * 4. Tamil DOCX
 * plus the JSON configuration file for seamless dashboard backup/restore.
 */
export const saveMenuToGoogleDrive = async (
  menu: EventMenu,
  accessToken: string,
): Promise<{
  folderId: string;
  subfolderId: string;
  fileIds: Record<string, string>;
}> => {
  const rootFolderId = await getOrCreateBkrFolder(accessToken);
  const subfolderName = getEventSubfolderName(menu);
  const subfolderId = await getOrCreateEventSubfolder(
    subfolderName,
    rootFolderId,
    accessToken,
  );

  const cleanClient = sanitizeDriveName(menu.clientDetails?.name || "Client");

  // Generate 4 document blobs + JSON blob
  const [pdfEn, pdfTa, docxEn, docxTa] = await Promise.all([
    buildEventMenuPDFBlob(menu, "en"),
    buildEventMenuPDFBlob(menu, "ta"),
    buildEventMenuDOCXBlob(menu, "en"),
    buildEventMenuDOCXBlob(menu, "ta"),
  ]);

  const jsonBlob = new Blob([JSON.stringify(menu, null, 2)], {
    type: "application/json",
  });

  const pdfEnName = `BKR_Event_Menu_${cleanClient}_English.pdf`;
  const pdfTaName = `BKR_Event_Menu_${cleanClient}_Tamil.pdf`;
  const docxEnName = `BKR_Event_Menu_${cleanClient}_English.docx`;
  const docxTaName = `BKR_Event_Menu_${cleanClient}_Tamil.docx`;
  const jsonName = `BKR_Event_${menu.id}.json`;

  const fileIds: Record<string, string> = {};

  // Upload the 4 files to the event subfolder
  const [idPdfEn, idPdfTa, idDocxEn, idDocxTa, idJsonSub, idJsonRoot] =
    await Promise.all([
      uploadOrUpdateDriveFile(
        pdfEnName,
        "application/pdf",
        pdfEn.blob,
        subfolderId,
        accessToken,
      ),
      uploadOrUpdateDriveFile(
        pdfTaName,
        "application/pdf",
        pdfTa.blob,
        subfolderId,
        accessToken,
      ),
      uploadOrUpdateDriveFile(
        docxEnName,
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        docxEn.blob,
        subfolderId,
        accessToken,
      ),
      uploadOrUpdateDriveFile(
        docxTaName,
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        docxTa.blob,
        subfolderId,
        accessToken,
      ),
      uploadOrUpdateDriveFile(
        jsonName,
        "application/json",
        jsonBlob,
        subfolderId,
        accessToken,
      ),
      // Keep root JSON copy for ultra-fast list queries
      uploadOrUpdateDriveFile(
        jsonName,
        "application/json",
        jsonBlob,
        rootFolderId,
        accessToken,
      ),
    ]);

  fileIds.pdfEn = idPdfEn;
  fileIds.pdfTa = idPdfTa;
  fileIds.docxEn = idDocxEn;
  fileIds.docxTa = idDocxTa;
  fileIds.jsonSub = idJsonSub;
  fileIds.jsonRoot = idJsonRoot;

  return { folderId: rootFolderId, subfolderId, fileIds };
};

/**
 * Load all EventMenu JSON files from Google Drive
 */
export const loadMenusFromGoogleDrive = async (
  accessToken: string,
): Promise<EventMenu[]> => {
  await getOrCreateBkrFolder(accessToken);

  // Search for all event JSON files inside root or across Drive
  const query = encodeURIComponent(
    `name contains 'BKR_Event_' and name contains '.json' and trashed=false`,
  );

  const listRes = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,mimeType)&pageSize=100&supportsAllDrives=true&includeItemsFromAllDrives=true`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  if (!listRes.ok) {
    const err = await listRes.text();
    throw new Error(`Failed to list Google Drive files: ${err}`);
  }

  const listData: DriveFileList = await listRes.json();
  const jsonFiles = listData.files || [];

  const menusMap = new Map<string, EventMenu>();

  for (const file of jsonFiles) {
    try {
      const contentRes = await fetch(
        `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      if (contentRes.ok) {
        const menu = (await contentRes.json()) as EventMenu;
        if (menu.id && menu.clientDetails && menu.days) {
          menusMap.set(menu.id, menu);
        }
      }
    } catch (e) {
      console.warn(`Could not read Drive file ${file.name}:`, e);
    }
  }

  return Array.from(menusMap.values());
};

/**
 * Maintain and update a Master Event Register & Analytics Google Spreadsheet
 * directly inside the "BKR Catering Events" root folder.
 */
export const syncAnalyticsSpreadsheetToGoogleDrive = async (
  events: SavedEvent[],
  accessToken: string,
): Promise<string> => {
  const rootFolderId = await getOrCreateBkrFolder(accessToken);
  const sheetFileName = "BKR Catering - Event Register & Analytics";

  // Check if spreadsheet file already exists in root folder
  const query = encodeURIComponent(
    `name='${sheetFileName}' and '${rootFolderId}' in parents and trashed=false`,
  );
  const searchRes = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  let existingId: string | null = null;
  if (searchRes.ok) {
    const data: DriveFileList = await searchRes.json();
    if (data.files && data.files.length > 0) {
      existingId = data.files[0].id;
    }
  }

  // Format CSV content
  const escapeCsv = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;

  const rows: string[] = [];
  rows.push(["BKR CATERING - MASTER EVENT REGISTER & ANALYTICS"].map(escapeCsv).join(","));
  rows.push([`Default Drive Account: ${DEFAULT_DRIVE_ACCOUNT}`].map(escapeCsv).join(","));
  rows.push([`Generated At (IST): ${formatISTDate(getISTDateString(), "en-IN", { dateStyle: "full", timeStyle: "medium" })}`].map(escapeCsv).join(","));
  rows.push("");
  rows.push(["--- EVENT REGISTER ---"].map(escapeCsv).join(","));

  const headers = [
    "S.No",
    "Event Date",
    "Client Name",
    "Phone Number",
    "Venue Name",
    "Venue Address",
    "Tamil Solar Date",
    "No. of Days",
    "Total Sessions",
    "Total Guests (Head Count)",
    "Total Dishes Selected",
    "Quoted Rate Total (INR)",
    "Transport Charge (INR)",
    "Grand Total (INR)",
    "Status",
    "Saved At",
  ];
  rows.push(headers.map(escapeCsv).join(","));

  let totalGuests = 0;
  let totalRevenue = 0;
  let confirmedCount = 0;
  let pendingCount = 0;
  let completedCount = 0;
  let cancelledCount = 0;

  events.forEach((event, idx) => {
    const { menu, status, savedAt } = event;
    const sessions = (menu.days || []).flatMap((d) => d.sessions || []);
    const eventHeadCount = sessions.reduce((acc, s) => acc + (s.headCount || 0), 0);
    const quotedRate = sessions.reduce(
      (acc, s) => acc + (s.ratePerPerson || 0) * (s.headCount || 0),
      0,
    );
    const transport = menu.transportCharge || 0;
    const grandTotal = quotedRate + transport;
    const dishesCount = sessions.reduce(
      (acc, s) => acc + (s.selectedDishes?.length || 0),
      0,
    );

    totalGuests += eventHeadCount;
    totalRevenue += grandTotal;

    if (status === "confirmed") confirmedCount++;
    else if (status === "completed") completedCount++;
    else if (status === "pending") pendingCount++;
    else if (status === "cancelled") cancelledCount++;

    const row = [
      idx + 1,
      menu.startDate === menu.endDate
        ? menu.startDate
        : `${menu.startDate} to ${menu.endDate}`,
      menu.clientDetails?.name || "Client",
      menu.clientDetails?.phone || "",
      menu.venueDetails?.name || "",
      menu.venueDetails?.address || "",
      getTamilSolarDate(menu.startDate, "ta") || menu.tamilDate || "",
      menu.numberOfDays || 1,
      sessions.length,
      eventHeadCount,
      dishesCount,
      quotedRate,
      transport,
      grandTotal,
      status.toUpperCase(),
      savedAt || "",
    ];
    rows.push(row.map(escapeCsv).join(","));
  });

  rows.push("");
  rows.push(["--- ANALYTICS SUMMARY ---"].map(escapeCsv).join(","));
  rows.push(["Metric", "Value"].map(escapeCsv).join(","));
  rows.push(["Total Registered Events", events.length].map(escapeCsv).join(","));
  rows.push(["Confirmed Events", confirmedCount].map(escapeCsv).join(","));
  rows.push(["Completed Events", completedCount].map(escapeCsv).join(","));
  rows.push(["Pending Events", pendingCount].map(escapeCsv).join(","));
  rows.push(["Cancelled Events", cancelledCount].map(escapeCsv).join(","));
  rows.push(["Total Guests Served / Planned", totalGuests].map(escapeCsv).join(","));
  rows.push(["Total Revenue Forecast (INR)", `₹${totalRevenue.toLocaleString("en-IN")}`].map(escapeCsv).join(","));
  rows.push([
    "Average Event Value (INR)",
    events.length > 0 ? `₹${Math.round(totalRevenue / events.length).toLocaleString("en-IN")}` : "₹0",
  ].map(escapeCsv).join(","));

  const csvContent = rows.join("\r\n");
  const csvBlob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });

  const metadata = {
    name: sheetFileName,
    mimeType: SPREADSHEET_MIME,
    parents: existingId ? undefined : [rootFolderId],
  };

  const form = new FormData();
  form.append(
    "metadata",
    new Blob([JSON.stringify(metadata)], { type: "application/json" }),
  );
  form.append("file", csvBlob, `${sheetFileName}.csv`);

  const url = existingId
    ? `https://www.googleapis.com/upload/drive/v3/files/${existingId}?uploadType=multipart`
    : "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart";

  const uploadRes = await fetch(url, {
    method: existingId ? "PATCH" : "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
    body: form,
  });

  if (!uploadRes.ok) {
    const err = await uploadRes.text();
    throw new Error(`Failed to save analytics spreadsheet: ${err}`);
  }

  const result = await uploadRes.json();
  return result.id;
};

/**
 * Upload an exported document (PDF or DOCX) to the Google Drive folder
 */
export const uploadExportToGoogleDrive = async (
  fileName: string,
  blob: Blob,
  accessToken: string,
): Promise<string> => {
  const folderId = await getOrCreateBkrFolder(accessToken);
  const mimeType = fileName.endsWith(".pdf")
    ? "application/pdf"
    : "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  return uploadOrUpdateDriveFile(fileName, mimeType, blob, folderId, accessToken);
};
