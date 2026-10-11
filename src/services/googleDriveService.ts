/**
 * Google Drive REST API Service (v3)
 * Scoped to drive.file
 */

import { EventMenu } from "@/types/menu";

const BKR_FOLDER_NAME = "BKR Catering Events";
const FOLDER_MIME = "application/vnd.google-apps.folder";

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
}

interface DriveFileList {
  files: DriveFile[];
}

/**
 * Find or create the dedicated "BKR Catering Events" folder in the user's Google Drive
 */
export const getOrCreateBkrFolder = async (accessToken: string): Promise<string> => {
  const query = encodeURIComponent(
    `mimeType='${FOLDER_MIME}' and name='${BKR_FOLDER_NAME}' and trashed=false`,
  );

  const searchRes = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  if (!searchRes.ok) {
    const err = await searchRes.text();
    throw new Error(`Google Drive folder search failed: ${err}`);
  }

  const searchData: DriveFileList = await searchRes.json();
  if (searchData.files && searchData.files.length > 0) {
    return searchData.files[0].id;
  }

  // Create folder if it doesn't exist
  const createRes = await fetch("https://www.googleapis.com/drive/v3/files", {
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
  return createdData.id;
};

/**
 * Save an EventMenu as a JSON file in the Google Drive folder
 */
export const saveMenuToGoogleDrive = async (
  menu: EventMenu,
  accessToken: string,
): Promise<string> => {
  const folderId = await getOrCreateBkrFolder(accessToken);
  const fileName = `BKR_Event_${menu.id}.json`;

  // Check if file already exists in this folder
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

  const fileMetadata = {
    name: fileName,
    parents: existingId ? undefined : [folderId],
    description: `BKR Catering event menu for ${menu.clientDetails.name || "Client"} (${menu.startDate})`,
  };

  const fileData = JSON.stringify(menu, null, 2);
  const boundary = "-------314159265358979323846";
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const multipartRequestBody =
    delimiter +
    "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
    JSON.stringify(fileMetadata) +
    delimiter +
    "Content-Type: application/json\r\n\r\n" +
    fileData +
    closeDelimiter;

  const url = existingId
    ? `https://www.googleapis.com/upload/drive/v3/files/${existingId}?uploadType=multipart`
    : "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart";

  const uploadRes = await fetch(url, {
    method: existingId ? "PATCH" : "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": `multipart/related; boundary=${boundary}`,
    },
    body: multipartRequestBody,
  });

  if (!uploadRes.ok) {
    const err = await uploadRes.text();
    throw new Error(`Failed to save menu to Google Drive: ${err}`);
  }

  const result = await uploadRes.json();
  return result.id;
};

/**
 * Load all EventMenu JSON files from the "BKR Catering Events" folder in Google Drive
 */
export const loadMenusFromGoogleDrive = async (
  accessToken: string,
): Promise<EventMenu[]> => {
  const folderId = await getOrCreateBkrFolder(accessToken);
  const query = encodeURIComponent(`'${folderId}' in parents and trashed=false`);

  const listRes = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,mimeType)&pageSize=100`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  if (!listRes.ok) {
    const err = await listRes.text();
    throw new Error(`Failed to list Google Drive files: ${err}`);
  }

  const listData: DriveFileList = await listRes.json();
  const jsonFiles = (listData.files || []).filter((f) =>
    f.name.endsWith(".json") && f.name.startsWith("BKR_Event_"),
  );

  const menus: EventMenu[] = [];

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
          menus.push(menu);
        }
      }
    } catch (e) {
      console.warn(`Could not read Drive file ${file.name}:`, e);
    }
  }

  return menus;
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

  const metadata = {
    name: fileName,
    parents: [folderId],
  };

  const form = new FormData();
  form.append(
    "metadata",
    new Blob([JSON.stringify(metadata)], { type: "application/json" }),
  );
  form.append("file", blob);

  const uploadRes = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: form,
    },
  );

  if (!uploadRes.ok) {
    const err = await uploadRes.text();
    throw new Error(`Failed to upload ${fileName} to Google Drive: ${err}`);
  }

  const result = await uploadRes.json();
  return result.id;
};
