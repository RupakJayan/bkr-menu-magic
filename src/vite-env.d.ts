/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_CLIENT_ID?: string;
  readonly VITE_GOOGLE_MAPS_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace google {
  namespace accounts {
    namespace oauth2 {
      interface TokenResponse {
        access_token: string;
        expires_in: string;
        scope: string;
        token_type: string;
        error?: string;
        error_description?: string;
      }

      interface TokenClientConfig {
        client_id: string;
        scope: string;
        callback: (response: TokenResponse) => void;
      }

      interface TokenClient {
        requestAccessToken: (overrideConfig?: { prompt?: string }) => void;
      }

      function initTokenClient(config: TokenClientConfig): TokenClient;
      function revoke(token: string, done: () => void): void;
    }
  }

  namespace maps {
    namespace places {
      interface PlaceResult {
        name?: string;
        formatted_address?: string;
        url?: string;
        geometry?: unknown;
      }

      class Autocomplete {
        constructor(
          inputField: HTMLInputElement,
          opts?: { fields?: string[] },
        );
        addListener(eventName: string, handler: () => void): { remove: () => void };
        getPlace(): PlaceResult;
      }
    }

    namespace event {
      function removeListener(handle: unknown): void;
    }
  }
}

interface Window {
  google?: typeof google;
}
