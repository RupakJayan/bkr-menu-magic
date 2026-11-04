import { useEffect } from "react";
import { initReveals } from "@/lib/reveal";

/**
 * Wires the theme's scroll reveals for everything rendered under `document`.
 * Reveals fire once and are skipped entirely on nav / app chrome, so this is
 * only mounted by the landing page.
 */
export const useReveals = (): void => {
  useEffect(() => {
    const disconnect = initReveals(document);
    return () => disconnect();
  }, []);
};
