import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const distDir = path.resolve(rootDir, "dist");
const docsDir = path.resolve(rootDir, "docs");
const rootAssetsDir = path.resolve(rootDir, "assets");

if (!fs.existsSync(distDir)) {
  console.error("dist directory does not exist! Please run vite build first.");
  process.exit(1);
}

// 1. Clean and copy to docs/ (for GitHub Pages when source is set to /docs)
if (fs.existsSync(docsDir)) {
  fs.rmSync(docsDir, { recursive: true, force: true });
}
fs.mkdirSync(docsDir, { recursive: true });
fs.cpSync(distDir, docsDir, { recursive: true, force: true });

// 2. Ensure root assets/ has all built bundles (for GitHub Pages when source is set to root /)
if (fs.existsSync(rootAssetsDir)) {
  fs.rmSync(rootAssetsDir, { recursive: true, force: true });
}
const distAssets = path.resolve(distDir, "assets");
if (fs.existsSync(distAssets)) {
  fs.mkdirSync(rootAssetsDir, { recursive: true });
  fs.cpSync(distAssets, rootAssetsDir, { recursive: true, force: true });
}

// 3. Ensure 404.html exists in both docs and root
const fourOhFour = path.resolve(distDir, "404.html");
if (fs.existsSync(fourOhFour)) {
  fs.copyFileSync(fourOhFour, path.resolve(docsDir, "404.html"));
  fs.copyFileSync(fourOhFour, path.resolve(rootDir, "404.html"));
}

console.log("✓ Successfully synchronized production bundles to docs/ and root assets/ for 100% reliable GitHub Pages deployment.");
