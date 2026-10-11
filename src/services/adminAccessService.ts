const CREDENTIALS_KEY = "bkr-admin-credentials";
const SESSION_KEY = "bkr-admin-session";
const HASH_ITERATIONS = 310_000;
const SALT_BYTES = 16;
const HASH_BYTES = 32;

interface AdminCredentials {
  version: 1;
  salt: string;
  hash: string;
}

const toBase64 = (bytes: Uint8Array): string => {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
};

const fromBase64 = (value: string): Uint8Array =>
  Uint8Array.from(atob(value), (character) => character.charCodeAt(0));

const derivePasswordHash = async (
  password: string,
  salt: Uint8Array,
): Promise<Uint8Array> => {
  if (!window.crypto?.subtle) {
    throw new Error("Password setup requires a secure browser connection.");
  }

  const passwordKey = await window.crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await window.crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: new Uint8Array(salt),
      iterations: HASH_ITERATIONS,
      hash: "SHA-256",
    },
    passwordKey,
    HASH_BYTES * 8,
  );
  return new Uint8Array(bits);
};

const getCredentials = (): AdminCredentials | null => {
  const saved = localStorage.getItem(CREDENTIALS_KEY);
  if (!saved) return null;

  const credentials: unknown = JSON.parse(saved);
  if (
    typeof credentials !== "object" ||
    credentials === null ||
    !("version" in credentials) ||
    credentials.version !== 1 ||
    !("salt" in credentials) ||
    typeof credentials.salt !== "string" ||
    !("hash" in credentials) ||
    typeof credentials.hash !== "string"
  ) {
    throw new Error("Saved admin login details are invalid. Clear this browser's saved admin login to set it up again.");
  }
  return credentials as AdminCredentials;
};

export const isAdminPasswordConfigured = (): boolean =>
  getCredentials() !== null;

export const hasAdminSession = (): boolean =>
  sessionStorage.getItem(SESSION_KEY) === "authenticated";

export const setAdminPassword = async (password: string): Promise<void> => {
  if (password.length < 8) {
    throw new Error("Choose a password with at least 8 characters.");
  }
  if (isAdminPasswordConfigured()) {
    throw new Error("An admin password is already set for this browser.");
  }

  const salt = window.crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const hash = await derivePasswordHash(password, salt);
  const credentials: AdminCredentials = {
    version: 1,
    salt: toBase64(salt),
    hash: toBase64(hash),
  };
  localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(credentials));
  sessionStorage.setItem(SESSION_KEY, "authenticated");
};

export const loginAdmin = async (password: string): Promise<boolean> => {
  const credentials = getCredentials();
  if (!credentials) return false;

  const candidate = await derivePasswordHash(
    password,
    fromBase64(credentials.salt),
  );
  const expected = fromBase64(credentials.hash);
  if (candidate.length !== expected.length) return false;

  let difference = 0;
  candidate.forEach((byte, index) => {
    difference |= byte ^ expected[index];
  });
  if (difference !== 0) return false;

  sessionStorage.setItem(SESSION_KEY, "authenticated");
  return true;
};

export const logoutAdmin = (): void => {
  sessionStorage.removeItem(SESSION_KEY);
};
