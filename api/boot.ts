import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { trpcServer } from "@hono/trpc-server";
import { resolve } from "path";
import { readFile } from "fs/promises";
import { appRouter } from "./router";
import { HTTPException } from "hono/http-exception";

const app = new Hono();

// ── CORS ────────────────────────────────────────────────
app.use(
  "/api/*",
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

// ── API routes ─────────────────────────────────────────
app.use(
  "/api/trpc/*",
  trpcServer({
    router: appRouter,
    createContext: (_opts, c) => ({ req: c.req.raw, env: c.env }),
    onError: (err) => {
      if (err.error.cause instanceof HTTPException) {
        return err.error.cause;
      }
      console.error("tRPC error:", err.error);
    },
  })
);

// ── OAuth callback placeholder ────────────────────────
app.get("/api/oauth/*", (c) => {
  return c.json({ message: "OAuth callback - implement in production" }, 200);
});

// ── API health check ───────────────────────────────────
app.get("/api/health", (c) =>
  c.json({ status: "ok", timestamp: new Date().toISOString() })
);

// ── Frontend (Vite in dev, static files in prod) ──────
if (process.env.NODE_ENV === "production") {
  const distPath = resolve(process.cwd(), "dist/public");

  app.use("/*", async (c, next) => {
    const path = c.req.path;

    // Skip API routes
    if (path.startsWith("/api")) return next();

    try {
      // Try to serve the file directly first
      const filePath = resolve(distPath, path === "/" ? "index.html" : path.slice(1));
      const file = await readFile(filePath);
      const ext = path.split(".").pop() || "";
      const mimeTypes: Record<string, string> = {
        js: "application/javascript",
        css: "text/css",
        html: "text/html",
        png: "image/png",
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        svg: "image/svg+xml",
        json: "application/json",
        ico: "image/x-icon",
        woff2: "font/woff2",
        woff: "font/woff",
      };
      return c.body(file, 200, {
        "Content-Type": mimeTypes[ext] || "application/octet-stream",
      });
    } catch {
      // SPA fallback - serve index.html for all non-API routes
      try {
        const html = await readFile(resolve(distPath, "index.html"), "utf-8");
        return c.html(html);
      } catch {
        return next();
      }
    }
  });
}

// ── Start server ───────────────────────────────────────
const port = Number(process.env.PORT) || 3000;

serve(
  {
    fetch: app.fetch,
    port,
  },
  () => {
    console.log(`Server running on port ${port}`);
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  }
);
