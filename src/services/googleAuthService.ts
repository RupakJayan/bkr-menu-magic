/**
 * Google Identity Services (GIS) OAuth 2.0 Integration
 */

export interface GoogleUser {
  email?: string;
  name?: string;
  picture?: string;
}

export const ALLOWED_ADMIN_EMAILS = [
  "bkrcaters@gmail.com",
  "imurugansea@gmail.com",
  "raghavendrarbass@gmail.com",
  "ragsrups22@gmail.com",
  "rupak.jayanb@gmail.com",
  "rupakjayan22@gmail.com",
] as const;

export const isEmailAllowed = (email?: string): boolean => {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return ALLOWED_ADMIN_EMAILS.some(
    (allowed) => allowed.toLowerCase() === normalized,
  );
};

const TOKEN_KEY = "bkr-google-access-token";
const USER_KEY = "bkr-google-user";
const DRIVE_SCOPE = "https://www.googleapis.com/auth/drive";

export const DEFAULT_GOOGLE_CLIENT_ID =
  "827617794538-iuu24eotjtmafui7fni969rk6l5n50vv.apps.googleusercontent.com";

let tokenClient: google.accounts.oauth2.TokenClient | null = null;
let customClientIdOverride: string | null = null;

export const getGoogleClientId = (): string => {
  if (customClientIdOverride) {
    return customClientIdOverride;
  }
  try {
    const fromEnv =
      typeof import.meta !== "undefined" && import.meta?.env
        ? import.meta.env.VITE_GOOGLE_CLIENT_ID
        : "";
    return fromEnv || DEFAULT_GOOGLE_CLIENT_ID;
  } catch {
    return DEFAULT_GOOGLE_CLIENT_ID;
  }
};

export const setGoogleClientId = (clientId: string): void => {
  customClientIdOverride = clientId && clientId.trim() ? clientId.trim() : null;
};

export const isGoogleConfigured = (): boolean =>
  Boolean(getGoogleClientId());

export const getStoredGoogleToken = (): string | null =>
  sessionStorage.getItem(TOKEN_KEY);

export const getStoredGoogleUser = (): GoogleUser | null => {
  const raw = sessionStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as GoogleUser;
  } catch {
    return null;
  }
};

export const isGoogleAuthenticated = (): boolean =>
  Boolean(getStoredGoogleToken());

/**
 * Dynamically load Google Identity Services client script if not already loaded
 */
export const loadGoogleIdentityScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.oauth2) {
      resolve();
      return;
    }

    const scriptId = "google-identity-services";
    if (document.getElementById(scriptId)) {
      const existing = document.getElementById(scriptId) as HTMLScriptElement;
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Could not load Google Identity Services")));
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Could not load Google Identity Services"));
    document.head.appendChild(script);
  });
};

/**
 * Prompt user with Google OAuth popup to grant drive.file permission
 */
export const requestGoogleLogin = async (): Promise<string> => {
  const clientId = getGoogleClientId();
  if (!clientId) {
    throw new Error(
      "Google Client ID is not configured. Please add VITE_GOOGLE_CLIENT_ID to your environment.",
    );
  }

  await loadGoogleIdentityScript();

  return new Promise((resolve, reject) => {
    try {
      tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: `${DRIVE_SCOPE} email profile`,
        callback: async (response) => {
          if (response.error) {
            reject(new Error(response.error_description || response.error));
            return;
          }

          const token = response.access_token;
          sessionStorage.setItem(TOKEN_KEY, token);

          // Fetch user profile info
          try {
            const userResponse = await fetch(
              "https://www.googleapis.com/oauth2/v3/userinfo",
              { headers: { Authorization: `Bearer ${token}` } },
            );
            if (userResponse.ok) {
              const profile = await userResponse.json();

              if (!isEmailAllowed(profile.email)) {
                if (window.google?.accounts?.oauth2) {
                  window.google.accounts.oauth2.revoke(token, () => {});
                }
                sessionStorage.removeItem(TOKEN_KEY);
                sessionStorage.removeItem(USER_KEY);
                reject(
                  new Error(
                    `Access denied: ${profile.email || "This account"} is not an authorized administrator for BKR Catering.`,
                  ),
                );
                return;
              }

              const user: GoogleUser = {
                email: profile.email,
                name: profile.name,
                picture: profile.picture,
              };
              sessionStorage.setItem(USER_KEY, JSON.stringify(user));
            }
          } catch (e) {
            console.warn("Could not fetch Google profile details:", e);
          }

          resolve(token);
        },
      });

      tokenClient.requestAccessToken({ prompt: "consent" });
    } catch (error) {
      reject(error);
    }
  });
};

export const logoutGoogle = (): void => {
  const token = getStoredGoogleToken();
  if (token && window.google?.accounts?.oauth2) {
    window.google.accounts.oauth2.revoke(token, () => {
      /* token revoked */
    });
  }
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
};

/**
 * Gracefully clear only the expired OAuth access token without touching any user profile,
 * local storage menus, saved events, or custom dishes.
 */
export const clearExpiredGoogleToken = (): void => {
  sessionStorage.removeItem(TOKEN_KEY);
};

