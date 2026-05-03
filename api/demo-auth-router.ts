import { createRouter, publicQuery } from "./middleware";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

// Simple demo auth — no OAuth required
// Uses a hardcoded admin token for Railway deployment

const DEMO_ADMIN = {
  id: 1,
  unionId: "demo-admin",
  name: "Администратор",
  email: "admin@rod.ru",
  avatar: null,
  role: "admin" as const,
};

export const demoAuthRouter = createRouter({
  login: publicQuery
    .input(
      z.object({
        password: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // Accept any password (or no password) for demo mode
      // In production, this should be properly secured
      if (input.password && input.password !== "rod-admin") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Неверный пароль. Попробуйте: rod-admin",
        });
      }

      return {
        token: "demo-token-" + Date.now(),
        user: DEMO_ADMIN,
      };
    }),

  me: publicQuery.query(() => DEMO_ADMIN),
});
