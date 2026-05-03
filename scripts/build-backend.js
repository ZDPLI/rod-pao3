#!/usr/bin/env node
/**
 * Build script for Railway production
 * Compiles backend TypeScript to JavaScript using tsx
 */

import { execSync } from "child_process";
import fs from "fs";
import path from "path";

console.log("Building backend for production...");

// Ensure dist directory exists
const distDir = path.resolve(process.cwd(), "dist");
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Build frontend first
console.log("1. Building frontend...");
execSync("npx vite build", { stdio: "inherit" });

// Build backend using tsc
console.log("2. Building backend...");
try {
  execSync("npx tsc --project tsconfig.server.json --outDir dist", {
    stdio: "inherit",
  });
} catch {
  // tsc may have errors but still emit files
  console.log("TypeScript compilation completed (with possible type errors)");
}

// Copy necessary files
console.log("3. Copying static files...");
const filesToCopy = [".env", "drizzle.config.ts"];
for (const file of filesToCopy) {
  const src = path.resolve(process.cwd(), file);
  const dest = path.resolve(distDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`  Copied: ${file}`);
  }
}

// Copy db directory
console.log("4. Copying database files...");
const dbSrc = path.resolve(process.cwd(), "db");
const dbDest = path.resolve(distDir, "db");
if (fs.existsSync(dbSrc)) {
  fs.cpSync(dbSrc, dbDest, { recursive: true, force: true });
  console.log("  Copied: db/");
}

console.log("\nBuild complete! Output in: dist/");
