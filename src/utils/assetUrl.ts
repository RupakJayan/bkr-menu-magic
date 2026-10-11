/**
 * Prepend Vite's configured base path to a public-folder asset path.
 *
 * In development `import.meta.env.BASE_URL` is `/`, so nothing changes.
 * In production (GitHub Pages) it becomes `/bkr-menu-magic/`, fixing 404s
 * for any asset referenced as a string literal in JS/TS.
 */
export function assetUrl(path: string): string {
  const base = import.meta.env.BASE_URL ?? "/";
  // Avoid double slashes when path already starts with `/`
  return `${base.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}
