import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { User } from "@db/schema";
import { authenticateRequest } from "./kimi/auth";

export type TrpcContext = {
  req: Request;
  resHeaders: Headers;
  user?: User;
};

// Demo admin user for Railway deployment without OAuth
const DEMO_ADMIN_USER: User = {
  id: 1,
  unionId: "demo-admin",
  name: "Администратор",
  email: "admin@rod.ru",
  avatar: null,
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignInAt: new Date(),
};

export async function createContext(
  opts: FetchCreateContextFnOptions,
): Promise<TrpcContext> {
  const ctx: TrpcContext = { req: opts.req, resHeaders: opts.resHeaders };

  // Try OAuth auth first
  try {
    ctx.user = await authenticateRequest(opts.req.headers);
    return ctx;
  } catch {
    // OAuth auth failed — try demo auth
  }

  // Demo auth fallback (for Railway deployment without OAuth)
  const demoToken = opts.req.headers.get("x-demo-token");
  if (demoToken && demoToken.startsWith("demo-token-")) {
    ctx.user = DEMO_ADMIN_USER;
  }

  return ctx;
}
