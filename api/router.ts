import { authRouter } from "./auth-router";
import { demoAuthRouter } from "./demo-auth-router";
import { createRouter, publicQuery } from "./middleware";
import { categoryRouter } from "./routers/category";
import { serviceRouter } from "./routers/service";
import { contentRouter } from "./routers/content";
import { settingsRouter } from "./routers/settings";
import { orderRouter } from "./routers/order";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  demoAuth: demoAuthRouter,
  category: categoryRouter,
  service: serviceRouter,
  content: contentRouter,
  settings: settingsRouter,
  order: orderRouter,
});

export type AppRouter = typeof appRouter;
