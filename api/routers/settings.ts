import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { settings } from "../../db/schema";
import { eq } from "drizzle-orm";

export const settingsRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(settings);
  }),

  getByKey: publicQuery
    .input(z.object({ key: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(settings)
        .where(eq(settings.key, input.key))
        .limit(1);
      return result[0] ?? null;
    }),

  update: adminQuery
    .input(
      z.object({
        key: z.string().min(1),
        value: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(settings)
        .set({ value: input.value ?? null })
        .where(eq(settings.key, input.key));
      const result = await db
        .select()
        .from(settings)
        .where(eq(settings.key, input.key))
        .limit(1);
      return result[0];
    }),
});
